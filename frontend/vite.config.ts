import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Hash } from 'lucide-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  }
});
