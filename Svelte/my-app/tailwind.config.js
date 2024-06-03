module.exports = {
    theme: {
        extend: {
            backgroundSize: {
                '400': '400% 400%',
            },
            keyframes: {
                AnimationName: {
                    '0%': { 'background-position': '100% 50%' },
                    '50%': { 'background-position': '0% 51%' },
                    '100%': { 'background-position': '100% 50%' },
                },
            },
            animation: {
                AnimationName: 'AnimationName 9s ease infinite',
            },
            backgroundImage: {
                'gradient-to-custom': 'linear-gradient(270deg, #772e15, #0a785c)',
            },
        },
    },
    daisyui: {
        themes: [
            "default",
            "light",
            "dark",
            "black",
            "retro",
            "forest",
            "autumn",
            "business",
        ],
    },
    content: ['./src/routes/**/*.{html,svelte,js,ts}', './src/lib/components/**/*.{html,svelte,js,ts}'],
    plugins: [require('daisyui')],
};
