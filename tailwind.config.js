/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rysen: {
          orange: "#F07000",
          amber: "#F09000",
          ember: "#F04000",
          ink: "#090909",
          ivory: "#FFF8EF",
          sand: "#F5E8D6",
          soft: "#F4F4F2",
          charcoal: "#1E1E1E",
        },
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["Inter", "Aptos", "Segoe UI", "Arial", "sans-serif"],
      },
      boxShadow: {
        warm: "0 22px 70px rgba(240,112,0,0.13)",
        executive: "0 24px 80px rgba(9,9,9,0.14)",
      },
      backgroundImage: {
        "orange-sheen": "linear-gradient(135deg, #F07000 0%, #F09000 48%, #F04000 100%)",
      },
    },
  },
  plugins: [],
};
