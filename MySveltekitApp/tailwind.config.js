/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#3E7CE2',
      }
    }
  },
  plugins: [require('daisyui')],
};