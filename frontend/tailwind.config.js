/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: "#f4f7ff",
          orange: "#ff6b57",
          ember: "#e55445",
          green: "#1f6fff",
          mint: "#dff4ff",
          ink: "#0f172a"
        }
      },
      boxShadow: {
        soft: "0 20px 50px rgba(31, 111, 255, 0.12)"
      }
    }
  },
  plugins: []
};
