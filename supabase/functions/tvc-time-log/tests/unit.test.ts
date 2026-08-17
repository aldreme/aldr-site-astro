import { buildApprovalFormControls, mainHandler, type TvcTimeLogPayload } from "../index.ts";

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

Deno.test("buildApprovalFormControls - full payload with temp_worker_name and temp_worker_id_number", () => {
  const payload: TvcTimeLogPayload = {
    registration_number: "REG-2026-001",
    temp_worker_name: "王小明",
    temp_worker_id_number: "110101199003072345",
    temp_worker_phone: "13912345678",
    registration_time: "2026-08-17 09:00:00",
    job_type: "电工",
    duration: "8.5",
    hourly_wage: "50",
    payable_salary: "425",
    registration_location: "1号厂区",
    remarks: "无异常",
    approval_status: "待审批",
  };

  const controls = buildApprovalFormControls(payload, "unit-test-1");

  assertEquals(controls.length, 7, "Should produce 7 form controls");

  const nameCtrl = controls.find((c) => c.id === "widget17869367895160001");
  assertExists(nameCtrl, "Worker name control should exist");
  assertEquals(nameCtrl.value, "王小明");

  const idCtrl = controls.find((c) => c.id === "widget17869389460060001");
  assertExists(idCtrl, "ID control should exist");
  assertEquals(idCtrl.value, "110101199003072345");

  const phoneCtrl = controls.find((c) => c.id === "widget17869372906810001");
  assertExists(phoneCtrl, "Phone control should exist");
  assertEquals(phoneCtrl.value, { countryCode: "+86", nationalNumber: "13912345678" });

  const jobCtrl = controls.find((c) => c.id === "widget17869467995480001");
  assertExists(jobCtrl, "Job type control should exist");
  assertEquals(jobCtrl.value, "电工");

  const durationCtrl = controls.find((c) => c.id === "widget17869373329380001");
  assertExists(durationCtrl, "Duration control should exist");
  assertEquals(durationCtrl.value, 8.5);

  const wageCtrl = controls.find((c) => c.id === "widget17869375283840001");
  assertExists(wageCtrl, "Hourly wage control should exist");
  assertEquals(wageCtrl.value, 50);

  const salaryCtrl = controls.find((c) => c.id === "widget17869381614690001");
  assertExists(salaryCtrl, "Payable salary control should exist");
  assertEquals(salaryCtrl.value, 425);
});

Deno.test("buildApprovalFormControls - fallback extraction from associated_temp_worker", () => {
  const payload: TvcTimeLogPayload = {
    associated_temp_worker: "赵六 13800138000",
    job_type: "装卸工",
    duration: 6,
    hourly_wage: 30,
  };

  const controls = buildApprovalFormControls(payload, "unit-test-2");

  const nameCtrl = controls.find((c) => c.id === "widget17869367895160001");
  assertExists(nameCtrl);
  assertEquals(nameCtrl.value, "赵六 13800138000");

  const idCtrl = controls.find((c) => c.id === "widget17869389460060001");
  assertExists(idCtrl);
  assertEquals(idCtrl.value, "-");

  const phoneCtrl = controls.find((c) => c.id === "widget17869372906810001");
  assertExists(phoneCtrl);
  assertEquals(phoneCtrl.value, { countryCode: "+86", nationalNumber: "13800138000" });

  const salaryCtrl = controls.find((c) => c.id === "widget17869381614690001");
  assertExists(salaryCtrl);
  assertEquals(salaryCtrl.value, 180, "Payable salary should be duration * hourly_wage");
});

Deno.test("buildApprovalFormControls - custom form passthrough", () => {
  const customForm = [
    { id: "widget17869367895160001", type: "input", value: "自定义测试" },
  ];
  const payload: TvcTimeLogPayload = {
    form: customForm,
  };

  const controls = buildApprovalFormControls(payload, "unit-test-3");
  assertEquals(controls, customForm);
});

Deno.test("mainHandler - URL verification challenge", async () => {
  const req = new Request("http://localhost/webhook/tvc-time-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "url_verification",
      challenge: "test_challenge_token_abc",
    }),
  });

  const res = await mainHandler(req);
  assertEquals(res.status, 200);
  const data = await res.json();
  assertEquals(data.challenge, "test_challenge_token_abc");
});

Deno.test("mainHandler - Method Not Allowed for GET", async () => {
  const req = new Request("http://localhost/webhook/tvc-time-log", {
    method: "GET",
  });

  const res = await mainHandler(req);
  assertEquals(res.status, 405);
});

Deno.test("mainHandler - Bad Request on invalid JSON", async () => {
  const req = new Request("http://localhost/webhook/tvc-time-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{ malformed json",
  });

  const res = await mainHandler(req);
  assertEquals(res.status, 400);
  const data = await res.json();
  assertEquals(data.error, "Invalid JSON body");
});
