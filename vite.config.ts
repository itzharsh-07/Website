import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The React app lives in app/ so it can develop alongside the existing
// vanilla site without colliding on index.html during the migration.
export default defineConfig({
  root: 'app',
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
      '/img': 'http://localhost:3001',
      '/sitemap.xml': 'http://localhost:3001',
      '/robots.txt': 'http://localhost:3001',
    },
  },
});
