// Error monitoring and logging system

interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: Record<string, any>;
  resolved: boolean;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userId?: string;
  sessionId: string;
}

class ErrorMonitor {
  private static instance: ErrorMonitor;
  private sessionId: string;
  private userId?: string;
  private errorQueue: ErrorReport[] = [];
  private performanceQueue: PerformanceMetric[] = [];
  private isEnabled = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupErrorHandlers();
    this.setupPerformanceMonitoring();
    this.setupAutoFlush();
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  private generateSessionId(): string {
    return `error_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupErrorHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }, 'medium');
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        type: 'promise_rejection'
      }, 'high');
    });

    // React error boundary integration
    if (typeof window !== 'undefined') {
      (window as any).__NEUROTRAVEL_ERROR_MONITOR__ = this;
    }
  }

  private setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordPerformance('largest_contentful_paint', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.recordPerformance('first_input_delay', (entry as any).processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          });
          this.recordPerformance('cumulative_layout_shift', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
      }
    }

    // Page load timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.recordPerformance('page_load_time', navigation.loadEventEnd - navigation.loadEventStart);
          this.recordPerformance('dom_interactive', navigation.domInteractive - navigation.fetchStart);
          this.recordPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
        }
      }, 0);
    });
  }

  private setupAutoFlush() {
    // Flush errors and metrics periodically
    setInterval(() => {
      this.flushErrors();
      this.flushPerformanceMetrics();
    }, 60000); // Every minute

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushErrors();
      this.flushPerformanceMetrics();
    });
  }

  setUser(userId: string) {
    this.userId = userId;
  }

  captureError(
    error: Error | { message: string; stack?: string; [key: string]: any },
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context: Record<string, any> = {}
  ) {
    if (!this.isEnabled) return;

    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      message: error instanceof Error ? error.message : error.message,
      stack: error instanceof Error ? error.stack : error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      severity,
      context: this.sanitizeContext(context),
      resolved: false
    };

    this.errorQueue.push(errorReport);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', errorReport);
    }

    // Immediate flush for critical errors
    if (severity === 'critical') {
      this.flushErrors();
    }

    return errorReport.id;
  }

  recordPerformance(metric: string, value: number, context: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const performanceMetric: PerformanceMetric = {
      name: metric,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.performanceQueue.push(performanceMetric);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance metric:', performanceMetric);
    }
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeContext(context: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(context)) {
      // Skip sensitive data
      if (this.isSensitiveKey(key)) {
        continue;
      }
      
      // Limit string length to prevent huge payloads
      if (typeof value === 'string' && value.length > 1000) {
        sanitized[key] = value.substring(0, 1000) + '...[truncated]';
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth', 'session'];
    return sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive));
  }

  private async flushErrors() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await this.sendErrorsToService(errors);
    } catch (error) {
      console.error('Failed to send error reports:', error);
      // Re-queue errors on failure (with limit)
      if (this.errorQueue.length < 50) {
        this.errorQueue.unshift(...errors);
      }
    }
  }

  private async flushPerformanceMetrics() {
    if (this.performanceQueue.length === 0) return;

    const metrics = [...this.performanceQueue];
    this.performanceQueue = [];

    try {
      await this.sendMetricsToService(metrics);
    } catch (error) {
      console.error('Failed to send performance metrics:', error);
      // Re-queue metrics on failure (with limit)
      if (this.performanceQueue.length < 100) {
        this.performanceQueue.unshift(...metrics);
      }
    }
  }

  private async sendErrorsToService(errors: ErrorReport[]) {
    // In development, just log
    if (process.env.NODE_ENV === 'development') {
      console.log('Would send error reports:', errors);
      return;
    }

    // In production, send to error monitoring service
    const response = await fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ errors })
    });

    if (!response.ok) {
      throw new Error(`Error reporting API failed: ${response.status}`);
    }
  }

  private async sendMetricsToService(metrics: PerformanceMetric[]) {
    // In development, just log
    if (process.env.NODE_ENV === 'development') {
      console.log('Would send performance metrics:', metrics);
      return;
    }

    // In production, send to monitoring service
    const response = await fetch('/api/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ metrics })
    });

    if (!response.ok) {
      throw new Error(`Performance monitoring API failed: ${response.status}`);
    }
  }

  // Get current system health info
  getSystemHealth(): Record<string, any> {
    const health: Record<string, any> = {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink
      } : undefined,
      memory: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : undefined
    };

    return health;
  }

  // Public methods for manual error reporting
  reportError(error: Error | string, context?: Record<string, any>) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    return this.captureError(errorObj, 'medium', context);
  }

  reportCriticalError(error: Error | string, context?: Record<string, any>) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    return this.captureError(errorObj, 'critical', context);
  }

  disable() {
    this.isEnabled = false;
  }

  enable() {
    this.isEnabled = true;
  }
}

// Export singleton instance
export const errorMonitor = ErrorMonitor.getInstance();

// React error boundary integration
export function reportReactError(error: Error, errorInfo: { componentStack: string }) {
  errorMonitor.captureError(error, 'high', {
    type: 'react_error',
    componentStack: errorInfo.componentStack
  });
}

// Initialize error monitoring
export function initializeErrorMonitoring() {
  // Nothing to do - constructor handles initialization
  console.log('Error monitoring initialized');
}

// Performance measurement helpers
export function measureFunction<T>(fn: () => T, name: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  errorMonitor.recordPerformance(`function_${name}`, end - start);
  return result;
}

export async function measureAsyncFunction<T>(fn: () => Promise<T>, name: string): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    errorMonitor.recordPerformance(`async_function_${name}`, end - start);
    return result;
  } catch (error) {
    const end = performance.now();
    errorMonitor.recordPerformance(`async_function_${name}_error`, end - start);
    errorMonitor.captureError(error as Error, 'medium', { function: name });
    throw error;
  }
}