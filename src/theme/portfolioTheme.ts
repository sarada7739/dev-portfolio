import { defineTheme } from "@astryxdesign/core/theme";

export const portfolioTheme = defineTheme({
  name: "portfolio",
  tokens: {
    "--color-accent": "var(--color-cyan)",
    "--color-on-accent": "var(--color-navy-deep)",
    "--color-background-body": "var(--color-navy)",
    "--color-background-surface": "var(--color-navy-card)",
    "--color-text-primary": "var(--color-ink)",
    "--color-text-secondary": "var(--color-ink-soft)",
    "--color-border": "var(--color-navy-border)",
    "--font-family-body": "var(--font-sans)",
    "--font-family-heading": "var(--font-sans)",
    "--radius-element": "var(--radius-pill)",
    "--radius-container": "var(--radius-panel)",
    "--focus-outline-color": "var(--color-cyan-bright)",
  },
});
