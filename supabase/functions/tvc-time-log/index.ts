// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";

/**
 * Incoming request payload structure for TVC Time Log webhook
 */
export interface TvcTimeLogPayload {
  // Core webhook fields
  registration_number?: string;
  associated_temp_worker?: string;
  temp_worker_name?: string;
  temp_worker_id_number?: string;
  temp_worker_phone?: string;
  registration_time?: string;
  job_type?: string;
  duration?: string | number;
  hourly_wage?: string | number;
  payable_salary?: string | number;
  registration_location?: string;
  remarks?: string;
  approval_status?: string;

  // Alternative aliases
  worker_name?: string;
  name?: string;
  id_card?: string;
  id_number?: string;
  phone?: string;
  telephone?: string;
  mobile?: string;

  // Feishu challenge event / direct form override
  type?: string;
  challenge?: string;
  form?: Array<Record<string, unknown>> | string;
  [key: string]: unknown;
}

/**
 * Feishu Form Control Item structure for instance creation
 */
export interface FeishuFormControl {
  id: string;
  type: string;
  value: unknown;
  name?: string;
  currency?: string;
}

// Feishu Approval Configuration Defaults
const DEFAULT_APPROVAL_CODE = "DF38CC43-02D4-4782-99D9-1534C3FCCA50";
const DEFAULT_APPROVAL_USER_ID = "admin";

// Confirmed Feishu Approval Definition Form Widget IDs for DF38CC43-02D4-4782-99D9-1534C3FCCA50
const WIDGET_WORKER_NAME = "widget17869367895160001"; // 工人姓名 (input)
const WIDGET_ID_CARD = "widget17869389460060001"; // 身份证号 (input)
const WIDGET_PHONE = "widget17869372906810001"; // 联系电话 (telephone)
const WIDGET_JOB_TYPE = "widget17869467995480001"; // 工种 (input)
const WIDGET_DURATION = "widget17869373329380001"; // 工作时长(小时) (number, 1-24)
const WIDGET_HOURLY_WAGE = "widget17869375283840001"; // 时薪 (amount, CNY)
const WIDGET_PAYABLE_SALARY = "widget17869381614690001"; // 当日应付 (formula)

// In-memory token cache to minimize external token roundtrips
interface CachedToken {
  token: string;
  expiresAt: number;
}
let tokenCache: CachedToken | null = null;

/**
 * Obtains a valid Feishu tenant_access_token with in-memory caching
 */
async function getTenantAccessToken(reqId: string): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 300_000) {
    console.info(`[tvc-time-log] [${reqId}] [AUTH] Using cached Feishu tenant_access_token (valid until ${new Date(tokenCache.expiresAt).toISOString()})`);
    return tokenCache.token;
  }

  const appId = Deno.env.get("FEISHU_APP_ID");
  const appSecret = Deno.env.get("FEISHU_APP_SECRET");

  if (!appId || !appSecret) {
    console.error(`[tvc-time-log] [${reqId}] [AUTH ERROR] Missing FEISHU_APP_ID or FEISHU_APP_SECRET in environment variables`);
    throw new Error("Missing FEISHU_APP_ID or FEISHU_APP_SECRET in environment variables");
  }

  console.info(`[tvc-time-log] [${reqId}] [AUTH] Fetching new tenant_access_token from Feishu for app_id: ${appId}`);
  const startTime = Date.now();

  const response = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });

  const duration = Date.now() - startTime;

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[tvc-time-log] [${reqId}] [AUTH ERROR] HTTP ${response.status} (${duration}ms): ${errorText}`);
    throw new Error(`Feishu auth HTTP error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (data.code !== 0) {
    console.error(`[tvc-time-log] [${reqId}] [AUTH ERROR] Feishu returned error code ${data.code}: ${data.msg}`);
    throw new Error(`Feishu auth failed (code ${data.code}): ${data.msg}`);
  }

  const expireSeconds = data.expire || 7200;
  tokenCache = {
    token: data.tenant_access_token,
    expiresAt: now + expireSeconds * 1000,
  };

  console.info(`[tvc-time-log] [${reqId}] [AUTH SUCCESS] Retrieved tenant_access_token in ${duration}ms (expires in ${expireSeconds}s)`);
  return data.tenant_access_token;
}

/**
 * Extracts a phone number from text if matching standard Chinese mobile format (11 digits)
 */
function extractPhone(text?: string): string | null {
  if (!text) return null;
  const match = text.match(/1[3-9]\d{9}/);
  return match ? match[0] : null;
}

/**
 * Extracts a Chinese resident ID card number from text (18 chars)
 */
function extractIdCard(text?: string): string | null {
  if (!text) return null;
  const match = text.match(/\b\d{17}[\dXx]\b/);
  return match ? match[0] : null;
}

/**
 * Safely parses numbers with a default fallback
 */
function parseNumeric(val: unknown, fallback: number): number {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (typeof val === "string") {
    const parsed = parseFloat(val.trim());
    if (!isNaN(parsed)) return parsed;
  }
  return fallback;
}

