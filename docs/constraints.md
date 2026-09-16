# constraints.md — 制約と非機能要件

## 機微データ
扱うもの: 問い合わせフォームの氏名・メールアドレス・本文。認証・決済は扱わない。

- フォーム送信内容をサーバー側で永続化しない（DB・KV・ログファイルへの保存を禁止）
- サーバーログに氏名・メールアドレス・本文を出力しない。ログに出してよいのは HTTP ステータスとエラー種別のみ
- メール送信は Resend 経由のみ。送信先は `CONTACT_TO_EMAIL` に固定し、ユーザー入力を宛先に使わない
- メール本文にユーザー入力を含める際は、ヘッダインジェクションを防ぐため改行をエスケープする
- API キー・シークレットをリポジトリにコミットしない。`.env.local` を `.gitignore` に含める
- `NEXT_PUBLIC_` 接頭辞を付けてよいのは Turnstile Site Key のみ

## 入力検証
- `/api/contact` は zod でサーバー側検証する。クライアント検証だけで済ませない
- 氏名 1〜100文字、メールは RFC 5322 形式、本文 1〜2000文字。超過は 400 を返す
- Turnstile トークン未検証のリクエストは 403 を返す
- Content-Type が `application/json` 以外は 415 を返す

## 法令・表示
- 個人情報保護法に基づき、フォーム近傍に利用目的（返信のためのみに使用）を明記する
- 取得した個人情報は返信目的以外に使わない旨をフッターに1行で記す
- 外部送信（Turnstile、Resend）を利用する旨を同じ箇所に記す

## セキュリティ
- 依存パッケージは `pnpm audit` で high 以上が 0 件であること（CI で検証）
- `dangerouslySetInnerHTML` を使わない
- 外部リンク（GitHub / Twitter / Note）は `rel="noopener noreferrer"` を付ける

## 非機能要件
- Lighthouse（モバイル）で Performance 90 以上、Accessibility 95 以上
- 画像は next/image で最適化し、`alt` を必ず付ける（装飾画像は `alt=""`）
- フォントは self-host し、外部フォント CDN を使わない
- CLS 0.1 以下
- キーボードのみでフォーム送信まで到達できる

## 運用
- main 直接コミット。1タスク=1コミット。コミット1行目にタスクIDを含める
- CI（GitHub Actions）で `pnpm lint` と `pnpm build` が通らない変更を main に入れない
- すべて無料枠で運用する。有料プランを前提にした設計をしない
