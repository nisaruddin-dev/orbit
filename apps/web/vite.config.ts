import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const __dirname = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@orbit/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
