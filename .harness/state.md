# 現在地
更新: 2026-09-18

## 進行中
なし

## 直前に完了
T-013 公開（初回リリース完了。https://dev-portfolio.sarada7739.workers.dev）

## 次にやる
T-016 フォーム失敗時に Turnstile をリセット（L1）

## 詰まっている点
なし

## メモ
- 公開 URL: https://dev-portfolio.sarada7739.workers.dev（GitHub: sarada7739/dev-portfolio, main 自動デプロイ）
- 環境変数: Runtime に RESEND_API_KEY / CONTACT_TO_EMAIL / TURNSTILE_SECRET_KEY、Builds に NEXT_PUBLIC_TURNSTILE_SITE_KEY
- Resend 送信元は onboarding@resend.dev。宛先は Resend 登録アドレスのみ可
- LP参照画像: docs/reference/lp-reference.jpg。Nisoine 実素材: docs/reference/nisoine/
- 他8作品の素材は未入手（プレースホルダのまま）
- OpenNext ローカルビルドは Windows 非対応（symlink EPERM）。検証は CI と Cloudflare 側
- Fable 5.1 がクレジット切れなら impl-ui / ui-reviewer / impl-l4 は opus で代替
- サブエージェントにプロセス名一括終了（taskkill /IM chrome.exe）を禁止済み

## 次のバックログ候補（未起票）
- 他8作品の実素材差し替え（works.json + public/images/works/）
- 「何を」コメント約10か所の削除（第7章の規約違反）
- 独自ドメイン + Resend ドメイン認証
- Nisoine 説明文の「Stripe」下線リンク
