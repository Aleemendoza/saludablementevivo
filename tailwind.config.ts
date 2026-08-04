import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { forest: "#163d2e", moss: "#476252", cream: "#f8f7f2" },
    },
  },
  plugins: [],
} satisfies Config;
