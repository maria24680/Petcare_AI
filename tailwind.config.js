/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#111844',
                    light: '#4B5694',
                    lighter: '#7288AE',
                },
                secondary: '#EAE0CF',
                background: '#F8F6F2',
            },
        },
    },
    plugins: [],
}