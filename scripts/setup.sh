#!/bin/bash

# Setup script for iron-tracker development environment
# This script automates the setup of the entire development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        print_error "$1 is not installed"
        return 1
    fi
    return 0
}

# Check prerequisites
print_step "Checking prerequisites..."

prerequisites=("node" "npm" "git" "curl")
missing_prereqs=()

for cmd in "${prerequisites[@]}"; do
    if ! check_command "$cmd"; then
        missing_prereqs+=("$cmd")
    fi
done

if [ ${#missing_prereqs[@]} -ne 0 ]; then
    print_error "Missing prerequisites: ${missing_prereqs[*]}"
    echo "Please install the missing tools and run this script again."
    exit 1
fi

print_success "All prerequisites are installed"

# Node.js version check
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_NODE_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please upgrade to v18.0.0 or higher"
    exit 1
fi

print_success "Node.js version $NODE_VERSION is compatible"

# Install dependencies
print_step "Installing project dependencies..."
npm ci

# Setup environment variables
print_step "Setting up environment variables..."

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env from .env.example"
        print_warning "Please edit .env file with your Supabase credentials"
    else
        print_warning ".env.example not found. Creating basic .env file..."
        cat > .env << EOF
# Iron Tracker Environment Variables
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GA_ID=G-XXXXXXXXXX
EOF
    fi
else
    print_success ".env file already exists"
fi

# Setup pre-commit hooks
print_step "Setting up pre-commit hooks..."

if check_command "pre-commit"; then
    pre-commit install
    pre-commit install --hook-type commit-msg
    print_success "Pre-commit hooks installed"
else
    print_warning "pre-commit not found. Installing..."
    pip install pre-commit
    pre-commit install
    pre-commit install --hook-type commit-msg
    print_success "Pre-commit hooks installed"
fi

# Initialize secrets baseline
print_step "Initializing secrets detection baseline..."
if [ ! -f ".secrets.baseline" ]; then
    detect-secrets scan --baseline .secrets.baseline
    print_success "Secrets baseline created"
else
    print_success "Secrets baseline already exists"
fi

# Setup git hooks
print_step "Setting up git hooks..."

# Create commit-msg hook for conventional commits
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/sh
# Conventional commit message validation

commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo ""
    echo "Commit message must follow conventional commit format:"
    echo "  feat: add new feature"
    echo "  fix: resolve bug"
    echo "  docs: update documentation"
    echo "  test: add tests"
    echo "  chore: maintenance tasks"
    echo ""
    echo "Examples:"
    echo "  feat(auth): add OAuth integration"
    echo "  fix(workout): resolve weight calculation bug"
    echo "  docs: update API documentation"
    echo ""
    exit 1
fi
EOF

chmod +x .git/hooks/commit-msg

# Create pre-push hook for running tests
cat > .git/hooks/pre-push << 'EOF'
#!/bin/sh
# Run tests before pushing

echo "Running tests before push..."
npm run test

if [ $? -ne 0 ]; then
    echo "Tests failed. Please fix failing tests before pushing."
    exit 1
fi

echo "All tests passed!"
EOF

chmod +x .git/hooks/pre-push

print_success "Git hooks configured"

# Setup development tools configuration
print_step "Setting up development tools configuration..."

# VS Code settings
if [ -d ".vscode" ]; then
    mkdir -p .vscode
    
    cat > .vscode/settings.json << EOF
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "eslint.workingDirectories": ["."],
  "prettier.configPath": "./prettier.config.js",
  "typescript.validate.enable": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.associations": {
    "*.tsx": "typescriptreact",
    "*.ts": "typescript"
  }
}
EOF
    
    cat > .vscode/extensions.json << EOF
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "yzhang.markdown-all-in-one"
  ]
}
EOF
    
    print_success "VS Code configuration created"
fi

# Run initial quality checks
print_step "Running initial code quality checks..."

