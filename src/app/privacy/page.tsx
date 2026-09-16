import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { site } from "@/data";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <main className="bg-cream py-section-sm lg:py-section">
      <Container className="flex flex-col gap-8">
        <h1 className="font-serif text-h2 text-ink">プライバシーポリシー</h1>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-h3 text-ink-soft">取得する情報</h2>
          <p className="text-body text-ink">
            お問い合わせフォームからは、氏名・メールアドレス・本文を取得します。
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-h3 text-ink-soft">利用目的</h2>
          <p className="text-body text-ink">
            取得した情報は、お問い合わせへの返信のためにのみ使用します。それ以外の目的には使用しません。
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-h3 text-ink-soft">外部サービスへの提供</h2>
          <p className="text-body text-ink">
            送信内容は、メール配信のため米国の Resend, Inc. のサーバーを経由し、同社のポリシーにより最大30日間保存されます。同社は
            GDPR に準拠した DPA・SCC を公表しています。
          </p>
          <a
            href="https://resend.com/security/gdpr"
            rel="noopener noreferrer"
            target="_blank"
            className="text-small underline underline-offset-4"
          >
            https://resend.com/security/gdpr
          </a>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-h3 text-ink-soft">スパム対策</h2>
          <p className="text-body text-ink">
            Cloudflare Turnstile を利用しており、IP アドレス・ブラウザ情報等のアクセス情報が
            Cloudflare, Inc. に送信されます。
          </p>
          <a
            href="https://www.cloudflare.com/turnstile-privacy-policy/"
            rel="noopener noreferrer"
            target="_blank"
            className="text-small underline underline-offset-4"
          >
            https://www.cloudflare.com/turnstile-privacy-policy/
          </a>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-h3 text-ink-soft">保存期間</h2>
          <p className="text-body text-ink">
            当サイトのサーバーでは送信内容を保存しません。受信したメールは返信完了後に削除します。
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-h3 text-ink-soft">お問い合わせ先</h2>
          <p className="text-body text-ink">{site.email}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-h3 text-ink-soft">制定日</h2>
          <p className="text-body text-ink">2026-09-17</p>
        </section>

        <Link href="/" className="text-small underline underline-offset-4">
          トップへ戻る
        </Link>
      </Container>
    </main>
  );
}
