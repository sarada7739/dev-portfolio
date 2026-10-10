import http from "node:http";
import { readFile, writeFile, rm, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { execFile } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ADMIN_DIR = path.join(ROOT, "tools", "admin");
const WORKS_JSON = path.join(ROOT, "src", "data", "works.json");
const WORKS_JSON_REL = "src/data/works.json";
const IMG_DIR = path.join(ROOT, "public", "images", "works");
const IMG_DIR_REL = "public/images/works";
const IMG_URL_PREFIX = "/images/works/";

const BASE_PORT = 4319;
const MAX_PORT_TRIES = 20;
const MAX_BODY = 20 * 1024 * 1024;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// 画像ファイル名として許可する形。ドットで始まる名前やパス区切りを排除する
const IMG_FILE_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const MAX_STR = 2000;

const TOKEN = randomBytes(32).toString("hex");
const STATIC_FILES = {
  "/app.js": ["app.js", "text/javascript; charset=utf-8"],
  "/style.css": ["style.css", "text/css; charset=utf-8"],
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

let port = BASE_PORT;

// works.json と画像の書き込み・git 操作が交差しないよう直列化する
let queue = Promise.resolve();
function serialize(task) {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
}

function baseHeaders(contentType) {
  return {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy":
      "default-src 'self'; img-src 'self' blob: data:; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'",
  };
}

function sendJson(res, status, body) {
  res.writeHead(status, baseHeaders("application/json; charset=utf-8"));
  res.end(JSON.stringify(body));
}

function checkHostAndOrigin(req) {
  const allowedHosts = [`127.0.0.1:${port}`, `localhost:${port}`];
  if (!allowedHosts.includes(req.headers.host ?? "")) {
    throw new HttpError(403, "Host が許可されていません");
  }
  const origin = req.headers.origin;
  if (origin !== undefined && !allowedHosts.some((h) => origin === `http://${h}`)) {
    throw new HttpError(403, "Origin が許可されていません");
  }
}

function tokenMatches(candidate) {
  if (typeof candidate !== "string") return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(TOKEN);
  return a.length === b.length && timingSafeEqual(a, b);
}

function requireToken(req) {
  if (!tokenMatches(req.headers["x-admin-token"])) {
    throw new HttpError(403, "トークンが一致しません");
  }
}

async function readBody(req) {
  const declared = Number(req.headers["content-length"] ?? 0);
  if (declared > MAX_BODY) throw new HttpError(413, "リクエストが大きすぎます（上限 20MB）");
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new HttpError(413, "リクエストが大きすぎます（上限 20MB）");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readJsonBody(req) {
  const type = (req.headers["content-type"] ?? "").split(";")[0].trim().toLowerCase();
  if (type !== "application/json") throw new HttpError(415, "Content-Type は application/json にしてください");
  const raw = await readBody(req);
  try {
    return JSON.parse(raw.toString("utf8"));
  } catch {
    throw new HttpError(400, "JSON を解釈できません");
  }
}

function assertSlug(slug) {
  if (typeof slug !== "string" || slug.length > 64 || !SLUG_RE.test(slug)) {
    throw new HttpError(400, "slug は英小文字・数字・ハイフンのみ（先頭末尾・連続ハイフン不可）です");
  }
  // <slug>-full.jpg が別カードのサムネイルと衝突するのを防ぐ
  if (slug.endsWith("-full")) throw new HttpError(400, "slug の末尾に -full は使えません");
}

// slug 等から組み立てたファイル名を IMG_DIR 配下に閉じ込める
function imagePath(fileName) {
  if (!IMG_FILE_RE.test(fileName)) throw new HttpError(400, "画像ファイル名が不正です");
  const resolved = path.resolve(IMG_DIR, fileName);
  if (!resolved.startsWith(IMG_DIR + path.sep)) throw new HttpError(400, "書き込み先が許可範囲外です");
  return resolved;
}

// "/images/works/foo.jpg" 形式の参照だけをファイル名にする。それ以外は null
function imageFileFromRef(ref) {
  if (typeof ref !== "string" || !ref.startsWith(IMG_URL_PREFIX)) return null;
  const name = ref.slice(IMG_URL_PREFIX.length);
  return IMG_FILE_RE.test(name) ? name : null;
}

async function readWorksFile() {
  const text = await readFile(WORKS_JSON, "utf8");
  return { text, works: JSON.parse(text) };
}

function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isAllowedUrl(v) {
  if (v === "" || v === "#") return true;
  if (!v.startsWith("https://") || /\s/.test(v)) return false;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

function validateWorks(works) {
  if (!Array.isArray(works)) throw new HttpError(400, "works は配列にしてください");
  const seen = new Set();
  works.forEach((w, i) => {
    const label = `${i + 1}件目`;
    if (!isPlainObject(w)) throw new HttpError(400, `${label}: オブジェクトではありません`);
    for (const key of ["slug", "title", "description", "year", "thumbnail", "href"]) {
      if (typeof w[key] !== "string") throw new HttpError(400, `${label}: ${key} が文字列ではありません`);
    }
    for (const key of ["titleMasked", "image", "github"]) {
      if (w[key] !== undefined && typeof w[key] !== "string") {
        throw new HttpError(400, `${label}: ${key} が文字列ではありません`);
      }
    }
    for (const [key, value] of Object.entries(w)) {
      if (typeof value === "string" && value.length > MAX_STR) {
        throw new HttpError(400, `${label}: ${key} が長すぎます`);
      }
    }
    assertSlug(w.slug);
    if (seen.has(w.slug)) throw new HttpError(400, `slug が重複しています: ${w.slug}`);
    seen.add(w.slug);
    if (w.title.trim() === "") throw new HttpError(400, `${label}: title が空です`);
    for (const key of ["href", "github"]) {
      if (w[key] !== undefined && !isAllowedUrl(w[key])) {
        throw new HttpError(400, `${label}: ${key} は空・"#"・https:// のいずれかにしてください`);
      }
    }
  });
}

function referencedImages(works) {
  const names = new Set();
  for (const w of works) {
    for (const ref of [w.thumbnail, w.image]) {
      const name = imageFileFromRef(ref);
      if (name) names.add(name);
    }
  }
  return names;
}

async function saveWorks(works) {
  validateWorks(works);
  const { text: oldText, works: oldWorks } = await readWorksFile();
  // 既存ファイルの改行コードに合わせ、不要な差分を出さない
  const eol = oldText.includes("\r\n") ? "\r\n" : "\n";
  const body = JSON.stringify(works, null, 2).replace(/\n/g, eol) + eol;
  await writeFile(WORKS_JSON, body, "utf8");

  // 保存後にどのカードからも参照されなくなった画像だけを削除する
  const stillUsed = referencedImages(works);
  const removed = [];
  for (const name of referencedImages(oldWorks)) {
    if (stillUsed.has(name)) continue;
    await rm(imagePath(name), { force: true });
    removed.push(name);
  }
  return { count: works.length, removedImages: removed };
}

function decodeJpeg(b64, label) {
  if (typeof b64 !== "string" || b64 === "") throw new HttpError(400, `${label} がありません`);
  const buf = Buffer.from(b64, "base64");
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) {
    throw new HttpError(400, `${label} は JPEG ではありません`);
  }
  return buf;
}

async function saveImages(body) {
  if (!isPlainObject(body)) throw new HttpError(400, "リクエスト形式が不正です");
  assertSlug(body.slug);
  const thumb = decodeJpeg(body.thumbnail, "thumbnail");
  const full = decodeJpeg(body.full, "full");
  const thumbPath = imagePath(`${body.slug}.jpg`);
  const fullPath = imagePath(`${body.slug}-full.jpg`);
  await mkdir(IMG_DIR, { recursive: true });
  await writeFile(thumbPath, thumb);
  await writeFile(fullPath, full);
  return {
    thumbnail: `${IMG_URL_PREFIX}${body.slug}.jpg`,
    image: `${IMG_URL_PREFIX}${body.slug}-full.jpg`,
  };
}

function git(args, timeout = 30_000) {
  return new Promise((resolve) => {
    execFile(
      "git",
      args,
      { cwd: ROOT, timeout, windowsHide: true, maxBuffer: 4 * 1024 * 1024, env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } },
      (error, stdout, stderr) => {
        resolve({ ok: !error, code: error ? (error.code ?? 1) : 0, stdout: String(stdout), stderr: String(stderr), error });
      },
    );
  });
}

function formatGitLog(step, r) {
  const out = [r.stdout.trim(), r.stderr.trim()].filter(Boolean).join("\n");
  return `$ git ${step}\n${out}`.trim();
}

async function summarizeChange() {
  let before = [];
  const head = await git(["show", `HEAD:${WORKS_JSON_REL}`]);
  if (head.ok) {
    try {
      before = JSON.parse(head.stdout);
    } catch {
      // HEAD 側が解釈できなければ要約は汎用文言に落とす
      return "works: update";
    }
  }
  const { works: after } = await readWorksFile();
  const beforeBySlug = new Map(before.map((w) => [w.slug, w]));
  const afterSlugs = new Set(after.map((w) => w.slug));
  const added = after.filter((w) => !beforeBySlug.has(w.slug)).map((w) => w.slug);
  const removed = before.filter((w) => !afterSlugs.has(w.slug)).map((w) => w.slug);
  const edited = after
    .filter((w) => beforeBySlug.has(w.slug) && JSON.stringify(beforeBySlug.get(w.slug)) !== JSON.stringify(w))
    .map((w) => w.slug);
  const commonBefore = before.filter((w) => afterSlugs.has(w.slug)).map((w) => w.slug);
  const commonAfter = after.filter((w) => beforeBySlug.has(w.slug)).map((w) => w.slug);
  const reordered = commonBefore.join() !== commonAfter.join();

  const parts = [];
  if (added.length) parts.push(`add ${added.join(", ")}`);
  if (edited.length) parts.push(`edit ${edited.join(", ")}`);
  if (removed.length) parts.push(`remove ${removed.join(", ")}`);
  if (reordered) parts.push("reorder");
  const summary = parts.length ? parts.join("; ") : "update images";
  return `works: ${summary}`.slice(0, 200);
}

async function publish() {
  const paths = [WORKS_JSON_REL, IMG_DIR_REL];
  const branch = await git(["rev-parse", "--abbrev-ref", "HEAD"]);
  if (!branch.ok) throw new HttpError(500, `ブランチを確認できません: ${branch.stderr.trim()}`);
  if (branch.stdout.trim() !== "main") {
    throw new HttpError(409, `現在のブランチが main ではありません（${branch.stdout.trim()}）`);
  }

  const status = await git(["status", "--porcelain", "--", ...paths]);
  if (!status.ok) throw new HttpError(500, `git status に失敗しました: ${status.stderr.trim()}`);
  if (status.stdout.trim() === "") return { ok: true, changed: false, message: "公開する変更はありません", log: "" };

  const message = await summarizeChange();
  const logs = [];
  // 新規画像は add しないと pathspec 付き commit の対象にならない
  const steps = [
    ["add", "-A", "--", ...paths],
    ["commit", "-m", message, "--", ...paths],
    ["push", "origin", "main"],
  ];
  for (const args of steps) {
    const r = await git(args, args[0] === "push" ? 120_000 : 30_000);
    logs.push(formatGitLog(args[0], r));
    if (!r.ok) {
      return { ok: false, changed: true, message: `git ${args[0]} に失敗しました`, log: logs.join("\n\n") };
    }
  }
  return { ok: true, changed: true, message: `公開しました: ${message}`, log: logs.join("\n\n") };
}

async function serveImage(res, url) {
  const name = imageFileFromRef(url.searchParams.get("path"));
  if (!name) throw new HttpError(400, "画像パスが不正です");
  let data;
  try {
    data = await readFile(imagePath(name));
  } catch (e) {
    if (e.code === "ENOENT") throw new HttpError(404, "画像が見つかりません");
    throw e;
  }
  const ext = path.extname(name).toLowerCase();
  const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
  if (!types[ext]) throw new HttpError(400, "未対応の画像形式です");
  res.writeHead(200, baseHeaders(types[ext]));
  res.end(data);
}

async function handle(req, res) {
  checkHostAndOrigin(req);
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const method = req.method ?? "GET";

  if (url.pathname === "/") {
    if (method !== "GET") throw new HttpError(405, "許可されていないメソッドです");
    if (!tokenMatches(url.searchParams.get("token"))) throw new HttpError(403, "トークンが一致しません");
    const html = await readFile(path.join(ADMIN_DIR, "index.html"));
    res.writeHead(200, baseHeaders("text/html; charset=utf-8"));
    res.end(html);
    return;
  }

  // 静的ファイルは秘密を含まないため Host / Origin 検証のみで配信する
  if (STATIC_FILES[url.pathname]) {
    if (method !== "GET") throw new HttpError(405, "許可されていないメソッドです");
    const [file, type] = STATIC_FILES[url.pathname];
    res.writeHead(200, baseHeaders(type));
    res.end(await readFile(path.join(ADMIN_DIR, file)));
    return;
  }

  if (!url.pathname.startsWith("/api/")) throw new HttpError(404, "見つかりません");
  requireToken(req);

  if (url.pathname === "/api/works") {
    if (method === "GET") {
      const { works } = await readWorksFile();
      sendJson(res, 200, works);
      return;
    }
    if (method === "PUT") {
      const body = await readJsonBody(req);
      sendJson(res, 200, await serialize(() => saveWorks(body)));
      return;
    }
    throw new HttpError(405, "許可されていないメソッドです");
  }

  if (url.pathname === "/api/images") {
    if (method !== "POST") throw new HttpError(405, "許可されていないメソッドです");
    const body = await readJsonBody(req);
    sendJson(res, 200, await serialize(() => saveImages(body)));
    return;
  }

  if (url.pathname === "/api/image") {
    if (method !== "GET") throw new HttpError(405, "許可されていないメソッドです");
    await serveImage(res, url);
    return;
  }

  if (url.pathname === "/api/publish") {
    if (method !== "POST") throw new HttpError(405, "許可されていないメソッドです");
    sendJson(res, 200, await serialize(publish));
    return;
  }

  throw new HttpError(404, "見つかりません");
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((e) => {
    const status = e instanceof HttpError ? e.status : 500;
    if (status === 500) console.error(e);
    if (res.headersSent) {
      res.end();
      return;
    }
    sendJson(res, status, { error: status === 500 ? `内部エラー: ${e.message}` : e.message });
  });
});

function openBrowser(url) {
  if (process.env.ADMIN_NO_OPEN === "1") return;
  const [cmd, args] =
    process.platform === "win32"
      ? ["cmd", ["/c", "start", "", url]]
      : process.platform === "darwin"
        ? ["open", [url]]
        : ["xdg-open", [url]];
  execFile(cmd, args, { windowsHide: true }, (error) => {
    if (error) console.error("ブラウザを自動で開けませんでした。上の URL を手動で開いてください。");
  });
}

function listen(tries = 0) {
  port = BASE_PORT + tries;
  server.once("error", (e) => {
    if (e.code === "EADDRINUSE" && tries + 1 < MAX_PORT_TRIES) {
      listen(tries + 1);
      return;
    }
    console.error(`サーバーを起動できません: ${e.message}`);
    process.exit(1);
  });
  server.listen(port, "127.0.0.1", () => {
    server.removeAllListeners("error");
    const url = `http://127.0.0.1:${port}/?token=${TOKEN}`;
    console.log(`制作物エディタを起動しました。\n${url}\n終了は Ctrl+C`);
    openBrowser(url);
  });
}

listen();
