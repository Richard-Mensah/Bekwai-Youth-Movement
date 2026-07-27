import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Derived from the BYM logo (deep teal-green, maroon-red, steel blue)
        brand: {
          green: {
            DEFAULT: "#1F4D3F",
            50: "#eef5f2",
            100: "#d6e7e0",
            500: "#1F4D3F",
            600: "#193f34",
            700: "#133029",
            900: "#0c1f1a",
          },
          red: {
            DEFAULT: "#8E1B1B",
            50: "#fbecec",
            100: "#f3cccc",
            500: "#8E1B1B",
            600: "#741616",
            700: "#5a1111",
          },
          blue: {
            DEFAULT: "#3C6E9F",
            50: "#eef3f8",
            100: "#cfe0ee",
            500: "#3C6E9F",
            600: "#315b83",
            700: "#264667",
          },
        },
        // Civic + Youth redesign tokens
        // The canopy ramp had a hole between 100 and 500, so anything needing a
        // mid-tone reached for brand-green or a stock gray and broke the family.
        canopy: {
          DEFAULT: "#14342B",
          50: "#eaf2ee",
          100: "#cfe1d8",
          200: "#a9c7b8",
          300: "#7ba694",
          400: "#4a7d69",
          500: "#14342B",
          600: "#102a23",
          700: "#0c201b",
          800: "#081712",
          900: "#050e0b",
        },
        gold: {
          DEFAULT: "#C9A24B",
          50: "#faf5e8",
          100: "#f3e7c4",
          200: "#e7cf8f",
          300: "#dab85c",
          400: "#C9A24B",
          500: "#b78d35",
          600: "#94702a",
          700: "#6f5420",
        },
        ink: "#111827",
        paper: "#F7F5EF",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      maxWidth: {
        content: "75rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 1.8s infinite",
        "scale-in": "scale-in 0.2s ease-out both",
      },
      // A real elevation ramp. Every shadow is tinted with the canopy green
      // rather than neutral black, so raised surfaces stay in the same family
      // as everything else instead of looking grey and pasted on.
      boxShadow: {
        hairline: "0 1px 2px rgba(16,42,35,0.05)",
        card: "0 1px 2px rgba(16,42,35,0.04), 0 8px 24px -12px rgba(16,42,35,0.18)",
        "card-hover":
          "0 2px 4px rgba(16,42,35,0.06), 0 18px 40px -16px rgba(16,42,35,0.28)",
        elevated:
          "0 4px 8px rgba(16,42,35,0.06), 0 28px 56px -24px rgba(16,42,35,0.34)",
        gold: "0 8px 28px -12px rgba(201,162,75,0.55)",
      },
    },
  },
  plugins: [],
}

export default config
