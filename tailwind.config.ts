import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        jungle: {
          dark: '#2d5016',
          DEFAULT: '#4a7c2c',
          light: '#356b1f',
        },
        orange: {
          DEFAULT: '#ff8c3c',
          dark: '#ff6b1a',
        },
        cream: '#fffef8',
      },
      fontFamily: {
        comic: ['"Comic Sans MS"', '"Chalkboard SE"', 'cursive'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
      },
      animation: {
        shake: 'shake 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
