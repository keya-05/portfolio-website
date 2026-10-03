import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/**
 * Single source of truth for design tokens.
 * Tailwind classes (bg-yellow, text-off-white/70...) AND CSS variables
 * (var(--yellow)) are both generated from this object.
 */
const palette = {
  black: '#090909',
  'off-white': '#F2F0E8',
  yellow: '#F6D743',
  orange: '#F47A38',
  'sunset-pink': '#E85D75',
  'sky-blue': '#53B8D4',
  green: '#69B86B',
  danger: '#D94141',
  'hud-gray': '#9B9B9B',
  panel: 'rgba(12,12,12,.88)',
} as const;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...palette,
    },
    extend: {
      fontFamily: {
        display: ['Anton', 'Impact', '"Arial Narrow"', 'sans-serif'],
        ui: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        hud: '0.22em',
      },
      zIndex: {
        sky: '0',
        world: '10',
        hud: '40',
        overlay: '50',
        toast: '60',
        intro: '70',
        grain: '80',
      },
      screens: {
        xs: '360px',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': Object.fromEntries(Object.entries(palette).map(([k, v]) => [`--${k}`, v])),
      });
    }),
  ],
} satisfies Config;
