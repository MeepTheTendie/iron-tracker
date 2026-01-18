# Iron Tracker Deployment Guide

This guide covers the deployment process for Iron Tracker across different environments and platforms.

## 🌍 Environments

### Development
- **Purpose**: Local development and testing
- **URL**: `http://localhost:3000`
- **Database**: Local Supabase project
- **Features**: Hot reload, DevTools, debug logging

### Staging
- **Purpose**: Pre-production testing
- **URL**: `https://staging.iron-tracker.com`
- **Database**: Staging Supabase project
- **Features**: Production-like environment, test data

### Production
- **Purpose**: Live application
- **URL**: `https://iron-tracker.com`
- **Database**: Production Supabase project
- **Features**: Optimized performance, monitoring, analytics

## 🚀 Deployment Platforms

### Vercel (Recommended)

Vercel provides the best experience for React applications with automatic deployments and optimizations.

#### Setup

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link project
   vercel link
   ```

2. **Configure Project**
   ```json
   // vercel.json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/api/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ],
     "env": {
       "VITE_SUPABASE_URL": "@supabase-url",
       "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
     },
     "functions": {
       "api/*.ts": {
         "maxDuration": 30
       }
     }
   }
   ```

3. **Environment Variables**
   - `VITE_SUPABASE_URL`: Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
   - `VITE_GA_ID`: Google Analytics ID (optional)

#### Deployment Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy to staging
vercel --scope team
```

### Netlify

#### Setup

1. **Create Site**
   - Connect GitHub repository
   - Configure build settings
   - Add environment variables

2. **Build Configuration**
   ```toml
   # netlify.toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [build.environment]
     NODE_VERSION = "20"
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   
   [context.production.environment]
     VITE_APP_ENV = "production"
   
   [context.deploy-preview.environment]
     VITE_APP_ENV = "staging"
   ```

#### Environment Variables
Same as Vercel, configured in Netlify dashboard.

### Docker

#### Build Docker Image

```bash
# Build for production
docker build -t iron-tracker:latest .

# Build for specific environment
docker build -t iron-tracker:staging --build-arg ENVIRONMENT=staging .
```

#### Run Docker Container

```bash
# Run locally
docker run -p 80:80 iron-tracker:latest

# Run with environment variables
docker run -p 80:80 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your-anon-key \
  iron-tracker:latest
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
```

### Cloudflare Pages

#### Setup

1. **Create Project**
   - Connect GitHub repository
   - Configure build settings
   - Add environment variables

2. **Build Configuration**
   ```toml
   # wrangler.toml
   name = "iron-tracker"
   compatibility_date = "2024-01-17"
   
   [env.production]
   vars = { ENVIRONMENT = "production" }
   
   [env.staging]
   vars = { ENVIRONMENT = "staging" }
   ```

## 🔧 CI/CD Pipeline

### GitHub Actions

Our CI/CD pipeline automatically handles deployments:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run check:ci

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Environment-specific Configurations

#### Development
```bash
# .env.development
VITE_APP_ENV=development
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-anon-key
VITE_DEBUG=true
```

#### Staging
```bash
# .env.staging
VITE_APP_ENV=staging
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-anon-key
VITE_DEBUG=false
```

#### Production
```bash
# .env.production
VITE_APP_ENV=production
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-anon-key
VITE_DEBUG=false
VITE_GA_ID=G-XXXXXXXXXX
```

## 🔍 Health Checks

### Health Check Endpoint

```typescript
// src/api/health.ts
export async function GET() {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: import.meta.env.VITE_APP_ENV,
    uptime: process.uptime()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}
```

### Monitoring Health

```bash
# Check health endpoint
curl -f https://iron-tracker.com/api/health

# Response
{
  "status": "healthy",
  "timestamp": "2024-01-17T12:00:00Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600
}
```

## 📊 Performance Optimization

### Build Optimizations

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          charts: ['recharts']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npm install -g vite-bundle-analyzer
vite-bundle-analyzer dist

# Or use web-vitals
npm run perf
```

### Caching Strategy

```nginx
# nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location /api/ {
  add_header Cache-Control "no-cache";
}
```

## 🔒 Security Configuration

### HTTPS Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name iron-tracker.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### Environment Variable Security

```bash
# Never commit sensitive data
# Use secret management services
# Rotate keys regularly
# Use different keys for each environment
```

## 📱 PWA Configuration

### Service Worker

```typescript
// public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('iron-tracker-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icons/icon-192x192.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

## 🚨 Rollback Procedures

### Quick Rollback

```bash
# Vercel
vercel rollback [deployment-url]

# Docker
docker stop iron-tracker
docker run -p 80:80 iron-tracker:previous-version

# Manual
git checkout [previous-commit]
git push -f origin main
```

### Database Rollback

```sql
-- Supabase rollback
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'your_database';

-- Or restore from backup
-- Use Supabase Dashboard to restore point-in-time
```

## 📈 Monitoring and Analytics

### Performance Monitoring

```typescript
// src/lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to analytics service
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Error Tracking

```typescript
// src/lib/error-tracking.ts
export function trackError(error: Error, context?: any) {
  console.error('Application Error:', error);
  
  // Send to error tracking service
  if (import.meta.env.PROD) {
    // Sentry, LogRocket, etc.
  }
}
```

## 🔄 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Security scan passed
- [ ] Performance audit completed
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Backup strategy in place

### Post-deployment
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Analytics tracking
- [ ] User notification (if needed)
- [ ] Rollback plan verified

## 🆘 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Check Node.js version
   node --version
   npm --version
   
   # Clear cache
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Environment Variables Missing**
   ```bash
   # Verify variables
   printenv | grep VITE_
   
   # Check .env file
   cat .env
   ```

3. **Health Check Failing**
   ```bash
   # Check logs
   docker logs iron-tracker
   
   # Test endpoint locally
   curl -f http://localhost:3000/api/health
   ```

4. **Performance Issues**
   ```bash
   # Run Lighthouse
   npm run perf
   
   # Check bundle size
   npm run analyze
   ```

### Getting Help

- Check deployment logs
- Review CI/CD pipeline status
- Monitor performance metrics
- Check error tracking dashboard
- Review community issues

---

For questions or support, please create an issue in the repository or contact the development team.