import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        naranja: '#FF5436',
        carbon: '#16171D',
        superficie: '#1E2027',
        crema: '#FAF5EC',
        verde: '#C4F042',
        magenta: '#E5167B',
        gris: '#6E6C66',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
