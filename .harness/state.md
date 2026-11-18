# 現在地
更新: 2026-11-18

## 進行中
なし

## 直前に完了
T-041 作品目次と大判の展示（L2 / V2）。メインが単独で実装・検証。

## 次にやる
T-016 フォーム失敗時に Turnstile をリセット（L1）。

## 公開前の残件
既存の開発依存 picomatch に重大度 high が1件。npm の最新版4.0.7にも該当し、公式の修正版は未掲載。全依存の CI 監査は未達、本番依存の監査は0件。監査除外や依存バージョンの変更は行っていない。

## メモ
- T-038 の参照は Refero に掲載された Dala。リンクと配色は docs/design-tokens.md。粒子は src/components/particles、初期画像は public/images/particle-orbit.webp。
- T-039 は翡翠・薄紫・桃色の丸い粒子。クリック・タップで波、ドラッグで回転。画面上の操作案内は省き、読み上げに対応。検証記録は docs/reference/shots/t039-gestures.json、t039-layout.json、t039-lighthouse-final.json。
- T-040 はWebGLで点群を一括描画し、使用不可時は2Dに切り替える。輪の前後に伝わる波と接点からの回転追従、リリース後の慣性に対応。タッチ条件での変更前後の実測は docs/reference/shots/t040-{before,after}-bench.json。
- /versions にクラシック版（456d740）・ネオン版（0113f86）を保存。個別のHTML・CSSと画像は public/editions にあり、制作物データの編集から独立している。
- トップの粒子は停止・再開に対応。画面外・非表示タブでは描画を停止し、動きを減らす設定とJavaScript無効時は静止画を表示する。
- T-038 の証跡は docs/reference/shots/t038-checks.json、t038-hero-*.png、t038-page-*.png、t038-lighthouse-final.json。320〜1440pxで横はみ出し0、Lighthouseモバイル性能92・アクセシビリティ100・CLS 0。
- Nisoineと6件の作品を掲載。制作物は pnpm admin で編集し、ツールの「公開」は未pushコミットもまとめてpushする。
- 作品一覧は /#works-all、各作品は /#project-<slug>。目次と横スワイプ、大判の実画像、2倍表示に対応。
- 既存の公開URLは https://dev-portfolio.sarada7739.workers.dev 。GitHub sarada7739/dev-portfolio の main push で自動デプロイする。
- 現行サイトはAstryx Buttonと事前ビルドした専用テーマを使用。日本語は端末標準、欧文は自前配信のGeist。テーマの再生成手順は docs/architecture.md。
- フォームはcompact Turnstileを近接・フォーカス時に読み込み、検証スキーマを送信時に読み込む。模擬送信を確認し、実メール送信は未検証。
- Runtime に RESEND_API_KEY / CONTACT_TO_EMAIL / TURNSTILE_SECRET_KEY、Builds に NEXT_PUBLIC_TURNSTILE_SITE_KEY。Resend送信元は onboarding@resend.dev。
- WindowsでのOpenNextビルドにはsymlink権限の制約がある。Cloudflare向けビルドはCIで検証する。
- CodexはAGENTS.mdと.codex/agents/、Claude CodeはCLAUDE.mdと.claude/agents/を使い、.harness/を共有する。

## バックログ候補
- picomatch の修正版が公開されたら開発依存を更新して全体の監査を再実行する。
- site.jsonの仮メールとSNS、編集ツールのURLトークン消去・画像パス・予約名slugを確認する。
- Netlify移行、独自ドメイン、Resendドメイン認証はユーザー検討中。
