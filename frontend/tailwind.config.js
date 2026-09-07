/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F7F2",
        charcoal: {
          DEFAULT: "#1C2421",
          muted: "#5C6662",
          light: "#8E9692"
        },
        forest: {
          DEFAULT: "#164A3A",
          dark: "#0E3328",
          light: "#21634F"
        },
        emerald: {
          DEFAULT: "#2F7D61",
          light: "#429B7A"
        },
        ocean: {
          DEFAULT: "#487C86",
          light: "#5E95A0"
        },
        borderNeutral: "#E2E4DF",
        borderDark: "#D0D3CB",
        accentSuccess: "#164A3A",
        accentFailure: "#9E2A2B"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace']
      }
    },
  },
  plugins: [],
}
