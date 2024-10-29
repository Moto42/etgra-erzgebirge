const defaultTheme = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md}", "./src/**/*.svg",],
  theme: {
    extend: {
      fontFamily: {
        // here for ease of adding things to the font-stack
        'sans': [...defaultTheme.fontFamily.sans],
        'headers': [...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

