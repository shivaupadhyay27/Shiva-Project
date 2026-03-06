import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    preact(),
    compression({ algorithm: 'brotliCompress' }) // ya 'gzip'
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
});