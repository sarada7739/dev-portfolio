import { defineTheme } from "@astryxdesign/core/theme";

export const portfolioTheme = defineTheme({
  name: "portfolio",
  tokens: {
    "--color-accent": "var(--color-action)",
    "--color-on-accent": "var(--color-ink)",
    "--color-background-body": "var(--color-canvas)",
    "--color-background-surface": "var(--color-card)",
    "--color-text-primary": "var(--color-ink)",
    "--color-text-secondary": "var(--color-ink-soft)",
    "--color-border": "var(--color-line)",
    "--font-family-body": "var(--font-sans)",
    "--font-family-heading": "var(--font-sans)",
    "--radius-element": "var(--radius-pill)",
    "--radius-container": "var(--radius-panel)",
    "--focus-outline-color": "var(--color-focus)",
  },
});
