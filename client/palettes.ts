import type { PluginClientContext } from "@getpaseo/plugin/client";

type ThemeContribution = Parameters<PluginClientContext["addTheme"]>[0];
export type Scheme = "light" | "dark";

// Adapted from Paseo's Light and Ghostty themes. See NOTICE for attribution.
// The plugin API exposes a smaller palette than the built-in theme system.
const palettes = {
  light: {
    background: "#ffffff",
    foreground: "#1a1a1e",
    raised: "#fafafa",
    control: "#f4f4f5",
    border: "#e4e4e7",
    accent: "#20744a",
    mutedForeground: "#71717a",
    // Paseo also uses this token for section headings (foregroundExtraMuted).
    ring: "#a1a1aa",
  },
  dark: {
    background: "#282c34",
    foreground: "#fafafa",
    raised: "#2f333d",
    control: "#383c48",
    border: "#353a47",
    accent: "#89b4fa",
    mutedForeground: "#c8ccd8",
    ring: "#a0a4b2",
  },
} satisfies Record<Scheme, ThemeContribution["colors"]>;

export function themeFor(scheme: Scheme): ThemeContribution {
  return {
    id: "auto",
    name: "Auto · Light / Ghostty",
    appearance: scheme,
    colors: { ...palettes[scheme] },
  };
}
