/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-10px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
  safelist: [
    { pattern: /bg-(blue|purple|green|red|slate|orange|teal)-(50|100|500|600|700|800|900)/ },
    { pattern: /text-(blue|purple|green|red|slate|orange|teal)-(50|100|500|600|700|800|900)/ },
    { pattern: /border-(blue|purple|green|red|slate|orange|teal)-(50|100|500|600|700|800|900)/ },
    { pattern: /from-(blue|purple|green|red|slate|orange|teal)-(500|600|700)/ },
    { pattern: /to-(blue|purple|green|red|slate|orange|teal)-(600|700|800)/ },
  ],
}
