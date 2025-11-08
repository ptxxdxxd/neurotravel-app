// Image optimization utility
import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  lazy?: boolean;
  quality?: 'low' | 'medium' | 'high';
  aspectRatio?: string;
  placeholder?: 'blur' | 'skeleton' | 'none';
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  lazy = true,
  quality = 'medium',
  aspectRatio,
  placeholder = 'skeleton',
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [imageSrc, setImageSrc] = useState(lazy ? '' : src);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [lazy, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(false);
    }
  };

  const getQualityParams = (quality: string, src: string) => {
    // If using a CDN like Cloudinary or similar, add quality parameters
    if (src.includes('cloudinary.com') || src.includes('imagekit.io')) {
      const qualityMap = { low: 'q_40', medium: 'q_70', high: 'q_90' };
      return src.includes('?') 
        ? `${src}&${qualityMap[quality as keyof typeof qualityMap]}` 
        : `${src}?${qualityMap[quality as keyof typeof qualityMap]}`;
    }
    return src;
  };

  const optimizedSrc = getQualityParams(quality, imageSrc);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Placeholder */}
      {!isLoaded && placeholder !== 'none' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {placeholder === 'skeleton' ? (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700" />
          )}
        </div>
      )}

      {/* Main Image */}
      {(isInView || !lazy) && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          className={`
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${aspectRatio ? 'w-full h-full object-cover' : ''}
          `}
          {...props}
        />
      )}

      {/* Error State */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Image preloader utility
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Critical images preloader hook
export function useCriticalImages(images: string[]) {
  useEffect(() => {
    const preloadPromises = images.map(preloadImage);
    Promise.allSettled(preloadPromises).then((results) => {
      console.log(`Preloaded ${results.filter(r => r.status === 'fulfilled').length}/${images.length} critical images`);
    });
  }, [images]);
}