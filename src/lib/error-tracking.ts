import { supabase } from './supabase';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  route?: string;
  userAgent?: string;
  timestamp?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  level: 'error' | 'warning' | 'info';
  fingerprint?: string;
}

class ErrorTracker {
  private sessionId: string;
  private errorQueue: ErrorReport[] = [];
  private isOnline: boolean = true;
  private retryTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupOfflineHandling();
    this.setupErrorListeners();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private setupOfflineHandling() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    this.isOnline = navigator.onLine;
  }

  private setupErrorListeners() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError(event.error, {
        component: 'global',
        action: 'uncaught-error',
        route: window.location.pathname,
        userAgent: navigator.userAgent,
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason, {
        component: 'global',
        action: 'unhandled-promise-rejection',
        route: window.location.pathname,
        userAgent: navigator.userAgent,
      });
    });
  }

  public trackError(error: Error | string, context: Partial<ErrorContext> = {}, level: 'error' | 'warning' | 'info' = 'error'): void {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    const errorReport: ErrorReport = {
      error: errorObj,
      context: {
        ...context,
        userId: this.getCurrentUserId(),
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        route: context.route || window.location.pathname,
        userAgent: navigator.userAgent,
      },
      level,
      fingerprint: this.generateFingerprint(errorObj, context),
    };

    if (this.isOnline) {
      this.sendErrorReport(errorReport);
    } else {
      this.errorQueue.push(errorReport);
      this.persistErrorQueue();
    }
  }

  public trackUserAction(action: string, context: Partial<ErrorContext> = {}): void {
    this.trackError(new Error(`User action: ${action}`), {
      ...context,
      action,
    }, 'info');
  }

  public trackPerformance(metric: string, value: number, context: Partial<ErrorContext> = {}): void {
    this.trackError(new Error(`Performance metric: ${metric} = ${value}`), {
      ...context,
      action: 'performance-metric',
      additionalData: { metric, value },
    }, 'info');
  }

  private getCurrentUserId(): string | undefined {
    // Get current user ID from Supabase auth
    // This would be implemented based on your auth state management
    return undefined;
  }

  private generateFingerprint(error: Error, context: Partial<ErrorContext>): string {
    const fingerprintData = {
      message: error.message,
      stack: error.stack?.split('\n')[1], // First stack frame
      component: context.component,
      action: context.action,
    };

    return btoa(JSON.stringify(fingerprintData)).slice(0, 16);
  }

  private async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    try {
      // Log to console in development
      if (import.meta.env.DEV) {
        console.group(`🔴 Error Tracker [${errorReport.level.toUpperCase()}]`);
        console.error('Error:', errorReport.error);
        console.log('Context:', errorReport.context);
        console.log('Fingerprint:', errorReport.fingerprint);
        console.groupEnd();
        return;
      }

      // Send to Supabase error tracking table
      const { error } = await supabase.from('error_logs').insert({
        error_message: errorReport.error.message,
        error_stack: errorReport.error.stack,
        error_context: errorReport.context,
        level: errorReport.level,
        fingerprint: errorReport.fingerprint,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('Failed to send error report:', error);
        this.errorQueue.push(errorReport);
      }

      // Send to external monitoring service (e.g., Sentry)
      // await this.sendToExternalService(errorReport);
      
    } catch (err) {
      console.error('Error tracking failed:', err);
      this.errorQueue.push(errorReport);
    }
  }

  private async sendToExternalService(errorReport: ErrorReport): Promise<void> {
    // Integration with external services like Sentry, LogRocket, etc.
    // Example:
    // if (window.Sentry) {
    //   window.Sentry.captureException(errorReport.error, {
    //     extra: errorReport.context,
    //     level: errorReport.level,
    //     fingerprint: [errorReport.fingerprint],
    //   });
    // }
  }

  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const queuedErrors = [...this.errorQueue];
    this.errorQueue = [];

    for (const errorReport of queuedErrors) {
      try {
        await this.sendErrorReport(errorReport);
      } catch (err) {
        console.error('Failed to send queued error:', err);
        // Re-queue if sending fails
        this.errorQueue.push(errorReport);
      }
    }
  }

  private persistErrorQueue(): void {
    try {
      localStorage.setItem('error_tracker_queue', JSON.stringify(this.errorQueue));
    } catch (err) {
      console.warn('Failed to persist error queue:', err);
    }
  }

  private loadPersistedErrorQueue(): void {
    try {
      const persisted = localStorage.getItem('error_tracker_queue');
      if (persisted) {
        this.errorQueue = JSON.parse(persisted);
        localStorage.removeItem('error_tracker_queue');
      }
    } catch (err) {
      console.warn('Failed to load persisted error queue:', err);
    }
  }

  public clearErrorQueue(): void {
    this.errorQueue = [];
    try {
      localStorage.removeItem('error_tracker_queue');
    } catch (err) {
      console.warn('Failed to clear persisted error queue:', err);
    }
  }

  public getErrorQueueSize(): number {
    return this.errorQueue.length;
  }

  public async forceFlush(): Promise<void> {
    await this.flushErrorQueue();
  }
}

