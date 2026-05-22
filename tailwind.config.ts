import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: "#0071e3",
          "blue-hover": "#0077ed",
          purple: "#8944ab",
          green: "#34c759",
          orange: "#ff9f0a",
          red: "#ff375f",
          teal: "#5ac8fa",
          bg: "#f5f5f7",
          card: "#ffffff",
          text: "#1d1d1f",
          "text-secondary": "#86868b",
          border: "#d2d2d7",
        },
        primary: {
          50: "#e8f4fd",
          100: "#c5e2fa",
          200: "#9dd0f7",
          300: "#72bdf4",
          400: "#4eadf1",
          500: "#219eef",
          600: "#0071e3",
          700: "#005fd1",
          800: "#004dbf",
          900: "#0036a0",
          950: "#001e70",
        },
        accent: {
          50: "#f4f1fa",
          100: "#e6ddf5",
          200: "#cfc0eb",
          300: "#b498df",
          400: "#9b6ed3",
          500: "#8944ab",
          600: "#783c9a",
          700: "#663488",
          800: "#552b75",
          900: "#432060",
          950: "#2d1445",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"PingFang SC"',
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s cubic-bezier(0.32, 0.72, 0, 1) both",
        "fade-in": "fade-in 0.5s ease-out both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.32, 0.72, 0, 1) both",
        float: "float 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundSize: {
        "300%": "300% 300%",
      },
      fontSize: {
        "hero": ["clamp(3rem, 8vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "hero-sub": ["clamp(1.125rem, 2vw, 1.5rem)", { lineHeight: "1.5" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
