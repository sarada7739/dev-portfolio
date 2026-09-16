import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  arrow?: "↓" | "→";
};

// 黒ピルボタン。矢印は装飾のため aria-hidden にする
export default function Button({ href, children, arrow }: ButtonProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-pill bg-button px-6 py-3 text-small text-on-navy"
    >
      <span>{children}</span>
      {arrow ? <span aria-hidden="true">{arrow}</span> : null}
    </a>
  );
}
