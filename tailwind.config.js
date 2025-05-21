/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class", // Or 'media' if you prefer OS-level dark mode
  theme: {
    extend: {
      colors: {
        'astral-dark': '#0F0F2B',       // Deep indigo/almost black
        'astral-bg': '#1A1A3D',         // Slightly lighter indigo for main backgrounds
        'astral-light': '#E0E0FF',     // Pale lavender/silver for text
        'esoteric-purple': '#7E57C2', // Mystical purple accent
        'cosmic-blue': '#3D5AFE',       // Vibrant blue accent
        'starlight-gold': '#FFCA28',   // Gold accent for highlights
        'shadow-blue': '#2C2C54',      // Darker blue for card/element backgrounds
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        // You can add custom esoteric fonts here if you have them
        // sans: ['Inter', 'sans-serif'], // Assuming Inter is still desired from layout
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}; 