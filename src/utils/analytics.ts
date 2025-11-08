// Analytics and tracking system for NeuroTravel

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

interface UserProperties {
  userId?: string;
  userType?: 'free' | 'premium' | 'pro';
  neurodivergentType?: string;
  accessibilityNeeds?: string[];
  communicationPreference?: string;
  registrationDate?: string;
}

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private sessionId: string;
  private userId?: string;
  private userProperties: UserProperties = {};
  private eventQueue: AnalyticsEvent[] = [];
  private isEnabled = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserPreferences();
    this.setupBeforeUnload();
  }

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadUserPreferences() {
    // Check if user has opted out of analytics
    const analyticsOptOut = localStorage.getItem('neurotravel-analytics-opt-out');
    if (analyticsOptOut === 'true') {
      this.isEnabled = false;
    }
  }

  private setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      this.flushEvents();
    });

    // Flush events periodically
    setInterval(() => {
      this.flushEvents();
    }, 30000); // Every 30 seconds
  }

  setUser(userId: string, properties: UserProperties = {}) {
    if (!this.isEnabled) return;
    
    this.userId = userId;
    this.userProperties = { ...this.userProperties, userId, ...properties };
    
    // Track user identification
    this.track('user_identified', {
      userId,
      properties: this.sanitizeUserProperties(properties)
    });
  }

  track(eventName: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties: this.sanitizeProperties(properties),
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.eventQueue.push(event);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }

    // Flush if queue is getting large
    if (this.eventQueue.length >= 10) {
      this.flushEvents();
    }
  }

  // Privacy-focused property sanitization
  private sanitizeProperties(properties: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(properties)) {
      // Remove or hash sensitive data
      if (this.isSensitiveKey(key)) {
        continue; // Skip sensitive properties
      }
      
      if (typeof value === 'string' && this.containsSensitiveData(value)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  private sanitizeUserProperties(properties: UserProperties): UserProperties {
    // Only keep non-sensitive analytics-relevant properties
    return {
      userType: properties.userType,
      accessibilityNeeds: properties.accessibilityNeeds,
      communicationPreference: properties.communicationPreference,
      registrationDate: properties.registrationDate
    };
  }

  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = ['password', 'email', 'phone', 'address', 'ssn', 'credit_card'];
    return sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive));
  }

  private containsSensitiveData(value: string): boolean {
    // Basic patterns for sensitive data
    const patterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/ // Credit card
    ];
    
    return patterns.some(pattern => pattern.test(value));
  }

  private async flushEvents() {
    if (this.eventQueue.length === 0 || !this.isEnabled) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // In a real implementation, this would send to your analytics service
      await this.sendToAnalyticsService(events);
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-queue events on failure (with limit to prevent infinite growth)
      if (this.eventQueue.length < 100) {
        this.eventQueue.unshift(...events);
      }
    }
  }

  private async sendToAnalyticsService(events: AnalyticsEvent[]) {
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('Sending analytics events:', events);
      return;
    }

    // In production, send to your analytics service
    // Example: Google Analytics 4, Mixpanel, or custom service
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ events })
    });

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status}`);
    }
  }

  // User privacy controls
  optOut() {
    this.isEnabled = false;
    localStorage.setItem('neurotravel-analytics-opt-out', 'true');
    this.eventQueue = []; // Clear any pending events
  }

  optIn() {
    this.isEnabled = true;
    localStorage.removeItem('neurotravel-analytics-opt-out');
  }

  isOptedOut(): boolean {
    return !this.isEnabled;
  }
}

// Pre-defined event tracking functions
export const analytics = AnalyticsManager.getInstance();

// Page view tracking
export function trackPageView(pageName: string, properties: Record<string, any> = {}) {
  analytics.track('page_view', {
    page: pageName,
    url: window.location.href,
    referrer: document.referrer,
    ...properties
  });
}

// User interaction tracking
export function trackUserAction(action: string, properties: Record<string, any> = {}) {
  analytics.track('user_action', {
    action,
    ...properties
  });
}

// Feature usage tracking
export function trackFeatureUsage(feature: string, properties: Record<string, any> = {}) {
  analytics.track('feature_used', {
    feature,
    ...properties
  });
}

// Error tracking
export function trackError(error: Error | string, context: Record<string, any> = {}) {
  const errorData = {
    error_message: typeof error === 'string' ? error : error.message,
    error_stack: typeof error === 'object' ? error.stack : undefined,
    ...context
  };
  
  analytics.track('error_occurred', errorData);
}

// Performance tracking
export function trackPerformance(metric: string, value: number, properties: Record<string, any> = {}) {
  analytics.track('performance_metric', {
    metric,
    value,
    ...properties
  });
}

// Accessibility tracking
export function trackAccessibilityUsage(feature: string, properties: Record<string, any> = {}) {
  analytics.track('accessibility_feature_used', {
    feature,
    ...properties
  });
}

// Crisis intervention tracking (anonymized)
export function trackCrisisIntervention(type: string, resolved: boolean) {
  analytics.track('crisis_intervention', {
    type: type,
    resolved,
    // No personal data included for privacy
  });
}

// React hook for analytics
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Track page views automatically
    trackPageView(location.pathname, {
      search: location.search,
      hash: location.hash
    });
  }, [location]);

  return {
    trackPageView,
    trackUserAction,
    trackFeatureUsage,
    trackError,
    trackPerformance,
    trackAccessibilityUsage,
    trackCrisisIntervention
  };
}

// Initialize analytics
export function initializeAnalytics() {
  // Track initial page load
  trackPageView(window.location.pathname);
  
  // Track performance metrics
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        trackPerformance('page_load_time', navigation.loadEventEnd - navigation.loadEventStart);
        trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
      }
    });
  }
  
  // Track unhandled errors
  window.addEventListener('error', (event) => {
    trackError(event.error || event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
  
  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackError(event.reason, {
      type: 'unhandled_promise_rejection'
    });
  });
}