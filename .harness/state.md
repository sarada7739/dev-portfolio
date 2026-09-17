# 現在地
更新: 2026-09-17

## 進行中
T-012 全体の視覚突合（V2 / ui-reviewer → impl-l1 / NG 1回）

## 直前に完了
T-011 CI + OpenNext（続行。NG1回: 冒頭コメント。OpenNext ローカルビルドは Windows 非対応で CI 検証に変更）

## 次にやる
T-013 Cloudflare Pages 接続・公開

## 詰まっている点
なし

## メモ
- LP参照画像: docs/reference/lp-reference.jpg（V2）
- Nisoine 実素材: docs/reference/nisoine/{hero-sunset.jpg, screen-timeline.png, screen-home.png, phone-frame.png}。phone-frame は任意
- 他8作品の素材は未入手。プレースホルダで進める
- GitHub リポジトリ名: dev-portfolio（T-013 前に作成）
- .claude/agents/ は有効。impl-l1 / reviewer / auditor 等を名前で委譲する
- Fable 5.1 がクレジット切れなら impl-ui / ui-reviewer / impl-l4 は general-purpose + model opus で代替
- トークン確定済み。セクション実装はトークンのみ使い、生の px/hex を書かない
