/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.ejs`], //set it to all ejs files.
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['fantasy'],
  },
}

