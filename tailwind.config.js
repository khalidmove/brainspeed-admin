/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "[var(--custom-blue)]": "#020973",
        "[var(--dark-blue)]": "#030A74",
        "[var(--dark-orange)]": "#1654F2",
        "custom-darkBlue": "#04107F",
        "[var(--dark-lightBlue)]": "#DFE7FE",
        "custom-lightBlack": "#303030",
        // "[var(--dark-orange)]": "#167DD8",
        // "new-blue": "#187CC0",
        // "custom-baby-blue": "#92c0e9",
        // "light-blue": "#449ae8",
      },
    },
  },
  plugins: [],
};
