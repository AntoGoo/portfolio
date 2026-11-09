import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // En dev, `npm run dev:full` lance wrangler sur 8788 ; Vite lui relaie l'API et les fichiers.
    proxy: {
      '/api': 'http://localhost:8788',
      '/files': 'http://localhost:8788',
    },
  },
});
