import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    return {
      server: {
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // PageSpeed optimizations
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: mode === 'production', // Remove console.log in production
            drop_debugger: true,
          },
        },
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'firebase-vendor': ['firebase/app', 'firebase/firestore'],
            },
          },
        },
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        // Enable source maps for production debugging (optional)
        sourcemap: false,
      },
      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
      },
    };
});
