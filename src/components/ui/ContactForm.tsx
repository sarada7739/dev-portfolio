"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";

type FieldErrors = Partial<Record<keyof ContactInput, string>>;
type SubmitStatus = "idle" | "submitting" | "success" | "error";

// お問い合わせフォーム。送信先 /api/contact は T-009 で実装
export default function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = contactSchema.safeParse({ name, email, message, turnstileToken });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ContactInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor={nameId} className="text-small text-ink-soft">
            お名前
          </label>
          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-card border border-line bg-card px-4 py-2 text-body text-ink focus:border-ink focus:outline-none"
          />
          {errors.name ? <p className="text-caption text-coral-text">{errors.name}</p> : null}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={emailId} className="text-small text-ink-soft">
            メールアドレス
          </label>
          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-card border border-line bg-card px-4 py-2 text-body text-ink focus:border-ink focus:outline-none"
          />
          {errors.email ? <p className="text-caption text-coral-text">{errors.email}</p> : null}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={messageId} className="text-small text-ink-soft">
            本文
          </label>
          <textarea
            id={messageId}
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="rounded-card border border-line bg-card px-4 py-2 text-body text-ink focus:border-ink focus:outline-none"
          />
          {errors.message ? <p className="text-caption text-coral-text">{errors.message}</p> : null}
        </div>

        <div>
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
          />
          {errors.turnstileToken ? (
            <p className="mt-1 text-caption text-coral-text">{errors.turnstileToken}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-pill bg-button px-6 py-3 text-small text-on-navy disabled:opacity-50"
        >
          送信する
        </button>

        {status === "success" ? (
          <p className="text-small text-ink">送信しました。返信をお待ちください。</p>
        ) : null}
        {status === "error" ? (
          <p className="text-small text-coral-text">
            送信できませんでした。時間をおいて再度お試しください。
          </p>
        ) : null}
      </form>

      <p className="mt-4 text-caption text-gray">
        いただいた情報は返信のためにのみ使用し、それ以外の目的には使いません。送信時に Cloudflare
        Turnstile と Resend を利用します。詳しくは
        <Link href="/privacy">プライバシーポリシー</Link>
        をご覧ください。
      </p>
    </div>
  );
}
