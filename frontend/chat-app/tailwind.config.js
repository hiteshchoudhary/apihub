/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6b8afd",
        secondary: "#2e333d",
        dark: "#212328",
        danger: "#eb3330",
        success: "#4aac68",
      },
    },
  },
  plugins: [],
};
