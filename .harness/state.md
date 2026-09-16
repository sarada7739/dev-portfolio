# 現在地
更新: 2026-09-17

## 進行中
T-005 Nisoine セクション（L1 / impl-l1 / NG 0回）

## 直前に完了
T-004 ヘッダー + ヒーロー（続行。ui/{Container,Button,SectionLabel} 作成）

## 次にやる
T-006 その他の制作物グリッド

## 詰まっている点
- `next dev` が AGENTS.md 末尾に nextjs-agent-rules ブロックを自動追記する。毎回 `git checkout -- AGENTS.md` で戻している。恒久対策（無効化オプションの有無）は T-011 で調べる

## メモ
- LP参照画像: docs/reference/lp-reference.jpg（V2）
- Nisoine 実素材: docs/reference/nisoine/{hero-sunset.jpg, screen-timeline.png, screen-home.png, phone-frame.png}。phone-frame は任意
- 他8作品の素材は未入手。プレースホルダで進める
- GitHub リポジトリ名: dev-portfolio（T-013 前に作成）
- .claude/agents/ はセッション再起動後に有効。それまでは general-purpose + model 指定で代替
- トークン確定済み。セクション実装はトークンのみ使い、生の px/hex を書かない
