/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f7',
          100: '#fce7f1',
          200: '#fbcfe3',
          300: '#f7a6c8',
          400: '#ee6fa3',
          500: '#e0407f',
          600: '#d02270',
          DEFAULT: '#c0175d', // nav bar magenta
          700: '#c0175d',
          800: '#9d1250',
          900: '#7a0a3a',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Hind Siliguri', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bangla: ['Hind Siliguri', 'Poppins', 'sans-serif'],
        display: ['"Lilita One"', 'Poppins', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
        logo: ['Pacifico', 'cursive'],
      },
    },
  },
  plugins: [],
};
