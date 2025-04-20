/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#4C3398", // Main brand purple (Getir's purple but more professional)
        "primary-dark": "#3B2875",
        "primary-light": "#7454BF",
        secondary: "#FFD300", // Accent yellow
        "secondary-dark": "#E6BE00",
        "secondary-light": "#FFE14D",
        accent: "#FFF2CC",
        "getir-gray": "#F5F5F8", // Lighter background
        "getir-text": "#191919", // Main text color
        "getir-muted": "#697488", // Muted text color
        success: "#00B140", // Success green
        warning: "#FFA500", // Warning orange
        error: "#FF0000", // Error red
        info: "#0088FF", // Info blue
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        getir: "0 4px 12px rgba(93, 62, 188, 0.15)",
        card: "0 6px 16px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 12px 24px rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        "gradient-getir": "linear-gradient(90deg, #4C3398 0%, #6244BB 100%)",
      },
      borderRadius: {
        getir: "0.5rem",
      },
    },
  },
  plugins: [],
};
