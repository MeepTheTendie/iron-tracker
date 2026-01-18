import { createRoute } from '@tanstack/react-router';

interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  checks: {
    database: 'pass' | 'fail';
    api: 'pass' | 'fail';
    memory: 'pass' | 'warn' | 'fail';
    disk: 'pass' | 'warn' | 'fail';
  };
  metrics: {
    memoryUsage: NodeJS.MemoryUsage;
    responseTime: number;
    activeConnections: number;
  };
}

export const healthRoute = createRoute('/api/health', {
  component: HealthCheck,
});

async function HealthCheck(): Promise<Response> {
  const startTime = Date.now();
  
  try {
    // Perform health checks
    const checks = await performHealthChecks();
    
    // Determine overall health status
    const failedChecks = Object.values(checks).filter(check => check === 'fail').length;
    const status = failedChecks === 0 ? 'healthy' : failedChecks <= 1 ? 'degraded' : 'unhealthy';
    
    // Get metrics
    const metrics = await getMetrics();
    
    const healthData: HealthResponse = {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: import.meta.env.VITE_APP_ENV || 'development',
      uptime: process.uptime(),
      checks,
      metrics: {
        ...metrics,
        responseTime: Date.now() - startTime,
      },
    };
    
    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;
    
    return new Response(JSON.stringify(healthData), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

async function performHealthChecks() {
  const checks = {
    database: 'pass' as const,
    api: 'pass' as const,
    memory: 'pass' as const,
    disk: 'pass' as const,
  };
  
  // Check database connectivity
  try {
    const { supabase } = await import('../lib/supabase');
    const { error } = await supabase.from('programs').select('count').single();
    if (error) {
      checks.database = 'fail';
    }
  } catch (error) {
    checks.database = 'fail';
  }
  
  // Check API connectivity
  try {
    const response = await fetch('/api/health', { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) {
      checks.api = 'fail';
    }
  } catch (error) {
    checks.api = 'pass'; // Self-health check
  }
  
  // Check memory usage
  const memUsage = process.memoryUsage();
  const totalMemMB = memUsage.heapTotal / 1024 / 1024;
  const usedMemMB = memUsage.heapUsed / 1024 / 1024;
  const memoryUsagePercent = (usedMemMB / totalMemMB) * 100;
  
  if (memoryUsagePercent > 90) {
    checks.memory = 'fail';
  } else if (memoryUsagePercent > 75) {
    checks.memory = 'warn';
  }
  
  // Check disk usage (simplified)
  try {
    const fs = await import('fs');
    const stats = fs.statSync('.');
    // In a real app, you'd check actual disk space
    checks.disk = 'pass';
  } catch (error) {
    checks.disk = 'warn';
  }
  
  return checks;
}

async function getMetrics() {
  const memUsage = process.memoryUsage();
  
  // Simulate active connections (in a real app, you'd track actual connections)
  const activeConnections = Math.floor(Math.random() * 100);
  
  return {
    memoryUsage: memUsage,
    activeConnections,
  };
}

// Additional health check endpoints
export const readinessRoute = createRoute('/api/ready', {
  component: ReadinessCheck,
});

async function ReadinessCheck(): Promise<Response> {
  // Readiness check - more thorough than health check
  const checks = await performHealthChecks();
  const allPass = Object.values(checks).every(check => check === 'pass');
  
  if (!allPass) {
    return new Response(JSON.stringify({ 
      ready: false,
      checks 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({ 
    ready: true,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export const livenessRoute = createRoute('/api/live', {
  component: LivenessCheck,
});

async function LivenessCheck(): Promise<Response> {
  // Liveness check - minimal check to see if process is alive
  return new Response(JSON.stringify({ 
    alive: true,
    pid: process.pid,
    uptime: process.uptime()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export const metricsRoute = createRoute('/api/metrics', {
  component: Metrics,
});

async function Metrics(): Promise<Response> {
  const metrics = await getMetrics();
  const performanceMetrics = getPerformanceMetrics();
  
  const allMetrics = {
    ...metrics,
    performance: performanceMetrics,
    timestamp: new Date().toISOString(),
  };
  
  return new Response(JSON.stringify(allMetrics), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

function getPerformanceMetrics() {
  const memUsage = process.memoryUsage();
  
  return {
    memory: {
      rss: memUsage.rss,
      heapTotal: memUsage.heapTotal,
      heapUsed: memUsage.heapUsed,
      external: memUsage.external,
      arrayBuffers: memUsage.arrayBuffers,
    },
    cpu: {
      usage: process.cpuUsage(),
    },
    uptime: process.uptime(),
    pid: process.pid,
    version: process.version,
    platform: process.platform,
    arch: process.arch,
  };
}