/**
 * Builds form controls matching Feishu Approval Definition
 */
export function buildApprovalFormControls(payload: TvcTimeLogPayload, reqId: string): FeishuFormControl[] {
  // If request contains an explicit form array, use it directly
  if (payload.form) {
    if (Array.isArray(payload.form)) {
      console.info(`[tvc-time-log] [${reqId}] [FORM BUILD] Using custom form controls array provided in payload (${payload.form.length} items)`);
      return payload.form as FeishuFormControl[];
    }
    if (typeof payload.form === "string") {
      try {
        const parsed = JSON.parse(payload.form);
        if (Array.isArray(parsed)) {
          console.info(`[tvc-time-log] [${reqId}] [FORM BUILD] Using parsed form controls array from string (${parsed.length} items)`);
          return parsed as FeishuFormControl[];
        }
      } catch (err) {
        console.warn(`[tvc-time-log] [${reqId}] [FORM BUILD WARNING] Could not parse form string: ${err}`);
      }
    }
  }

  // 1. Worker Name (工人姓名, input)
  const workerName =
    (payload.temp_worker_name && payload.temp_worker_name.trim()) ||
    (payload.associated_temp_worker && payload.associated_temp_worker.trim()) ||
    (payload.worker_name && payload.worker_name.trim()) ||
    (payload.name && payload.name.trim()) ||
    "未填写";

  // 2. ID Number (身份证号, input)
  const idNumber =
    (payload.temp_worker_id_number && payload.temp_worker_id_number.trim()) ||
    (payload.id_card && payload.id_card.trim()) ||
    (payload.id_number && payload.id_number.trim()) ||
    extractIdCard(payload.associated_temp_worker) ||
    "-";

  // 3. Contact Phone (联系电话, telephone)
  const rawPhone =
    (payload.temp_worker_phone && payload.temp_worker_phone.trim()) ||
    (payload.phone && payload.phone.trim()) ||
    (payload.telephone && payload.telephone.trim()) ||
    (payload.mobile && payload.mobile.trim()) ||
    extractPhone(payload.associated_temp_worker) ||
    "00000000000";

  // Clean phone number
  const cleanNationalNumber = rawPhone.replace(/\D/g, "") || "00000000000";

  // 4. Job Type (工种, input)
  const jobType = (payload.job_type && payload.job_type.trim()) || "通用工种";

  // 5. Working Duration in Hours (工作时长(小时), number, range 1-24)
  const duration = parseNumeric(payload.duration, 8);

  // 6. Hourly Wage (时薪, amount, CNY)
  const hourlyWage = parseNumeric(payload.hourly_wage, 0);

  // 7. Payable Salary (当日应付, formula) - must match duration * hourly_wage for formula integrity
  const calculatedSalary = duration * hourlyWage;
  const payableSalary = payload.payable_salary !== undefined && payload.payable_salary !== ""
    ? parseNumeric(payload.payable_salary, calculatedSalary)
    : calculatedSalary;

  console.info(
    `[tvc-time-log] [${reqId}] [FORM MAPPING] Resolved values: workerName="${workerName}", idNumber="${idNumber}", phone="${cleanNationalNumber}", jobType="${jobType}", duration=${duration}h, hourlyWage=¥${hourlyWage}, payableSalary=¥${payableSalary}`
  );

  const controls: FeishuFormControl[] = [
    {
      id: WIDGET_WORKER_NAME,
      type: "input",
      value: workerName,
      name: "工人姓名",
    },
    {
      id: WIDGET_ID_CARD,
      type: "input",
      value: idNumber,
      name: "身份证号",
    },
    {
      id: WIDGET_PHONE,
      type: "telephone",
      value: {
        countryCode: "+86",
        nationalNumber: cleanNationalNumber,
      },
      name: "联系电话",
    },
    {
      id: WIDGET_JOB_TYPE,
      type: "input",
      value: jobType,
      name: "工种",
    },
    {
      id: WIDGET_DURATION,
      type: "number",
      value: duration,
      name: "工作时长(小时)",
    },
    {
      id: WIDGET_HOURLY_WAGE,
      type: "amount",
      value: hourlyWage,
      currency: "CNY",
      name: "时薪",
    },
    {
      id: WIDGET_PAYABLE_SALARY,
      type: "formula",
      value: payableSalary,
      name: "当日应付",
    },
  ];

  return controls;
}

/**
 * Relays the webhook request to Feishu Approval Instance API
 */
