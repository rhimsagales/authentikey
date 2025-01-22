/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,css}"],
  theme: {
    extend: {
      fontFamily : {
        inter : ['Inter', 'serif'],
        poppins: ['Poppins', 'serif'],
      }
    },
  },
  daisyui: {
    themes: [
        "dark",
        "light",
      ],
    },
  plugins: [
    require('daisyui'),
  ],
}