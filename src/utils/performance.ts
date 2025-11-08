// Performance monitoring and caching utilities

// API response cache
class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxSize = 100;

  set(key: string, data: any, ttl: number = 300000) { // 5 min default TTL
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
}

export const apiCache = new APICache();

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(key: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(key, duration);
    };
  }

  recordMetric(key: string, value: number) {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    const values = this.metrics.get(key)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  getAverageMetric(key: string): number {
    const values = this.metrics.get(key);
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getAllMetrics(): Record<string, { average: number; latest: number; count: number }> {
    const result: Record<string, { average: number; latest: number; count: number }> = {};
    
    for (const [key, values] of this.metrics.entries()) {
      if (values.length > 0) {
        result[key] = {
          average: values.reduce((sum, val) => sum + val, 0) / values.length,
          latest: values[values.length - 1],
          count: values.length
        };
      }
    }
    
    return result;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Enhanced fetch with caching and performance monitoring
export async function cachedFetch(url: string, options: RequestInit = {}, cacheKey?: string, ttl?: number): Promise<any> {
  const key = cacheKey || `${options.method || 'GET'}_${url}`;
  
  // Check cache first
  const cachedData = apiCache.get(key);
  if (cachedData) {
    console.log(`Cache hit for ${key}`);
    return cachedData;
  }

  // Performance timing
  const endTiming = performanceMonitor.startTiming(`api_${key}`);

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache successful responses
    if (response.status >= 200 && response.status < 300) {
      apiCache.set(key, data, ttl);
    }

    endTiming();
    return data;
  } catch (error) {
    endTiming();
    throw error;
  }
}

// Debounce utility for expensive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle utility for frequent events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastExec = 0;
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    const elapsed = Date.now() - lastExec;
    
    const execute = () => {
      lastExec = Date.now();
      func(...args);
    };
    
    if (elapsed > delay) {
      execute();
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(execute, delay - elapsed);
    }
  };
}

// Service Worker registration for offline functionality
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered: ', registration);
        
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available, prompt user to refresh
                  console.log('New content is available; please refresh.');
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            });
          }
        });
      } catch (error) {
        console.log('SW registration failed: ', error);
      }
    });
  }
}

// Bundle analyzer helper (development only)
export function analyzeBundleSize() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis would be available if webpack-bundle-analyzer was installed');
  }
}