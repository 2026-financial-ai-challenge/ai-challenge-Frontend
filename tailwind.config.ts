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
          muted: "#FAFBFC",
        },
        foreground: "#252A34",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#252A34",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#252A34",
        },
        primary: {
          DEFAULT: "#4E7FFF",
          light: "#EAF1FF",
          hover: "#3A6AEB",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#EAF1FF",
          foreground: "#252A34",
        },
        muted: {
          DEFAULT: "#FAFBFC",
          foreground: "#8B94A3",
        },
        accent: {
          DEFAULT: "#EAF1FF",
          foreground: "#252A34",
        },
        destructive: {
          DEFAULT: "#D94F3D",
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#FF8B7B",
          light: "#FFF1EF",
        },
        success: {
          DEFAULT: "#7FE0C4",
          light: "#E8F9F4",
        },
        caution: {
          DEFAULT: "#F5B62E",
          light: "#FFF8E8",
        },
        text: {
          primary: "#252A34",
          secondary: "#8B94A3",
        },
        border: "#E4EAF4",
        input: "#E4EAF4",
        ring: "#4E7FFF",
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
        card: "0 10px 30px rgba(37, 42, 52, 0.06)",
        btn: "0 8px 18px rgba(78, 127, 255, 0.28)",
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
