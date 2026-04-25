import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          '50': '#f0f9ff',
          '100': '#e0f2fe',
          '500': '#0ea5e9',
          '600': '#0284c7',
          '900': '#0c4a6e',
        },
        neutral: {
          '0': '#ffffff',
          '50': '#f8fafc',
          '100': '#f1f5f9',
          '400': '#94a3b8',
          '700': '#334155',
          '900': '#0f172a',
        },
        semantic: {
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'System'],
        bold: ['Inter_700Bold', 'System'],
        mono: ['SpaceMono_400Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
