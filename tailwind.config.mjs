/** @type {import('tailwindcss').Config} */
import { palettes } from "./src/shared/styles/colors";

const activePalette = palettes.palette2;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: activePalette.primary,
        secondary: activePalette.secondary,
        gray: activePalette.gray,
        error: activePalette.error,
        warning: activePalette.warning,
      },
    },
  },

  plugins: [],
};