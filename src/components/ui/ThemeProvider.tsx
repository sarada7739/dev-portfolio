"use client";

import type { ReactNode } from "react";
import { Theme } from "@astryxdesign/core/theme";
import { portfolioTheme } from "@/theme/portfolio.js";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <Theme theme={portfolioTheme} mode="dark">
      <div className="portfolio-theme">{children}</div>
    </Theme>
  );
}
