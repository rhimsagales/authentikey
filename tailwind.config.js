/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,css}"],
  theme: {
    extend: {
      fontFamily : {
        inter : ['Inter', 'serif'],
        poppins: ['Poppins', 'serif'],
      },
      keyframes : {
        "fade-in": {
              "0%": {
                  opacity: 0
              },
              "100%": {
                  opacity: 1
              },
          },
          "fade-out": {
              "0%": {
                  opacity: 1
              },
              "100%": {
                  opacity: 0
              },
          },
      },

    },
    animation : {
      fadein: 'fade-in 1s ease-in-out 0.25s 1',
      fadeoutTen: 'fade-out 1s ease-out 10s 1',
    }
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