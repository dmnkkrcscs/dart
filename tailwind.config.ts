import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: ["class", ".theme-dark"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        panel2: "var(--panel2)",
        panel3: "var(--panel3)",
        line: "var(--line)",
        line2: "var(--line2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        dim: "var(--dim)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        good: "var(--good)",
        warn: "var(--warn)",
        bad: "var(--bad)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial"],
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(0,0,0,0.5), 0 2px 8px -2px rgba(0,0,0,0.3)",
        glow: "var(--shadow-glow)",
        glowAmber: "var(--shadow-glow-amber)",
      },
      backgroundImage: {
        "grad-accent": "linear-gradient(135deg, var(--accent) 0%, var(--accent-end) 100%)",
        "grad-amber": "linear-gradient(135deg, var(--accent2) 0%, var(--accent2-end) 100%)",
        "grad-emerald": "linear-gradient(135deg, #26d07c 0%, #0ea968 100%)",
        "grad-blue": "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
        "grad-purple": "linear-gradient(135deg, #a855f7 0%, #6d28d9 100%)",
        "grad-pink": "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
        "grad-teal": "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
        "grad-rose": "linear-gradient(135deg, #f43f5e 0%, #b91c1c 100%)",
        "card-sheen": "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 30%)",
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
          "50%": { backgroundColor: "color-mix(in srgb, var(--accent) 18%, transparent)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 0 color-mix(in srgb, var(--accent) 40%, transparent)" },
          "50%": { boxShadow: "0 0 0 12px color-mix(in srgb, var(--accent) 0%, transparent)" },
        },
      },
      animation: {
        pop: "pop 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        slideUp: "slideUp 280ms cubic-bezier(0.16, 1, 0.3, 1)",
        flash: "flash 700ms ease-out",
        shimmer: "shimmer 2.4s linear infinite",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
