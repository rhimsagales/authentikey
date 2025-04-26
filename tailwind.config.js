/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,css,ejs}"],
  theme: {
    screens: {
        xs: "450px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl" : "1792px",
        "4xl" : "2048px",
        'small-device': { 'raw': '(max-width: 319px), (max-height: 480px)' },
    },
    extend: {
      fontFamily : {
        inter : ['Inter', 'serif'],
        poppins: ['Poppins', 'serif'],
        oi : [ "Oi", "serif"],
        chickle : ["Chicle", "serif"],
        monomakh : ["Monomakh", 'system-ui'],
        anton : ["Anton", 'sans-serif']
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
          "drop-in": {
              "0%": {
                  opacity: "0",
                  transform: "scale(0)",
                  animationTimingFunction: "cubic-bezier(0.34, 1.61, 0.7, 1)",
              },
              "100%": {
                  opacity: "1",
                  transform: "scale(1)",
              },
          },
          "drop-out": {
              "0%": {
                  opacity: "1",
                  transform: "scale(1)",
                  animationTimingFunction: "cubic-bezier(0.34, 1.61, 0.7, 1)",
              },
              "100%": {
                  opacity: "0",
                  transform: "scale(0)"
              },
          },
      },
      writingMode: {
        'vertical-lr': 'vertical-lr',
        'vertical-rl': 'vertical-rl',
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
      dropin: 'drop-in 0.5s ease-in-out 0.25s 1',
      dropout: 'drop-out .5s ease-in-out 0.25s 1',
    }
  },
  daisyui: {
    themes: [
        "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      ],
    },
  plugins: [
    require('daisyui'),
  ],
}