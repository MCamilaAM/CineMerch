import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cine: {
          50: "#FFF5F5",
          100: "#FDE8E8",
          200: "#FBD0D0",
          300: "#F7A8A8",
          400: "#EE6B6E",
          500: "#DC3545",
          600: "#B91C1C", // Main cinema red
          700: "#991B1B",
          800: "#7F1D1D", // Deep velvet red from photo
          900: "#5D1217", // Rich dark burgundy
          950: "#38080C",
        },
        parchment: {
          50: "#FAF7F2",
          100: "#F5EFE6",
          200: "#ECE2D0",
          300: "#DECEB5",
          400: "#CDB694",
          900: "#2B261F",
        },
        gold: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        }
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      }
    },
  },
  plugins: [],
};

export default config;
