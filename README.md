This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 開発ハーネス

リポジトリのルートで新しいセッションを開始します。Codex は [AGENTS.md](AGENTS.md) と `.codex/agents/` を使います。Claude Code に戻すときは同じフォルダを Claude Code で開くと、[CLAUDE.md](CLAUDE.md) と `.claude/agents/` が読み込まれます。どちらも [.harness/state.md](.harness/state.md) と [.harness/backlog.md](.harness/backlog.md) から作業を再開します。

移行前の設定とタスク履歴は、ローカルの `.harness/backup/2026-11-12_claude-code-harness.zip` に保存しています。移行前のファイルが必要な場合は、リポジトリのルートで次のコマンドを実行し、展開先から必要なファイルを選んで復元してください。

```powershell
$harnessRestore = Join-Path ([IO.Path]::GetTempPath()) ("claude-harness-" + [guid]::NewGuid())
Expand-Archive -LiteralPath '.harness/backup/2026-11-12_claude-code-harness.zip' -DestinationPath $harnessRestore
Write-Output $harnessRestore
```

ZIP の `.harness/` は移行前時点の履歴です。通常のツール切り替えでは、現在の `.harness/` をそのまま使います。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
