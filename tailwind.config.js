/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "terminal-red": "#ff5f56",
        "terminal-yellow": "#ffbd2e",
        "terminal-green": "#27c93f",
      },
    },
  },
  plugins: [],
};
