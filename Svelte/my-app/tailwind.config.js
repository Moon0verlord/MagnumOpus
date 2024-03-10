module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#00c8ff",
          "secondary": "#0dc400",
          "accent": "#00eeff",
          "neutral": "#03212b",
          "base-100": "#f5f5f4",
        },
      },
    ],
  },
  content: ['./src/routes/**/*.{html,svelte,js,ts}'],
  plugins: [require('daisyui')],
};
