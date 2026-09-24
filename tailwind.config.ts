import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "var(--theme-bg)",
          surface: "var(--theme-surface)",
          "surface-hover": "var(--theme-surface-hover)",
          primary: "var(--theme-primary)",
          "primary-hover": "var(--theme-primary-hover)",
          secondary: "var(--theme-secondary)",
          accent: "var(--theme-accent)",
          text: "var(--theme-text)",
          muted: "var(--theme-muted)",
          border: "var(--theme-border)",
          glow: "var(--theme-glow)",
        },
        p3: {
          blue: "#00d2ff",
          dark: "#050b18",
          surface: "#0c172e",
          accent: "#2563eb",
          gold: "#38bdf8",
        },
        p4: {
          yellow: "#facc15",
          dark: "#0f0f0c",
          surface: "#1a1913",
          accent: "#eab308",
          orange: "#f97316",
        },
        p5: {
          red: "#ef4444",
          dark: "#0d0404",
          surface: "#1c0b0b",
          accent: "#dc2626",
          white: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "Impact", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "clock-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "tv-static": {
          "0%, 100%": { opacity: "0.9" },
          "50%": { opacity: "0.6" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px var(--theme-glow))" },
          "50%": { opacity: "0.6", filter: "drop-shadow(0 0 5px var(--theme-glow))" },
        },
        "all-out-slice": {
          "0%": { transform: "scaleX(0) skewX(-20deg)", opacity: "0" },
          "50%": { transform: "scaleX(1.1) skewX(-20deg)", opacity: "1" },
          "100%": { transform: "scaleX(1) skewX(-20deg)", opacity: "1" },
        },
      },
      animation: {
        "clock-spin": "clock-spin 4s linear infinite",
        "tv-static": "tv-static 0.15s infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "all-out-slice": "all-out-slice 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      clipPath: {
        diagonal: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
        comic: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
