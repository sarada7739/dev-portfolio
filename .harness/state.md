# 現在地
更新: 2026-09-17

## 進行中
T-013 Cloudflare 接続・公開（L2 / メイン + impl-l0 / NG 0回）

## 直前に完了
T-012 視覚突合（続行。NG2回。残差は archive/tasks/T-012.md）

## 次にやる
なし（T-013 で初回リリース完了）

## 詰まっている点
- T-013: Cloudflare 接続・Resend/Turnstile キー・環境変数はユーザー作業待ち。公開 URL が来たら表示確認とフォーム送信テストへ

## メモ
- LP参照画像: docs/reference/lp-reference.jpg（V2）
- Nisoine 実素材: docs/reference/nisoine/{hero-sunset.jpg, screen-timeline.png, screen-home.png, phone-frame.png}。phone-frame は任意
- 他8作品の素材は未入手。プレースホルダで進める
- GitHub リポジトリ名: dev-portfolio（T-013 前に作成）
- .claude/agents/ は有効。impl-l1 / reviewer / auditor 等を名前で委譲する
- Fable 5.1 がクレジット切れなら impl-ui / ui-reviewer / impl-l4 は general-purpose + model opus で代替
- トークン確定済み。セクション実装はトークンのみ使い、生の px/hex を書かない
