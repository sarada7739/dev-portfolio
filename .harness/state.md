# 現在地
更新: 2026-09-17

## 進行中
T-009 /api/contact Route Handler（L2 / impl-l2 / NG 0回 / 監査ゲート対象）

## 直前に完了
T-008 フッター + フォーム UI（続行。zod / react-turnstile 追加、日本語文言）

## 次にやる
T-010 SEO（metadata・OGP・sitemap・robots）

## 詰まっている点
- `next dev` が AGENTS.md 末尾に nextjs-agent-rules ブロックを自動追記する。毎回 `git checkout -- AGENTS.md` で戻している。恒久対策（無効化オプションの有無）は T-011 で調べる

## メモ
- LP参照画像: docs/reference/lp-reference.jpg（V2）
- Nisoine 実素材: docs/reference/nisoine/{hero-sunset.jpg, screen-timeline.png, screen-home.png, phone-frame.png}。phone-frame は任意
- 他8作品の素材は未入手。プレースホルダで進める
- GitHub リポジトリ名: dev-portfolio（T-013 前に作成）
- .claude/agents/ はセッション再起動後に有効。それまでは general-purpose + model 指定で代替
- トークン確定済み。セクション実装はトークンのみ使い、生の px/hex を書かない
