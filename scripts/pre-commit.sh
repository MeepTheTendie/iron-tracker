#!/bin/bash

# Pre-commit hook for iron-tracker
# Runs comprehensive checks before allowing commits

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[PRE-COMMIT]${NC} $1"
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

# Check if this is a commit that should be checked
check_commit_relevance() {
    print_step "Checking commit relevance..."
    
    # Get list of staged files
    STAGED_FILES=$(git diff --cached --name-only)
    
    if [ -z "$STAGED_FILES" ]; then
        print_warning "No staged files found"
        return 0
    fi
    
    echo "Staged files:"
    echo "$STAGED_FILES"
    echo ""
    
    # Check if any relevant files are staged
    RELEVANT_FILES=$(echo "$STAGED_FILES" | grep -E '\.(js|jsx|ts|tsx|json|md|yml|yaml)$' || true)
    
    if [ -z "$RELEVANT_FILES" ]; then
        print_warning "No relevant code files staged, skipping checks"
        return 1  # Skip further checks
    fi
    
    return 0
}

# Run TypeScript type checking
run_typecheck() {
    print_step "Running TypeScript type checking..."
    
    if npm run tsc; then
        print_success "TypeScript type checking passed"
    else
        print_error "TypeScript type checking failed"
        return 1
    fi
}

# Run ESLint
run_lint() {
    print_step "Running ESLint..."
    
    # Get staged JS/TS files
    STAGED_JS_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$' || true)
    
    if [ -z "$STAGED_JS_FILES" ]; then
        print_warning "No JS/TS files to lint"
        return 0
    fi
    
    echo "Linting files:"
    echo "$STAGED_JS_FILES"
    
    if npx eslint $STAGED_JS_FILES --fix; then
        print_success "ESLint passed"
    else
        print_error "ESLint failed"
        return 1
    fi
}

# Run Prettier formatting
run_format() {
    print_step "Running Prettier formatting..."
    
    # Get staged files that should be formatted
    STAGED_FORMAT_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx|json|md|yml|yaml)$' || true)
    
    if [ -z "$STAGED_FORMAT_FILES" ]; then
        print_warning "No files to format"
        return 0
    fi
    
    echo "Formatting files:"
    echo "$STAGED_FORMAT_FILES"
    
    if npx prettier --write $STAGED_FORMAT_FILES; then
        print_success "Prettier formatting completed"
        
        # Re-add formatted files to staging
        git add $STAGED_FORMAT_FILES
        print_success "Re-formatted files added to staging"
    else
        print_error "Prettier formatting failed"
        return 1
    fi
}

# Run tests
run_tests() {
    print_step "Running tests..."
    
    if npm run test; then
        print_success "All tests passed"
    else
        print_error "Tests failed"
        return 1
    fi
}

# Run security audit
run_security_audit() {
    print_step "Running security audit..."
    
    if npm audit --audit-level=moderate; then
        print_success "Security audit passed"
    else
        print_warning "Security audit found issues (but continuing)"
        # Don't fail the commit for security issues, just warn
    fi
}

# Check for TODO/FIXME comments
check_todo_comments() {
    print_step "Checking for TODO/FIXME comments..."
    
    TODO_COUNT=$(git diff --cached --name-only | xargs grep -l "TODO\|FIXME" 2>/dev/null | wc -l || true)
    
    if [ "$TODO_COUNT" -gt 0 ]; then
        print_warning "Found TODO/FIXME comments in $TODO_COUNT files"
        print_warning "Consider addressing these before committing"
        
        # List files with TODOs
        git diff --cached --name-only | xargs grep -n "TODO\|FIXME" 2>/dev/null || true
        echo ""
        
        # Ask user if they want to continue
        read -p "Continue with commit? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Commit cancelled due to TODO comments"
            return 1
        fi
    else
        print_success "No TODO/FIXME comments found"
    fi
}

# Check bundle size impact
check_bundle_size() {
    print_step "Checking bundle size impact..."
    
    # Build the project
    if npm run build; then
        CURRENT_SIZE=$(du -sh dist/ | cut -f1)
        print_success "Current bundle size: $CURRENT_SIZE"
        
        # Check if bundle size exceeds reasonable limits
        SIZE_MB=$(du -sm dist/ | cut -f1)
        if [ "$SIZE_MB" -gt 10 ]; then
            print_warning "Bundle size is large (>10MB). Consider optimization."
        fi
    else
        print_error "Build failed, cannot check bundle size"
        return 1
    fi
}

# Check for sensitive information
check_secrets() {
    print_step "Checking for sensitive information..."
    
    # Check for common secret patterns
    SECRETS_FOUND=$(git diff --cached --name-only | xargs grep -l -E "(password|secret|key|token)" 2>/dev/null | wc -l || true)
    
    if [ "$SECRETS_FOUND" -gt 0 ]; then
        print_warning "Found potential secrets in $SECRETS_FOUND files"
        print_warning "Please review these files for sensitive information:"
        
        git diff --cached --name-only | xargs grep -n -E "(password|secret|key|token)" 2>/dev/null || true
        echo ""
        
        read -p "Continue with commit? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Commit cancelled due to potential secrets"
            return 1
        fi
    else
        print_success "No obvious secrets found"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Iron Tracker Pre-commit Hook${NC}"
    echo ""
    
    # Check if we should run the checks
    if ! check_commit_relevance; then
        exit 0  # Skip checks for non-relevant commits
    fi
    
    # Run all checks
    FAILED_CHECKS=0
    
    run_typecheck || FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo ""
    
    run_format || FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo ""
    
    run_lint || FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo ""
    
    run_tests || FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo ""
    
    run_security_audit
    echo ""
    
    check_todo_comments || FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo ""
    
    check_secrets || FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo ""
    
    check_bundle_size || FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo ""
    
    # Final result
    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "${GREEN}✅ All pre-commit checks passed!${NC}"
        echo -e "${GREEN}🎉 Ready to commit!${NC}"
        exit 0
    else
        echo -e "${RED}❌ $FAILED_CHECKS pre-commit checks failed${NC}"
        echo -e "${RED}🔧 Please fix the issues above before committing${NC}"
        exit 1
    fi
}

# Run main function
main "$@"