module.exports = {
    daisyui: {
        themes: [
            "default",
            "light",
            "dark",
            "black",
            "retro",
            "valentine",
        ],
    },
    content: ['./src/routes/**/*.{html,svelte,js,ts}', './src/lib/components/**/*.{html,svelte,js,ts}'],
    plugins: [require('daisyui')],
};
