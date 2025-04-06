// tailwind.config.ts
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',  // Enable dark mode by class
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#fff',
          dark: '#333',
        },
      },
    },
  },
  plugins: [],
};
