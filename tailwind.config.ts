import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        brand: {
          50: "#EEF6FF",
          100: "#D7EBFF",
          200: "#B3D6FF",
          300: "#7CBCFF",
          400: "#4AA3FF",
          500: "#2F86FF",
          600: "#1B6DF0",
          700: "#1558C7",
          800: "#1449A0",
          900: "#163A6B",
        },
        navy: {
          50: "#F3F7FC",
          100: "#E6EEF8",
          200: "#C9D9EE",
          300: "#9BB6D8",
          400: "#6B8DB8",
          500: "#3D5F8A",
          600: "#2B4A73",
          700: "#1E3A6E",
          800: "#16305C",
          900: "#12284A",
          950: "#0C1C36",
        },
        alert: {
          DEFAULT: "#FF4D4D",
          50: "#FFF1F1",
          600: "#E03D3D",
        },
        sun: {
          DEFAULT: "#FFD34D",
          400: "#FFC107",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "var(--font-noto-sans-kr)",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 10px 30px rgba(22, 58, 107, 0.08)",
        btn: "0 8px 18px rgba(47, 134, 255, 0.28)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        bubble: "1.75rem",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
