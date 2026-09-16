import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const ENV = {
  RESEND_API_KEY: "re_test_key",
  CONTACT_TO_EMAIL: "owner@example.com",
  TURNSTILE_SECRET_KEY: "turnstile_secret",
};

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    name: "山田太郎",
    email: "taro@example.com",
    message: "お問い合わせ本文です。",
    turnstileToken: "token-123",
    ...overrides,
  };
}

function jsonRequest(body: unknown, contentType = "application/json") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: JSON.stringify(body),
  });
}

function stubTurnstileFetch(success: boolean) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      json: async () => ({ success }),
    }),
  );
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = ENV.RESEND_API_KEY;
    process.env.CONTACT_TO_EMAIL = ENV.CONTACT_TO_EMAIL;
    process.env.TURNSTILE_SECRET_KEY = ENV.TURNSTILE_SECRET_KEY;
    delete process.env.CONTACT_FROM_EMAIL;
    sendMock.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("Content-Type が application/json でなければ 415 を返す", async () => {
    const { POST } = await import("./route");
    const response = await POST(jsonRequest(validBody(), "text/plain"));
    expect(response.status).toBe(415);
  });

  it("name が101文字なら 400 invalid_input を返す", async () => {
    const { POST } = await import("./route");
    const response = await POST(jsonRequest(validBody({ name: "あ".repeat(101) })));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "invalid_input" });
  });

  it("email の形式が不正なら 400 invalid_input を返す", async () => {
    const { POST } = await import("./route");
    const response = await POST(jsonRequest(validBody({ email: "not-an-email" })));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "invalid_input" });
  });

  it("message が2001文字なら 400 invalid_input を返す", async () => {
    const { POST } = await import("./route");
    const response = await POST(jsonRequest(validBody({ message: "あ".repeat(2001) })));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "invalid_input" });
  });

  it("Turnstile 検証が失敗したら 403 turnstile_failed を返す", async () => {
    stubTurnstileFetch(false);
    const { POST } = await import("./route");
    const response = await POST(jsonRequest(validBody()));
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "turnstile_failed" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("Turnstile 成功かつ Resend 送信成功で 200 ok を返す", async () => {
    stubTurnstileFetch(true);
    sendMock.mockResolvedValue({ data: { id: "email_1" }, error: null });
    const { POST } = await import("./route");
    const response = await POST(jsonRequest(validBody()));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });

    const sentPayload = sendMock.mock.calls[0][0];
    expect(sentPayload.to).toBe(ENV.CONTACT_TO_EMAIL);
    expect(sentPayload.from).toBe("onboarding@resend.dev");
    expect(sentPayload.replyTo).toBe("taro@example.com");
    expect(sentPayload.subject).toBe("[ポートフォリオ] お問い合わせ");
  });

  it("Resend 送信が失敗したら 502 send_failed を返す", async () => {
    stubTurnstileFetch(true);
    sendMock.mockResolvedValue({ data: null, error: { message: "failed" } });
    const { POST } = await import("./route");
    const response = await POST(jsonRequest(validBody()));
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "send_failed" });
  });
});
