import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    return {
      server: {
        host: '0.0.0.0',
      },
      plugins: [react()],
      // Оптимизация изображений
      assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp', '**/*.JPG', '**/*.JPEG', '**/*.PNG'],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // PageSpeed optimizations
        minify: 'esbuild', // Используем встроенный esbuild (быстрее и не требует зависимостей)
        // esbuild автоматически удаляет console.log в production
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
