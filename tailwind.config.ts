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
        background: {
          DEFAULT: "#FFFFFF",
          muted: "#F2F4F6",
        },
        foreground: "#20242B",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#20242B",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#20242B",
        },
        primary: {
          DEFAULT: "#1F3A5F",
          light: "#E7EBEF",
          hover: "#16293F",
          deep: "#15263C",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E7EBEF",
          foreground: "#20242B",
        },
        muted: {
          DEFAULT: "#F2F4F6",
          foreground: "#6B6F76",
        },
        accent: {
          DEFAULT: "#E7EBEF",
          foreground: "#20242B",
        },
        destructive: {
          DEFAULT: "#B3402D",
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#C25A46",
          light: "#F6E9E5",
          bright: "#E8907C",
        },
        success: {
          DEFAULT: "#3F7A5E",
          light: "#E7F0EB",
          bright: "#79C3A0",
        },
        caution: {
          DEFAULT: "#A67A25",
          light: "#F3ECDD",
          bright: "#DDB264",
        },
        text: {
          primary: "#20242B",
          secondary: "#6B6F76",
        },
        border: "#D9DEE3",
        input: "#D9DEE3",
        ring: "#1F3A5F",
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
        card: "0 1px 2px rgba(32, 36, 43, 0.05)",
        sheet: "0 1px 2px rgba(21, 38, 60, 0.04), 0 12px 32px -12px rgba(21, 38, 60, 0.18)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        chat: "1.25rem",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
