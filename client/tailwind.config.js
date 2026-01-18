/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#DC2626', // Red-600 for emergency
                secondary: '#1F2937', // Gray-800
            }
        },
    },
    plugins: [],
}
