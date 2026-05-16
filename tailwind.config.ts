import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0b0d10",
        panel: "#15181d",
        panel2: "#1c2026",
        line: "#262b32",
        ink: "#e8ecf1",
        muted: "#8a93a0",
        accent: "#ff3b3b",
        accent2: "#ffd166",
        good: "#22c55e",
        warn: "#f59e0b",
        bad: "#ef4444",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial"],
        display: ["ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        soft: "0 6px 30px rgba(0,0,0,0.35)",
        glow: "0 0 0 2px rgba(255,59,59,0.45), 0 0 40px rgba(255,59,59,0.25)",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        flash: {
          "0%,100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(255,59,59,0.18)" },
        },
      },
      animation: {
        pop: "pop 200ms ease-out",
        slideUp: "slideUp 240ms ease-out",
        flash: "flash 700ms ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
