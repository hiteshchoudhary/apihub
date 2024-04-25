/** @type {import('tailwindcss').Config} */
import { BREAKPOINTS } from "./src/constants";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: BREAKPOINTS /* BREAKPOINTS */,
    extend: {
      colors: {
        /* Extra Colors and Font Family */ darkRed: "#DB4444",
        yellow: "#00FF66",
        grey: "#cdcdcd",
      },
      fontFamily: {
        poppinsRegular: ["poppins-regular"],
        poppinsBlack: ["poppins-black"],
        poppinsBold: ["poppins-bold"],
        poppinsLight: ["poppins-light"],
        poppinsMedium: ["poppins-medium"],
        poppinsItalic: ["poppins-italic"],
      },
    },
  },
  plugins: [],
};
