/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables dark mode toggle based on class
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primery": "#3490dc",
        "accent": "#38c172 ",
        "bgc": "#f8fafc ",
        "black-rgba":"rgba(0, 0, 0, 0.54)",
        "white-rgba":"rgba(248, 250, 252, 0.54)"
        
      },
    },
  },
  plugins: [],
};
