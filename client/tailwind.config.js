/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
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

