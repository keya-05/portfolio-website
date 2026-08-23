import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#A6916C",
        taupe: "#A6916C",
        surface: "#F0E1BC",
        "surface-2": "#E4D2A8",
        wine: "#4A0A0A",
        "wine-2": "#6B1414",
        gilt: "#A8702A",
        ink: "#2C1B18",
        "ink-2": "#6B5449",
        "ink-3": "#99877A",
        line: "#E2D2BA",
        "line-2": "#D2BE9F",
        cream: "#F3E9D2",
        placeholder: "#DAD8D3",
        doodle: "#241812",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
        serif: ["var(--font-serif)", "serif"],
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
