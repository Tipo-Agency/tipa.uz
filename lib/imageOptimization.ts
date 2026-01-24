/**
 * Утилиты для оптимизации изображений
 */

/**
 * Проверяет, является ли изображение тяжелым (больше 500KB)
 * Это можно использовать для предупреждений или автоматической оптимизации
 */
export function isImageHeavy(file: File): boolean {
  const maxSize = 500 * 1024; // 500KB
  return file.size > maxSize;
}

/**
 * Генерирует URL для оптимизированного изображения через CDN
 * Пример использования с Cloudinary, Imgix или другим CDN
 */
export function getOptimizedImageUrl(
  originalSrc: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
  } = {}
): string {
  // Если это внешний URL, возвращаем как есть
  if (originalSrc.startsWith('http://') || originalSrc.startsWith('https://')) {
    return originalSrc;
  }

  const { width, height, quality = 85, format } = options;

  // Пример интеграции с CDN (нужно настроить)
  // const cdnBaseUrl = 'https://cdn.tipa.uz';
  // const params = new URLSearchParams();
  // if (width) params.append('w', width.toString());
  // if (height) params.append('h', height.toString());
  // params.append('q', quality.toString());
  // if (format) params.append('f', format);
  // return `${cdnBaseUrl}${originalSrc}?${params.toString()}`;

  // Пока возвращаем оригинальный путь
  return originalSrc;
}

/**
 * Генерирует srcset для responsive images
 */
export function generateSrcSet(
  originalSrc: string,
  sizes: number[] = [400, 800, 1200, 1600]
): string {
  return sizes
    .map(size => `${getOptimizedImageUrl(originalSrc, { width: size })} ${size}w`)
    .join(', ');
}

/**
 * Проверяет поддержку WebP в браузере
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Рекомендации по оптимизации изображений:
 * 
 * 1. Используйте формат WebP для современных браузеров
 * 2. Сжимайте изображения до 85% качества (почти незаметная разница)
 * 3. Используйте правильные размеры (не загружайте 2000px изображение для 400px контейнера)
 * 4. Используйте lazy loading для изображений ниже fold
 * 5. Используйте srcset для responsive images
 * 6. Рассмотрите использование CDN (Cloudinary, Imgix, Cloudflare Images)
 * 
 * Для автоматической оптимизации можно:
 * - Настроить CDN с автоматической оптимизацией
 * - Использовать плагины для Vite (vite-imagetools)
 * - Добавить скрипт для предварительной обработки изображений
 */
