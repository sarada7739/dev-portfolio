"use strict";

const TOKEN = new URLSearchParams(location.search).get("token") ?? "";
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const THUMB_W = 1200;
const THUMB_H = 720;
const RATIO = THUMB_H / THUMB_W;
const FULL_MAX = 2000;
const JPEG_QUALITY = 0.85;
const STAGE_MAX_W = 640;
const STAGE_MAX_H = 420;
const MIN_CROP_DISPLAY = 40;

const $ = (id) => document.getElementById(id);
const els = {
  status: $("status"),
  list: $("work-list"),
  viewList: $("view-list"),
  viewForm: $("view-form"),
  viewResult: $("view-result"),
  heading: $("form-heading"),
  form: $("work-form"),
  title: $("f-title"),
  description: $("f-description"),
  year: $("f-year"),
  github: $("f-github"),
  href: $("f-href"),
  slug: $("f-slug"),
  drop: $("drop"),
  file: $("f-file"),
  imageNote: $("image-note"),
  cropper: $("cropper"),
  stage: $("stage"),
  stageCanvas: $("stage-canvas"),
  cropBox: $("crop-box"),
  shade: $("shade"),
  preview: $("preview-canvas"),
  resultHeading: $("result-heading"),
  resultLog: $("result-log"),
};

let works = [];
let editingIndex = -1; // -1 は新規追加
let slugTouched = false;
let objectUrls = [];
// 切り抜き状態。座標はすべて元画像のピクセル単位
let img = null;
let crop = null;
let scale = 1;

function setStatus(text, isError = false) {
  els.status.textContent = text;
  els.status.classList.toggle("error", isError);
}

async function api(path, options = {}) {
  const headers = { "X-Admin-Token": TOKEN };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    let message = `${res.status}`;
    try {
      message = (await res.json()).error ?? message;
    } catch {
      // 本文が JSON でなければステータスのみ表示する
    }
    throw new Error(message);
  }
  return res;
}

async function loadWorks() {
  works = await (await api("/api/works")).json();
  await renderList();
}

async function saveWorks(next) {
  await api("/api/works", { method: "PUT", body: JSON.stringify(next) });
  await loadWorks();
}

function show(view) {
  els.viewList.hidden = view !== "list";
  els.viewForm.hidden = view !== "form";
  els.viewResult.hidden = view !== "result";
}

async function thumbUrl(ref) {
  try {
    const res = await api(`/api/image?path=${encodeURIComponent(ref)}&t=${Date.now()}`);
    const url = URL.createObjectURL(await res.blob());
    objectUrls.push(url);
    return url;
  } catch {
    // 画像が無いカードでも一覧は表示したいので空にする
    return "";
  }
}

function button(label, onClick, className = "") {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = label;
  if (className) b.className = className;
  b.addEventListener("click", onClick);
  return b;
}

async function renderList() {
  objectUrls.forEach((u) => URL.revokeObjectURL(u));
  objectUrls = [];
  els.list.replaceChildren();
  for (const [i, w] of works.entries()) {
    const li = document.createElement("li");
    const image = document.createElement("img");
    image.alt = `${w.title} のサムネイル`;
    thumbUrl(w.thumbnail).then((u) => {
      if (u) image.src = u;
    });

    const info = document.createElement("div");
    info.className = "work-info";
    const name = document.createElement("strong");
    name.textContent = `${i + 1}. ${w.title}`;
    const meta = document.createElement("span");
    meta.textContent = `${w.year} / ${w.slug}`;
    const desc = document.createElement("span");
    desc.textContent = w.description;
    info.append(name, meta, desc);

    const buttons = document.createElement("div");
    buttons.className = "work-buttons";
    const up = button("↑", () => move(i, -1));
    up.disabled = i === 0;
    up.setAttribute("aria-label", `${w.title} を上へ`);
    const down = button("↓", () => move(i, 1));
    down.disabled = i === works.length - 1;
    down.setAttribute("aria-label", `${w.title} を下へ`);
    buttons.append(up, down, button("編集", () => openForm(i)), button("削除", () => remove(i), "danger"));

    li.append(image, info, buttons);
    els.list.append(li);
  }
}

async function move(index, delta) {
  const next = [...works];
  const target = index + delta;
  [next[index], next[target]] = [next[target], next[index]];
  try {
    await saveWorks(next);
    setStatus("並べ替えを保存しました（公開するまでサイトには反映されません）");
  } catch (e) {
    setStatus(`並べ替えに失敗しました: ${e.message}`, true);
  }
}

async function remove(index) {
  const w = works[index];
  if (!confirm(`「${w.title}」を削除します。他のカードが使っていない画像ファイルも削除されます。よろしいですか？`)) return;
  try {
    await saveWorks(works.filter((_, i) => i !== index));
    setStatus(`「${w.title}」を削除しました（公開するまでサイトには反映されません）`);
  } catch (e) {
    setStatus(`削除に失敗しました: ${e.message}`, true);
  }
}

