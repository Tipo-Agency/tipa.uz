import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  sizes?: string; // для responsive images
  onLoad?: () => void;
  onError?: () => void;
  width?: number;
  height?: number;
}

/**
 * Компонент для оптимизированной загрузки изображений
 * - Lazy loading
 * - Blur placeholder
 * - Responsive images с srcset
 * - Автоматическая оптимизация через CDN (если настроен)
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  aspectRatio,
  objectFit = 'cover',
  sizes,
  onLoad,
  onError,
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Генерация оптимизированного URL
  // Можно использовать CDN или сервис оптимизации изображений
  const getOptimizedSrc = (originalSrc: string, size?: number): string => {
    // Если это внешний URL, возвращаем как есть
    if (originalSrc.startsWith('http://') || originalSrc.startsWith('https://')) {
      return originalSrc;
    }

    // Для локальных изображений можно использовать CDN или сервис оптимизации
    // Пример с Cloudinary или Imgix:
    // const cdnUrl = `https://cdn.tipa.uz${originalSrc}`;
    // return size ? `${cdnUrl}?w=${size}&q=85&auto=format` : `${cdnUrl}?q=85&auto=format`;
    
    // Пока возвращаем оригинальный путь
    // В будущем можно интегрировать с CDN
    return originalSrc;
  };

  // Генерация srcset для responsive images
  const getSrcSet = (originalSrc: string): string | undefined => {
    if (originalSrc.startsWith('http://') || originalSrc.startsWith('https://')) {
      return undefined;
    }

    // Генерируем srcset для разных размеров экрана
    // Это поможет браузеру выбрать оптимальный размер изображения
    const sizes = [400, 800, 1200, 1600];
    return sizes
      .map(size => `${getOptimizedSrc(originalSrc, size)} ${size}w`)
      .join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    if (onError) onError();
  };

  const optimizedSrc = getOptimizedSrc(src);
  const srcSet = getSrcSet(src);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    ...(aspectRatio && { aspectRatio }),
    ...(width && height && { width, height }),
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
  };

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-800 text-gray-500`} style={containerStyle}>
        <span className="text-sm">Ошибка загрузки изображения</span>
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 animate-pulse"
          style={{ zIndex: 1 }}
        />
      )}

      {/* Оптимизированное изображение */}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
        style={{
          ...imageStyle,
          position: isLoaded ? 'relative' : 'absolute',
          zIndex: isLoaded ? 2 : 0,
        }}
        decoding="async"
        fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      />
    </div>
  );
};
