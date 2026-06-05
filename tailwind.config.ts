import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
          4: "var(--surface-4)",
        },
        ink: "var(--text-primary)",
        canvas: "var(--surface-3)",
        cloud: "var(--surface-1)",
        charcoal: "#39393b",
        ash: "var(--text-muted)",
        mute: "var(--text-subtle)",
        stone: "var(--text-muted)",
        hairline: "var(--border-default)",
        "hairline-soft": "var(--border-subtle)",
        volt: "var(--accent)",
        "volt-bright": "var(--accent-bright)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          soft: "var(--accent-soft)",
          on: "var(--accent-on)",
        },
        sale: "var(--color-error)",
        success: "var(--color-success)",
        info: "var(--color-info)",
        apple: {
          blue: "#0071e3",
          "blue-hover": "#0077ed",
          purple: "#8944ab",
          green: "#34c759",
          orange: "#ff9f0a",
          red: "#ff375f",
          teal: "#5ac8fa",
          bg: "var(--surface-1)",
          card: "var(--surface-3)",
          text: "var(--text-primary)",
          "text-secondary": "var(--text-muted)",
          border: "var(--border-default)",
        },
        solid: {
          DEFAULT: "var(--solid-bg)",
          fg: "var(--solid-fg)",
        },
        primary: {
          DEFAULT: "var(--text-primary)",
          foreground: "var(--text-inverse)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        display: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-hero": [
          "clamp(2.75rem, 6.5vw, 4.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "500" },
        ],
        "display-campaign": [
          "clamp(2rem, 5vw, 2.5rem)",
          { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "500" },
        ],
        "heading-xl": ["2rem", { lineHeight: "1.2", fontWeight: "500", letterSpacing: "-0.025em" }],
        "heading-lg": ["1.375rem", { lineHeight: "1.25", fontWeight: "500", letterSpacing: "-0.02em" }],
        "heading-md": ["1.125rem", { lineHeight: "1.4", fontWeight: "500" }],
        "body-md": ["0.9375rem", { lineHeight: "1.6", fontWeight: "400" }],
        "caption-md": ["0.8125rem", { lineHeight: "1.5", fontWeight: "500" }],
        "caption-sm": ["0.75rem", { lineHeight: "1.5", fontWeight: "500" }],
      },
      borderRadius: {
        input: "var(--radius-input)",
        button: "var(--radius-button)",
        card: "var(--radius-card)",
        panel: "var(--radius-panel)",
        pill: "var(--radius-pill)",
        "pill-lg": "1.875rem",
        "pill-md": "1.5rem",
        none: "0",
      },
      spacing: {
        xxs: "2px",
        section: "5rem",
        "section-lg": "6rem",
        "section-xl": "7.5rem",
        18: "4.5rem",
        22: "5.5rem",
      },
      maxWidth: {
        editorial: "80rem",
      },
      transitionDuration: {
        fast: "150ms",
        brand: "200ms",
        slow: "250ms",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "reveal-up": {
          "0%": { clipPath: "inset(100% 0 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        "scroll-hint": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.6" },
          "50%": { transform: "translateY(8px)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scroll-hint": "scroll-hint 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
