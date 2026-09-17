import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  arrow?: "↓" | "→";
  tone?: "dark" | "coral";
  external?: boolean;
};

const toneClass = {
  dark: "bg-button text-on-navy",
  coral: "bg-coral text-on-navy",
};

// 黒ピルボタン。矢印は装飾のため aria-hidden にする
export default function Button({ href, children, arrow, tone = "dark", external }: ButtonProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-2 rounded-pill px-6 py-3 text-small ${toneClass[tone]}`}
    >
      <span>{children}</span>
      {arrow ? <span aria-hidden="true">{arrow}</span> : null}
    </a>
  );
}
