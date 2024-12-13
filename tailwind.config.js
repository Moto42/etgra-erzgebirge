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
      colors:{
        txinfomedia: {
          bg: {
            standout: "#86B0C1",
          },
        }
      },
      backgroundImage: {
        headerpattern: "linear-gradient(-4deg, rgb(159, 173, 173), rgb(159, 173, 173) 60%, rgb(145, 152, 152) 60%)",
      }
    },
  },
  plugins: [],
}