async function handleWebhook(req: Request, reqId: string): Promise<Response> {
  const startTime = Date.now();
  console.info(`[tvc-time-log] [${reqId}] [START] Processing incoming TVC time log webhook`);

  // 1. Parse JSON body
  let payload: TvcTimeLogPayload;
  try {
    payload = await req.json();
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[tvc-time-log] [${reqId}] [BAD REQUEST] Failed to parse JSON request body: ${errorMsg}`);
    return new Response(
      JSON.stringify({ error: "Invalid JSON body", details: errorMsg, req_id: reqId }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // 2. Handle Feishu URL Verification challenge event if present
  if (payload.type === "url_verification" && payload.challenge) {
    console.info(`[tvc-time-log] [${reqId}] [CHALLENGE] Received Feishu webhook URL verification challenge: ${payload.challenge}`);
    return new Response(
      JSON.stringify({ challenge: payload.challenge }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  console.info(`[tvc-time-log] [${reqId}] [PAYLOAD] Received data: ${JSON.stringify(payload)}`);

  // 3. Obtain Feishu Access Token
  let tenantAccessToken: string;
  try {
    tenantAccessToken = await getTenantAccessToken(reqId);
  } catch (authError) {
    const errorMsg = authError instanceof Error ? authError.message : String(authError);
    console.error(`[tvc-time-log] [${reqId}] [AUTH FAILURE] ${errorMsg}`);
    return new Response(
      JSON.stringify({ error: "Failed to authenticate with Feishu", details: errorMsg, req_id: reqId }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // 4. Build Form Controls
  const approvalCode = Deno.env.get("FEISHU_APPROVAL_CODE") || DEFAULT_APPROVAL_CODE;
  const userId = Deno.env.get("FEISHU_APPROVAL_USER_ID") || DEFAULT_APPROVAL_USER_ID;
  const formControls = buildApprovalFormControls(payload, reqId);
  const formJsonString = JSON.stringify(formControls);

  const instanceRequestBody = {
    approval_code: approvalCode,
    user_id: userId,
    form: formJsonString,
  };

  console.info(
    `[tvc-time-log] [${reqId}] [FEISHU API REQUEST] Target: https://open.feishu.cn/open-apis/approval/v4/instances | approval_code: ${approvalCode} | user_id: ${userId} | form controls count: ${formControls.length}`
  );

  // 5. Call Feishu Create Approval Instance API
  const apiStartTime = Date.now();
  let feishuResponse: Response;
  try {
    feishuResponse = await fetch("https://open.feishu.cn/open-apis/approval/v4/instances", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tenantAccessToken}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(instanceRequestBody),
    });
  } catch (netError) {
    const errorMsg = netError instanceof Error ? netError.message : String(netError);
    console.error(`[tvc-time-log] [${reqId}] [NETWORK ERROR] Failed to connect to Feishu API: ${errorMsg}`);
    return new Response(
      JSON.stringify({ error: "Network error contacting Feishu API", details: errorMsg, req_id: reqId }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const apiDuration = Date.now() - apiStartTime;
  const rawResponseText = await feishuResponse.text();

  let responseData: any;
  try {
    responseData = JSON.parse(rawResponseText);
  } catch {
    responseData = { raw: rawResponseText };
  }

  if (!feishuResponse.ok || responseData.code !== 0) {
    console.error(
      `[tvc-time-log] [${reqId}] [FEISHU API ERROR] HTTP ${feishuResponse.status} (${apiDuration}ms) | Code: ${responseData.code} | Msg: ${responseData.msg} | Error Details: ${JSON.stringify(responseData.error || responseData)}`
    );

    return new Response(
      JSON.stringify({
        error: "Feishu Approval API returned an error",
        status: feishuResponse.status,
        feishu_code: responseData.code,
        feishu_msg: responseData.msg,
        feishu_error: responseData.error,
        req_id: reqId,
      }),
      {
        status: feishuResponse.status >= 400 && feishuResponse.status < 500 ? 400 : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const instanceCode = responseData.data?.instance_code;
  const totalDuration = Date.now() - startTime;

  console.info(
    `[tvc-time-log] [${reqId}] [SUCCESS] Successfully created approval instance: ${instanceCode} (Feishu API: ${apiDuration}ms, Total: ${totalDuration}ms)`
  );

  return new Response(
    JSON.stringify({
      message: "success",
      instance_code: instanceCode,
      approval_code: approvalCode,
      user_id: userId,
      req_id: reqId,
      duration_ms: totalDuration,
    }),
    {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * Main Request handler
 */
export async function mainHandler(req: Request): Promise<Response> {
  const { method } = req;
  const url = new URL(req.url);
  const reqId = `tvc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.info(
    `[tvc-time-log] [${reqId}] [REQUEST RECEIVED] ${method} ${url.pathname}${url.search} | IP: ${clientIp} | User-Agent: ${userAgent}`
  );

  try {
    switch (method) {
      case "POST":
        return await handleWebhook(req, reqId);
      default:
        console.warn(`[tvc-time-log] [${reqId}] [METHOD NOT ALLOWED] ${method} is not supported`);
        return new Response(
          JSON.stringify({ error: `Method ${method} Not Allowed`, req_id: reqId }),
          {
            status: 405,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }
  } catch (err: any) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[tvc-time-log] [${reqId}] [UNHANDLED ERROR] ${errorMessage}`);

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: errorMessage,
        req_id: reqId,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

// Serve HTTP requests when executed directly
if (import.meta.main) {
  Deno.serve(mainHandler);
}

