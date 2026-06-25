import type { Config } from "tailwindcss"

const config: Config = {
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
        ink: "#111827",
        paper: "#F8FAFC",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
}

export default config
