/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    darkTheme: "binus",
    themes: [
      {
        binus: {
          ...require("daisyui/src/colors/themes")["[data-theme=winter]"],
          secondary: "#fb923c",
          success: "#22c55e",
        },
      },
    ],
  },
};
``;
