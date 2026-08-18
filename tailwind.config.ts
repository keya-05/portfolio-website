import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
        coral: "rgb(var(--color-coral) / <alpha-value>)",
        "coral-2": "rgb(var(--color-coral-2) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        foam: "rgb(var(--color-foam) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "ink-2": "rgb(var(--color-ink-2) / <alpha-value>)",
        "ink-3": "rgb(var(--color-ink-3) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        "line-2": "rgb(var(--color-line-2) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        card: "22px",
        frame: "28px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(44,27,24,.05), 0 12px 28px -14px rgba(44,27,24,.22)",
      },
    },
  },
  plugins: [],
};
export default config;
