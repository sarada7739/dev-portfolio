2026-09-17 | 形態 | 1ページのポートフォリオLP。目的は仕事相談の受付。Nisoine を最上部に置く | -
2026-09-17 | 技術 | Next.js (App Router) + Tailwind v4。ユーザー指定 | -
2026-09-17 | ホスティング | Cloudflare Pages + OpenNext。Nisoine と同じ基盤、無料枠 | -
2026-09-17 | フォーム | Route Handler + Resend + Turnstile。外部SaaSにデータを残さない | -
2026-09-17 | 機微データ | 氏名・メール・本文を扱う。永続化禁止、ログ出力禁止。監査ゲートはフォーム関連タスクのみ | -
2026-09-17 | 運用 | main 直接コミット、1タスク=1コミット。Actions で lint/build のみ | -
2026-09-17 | コンテンツ | 制作物データは src/data/works.json に分離。素材はプレースホルダで開始 | -
2026-09-17 | スコープ | 「事例を読む」の遷移先は初回リリースに含めない | -
2026-09-17 | 設計 | V2 のため impl-ui でトークン抽出を先行。セクション実装は impl-l1 に量産させる | -
2026-09-17 | 素材 | Nisoine の実素材3点を docs/reference/nisoine/ に保管。LP参照画像のスマホ枠には screen-home.png を使う | T-005
2026-09-17 | 運用 | GitHub リポジトリ名は dev-portfolio | T-013
2026-09-17 | コンテンツ | 4件目の作品名は画像どおり「ぴーと」。タスク起票時の「びーと」は誤記 | T-003
2026-09-17 | デザイン | トークン追加: radius-phone 40px（スマホ枠）、aspect-photo 4/3（Nisoine 写真）。抽出時の漏れ。任意値 [...] は引き続き禁止 | T-005
2026-09-17 | フォーム | 検証エラー文言は日本語。contact-schema.ts の各ルールに message を持たせ、クライアント・サーバーで共用 | T-008
2026-09-17 | 法令 | 監査の要人間判断（Resend=米国・30日保存の外国第三者提供）はユーザー判断で /privacy ページにのみ詳細を記載。フォーム直下の文言は現行のまま、ポリシーへリンクを追加 | T-009
2026-09-17 | ビルド | OpenNext build は Windows で symlink EPERM（開発者モード要）。ローカル実行を受入条件から外し CI（Ubuntu）で検証する。開発者モード有効化はユーザー判断に委ねる | T-011
2026-09-17 | 運用 | next dev の AGENTS.md 自動追記は next.config.ts の agentRules: false で無効化 | T-011
2026-09-17 | 運用 | Fable 5.1 がクレジット切れの場合、impl-ui / ui-reviewer / impl-l4 は opus で代替する（ユーザー指示） | -
2026-09-17 | デザイン | h1 は 52px でなく計測どおり 50px。Nisoine 見出し10文字がカラム幅(523px)を超えたため。グリッド比率は変えない | T-012
2026-09-17 | デザイン | 視覚突合の残差（Nisoine 右カラム幅・スマホ高さ・カード幅 −7px）は許容。非対称グリッドへの変更は行わない | T-012
2026-09-18 | リリース | 初回リリース完了。完成の定義①②③をすべて満たした。公開 URL: https://dev-portfolio.sarada7739.workers.dev | T-013
2026-09-18 | 運用 | Resend は onboarding@resend.dev のため送信先は Resend 登録アドレスに限定。独自ドメイン認証は次回以降 | T-013
2026-09-18 | 運用 | Fable 5.1 は使わない（ユーザー指示）。impl-ui / ui-reviewer / impl-l4 は opus で実行 | -
