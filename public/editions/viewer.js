const preview = document.querySelector(".edition-dialog");
const fullImage = preview.querySelector("img");
let trigger;

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-preview]");
  if (!link || event.ctrlKey || event.shiftKey || event.metaKey || event.altKey)
    return;
  event.preventDefault();
  trigger = link;
  fullImage.src = link.href;
  fullImage.alt = link.querySelector("img")?.alt ?? "作品の画像";
  preview.showModal();
});

preview.addEventListener("click", (event) => {
  if (event.target === preview || event.target.closest("button"))
    preview.close();
});

preview.addEventListener("close", () => {
  fullImage.removeAttribute("src");
  trigger?.focus({ preventScroll: true });
});
