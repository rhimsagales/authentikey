/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,css,ejs}"],
  theme: {
    extend: {
      fontFamily : {
        inter : ['Inter', 'serif'],
        poppins: ['Poppins', 'serif'],
        oi : [ "Oi", "serif"],
        chickle : ["Chicle", "serif"]
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
          "fade-in-down": {
              "0%": {
                  opacity: 0,
                  transform: "translate3d(0, -100%, 0)",
              },
              "100%": {
                  opacity: 1,
                  transform: "translate3d(0, 0, 0)",
              },
          },
          "fade-in-up": {
              "0%": {
                  opacity: 0,
                  transform: "translate3d(0, 100%, 0)",
              },
              "100%": {
                  opacity: 1,
                  transform: "translate3d(0, 0, 0)",
              },
          },
          "slide-in-up": {
              "0%": {
                  visibility: "visible",
                  transform: "translate3d(0, 100%, 0)",
              },
              "100%": {
                  visibility: "visible",
                  transform: "translate3d(0, 0, 0)",
              },
          },
          "slide-in-down": {
              "0%": {
                  visibility: "visible",
                  transform: "translate3d(0, -100%, 0)",
              },
              "100%": {
                
                  transform: "translate3d(0, 0, 0)",
              },
          },
      },
      

    },
    animation : {
      fadein: 'fade-in 1s ease-in-out 0.25s 1',
      fadeoutTen: 'fade-out 1s ease-out 10s 1',
      fadeoutThree: 'fade-out 1s ease-out 3s 1',
      fadeindown: 'fade-in-down 1s ease-in 0.25s 1',
      fadeinup: 'fade-in-up 1s ease-in-out 0.25s 1',
      slideinup: 'slide-in-up 1s ease-in-out 0.25s 1',
      slideindown: 'slide-in-down 1s ease-in-out 0.25s 1',
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