echo "Running ESLint..."
npm run lint -- --fix || true

echo "Running Prettier..."
npm run format || true

echo "Running TypeScript check..."
npm run tsc --noEmit

echo "Running tests..."
npm run test

# Setup monitoring and health checks
print_step "Setting up health check endpoints..."

# Create health check API endpoint directory
mkdir -p src/api

cat > src/api/health.ts << 'EOF'
import { createRoute } from '@tanstack/react-router'

export const healthRoute = createRoute('/api/health', {
  component: HealthCheck,
})

function HealthCheck() {
  return new Response(JSON.stringify({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
EOF

# Setup Docker configuration (optional)
print_step "Setting up Docker configuration..."

cat > Dockerfile << 'EOF'
# Multi-stage build for production optimization
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
EOF

cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
        
        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Health check endpoint
        location /api/health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Final setup
print_step "Creating development scripts..."

cat > scripts/dev.sh << 'EOF'
#!/bin/bash
# Development server with hot reload

echo "Starting Iron Tracker development server..."
echo "Server will be available at: http://localhost:3000"
echo "TanStack DevTools will be available in the app"

# Set development environment
export VITE_APP_ENV=development

# Start development server with hot reload
npm run dev
EOF

cat > scripts/build.sh << 'EOF'
#!/bin/bash
# Production build script

echo "Building Iron Tracker for production..."

# Clean previous build
rm -rf dist/

# Set production environment
export VITE_APP_ENV=production

# Build application
npm run build

# Analyze bundle size
echo "Bundle size analysis:"
du -sh dist/

echo "Build completed successfully!"
EOF

cat > scripts/test.sh << 'EOF'
#!/bin/bash
# Comprehensive test runner

echo "Running Iron Tracker test suite..."

# Run unit tests
echo "Running unit tests..."
npm run test

# Run linting
echo "Running ESLint..."
npm run lint

# Run type checking
echo "Running TypeScript check..."
npm run tsc --noEmit

# Run security audit
echo "Running security audit..."
npm audit --audit-level=moderate

echo "All tests completed!"
EOF

chmod +x scripts/dev.sh scripts/build.sh scripts/test.sh

print_success "Development scripts created"

# Create comprehensive documentation
print_step "Creating development documentation..."

cat > DEVELOPMENT.md << 'EOF'
# Iron Tracker Development Guide

## Quick Start

This guide covers everything you need to know about developing Iron Tracker.

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account
- VS Code (recommended)

### Initial Setup

1. **Clone and Setup**
   ```bash
   git clone https://github.com/elidianeasb/iron-tracker.git
   cd iron-tracker
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Configure Environment**
   ```bash
   # Edit .env with your Supabase credentials
   nano .env
   ```

3. **Start Development**
   ```bash
   ./scripts/dev.sh
   # or
   npm run dev
   ```

### Development Workflow

#### Code Quality

Our project uses several tools to maintain code quality:

- **ESLint**: Lints JavaScript/TypeScript code
- **Prettier**: Formats code consistently
- **Pre-commit hooks**: Run automated checks before commits
- **TypeScript**: Type safety

#### Conventional Commits

We follow conventional commit format:

```
type(scope): description

feat(auth): add OAuth integration
fix(workout): resolve weight calculation bug
docs: update API documentation
test: add unit tests for workout component
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`

#### Git Hooks

- **Pre-commit**: Runs linting, formatting, and tests
- **Pre-push**: Ensures all tests pass
- **Commit-msg**: Validates commit message format

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run check` - Format + lint + type check

### Architecture

#### Tech Stack

- **Frontend**: React 19.2.0 with TypeScript
- **Routing**: TanStack Router (file-based, type-safe)
- **Styling**: Tailwind CSS 4.0.6
- **Backend**: Supabase (PostgreSQL + API)
- **Build Tool**: Vite 7.1.7
- **Testing**: Vitest 3.0.5

#### Project Structure

```
src/
├── components/         # Reusable React components
├── lib/               # Utilities (Supabase client)
├── routes/            # TanStack Router file-based routes
├── api/               # API endpoints
├── main.tsx           # App entry point
├── routeTree.gen.ts   # Auto-generated router tree
└── styles.css         # Global styles
```

#### Routing

Iron Tracker uses TanStack Router for type-safe file-based routing:

- `src/routes/__root.tsx` - Root layout
- `src/routes/index.tsx` - Dashboard (/)
- `src/routes/history.tsx` - History page (/history)
- `src/routes/workout.tsx` - Workout page (/workout)

#### Database Schema

Key tables:
- `programs` - Workout programs by day
- `exercises` - Exercise library
- `program_exercises` - Program-exercise relationships
- `daily_habits` - Daily habit tracking
- `workout_logs` - Workout progress

### Testing

#### Unit Tests

Run tests with:
```bash
npm run test
```

Test files should be co-located with components:
```
src/
├── components/
│   ├── WorkoutCard.tsx
│   └── WorkoutCard.test.tsx
```

#### Integration Tests

For integration tests, create tests in `src/tests/`:
```bash
npm run test src/tests/
```

### Performance

#### Bundle Size

Monitor bundle size with:
```bash
npm run build
du -sh dist/
```

#### Lighthouse

Run Lighthouse audits:
```bash
npm install -g @lhci/cli@0.13.x
lhci autorun
```

### Deployment

#### Environments

1. **Development** - Local development
2. **Staging** - Pre-production testing
3. **Production** - Live application

#### CI/CD Pipeline

Our CI/CD pipeline includes:
- Code quality checks
- Multi-environment testing
- Security scanning
- Automated deployment
- Health checks

#### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Security

#### Environment Variables

Never commit sensitive data. Use environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GA_ID` (optional)

#### Security Scanning

Security is scanned automatically:
- npm audit for dependency vulnerabilities
- Snyk for advanced security analysis
- Semgrep for code security issues
- TruffleHog for secret detection

#### Best Practices

1. Always validate user input
2. Use Supabase Row Level Security (RLS)
3. Keep dependencies updated
4. Use HTTPS in production
5. Implement proper error handling

### Monitoring

#### Health Checks

Health check endpoint: `GET /api/health`

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-17T12:00:00Z",
  "version": "1.0.0"
}
```

#### Error Tracking

Set up error tracking (recommended):
- Sentry for frontend errors
- Supabase logs for backend errors

### Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow the development workflow
4. Commit changes with conventional commits
5. Push and create Pull Request

### Troubleshooting

#### Common Issues

1. **Build fails with TypeScript errors**
   - Run `npm run check` to identify issues
   - Check TypeScript configuration

2. **Tests failing**
   - Check console output for specific errors
   - Ensure test environment is properly configured

3. **Environment variable issues**
   - Verify .env file exists and is properly formatted
   - Check variable names match .env.example

4. **Performance issues**
   - Run Lighthouse audit
   - Check bundle size
   - Profile React components

#### Getting Help

- Check this documentation
- Review existing issues on GitHub
- Join our community discussions

### Development Tools

#### VS Code Extensions

Recommended extensions (auto-installed):
- Prettier
- ESLint
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag

#### Browser Extensions

- React Developer Tools
- TanStack DevTools

---

Happy coding! 🚀
EOF

print_success "Development documentation created"

# Final success message
print_success "Iron Tracker development environment setup completed!"
echo ""
echo "🎉 Your development environment is ready!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your Supabase credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:3000 in your browser"
echo "4. Read DEVELOPMENT.md for detailed guidance"
echo ""
echo "Useful commands:"
echo "  npm run dev     - Start development server"
echo "  npm run test    - Run tests"
echo "  npm run build   - Build for production"
echo "  npm run check   - Run all quality checks"
echo ""