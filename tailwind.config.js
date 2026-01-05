/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617", 
        surface: "#1e293b",    
        primary: "#2dd4bf",    
        primaryDark: "#14b8a6", 
      }
    },
  },
  plugins: [],
}