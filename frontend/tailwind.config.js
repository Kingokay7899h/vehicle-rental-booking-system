/** @type {import('tailwindcss').Config} */
module.exports = {
  // CORRECTED: The content path now correctly scans all files in the src directory.
  // The original path "./src/**/.{js,jsx,ts,tsx}" was incorrect.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
