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
        bg: "#A89574",
        surface: "#F7F0E4",
        "surface-2": "#EFE3D0",
        wine: "#7A1220",
        "wine-2": "#A83244",
        gilt: "#A8702A",
        ink: "#2C1B18",
        "ink-2": "#6B5449",
        "ink-3": "#99877A",
        line: "#E2D2BA",
        "line-2": "#D2BE9F",
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
