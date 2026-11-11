"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import type { ContactInput } from "@/lib/contact-schema";

type FieldErrors = Partial<Record<keyof ContactInput, string>>;
type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);
  const [showTurnstile, setShowTurnstile] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  useEffect(() => {
    const element = turnstileRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowTurnstile(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setErrors({});
    setStatus("submitting");
    try {
      const { contactSchema } = await import("@/lib/contact-schema");
      const result = contactSchema.safeParse({
        name,
        email,
        message,
        turnstileToken,
      });
      if (!result.success) {
        const fieldErrors: FieldErrors = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof ContactInput;
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        setErrors(fieldErrors);
        setStatus("idle");
        return;
      }
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <div className="contact-form">
      <form
        onSubmit={handleSubmit}
        onFocusCapture={() => setShowTurnstile(true)}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="contact-field">
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
          {errors.name ? (
            <p className="text-caption text-coral-text">{errors.name}</p>
          ) : null}
        </div>

        <div className="contact-field">
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
          {errors.email ? (
            <p className="text-caption text-coral-text">{errors.email}</p>
          ) : null}
        </div>

        <div className="contact-field">
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
          {errors.message ? (
            <p className="text-caption text-coral-text">{errors.message}</p>
          ) : null}
        </div>

        <div>
          <div ref={turnstileRef} className="turnstile-slot">
            {showTurnstile ? (
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
                options={{ size: "compact" }}
                onSuccess={setTurnstileToken}
                onExpire={() => setTurnstileToken("")}
              />
            ) : null}
          </div>
          {errors.turnstileToken ? (
            <p className="mt-1 text-caption text-coral-text">
              {errors.turnstileToken}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="neon-button neon-button-primary"
        >
          送信する
        </button>

        {status === "success" ? (
          <p className="text-small text-ink">
            送信しました。返信をお待ちください。
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-small text-coral-text">
            送信できませんでした。時間をおいて再度お試しください。
          </p>
        ) : null}
      </form>

      <p className="privacy-notice">
        いただいた情報は返信のためにのみ使用し、それ以外の目的には使いません。送信時に
        Cloudflare Turnstile と Resend を利用します。詳しくは
        <Link href="/privacy">プライバシーポリシー</Link>
        をご覧ください。
      </p>
    </div>
  );
}
