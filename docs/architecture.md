# architecture.md — 構成と技術選定

## 技術選定
| 領域 | 選定 | 理由 |
|---|---|---|
| フレームワーク | Next.js (App Router) | ユーザー指定。フォームAPIを Route Handler で同居させられる |
| スタイル | Tailwind CSS v4 | デザイントークンを CSS 変数で定義し、参照画像への忠実度を保ちやすい |
| フォント | next/font（Noto Serif JP / Shippori Mincho 等） | 参照画像のセリフ体を再現。self-host で CLS を防ぐ |
| ホスティング | Cloudflare Pages + @opennextjs/cloudflare | Nisoine と同じ管理画面。無料枠。Route Handler が Workers 上で動く |
| メール送信 | Resend | 無料 3,000通/月。API が単純。送信内容を保存しない |
| スパム対策 | Cloudflare Turnstile | 無料。同一プラットフォームで完結 |
| Lint/Format | ESLint + Prettier | Next.js 標準構成に従う |
| CI | GitHub Actions | lint と build のみ。デプロイは Cloudflare の Git 連携に任せる |
| パッケージ管理 | pnpm | ロックファイルの差分が読みやすい |

## ディレクトリ方針
```
src/
  app/
    layout.tsx            # フォント読込・メタデータ
    page.tsx              # セクションを順に並べるだけ。ロジックを持たない
    api/contact/route.ts  # フォーム受信 → Turnstile 検証 → Resend 送信
  components/
    sections/             # Hero, Nisoine, Works, HowIWork, Footer
    ui/                   # Tag, Button, WorkCard など再利用部品
  data/
    works.json            # 制作物データ。素材差し替えはここだけ触る
    how-i-work.json       # HOW I WORK の4項目
  lib/
    contact-schema.ts     # フォーム入力の zod スキーマ（クライアント・サーバー共用）
public/
  images/works/           # 制作物のサムネイル（初回はプレースホルダ）
docs/
  design-tokens.md        # impl-ui が参照画像から抽出（80行以内）
  reference/              # 参照画像
```

## デザイントークンの扱い
- `docs/design-tokens.md` を唯一の出典とし、`src/app/globals.css` の `@theme` に転記する
- コンポーネントはトークン（Tailwind クラス）のみ使い、生の px / 色コードをハードコードしない
- トークン抽出（V2 / impl-ui）→ 個別セクション実装（impl-l1）の順で進める

## フォームの境界
```
ブラウザ ──POST /api/contact──▶ Route Handler
                                 ├─ zod で入力検証
                                 ├─ Turnstile トークンを Cloudflare に検証
                                 ├─ Resend で自分宛にメール送信
                                 └─ 自サーバーでは保存しない（Resend 側では最大30日保持） 200/4xx を返す
```
- 状態を持たない。DB・KV は使わない
- レート制限は Turnstile に委ね、初回は独自実装しない

## 環境変数
| 変数 | 用途 | 置き場所 |
|---|---|---|
| `RESEND_API_KEY` | メール送信 | Cloudflare Pages の Secret |
| `CONTACT_TO_EMAIL` | 送信先（自分） | Cloudflare Pages の環境変数 |
| `TURNSTILE_SECRET_KEY` | Turnstile サーバー検証 | Cloudflare Pages の Secret |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile ウィジェット | 公開可 |
- ローカルは `.env.local`（git 管理外）。`.env.example` にキー名のみ置く

## デプロイ手順
1. GitHub リポジトリ（dev-portfolio）を Cloudflare Workers/Pages の Git 連携に接続（main ブランチ）
2. ビルドコマンド: `pnpm install --frozen-lockfile && pnpm exec opennextjs-cloudflare build`
3. 環境変数を上表のとおり設定
4. 独自ドメインを割り当て（任意）
5. ローカル確認は `pnpm preview`（build + wrangler preview）、本番デプロイは `pnpm deploy`（T-013 で実施）
6. ローカル Windows では OpenNext ビルドが symlink の権限で失敗する（開発者モード有効化または WSL で回避）。検証は CI と Cloudflare 側のビルドで行う

## 状態管理
- クライアント状態はフォームの入力値・送信状態のみ。`useState` で足りる。状態管理ライブラリは入れない

## 対応環境
- モダンブラウザ最新2バージョン（Chrome / Safari / Firefox / Edge）。IE 非対応
- ブレークポイントはトークン文書で確定（想定: sm 640 / md 768 / lg 1024 / xl 1280）
