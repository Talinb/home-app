import type { Config } from "tailwindcss";

export default <Config>{
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["PrimaryFont", "sans-serif"],
        secondary: ["Courier New", "Courier", "monospace"], 
      },
      colors: {
        "light-navy": "#004266",
        navy: "#003049",
        red: "#D62828",
        orange: "#F77F00",
        yellow: "#FCBF49",
        white: "#EAE2B7",
      },
      transitionProperty: {
        transform: "transform",
        position: "left, right, top, bottom",
        colors: "background-color, border-color, color",
      },
      transitionDuration: {
        "300": "300ms",
      },
      transitionTimingFunction: {
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
