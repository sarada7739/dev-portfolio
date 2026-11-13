# 現在地
更新: 2026-11-13

## 進行中
なし

## 直前に完了
T-037 ポートフォリオと編集ツールの日本語を推敲（L2、reviewer 続行、最終稿26ファイル照合・lint・型検査・テスト7件・本番ビルドを確認）

## 次にやる
T-016 フォーム失敗時に Turnstile をリセット（L1）

## 詰まっている点
なし

## メモ
- T-035 は Next.js 16.4.6、Zod 4.6.7、OpenNext Cloudflare 1.20.16、Wrangler 4.160.0 に更新。既存の `braces` 監査除外は修正版未公開のため継続。
- T-035 の最終ロックで固定インストール、lint、型検査、ビルド、7テスト、1440px／390px、AVIF、問い合わせAPIの400／415を確認。
- 公開 URL は https://dev-portfolio.sarada7739.workers.dev（GitHub sarada7739/dev-portfolio、main pushで自動デプロイ）。
- 新参照は docs/reference/neon-portfolio.jpg。トークンは docs/design-tokens.md。生成ヒーローは public/images/neon-hero.png、生成指示は docs/reference/neon-hero-generation.json。
- 初期表示は上下左右の画面外から集合。ヒーロー600ms、全体最大1600ms。reduced-motion・フォーカス・アンカー移動は即時表示。
- 大きなキャッチコピーを置かず、開発についての説明はです・ます調。日本語は端末標準ゴシック、欧文はself-host Geist。
- Astryx Buttonと事前ビルドの専用テーマを導入。テーマの再生成手順は docs/architecture.md。
- T-034 では320/375/390/711/1440pxで横はみ出し0、Lighthouse mobile P91/A100/CLS0を確認。
- 証跡は docs/reference/shots/t034-check.json、t034-lighthouse.json、t034-after-*.png、t034-entrance.webm。実メール送信は未検証。
- フォームはcompact Turnstileを近接/フォーカス時に読み込み、検証スキーマを送信時に読み込む。同時送信は同期refロックで抑止する。
- Runtime に RESEND_API_KEY / CONTACT_TO_EMAIL / TURNSTILE_SECRET_KEY、Builds に NEXT_PUBLIC_TURNSTILE_SITE_KEY。Resend送信元は onboarding@resend.dev。
- Nisoine＋制作物6件は実素材。FieldSprigは開発中のUnity実画面を使用。GitHubリンクは Orrery / AI-Manager / Moni-to。制作物の追加は pnpm admin（tools/admin）で行える。
- 編集ツールの公開ボタンは未pushコミットもまとめてpushする。
- WindowsのOpenNextビルドはsymlink権限に制約があり、Cloudflare向けビルド検証はCI側で行う。
- CodexはAGENTS.mdと.codex/agents/、Claude CodeはCLAUDE.mdと.claude/agents/を使い、.harness/を共有する。

## 次のバックログ候補（未起票）
- site.jsonの仮メールとSNSの#の確認。仮SNSと仮メールの宣伝リンクはフッターの表示対象から除外。
- 編集ツールのURLトークン消去、画像パス検証、Windows予約名slug拒否。
- Netlify移行、独自ドメインとResendドメイン認証はユーザー検討中。
