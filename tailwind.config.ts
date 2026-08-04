import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        forest: "var(--action-primary)",
        moss: "var(--action-secondary)",
        cream: "var(--canvas)",
      },
    },
  },
  plugins: [],
} satisfies Config;
