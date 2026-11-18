"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

type LightboxProps = {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
};

export default function Lightbox({ src, alt, open, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);

  useLayoutEffect(() => {
    const view = viewport.current;
    if (!view) return;
    view.scrollLeft = (view.scrollWidth - view.clientWidth) / 2;
    view.scrollTop = (view.scrollHeight - view.clientHeight) / 2;
  }, [zoom]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // 拡大画像の表示中だけ、ピクセル値を指定せずに html 要素の overflow-hidden を切り替えて本文のスクロールを止める
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("overflow-hidden");
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={alt}
      onClose={onClose}
      onClick={(event) => {
        const rect = dialogRef.current?.getBoundingClientRect();
        if (!rect) return;
        const inside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        if (!inside) dialogRef.current?.close();
      }}
      className="work-dialog"
    >
      <div className="work-dialog-controls">
        <button
          type="button"
          aria-label={zoom ? "画像を全体表示に戻す" : "画像を2倍に拡大"}
          onClick={() => setZoom(!zoom)}
        >
          {zoom ? "1×" : "2×"}
        </button>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="閉じる"
        >
          ×
        </button>
      </div>
      <div className="work-dialog-view" ref={viewport}>
        <div className="work-dialog-photo" data-zoom={zoom}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={zoom ? "190vw" : "95vw"}
            className="object-contain"
          />
        </div>
      </div>
    </dialog>
  );
}