function suggestSlug(title) {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-full$/, "");
  const root = base || `work-${Date.now().toString(36)}`;
  const used = new Set(works.filter((_, i) => i !== editingIndex).map((w) => w.slug));
  let candidate = root;
  for (let n = 2; used.has(candidate); n++) candidate = `${root}-${n}`;
  return candidate;
}

function resetImage() {
  img = null;
  crop = null;
  els.cropper.hidden = true;
  els.file.value = "";
}

function openForm(index) {
  editingIndex = index;
  const w = index >= 0 ? works[index] : null;
  els.heading.textContent = w ? `「${w.title}」を編集` : "カードを追加";
  els.title.value = w?.title ?? "";
  els.description.value = w?.description ?? "";
  els.year.value = w?.year ?? `Y${new Date().getFullYear()}`;
  els.github.value = w?.github ?? "";
  els.href.value = w && w.href !== "#" ? w.href : "";
  els.slug.value = w?.slug ?? "";
  slugTouched = Boolean(w);
  els.imageNote.textContent = w ? "画像を差し替えない場合は、いまの画像がそのまま使われます。" : "新規カードには画像が必要です。";
  resetImage();
  setStatus("");
  show("form");
  els.title.focus();
}

function closeForm() {
  resetImage();
  show("list");
}

// ---- 切り抜き ----

function loadImageFile(file) {
  if (!file || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    setStatus("png / jpg / webp の画像を選んでください", true);
    return;
  }
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(url);
    img = image;
    startCrop();
    els.imageNote.textContent = `${file.name}（${image.naturalWidth}×${image.naturalHeight}）`;
    setStatus("");
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    setStatus("画像を読み込めませんでした", true);
  };
  image.src = url;
}

function maxCropWidth() {
  return Math.min(img.naturalWidth, img.naturalHeight / RATIO);
}

function startCrop() {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  scale = Math.min(STAGE_MAX_W / nw, STAGE_MAX_H / nh, 1);
  els.stageCanvas.width = Math.round(nw * scale);
  els.stageCanvas.height = Math.round(nh * scale);
  els.stageCanvas.getContext("2d").drawImage(img, 0, 0, els.stageCanvas.width, els.stageCanvas.height);
  const w = maxCropWidth();
  crop = { x: (nw - w) / 2, y: (nh - w * RATIO) / 2, w };
  els.cropper.hidden = false;
  updateCrop();
}

function updateCrop() {
  for (const box of [els.cropBox.style, els.shade.style]) {
    box.left = `${crop.x * scale}px`;
    box.top = `${crop.y * scale}px`;
    box.width = `${crop.w * scale}px`;
    box.height = `${crop.w * RATIO * scale}px`;
  }
  const ctx = els.preview.getContext("2d");
  ctx.drawImage(img, crop.x, crop.y, crop.w, crop.w * RATIO, 0, 0, els.preview.width, els.preview.height);
}

function pointerInImage(e) {
  const rect = els.stage.getBoundingClientRect();
  return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
}

function startDrag(e, corner) {
  e.preventDefault();
  e.stopPropagation();
  const target = e.currentTarget;
  target.setPointerCapture(e.pointerId);
  const start = pointerInImage(e);
  const origin = { ...crop };
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const minW = MIN_CROP_DISPLAY / scale;

  const onMove = (ev) => {
    const p = pointerInImage(ev);
    if (!corner) {
      crop.x = Math.min(Math.max(origin.x + p.x - start.x, 0), nw - origin.w);
      crop.y = Math.min(Math.max(origin.y + p.y - start.y, 0), nh - origin.w * RATIO);
    } else {
      // 反対側の角を固定し、5:3 を保ったまま大きさだけ変える
      const sx = corner.includes("e") ? 1 : -1;
      const sy = corner.includes("s") ? 1 : -1;
      const ax = sx > 0 ? origin.x : origin.x + origin.w;
      const ay = sy > 0 ? origin.y : origin.y + origin.w * RATIO;
      const roomW = sx > 0 ? nw - ax : ax;
      const roomH = sy > 0 ? nh - ay : ay;
      const wanted = Math.max(sx * (p.x - ax), (sy * (p.y - ay)) / RATIO);
      const w = Math.min(Math.max(wanted, minW), roomW, roomH / RATIO);
      crop.w = w;
      crop.x = sx > 0 ? ax : ax - w;
      crop.y = sy > 0 ? ay : ay - w * RATIO;
    }
    updateCrop();
  };
  const onUp = () => {
    target.removeEventListener("pointermove", onMove);
    target.removeEventListener("pointerup", onUp);
    target.removeEventListener("pointercancel", onUp);
  };
  target.addEventListener("pointermove", onMove);
  target.addEventListener("pointerup", onUp);
  target.addEventListener("pointercancel", onUp);
}

