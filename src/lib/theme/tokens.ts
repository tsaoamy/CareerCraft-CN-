/**
 * CareerCraft — 统一品牌双主题 Design Tokens
 * Dark: 柔和深色工作空间 | Light: 高级中性浅主题
 */

export const themeTokens = {
  dark: {
    surface: {
      l1: "#0F1115",
      l2: "#151821",
      l3: "#1B1F2A",
    },
    text: {
      primary: "#E8EAED",
      secondary: "#C4C8D0",
      muted: "#8B919E",
      subtle: "#6B7280",
    },
    accent: {
      DEFAULT: "#9BB832",
      bright: "#A8C93A",
      soft: "rgba(155, 184, 50, 0.12)",
      glow: "rgba(155, 184, 50, 0.22)",
    },
  },
  light: {
    surface: {
      l1: "#F5F5F2",
      l2: "#ECECE8",
      l3: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#2A2A2A",
      muted: "#6B6B6B",
      subtle: "#8A8A8A",
    },
    accent: {
      DEFAULT: "#7A9E12",
      bright: "#8AAF18",
      soft: "rgba(122, 158, 18, 0.1)",
      glow: "rgba(122, 158, 18, 0.18)",
    },
  },
  motion: {
    themeTransitionMs: 480,
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

/** @deprecated Use themeTokens — kept for gradual migration */
export const tokens = {
  color: {
    bg: {
      deepest: themeTokens.dark.surface.l1,
      deep: themeTokens.dark.surface.l2,
      elevated: themeTokens.dark.surface.l3,
      surface: themeTokens.dark.surface.l3,
    },
    ink: themeTokens.light.text.primary,
    canvas: themeTokens.light.surface.l3,
    cloud: themeTokens.light.surface.l1,
    volt: themeTokens.dark.accent.DEFAULT,
    voltBright: themeTokens.dark.accent.bright,
    voltGlow: themeTokens.dark.accent.glow,
    mute: themeTokens.dark.text.subtle,
    stone: themeTokens.dark.text.muted,
    ash: themeTokens.dark.text.muted,
    hairline: "rgba(255, 255, 255, 0.08)",
    hairlineStrong: "rgba(255, 255, 255, 0.12)",
  },
  spacing: {
    section: "clamp(3rem, 8vw, 6rem)",
    sectionSm: "clamp(2rem, 5vw, 3rem)",
    gutter: "clamp(1.25rem, 4vw, 5rem)",
  },
  motion: {
    ease: [0.16, 1, 0.3, 1] as const,
    duration: { fast: 0.35, normal: 0.55, slow: 0.75 },
    spring: { stiffness: 260, damping: 28 },
  },
  typography: {
    display: "font-display uppercase leading-[0.9] tracking-wide",
    h1: "text-[clamp(2.5rem,6vw,4rem)] font-medium tracking-tight leading-[1.05]",
    h2: "text-[clamp(1.75rem,4vw,2.5rem)] font-medium tracking-tight leading-[1.1]",
    h3: "text-heading-lg font-medium",
    body: "text-body-md text-stone leading-relaxed",
    caption: "text-caption-md text-mute",
  },
} as const;

export type FeaturePageId =
  | "dashboard"
  | "materials"
  | "matching"
  | "jd-analyzer"
  | "resume-builder"
  | "interview"
  | "applications";

export const pageAccentMap: Record<FeaturePageId, string> = {
  dashboard: "volt",
  materials: "volt",
  matching: "volt",
  "jd-analyzer": "volt",
  "resume-builder": "volt",
  interview: "volt",
  applications: "volt",
};
