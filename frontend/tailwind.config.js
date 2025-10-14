/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-", // Keep the prefix, it's still essential!
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // Add this block to disable the global style reset
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
