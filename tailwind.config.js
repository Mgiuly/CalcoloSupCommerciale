/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#2B5A8F',
            50: '#EBF3FA',
            100: '#D7E6F5',
            200: '#AFCDEB',
            300: '#87B4E1',
            400: '#5F9BD7',
            500: '#4A90E2',
            600: '#2B5A8F',
            700: '#1F426A',
            800: '#142B45',
            900: '#091320',
          },
        },
        boxShadow: {
          'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        },
      },
    },
    plugins: [],
  }