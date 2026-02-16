/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0f766e', // Deep Teal (Trust/Medical)
                    dark: '#115e59',
                    light: '#2dd4bf'
                },
                accent: {
                    DEFAULT: '#ef4444', // Emergency Red
                    hover: '#dc2626'
                },
                surface: '#f8fafc', // Clean White/Gray
                secondary: '#1e293b', // Slate 800 for buttons/text
            }
        },
    },
    plugins: [],
}
