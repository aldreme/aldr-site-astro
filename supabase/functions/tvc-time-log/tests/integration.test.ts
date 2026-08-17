import { mainHandler } from "../index.ts";

function assertEquals<T>(actual: T, expected: T, message?: string): void {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(
      `${message ? message + ": " : ""}Expected ${expectedStr}, got ${actualStr}`
    );
  }
}

function assertExists<T>(value: T, message?: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(`${message ? message + ": " : ""}Value expected to exist, got ${value}`);
  }
}

/**
 * Loads environment variables from a local env file if not already set
 */
function loadLocalEnvFile(filePath: string): void {
  try {
    const content = Deno.readTextFileSync(filePath);
    for (const rawLine of content.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eqIdx = line.indexOf("=");
      if (eqIdx > 0) {
        const key = line.slice(0, eqIdx).trim();
        const value = line.slice(eqIdx + 1).trim();
        if (!Deno.env.get(key) && value) {
          Deno.env.set(key, value);
        }
      }
    }
  } catch {
    // Environment file may not exist in CI or certain environments
  }
}

// Attempt to load from standard local env files safely without exposing secrets in code
loadLocalEnvFile(".env.development.local");
loadLocalEnvFile(".env.local");

Deno.test("integration - Live Relay to Feishu Approval API", async () => {
  const appId = Deno.env.get("FEISHU_APP_ID");
  const appSecret = Deno.env.get("FEISHU_APP_SECRET");

  if (!appId || !appSecret) {
    console.warn(
      "[SKIP] FEISHU_APP_ID or FEISHU_APP_SECRET environment variables not configured. Skipping live integration test."
    );
    return;
  }

  const livePayload = {
    registration_number: `REG-${Date.now()}`,
    temp_worker_name: "测试技工",
    temp_worker_id_number: "110101199003072345",
    temp_worker_phone: "13800138000",
    registration_time: "2026-08-17 10:00:00",
    job_type: "水电工",
    duration: "8",
    hourly_wage: "40",
    payable_salary: "320",
    registration_location: "总装车间A栋",
    remarks: "准时出勤",
    approval_status: "待审批",
  };

  const req = new Request("http://localhost/webhook/tvc-time-log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "127.0.0.1",
      "user-agent": "Feishu-Webhook-Integration-Test/1.0",
    },
    body: JSON.stringify(livePayload),
  });

  const res = await mainHandler(req);
  assertEquals(res.status, 201, "Expected HTTP 201 Created from webhook relay");

  const responseBody = await res.json();
  assertEquals(responseBody.message, "success");
  assertExists(responseBody.instance_code, "Expected instance_code in response");
  assertExists(responseBody.req_id, "Expected req_id in response");
});
