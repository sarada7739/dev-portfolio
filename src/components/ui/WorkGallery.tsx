"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Work } from "@/data";
import Lightbox from "./Lightbox";

const number = (n: number) => String(n).padStart(2, "0");
const slideId = (work: Work) => "project-" + work.slug;

function WorkTitle({ work }: { work: Work }) {
  return (
    <>
      {work.title}
      {work.titleMasked && (
        <>
          {" "}
          <span className="text-coral">{work.titleMasked}</span>
        </>
      )}
    </>
  );
}

export default function WorkGallery({ items }: { items: Work[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const index = useRef<HTMLOListElement>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const target = useRef<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Work | null>(null);
  const active = Math.max(0, Math.min(selected ?? 0, items.length - 1));

  useEffect(() => {
    const track = rail.current;
    if (!track) return;
    function sync() {
      if (!track || !track.clientWidth) return;
      const position = track.scrollLeft / track.clientWidth;
      setSelected(
        Math.max(0, Math.min(items.length - 1, Math.round(position))),
      );
      if (target.current !== null && Math.abs(position - target.current) < 0.01)
        target.current = null;
    }
    const resize = new ResizeObserver(sync);
    resize.observe(track);
    track.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => {
      resize.disconnect();
      track.removeEventListener("scroll", sync);
    };
  }, [items.length]);

  useEffect(() => {
    const list = index.current;
    const entry = list?.children[active];
    if (!list || !entry || list.scrollWidth <= list.clientWidth) return;
    const bounds = list.getBoundingClientRect(),
      item = entry.getBoundingClientRect();
    if (item.left < bounds.left) list.scrollLeft += item.left - bounds.left;
    if (item.right > bounds.right) list.scrollLeft += item.right - bounds.right;
  }, [active]);

  function show(which: number) {
    const track = rail.current;
    if (!track || which < 0 || which >= items.length) return;
    const nearby =
      Math.abs(track.scrollLeft / track.clientWidth - which) <= 1.05;
    target.current = which;
    track.scrollTo({
      left: which * track.clientWidth,
      behavior:
        nearby && !matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "smooth"
          : "instant",
    });
  }

  function keySelect(
    event: KeyboardEvent<HTMLElement>,
    from: number,
    focusIndex: boolean,
  ) {
    if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey)
      return;
    const next = {
      ArrowRight: from + 1,
      ArrowLeft: from - 1,
      Home: 0,
      End: items.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const which = Math.max(0, Math.min(items.length - 1, next));
    show(which);
    if (focusIndex)
      index.current?.children[which]
        ?.querySelector("a")
        ?.focus({ preventScroll: true });
    else rail.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <div className="gallery-heading">
        <h2 id="gallery-heading">作品一覧</h2>
        {items.length > 1 && (
          <div className="gallery-pager" hidden={selected === null}>
            <span className="gallery-count" aria-hidden="true">
              {number(active + 1)} <b>/</b> {number(items.length)}
            </span>
            <button
              type="button"
              aria-label="前の作品"
              disabled={active === 0}
              onClick={() => show((target.current ?? active) - 1)}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="次の作品"
              disabled={active === items.length - 1}
              onClick={() => show((target.current ?? active) + 1)}
            >
              →
            </button>
          </div>
        )}
      </div>
      <div className="gallery-layout">
        <nav aria-label="作品を選ぶ" className="gallery-nav">
          <ol className="gallery-index" ref={index}>
            {items.map((work, i) => (
              <li key={work.slug}>
                <a
                  href={"#" + slideId(work)}
                  aria-current={selected === i ? "true" : undefined}
                  onKeyDown={(e) => keySelect(e, i, true)}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
                      return;
                    e.preventDefault();
                    show(i);
                  }}
                >
                  <span className="gallery-thumb">
                    <Image src={work.thumbnail} alt="" fill sizes="72px" />
                  </span>
                  <span className="gallery-name">
                    <WorkTitle work={work} />
                  </span>
                  <span aria-hidden="true" className="index-pointer">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div
          ref={rail}
          className="gallery-rail"
          role="region"
          tabIndex={-1}
          aria-label="作品の展示"
          onKeyDown={(e) => keySelect(e, target.current ?? active, false)}
          onPointerDown={() => {
            target.current = null;
          }}
          onWheel={() => {
            target.current = null;
          }}
        >
          {items.map((work, i) => {
            const title = [work.title, work.titleMasked]
              .filter(Boolean)
              .join(" ");
            const src = work.image ?? work.thumbnail;
            const inactive = selected !== null && active !== i;
            const href = work.href && work.href !== "#" ? work.href : undefined;
            return (
              <article
                key={work.slug}
                id={slideId(work)}
                className="gallery-slide"
                aria-label={title}
                aria-hidden={inactive || undefined}
              >
                <a
                  className="gallery-image"
                  href={src}
                  tabIndex={inactive ? -1 : undefined}
                  aria-label={title + " の画像を拡大"}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
                      return;
                    e.preventDefault();
                    trigger.current = e.currentTarget;
                    setExpanded(work);
                  }}
                >
                  <Image
                    src={src}
                    alt={title + " の作品画像"}
                    fill
                    sizes="(min-width: 1440px) 850px, (min-width: 760px) 61vw, 93vw"
                  />
                  <span aria-hidden="true" className="gallery-zoom">
                    拡大 <span>⤢</span>
                  </span>
                </a>
                <div className="gallery-caption">
                  <p className="gallery-year">
                    {work.year.replace(/^Y(?=\d{4}$)/, "")}
                  </p>
                  <h3>
                    {work.github ? (
                      <a
                        href={work.github}
                        tabIndex={inactive ? -1 : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={title + " のGitHub"}
                      >
                        <WorkTitle work={work} />{" "}
                        <span className="gallery-repo" aria-hidden="true">
                          GitHub ↗
                        </span>
                      </a>
                    ) : (
                      <WorkTitle work={work} />
                    )}
                  </h3>
                  <p className="work-description">{work.description}</p>
                  {href && (
                    <a
                      className="project-link"
                      href={href}
                      tabIndex={inactive ? -1 : undefined}
                      target={/^https?:\/\//.test(href) ? "_blank" : undefined}
                      rel="noopener noreferrer"
                    >
                      作品を見る <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <span className="sr-only" role="status">
        {selected !== null &&
          items[active] &&
          `${active + 1}件目、${items[active].title} ${items[active].titleMasked ?? ""}`}
      </span>
      {expanded && (
        <Lightbox
          open
          src={expanded.image ?? expanded.thumbnail}
          alt={expanded.title + " の拡大画像"}
          onClose={() => {
            setExpanded(null);
            trigger.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </>
  );
}
