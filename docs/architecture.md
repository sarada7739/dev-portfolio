# architecture.md — 構成と技術選定

## 技術選定
| 領域 | 選定 | 理由 |
|---|---|---|
| フレームワーク | Next.js (App Router) | ユーザー指定。フォームAPIを Route Handler で同居させられる |
| スタイル | Tailwind CSS v4 / Astryx | CSS変数で配色を管理し、Astryx Buttonに共通の紫を適用する |
| フォント | next/font（Geist）/ 日本語の端末標準ゴシック | 欧文をself-host、日本語はHiragino / Yu Gothic / Meiryoで表示し、分割フォント読込を省く |
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

## 表示と粒子
- Astryx の `src/theme/portfolioTheme.ts` に既存CSS変数を参照する12トークンを定義し、公式CLIで生成した `portfolio.js` と `portfolio.css` を読み込む。ThemeProvider は dark に固定する。
- テーマ更新後は `pnpm dlx @astryxdesign/cli@0.7.13 theme build src/theme/portfolioTheme.ts --out src/theme/portfolio.css` を実行し、生成したJS/CSS/型定義もコミットする。
- 欧文は `next/font/local` で Geist を配信し、日本語は端末標準ゴシックで表示する。
- ヒーローは最初に `public/images/particle-orbit.webp` を描画する。Canvas 2D は `src/components/particles/field.ts` の固定シードから同じ粒子配置を生成する。
- 動きは最大30fps。手動停止、画面外、タブ非表示で連続描画を止める。動きを減らす設定では静止画を表示する。
- 共有画像は同じ粒子の静止画を使った `src/app/opengraph-image.png`。色と寸法の根拠は `docs/design-tokens.md` に記録する。

## 過去のサイト
- `/versions` から `/editions/classic` と `/editions/neon` を開ける。各版の上部から一覧と最新版へ戻れる。
- `public/editions` のHTMLとCSSはクラシック版（456d740）とネオン版（0113f86）のホームを静的に保存したもの。写真と拡大画像も各コミットのデータから取り出し、同じ内容の画像を共有する。
- 過去版のページ内リンクと画像拡大は独立して動く。問い合わせは最新版へ案内する。作品編集ツールの変更は現行ページに反映する。

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
- フォーム、画像拡大、粒子の再生状態は各コンポーネントで管理する。

## 対応環境
- モダンブラウザ最新2バージョン（Chrome / Safari / Firefox / Edge）。IE 非対応
- ブレークポイントはトークン文書で確定（想定: sm 640 / md 768 / lg 1024 / xl 1280）

## ローカル編集ツール（tools/admin）
- 制作物グリッド（works.json と public/images/works/）を GUI で編集するローカル専用ツール。`pnpm admin` で起動
- Next.js アプリとは独立した Node 標準モジュールのみのサーバー。本番ビルド・デプロイに一切含めない
- 127.0.0.1 のみで待ち受け。起動ごとのランダムトークンと Host / Origin 検証で他サイトからの操作を拒否
- 画像の切り抜き・縮小はブラウザの canvas で行い、サーバーは JPEG を書き込むだけ（sharp 等の追加依存なし）
- 「公開」は works.json と public/images/works/ だけを commit して main に push（Cloudflare が自動デプロイ）