function canvasToJpegBase64(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("JPEG を生成できませんでした"));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = () => reject(new Error("画像の変換に失敗しました"));
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}

function renderCanvas(sw, sh, sx, sy, dw, dh) {
  const canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext("2d");
  // 透過 PNG を JPEG にしたとき背景が黒くならないようにする
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, dw, dh);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
  return canvas;
}

async function buildImages() {
  const thumb = renderCanvas(crop.w, crop.w * RATIO, crop.x, crop.y, THUMB_W, THUMB_H);
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  const k = Math.min(1, FULL_MAX / Math.max(nw, nh));
  const full = renderCanvas(nw, nh, 0, 0, Math.round(nw * k), Math.round(nh * k));
  return { thumbnail: await canvasToJpegBase64(thumb), full: await canvasToJpegBase64(full) };
}

// ---- 保存・公開 ----

function isAllowedUrl(v) {
  if (v === "") return true;
  try {
    return new URL(v).protocol === "https:";
  } catch {
    return false;
  }
}

async function submitForm(e) {
  e.preventDefault();
  const title = els.title.value.trim();
  const slug = els.slug.value.trim();
  const github = els.github.value.trim();
  const href = els.href.value.trim();
  const isNew = editingIndex < 0;

  if (!title) return setStatus("タイトルを入力してください", true);
  if (!SLUG_RE.test(slug) || slug.endsWith("-full")) {
    return setStatus("slug は英小文字・数字・ハイフンのみで、末尾を -full にはできません", true);
  }
  if (works.some((w, i) => i !== editingIndex && w.slug === slug)) return setStatus("その slug は既に使われています", true);
  if (!isAllowedUrl(github) || !isAllowedUrl(href)) return setStatus("URL は空欄か https:// から始まる形式にしてください", true);
  if (isNew && !img) return setStatus("画像を選んでください", true);

  const card = { ...(isNew ? {} : works[editingIndex]) };
  card.slug = slug;
  card.title = title;
  card.description = els.description.value.trim();
  card.year = els.year.value.trim();
  card.href = href || "#";
  if (github) card.github = github;
  else delete card.github;

  try {
    if (img) {
      const posted = await (
        await api("/api/images", { method: "POST", body: JSON.stringify({ slug, ...(await buildImages()) }) })
      ).json();
      card.thumbnail = posted.thumbnail;
      card.image = posted.image;
    }
    const next = [...works];
    if (isNew) next.push(card);
    else next[editingIndex] = card;
    await saveWorks(next);
    closeForm();
    setStatus(`「${title}」を保存しました（公開するまでサイトには反映されません）`);
  } catch (err) {
    setStatus(`保存に失敗しました: ${err.message}`, true);
  }
}

async function publish() {
  if (!confirm("works.json と画像を commit して main に push します。公開してよいですか？")) return;
  const btn = $("btn-publish");
  btn.disabled = true;
  setStatus("公開中です…");
  try {
    const result = await (await api("/api/publish", { method: "POST", body: "{}" })).json();
    els.resultHeading.textContent = `${result.ok ? "成功" : "失敗"}: ${result.message}`;
    els.resultLog.textContent = result.log || "（git の出力はありません）";
    show("result");
    setStatus("");
  } catch (e) {
    setStatus(`公開に失敗しました: ${e.message}`, true);
  } finally {
    btn.disabled = false;
  }
}

// ---- イベント ----

$("btn-add").addEventListener("click", () => openForm(-1));
$("btn-publish").addEventListener("click", publish);
$("btn-cancel").addEventListener("click", closeForm);
$("btn-result-close").addEventListener("click", () => show("list"));
els.form.addEventListener("submit", submitForm);

els.title.addEventListener("input", () => {
  if (!slugTouched) els.slug.value = suggestSlug(els.title.value);
});
els.slug.addEventListener("input", () => {
  slugTouched = true;
});

els.drop.addEventListener("click", () => els.file.click());
els.drop.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    els.file.click();
  }
});
els.file.addEventListener("change", () => loadImageFile(els.file.files[0]));
els.drop.addEventListener("dragover", (e) => {
  e.preventDefault();
  els.drop.classList.add("over");
});
els.drop.addEventListener("dragleave", () => els.drop.classList.remove("over"));
els.drop.addEventListener("drop", (e) => {
  e.preventDefault();
  els.drop.classList.remove("over");
  loadImageFile(e.dataTransfer.files[0]);
});

els.cropBox.addEventListener("pointerdown", (e) => startDrag(e, null));
for (const handle of els.cropBox.querySelectorAll(".handle")) {
  handle.addEventListener("pointerdown", (e) => startDrag(e, handle.dataset.corner));
}

loadWorks().catch((e) => setStatus(`読み込みに失敗しました: ${e.message}`, true));
