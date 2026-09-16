import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// ヘッダインジェクション対策。message の改行はそのまま許容する
function stripNewlines(value: string) {
  return value.replace(/[\r\n]/g, "");
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    console.error("contact:unsupported_media_type", 415);
    return Response.json({ error: "unsupported_media_type" }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    console.error("contact:invalid_input", 400);
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    console.error("contact:invalid_input", 400);
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }

  // モジュールトップで読むとテストで差し替えにくいためハンドラ内で読む
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactToEmail = process.env.CONTACT_TO_EMAIL;
  const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!resendApiKey || !contactToEmail || !turnstileSecretKey) {
    const missing = [
      !resendApiKey && "RESEND_API_KEY",
      !contactToEmail && "CONTACT_TO_EMAIL",
      !turnstileSecretKey && "TURNSTILE_SECRET_KEY",
    ].filter(Boolean);
    console.error("contact:misconfigured", 500, missing);
    return Response.json({ error: "misconfigured" }, { status: 500 });
  }

  const { name, email, message, turnstileToken } = parsed.data;

  let turnstileSuccess = false;
  try {
    const verifyResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({ secret: turnstileSecretKey, response: turnstileToken }),
    });
    const verifyResult = (await verifyResponse.json()) as { success?: boolean };
    turnstileSuccess = verifyResult.success === true;
  } catch {
    turnstileSuccess = false;
  }

  if (!turnstileSuccess) {
    console.error("contact:turnstile_failed", 403);
    return Response.json({ error: "turnstile_failed" }, { status: 403 });
  }

  const safeName = stripNewlines(name);
  const safeEmail = stripNewlines(email);
  const text = `お名前: ${safeName}\nメールアドレス: ${safeEmail}\n\n${message}`;

  try {
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: safeEmail,
      subject: "[ポートフォリオ] お問い合わせ",
      text,
    });

    if (error) {
      console.error("contact:send_failed", 502);
      return Response.json({ error: "send_failed" }, { status: 502 });
    }
  } catch {
    console.error("contact:send_failed", 502);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 200 });
}