// Create singleton instance
const errorTracker = new ErrorTracker();

export { errorTracker };

// React hook for easy usage
export function useErrorTracker() {
  const trackError = (error: Error | string, context: Partial<ErrorContext> = {}, level: 'error' | 'warning' | 'info' = 'error') => {
    errorTracker.trackError(error, context, level);
  };

  const trackUserAction = (action: string, context: Partial<ErrorContext> = {}) => {
    errorTracker.trackUserAction(action, context);
  };

  const trackPerformance = (metric: string, value: number, context: Partial<ErrorContext> = {}) => {
    errorTracker.trackPerformance(metric, value, context);
  };

  return {
    trackError,
    trackUserAction,
    trackPerformance,
    clearQueue: () => errorTracker.clearErrorQueue(),
    getQueueSize: () => errorTracker.getErrorQueueSize(),
    forceFlush: () => errorTracker.forceFlush(),
  };
}

// React Error Boundary component
export class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; retry: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorTracker.trackError(error, {
      component: 'ErrorBoundary',
      action: 'react-error-boundary',
      additionalData: errorInfo,
    });
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-4">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-4">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>
        </div>
        
        <div className="mb-4">
          <button
            onClick={retry}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
        
        {import.meta.env.DEV && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              Error Details
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Performance monitoring utilities
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  public startTimer(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
      
      // Track slow operations
      if (duration > 1000) {
        errorTracker.trackPerformance(name, duration, {
          component: 'PerformanceTracker',
          action: 'slow-operation',
          additionalData: { threshold: 1000 },
        });
      }
    };
  }

  public recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 values
    if (values.length > 100) {
      values.shift();
    }
  }

  public getMetricStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { avg, min, max, count: values.length };
  }

  public getAllMetrics(): Record<string, ReturnType<typeof this.getMetricStats>> {
    const result: Record<string, ReturnType<typeof this.getMetricStats>> = {};
    
    for (const [name] of this.metrics) {
      result[name] = this.getMetricStats(name);
    }
    
    return result;
  }
}

export const performanceTracker = PerformanceTracker.getInstance();

// React hook for performance tracking
export function usePerformanceTracker() {
  const trackTiming = (name: string) => {
    return performanceTracker.startTimer(name);
  };

  const recordMetric = (name: string, value: number) => {
    performanceTracker.recordMetric(name, value);
  };

  const getMetricStats = (name: string) => {
    return performanceTracker.getMetricStats(name);
  };

  const getAllMetrics = () => {
    return performanceTracker.getAllMetrics();
  };

  return {
    trackTiming,
    recordMetric,
    getMetricStats,
    getAllMetrics,
  };
}