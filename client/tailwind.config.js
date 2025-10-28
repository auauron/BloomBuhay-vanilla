module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bloomWhite: '#FFF6F6',
        bloomPink: '#F875AA',
        bloomYellow: '#F3E198',
        bloomBlack: '#474747'
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
        sans: ["Rubik", "sans-serif"],
      },
    },
  },
  plugins: [],
};

