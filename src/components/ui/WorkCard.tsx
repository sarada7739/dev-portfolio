"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Work } from "@/data";
import Lightbox from "@/components/ui/Lightbox";

type WorkCardProps = {
  work: Work;
};

const cardClassName = "work-card";

export default function WorkCard({ work }: WorkCardProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasLink = Boolean(work.href) && work.href !== "#";
  const alt = `${work.title} のサムネイル`;

  const thumbnail = (
    <div className="work-thumbnail">
      <Image
        src={work.thumbnail}
        alt={alt}
        fill
        sizes="(min-width: 1280px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );

  const titleContent = work.github ? (
    <a
      href={work.github}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
    >
      {work.title}
      <span aria-hidden="true" className="text-gray-light">
        {" ↗"}
      </span>
    </a>
  ) : (
    work.title
  );

  const body = (
    <div className="work-body">
      <h3>
        {titleContent}
        {work.titleMasked ? (
          <>
            {" "}
            <span className="text-coral">{work.titleMasked}</span>
          </>
        ) : null}
      </h3>
      <p className="work-description">{work.description}</p>
      <div className="work-meta">
        <span>{work.year}</span>
        <span aria-hidden="true" className="work-arrow">
          ↗
        </span>
      </div>
    </div>
  );

  // GitHub へのリンクがボタンの中に入らないよう、サムネイルだけをボタンにする
  if (work.github) {
    return (
      <>
        <div className={cardClassName}>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`${work.title} の画像を拡大`}
            className="block w-full text-left"
          >
            {thumbnail}
          </button>
          {body}
        </div>
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

  if (!hasLink) {
    return (
      <>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className={cardClassName}
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
