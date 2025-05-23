import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'theme-black': '#000000',
        'theme-near-black': '#111111',
        'theme-dark-gray': '#333333',
        'theme-medium-gray': '#666666',
        'theme-light-gray': '#999999',
        'theme-very-light-gray': '#CCCCCC',
        'theme-near-white': '#EEEEEE',
        'theme-white': '#FFFFFF',
        // Functional names using the grayscale palette
        'text-main': '#EEEEEE',
        'text-muted': '#999999',
        'bg-main': '#111111',
        'bg-card': '#333333',
        'border-accent': '#666666',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config 