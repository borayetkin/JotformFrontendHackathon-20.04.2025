/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#0099ff",
        "primary-dark": "#0077cc",
        secondary: "#ff6b6b",
        accent: "#38B2AC",
      },
    },
  },
  plugins: [],
};
