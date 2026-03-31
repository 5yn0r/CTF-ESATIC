import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 42, 0.08)',
      },
      colors: {
        surface: '#f8fafc',
        brand: {
          50: '#eef2ff',
          500: '#4f46e5',
          700: '#4338ca',
        },
      },
    },
  },
  plugins: [],
};

export default config;
