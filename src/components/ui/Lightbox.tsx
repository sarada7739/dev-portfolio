"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type LightboxProps = {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
};

// ネイティブ dialog の showModal/close で開閉する。フォーカス復帰は close イベント任せ
export default function Lightbox({ src, alt, open, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // 表示中だけ本文スクロールを止める。px指定でなく html への overflow-hidden 付け外し
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("overflow-hidden");
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
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
      className="relative w-full max-w-content border-0 bg-transparent p-0 backdrop:bg-ink/80"
    >
      <button
        type="button"
        onClick={() => dialogRef.current?.close()}
        aria-label="閉じる"
        className="absolute right-2 top-2 rounded-pill bg-ink/60 p-2 text-small text-on-navy"
      >
        ×
      </button>
      <div className="relative aspect-thumb max-h-screen w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 80vw, 100vw"
          className="object-contain"
        />
      </div>
    </dialog>
  );
}
