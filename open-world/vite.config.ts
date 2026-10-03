import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Keep animation libs in their own cacheable chunk.
        manualChunks: {
          motion: ['gsap', '@gsap/react', 'lenis', 'framer-motion'],
        },
      },
    },
  },
});
