# 現在地
更新: 2026-11-12

## 進行中
なし

## 直前に完了
T-034 ネオン配色のポートフォリオと初期表示アニメーション（L2 / V2、reviewer・Terra max 視覚レビュー続行、フォーム技術監査問題なし）

## 次にやる
T-016 フォーム失敗時に Turnstile をリセット（L1）

## 詰まっている点
- 既存依存の監査で critical 2件・high 10件。Next 16.3.8、sharp、zod等の更新が別途必要。Astryx由来の指摘は0。

## メモ
- ローカル本番プレビューは http://127.0.0.1:3100、PID 20536。終了時はこの起動プロセスを指定する。
- 公開 URL は https://dev-portfolio.sarada7739.workers.dev（GitHub sarada7739/dev-portfolio、main pushで自動デプロイ）。
- 新参照は docs/reference/neon-portfolio.jpg。トークンは docs/design-tokens.md。生成ヒーローは public/images/neon-hero.png、生成指示は docs/reference/neon-hero-generation.json。
- 初期表示は上下左右の画面外から集合。ヒーロー600ms、全体最大1600ms。reduced-motion・フォーカス・アンカー移動は即時表示。
- 大きなキャッチコピーを置かず、開発についての説明はです・ます調。日本語は端末標準ゴシック、欧文はself-host Geist。
- Astryx Buttonと事前ビルドの専用テーマを導入。テーマの再生成手順は docs/architecture.md。
- 最終検証は lint/type/build成功、既存7テスト成功、320/375/390/711/1440pxで横はみ出し0、Lighthouse mobile P91/A100/CLS0。
- 証跡は docs/reference/shots/t034-check.json、t034-lighthouse.json、t034-after-*.png、t034-entrance.webm。実メール送信は未検証。
- フォームはcompact Turnstileを近接/フォーカス時に読み込み、検証スキーマを送信時に読み込む。同時送信は同期refロックで抑止する。
- Runtime に RESEND_API_KEY / CONTACT_TO_EMAIL / TURNSTILE_SECRET_KEY、Builds に NEXT_PUBLIC_TURNSTILE_SITE_KEY。Resend送信元は onboarding@resend.dev。
- Nisoine＋制作物5件は実素材。GitHubリンクは Orrery / AI-Manager / Moni-to。制作物の追加は pnpm admin（tools/admin）で行える。
- 編集ツールの公開ボタンは未pushコミットもまとめてpushする。
- WindowsのOpenNextビルドはsymlink権限に制約があり、Cloudflare向けビルド検証はCI側で行う。
- CodexはAGENTS.mdと.codex/agents/、Claude CodeはCLAUDE.mdと.claude/agents/を使い、.harness/を共有する。

## 次のバックログ候補（未起票）
- 既存依存のcritical/high監査指摘の解消。
- site.jsonの仮メール・SNSの#・SEO descriptionの確認。仮SNSと仮メールの宣伝リンクはフッターの表示対象から除外。
- 編集ツールのURLトークン消去、画像パス検証、Windows予約名slug拒否。
- Netlify移行、独自ドメインとResendドメイン認証はユーザー検討中。
