/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // ADD THIS SECTION TO DISABLE THE RESET
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
