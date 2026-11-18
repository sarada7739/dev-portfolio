"use client";

import { useRef } from "react";
import Container from "@/components/ui/Container";
import { site } from "@/data";

const destinations: Record<string, string> = {
  制作物: "#works",
  一覧: "#works-all",
  開発について: "#how-i-work",
  お問い合わせ: "#contact",
  過去のサイト: "/versions",
};

export default function Header({ home = true }: { home?: boolean }) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const links = site.nav.map((item) => {
    const destination = destinations[item] ?? "#works";
    const href =
      !home && destination.startsWith("#") ? "/" + destination : destination;
    return (
      <li key={item}>
        <a
          href={href}
          className={destination === "#contact" ? "nav-contact" : undefined}
          aria-current={
            !home && destination === "/versions" ? "page" : undefined
          }
          onClick={() => {
            if (menuRef.current) menuRef.current.open = false;
          }}
        >
          {item}
        </a>
      </li>
    );
  });
  return (
    <header className="site-header" id="top">
      <Container className="header-inner">
        <a
          href={home ? "#top" : "/"}
          className="brand"
          aria-label="sarada7739 のトップへ"
        >
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          sarada7739
        </a>
        <nav aria-label="サイト内ナビゲーション" className="desktop-nav">
          <ul className="nav-links">{links}</ul>
        </nav>
        <details
          className="mobile-menu"
          ref={menuRef}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              event.currentTarget.open = false;
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.currentTarget.open = false;
              event.currentTarget.querySelector("summary")?.focus();
            }
          }}
        >
          <summary>
            メニュー
            <span className="menu-glyph" aria-hidden="true" />
          </summary>
          <nav aria-label="モバイルナビゲーション">
            <ul className="nav-links">{links}</ul>
          </nav>
        </details>
      </Container>
    </header>
  );
}
