/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/*.ejs`],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["autumn"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
