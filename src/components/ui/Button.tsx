"use client";

import { Button as AstryxButton } from "@astryxdesign/core/Button";

type ButtonProps = {
  href: string;
  children: string;
  arrow?: "↓" | "→";
  tone?: "primary" | "secondary";
  external?: boolean;
};

export default function Button({
  href,
  children,
  arrow,
  tone = "primary",
  external,
}: ButtonProps) {
  return (
    <AstryxButton
      href={href}
      label={children}
      variant={tone}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`action-button action-${tone}`}
    >
      <span className="action-label">
        {children}
        {arrow ? <span aria-hidden="true">{arrow}</span> : null}
      </span>
    </AstryxButton>
  );
}
