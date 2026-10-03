import type { Config } from "tailwindcss";

/**
 * Colors are declared as `rgb(var(--token) / <alpha-value>)` so Tailwind's
 * opacity modifiers work (`bg-surface/50`, `border-border/40`). That means the
 * CSS variables in globals.css hold space-separated RGB channels, not hex.
 */
function token(name: string) {
  return `rgb(var(${name}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic surfaces
        bg: token("--color-bg"),
        surface: token("--color-surface"),
        "surface-raised": token("--color-surface-raised"),
        "surface-hover": token("--color-surface-hover"),
        border: token("--color-border"),

        // Text
        text: token("--color-text"),
        "text-muted": token("--color-text-muted"),
        "text-subtle": token("--color-text-subtle"),

        // Brand / status
        primary: token("--color-primary"),
        cta: token("--color-cta"),
        "cta-strong": token("--color-cta-strong"),
        accent: token("--color-accent"),
        success: token("--color-success"),
        warning: token("--color-warning"),
        info: token("--color-info"),

        // Pokemon types — also consumed from TYPE_COLORS in lib/pokemon.ts for
        // inline styles where the type is only known at runtime.
        type: {
          normal: "#A8A77A",
          fire: "#EE8130",
          water: "#6390F0",
          electric: "#F7D02C",
          grass: "#7AC74C",
          ice: "#96D9D6",
          fighting: "#C22E28",
          poison: "#A33EA1",
          ground: "#E2BF65",
          flying: "#A98FF3",
          psychic: "#F95587",
          bug: "#A6B91A",
          rock: "#B6A136",
          ghost: "#735797",
          dragon: "#6F35FC",
          dark: "#705746",
          steel: "#B7B7CE",
          fairy: "#D685AD",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        // Repeated one-off sizes from the pages, named.
        micro: ["0.625rem", { lineHeight: "0.875rem" }], // was text-[10px]
        label: ["0.6875rem", { lineHeight: "1rem" }], // was text-[11px]/text-xs labels
      },
      borderRadius: {
        card: "1rem", // was rounded-2xl on every surface
        control: "0.75rem", // was rounded-xl on every button/input
      },
      boxShadow: {
        card: "0 8px 30px rgb(0 0 0 / 0.3)",
        raised: "0 4px 10px rgb(0 0 0 / 0.35)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "spin-slow": "spin-slow 8s linear infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
