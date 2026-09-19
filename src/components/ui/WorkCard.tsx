"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Work } from "@/data";
import Lightbox from "@/components/ui/Lightbox";

type WorkCardProps = {
  work: Work;
};

const cardClassName = "flex flex-col overflow-hidden rounded-card border border-line bg-card shadow-card";

// 「その他の制作物」グリッドのカード1件分。href 未指定はクリックで拡大表示する
export default function WorkCard({ work }: WorkCardProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasLink = Boolean(work.href) && work.href !== "#";
  const alt = `${work.title} のサムネイル`;

  const thumbnail = (
    <div className="relative aspect-thumb w-full overflow-hidden rounded-t-card">
      <Image
        src={work.thumbnail}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );

  const body = (
    <div className="p-4">
      <h4 className="text-balance font-serif text-h3 text-ink-soft">
        {work.title}
        {work.titleMasked ? (
          <>
            {" "}
            <span className="text-coral">{work.titleMasked}</span>
          </>
        ) : null}
      </h4>
      <p className="mt-1 text-small text-gray">{work.description}</p>
      <p className="mt-2 text-caption tracking-wide text-gray-light">{work.year}</p>
    </div>
  );

  if (!hasLink) {
    return (
      <>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className={`${cardClassName} w-full text-left`}
        >
          {thumbnail}
          {body}
        </button>
        <Lightbox
          src={work.image ?? work.thumbnail}
          alt={alt}
          open={open}
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        />
      </>
    );
  }

  const external = /^https?:\/\//.test(work.href);

  return (
    <a
      href={work.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cardClassName}
    >
      {thumbnail}
      {body}
    </a>
  );
}
