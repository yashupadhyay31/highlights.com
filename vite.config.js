import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // /api/* → Express + MongoDB server
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      // /currents-api/* → https://api.currentsapi.services/*
      '/currents-api': {
        target: 'https://api.currentsapi.services',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/currents-api/, '')
      },
      // /twelve-data-api/* → https://api.twelvedata.com/*
      '/twelve-data-api': {
        target: 'https://api.twelvedata.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/twelve-data-api/, '')
      }
    }
  }
});


