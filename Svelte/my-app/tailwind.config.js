module.exports = {
    daisyui: {
        themes: [
            "default",
            "light",
            "dark",
            "retro",
            "cyberpunk",
            "valentine",
        ],
    },
    content: ['./src/routes/**/*.{html,svelte,js,ts}', './src/lib/components/**/*.{html,svelte,js,ts}'],
    plugins: [require('daisyui')],
};
