#!/bin/bash

# Pre-push hook for iron-tracker
# Runs final comprehensive checks before pushing to remote

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[PRE-PUSH]${NC} $1"
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

# Get remote URL and branch
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "origin")
CURRENT_BRANCH=$(git branch --show-current)
TARGET_BRANCH=${1:-main}

print_step "Pre-push checks for branch '$CURRENT_BRANCH' → '$TARGET_BRANCH'"

# Run comprehensive test suite
run_full_test_suite() {
    print_step "Running comprehensive test suite..."
    
    if npm run test:coverage; then
        print_success "Full test suite with coverage passed"
    else
        print_error "Test suite failed"
        return 1
    fi
}

# Performance audit
run_performance_audit() {
    print_step "Running performance audit..."
    
    if npm run perf; then
        print_success "Performance audit passed"
    else
        print_warning "Performance audit had warnings"
        # Don't fail push for performance warnings
    fi
}

# Security scan
run_security_scan() {
    print_step "Running security scan..."
    
    if npm run security; then
        print_success "Security scan passed"
    else
        print_error "Security scan failed"
        return 1
    fi
}

# Dependency check
run_dependency_check() {
    print_step "Checking dependencies..."
    
    # Check for outdated dependencies
    OUTDATED_COUNT=$(npm outdated | wc -l || true)
    if [ "$OUTDATED_COUNT" -gt 0 ]; then
        print_warning "$OUTDATED_COUNT outdated packages found"
        npm outdated
        echo ""
        
        read -p "Continue with push despite outdated packages? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Push cancelled due to outdated dependencies"
            return 1
        fi
    else
        print_success "All dependencies are up to date"
    fi
}

# Check build for production
check_production_build() {
    print_step "Checking production build..."
    
    # Clean previous build
    rm -rf dist/
    
    if npm run build; then
        print_success "Production build successful"
        
        # Check build output
        if [ -f "dist/index.html" ]; then
            print_success "Build artifacts created successfully"
        else
            print_error "Build artifacts missing"
            return 1
        fi
    else
        print_error "Production build failed"
        return 1
    fi
}

# Check if pushing to main branch
check_main_branch_push() {
    if [ "$CURRENT_BRANCH" = "$TARGET_BRANCH" ]; then
        print_step "Pushing to main branch - running additional checks..."
        
        # Additional checks for main branch pushes
        run_full_test_suite || return 1
        run_performance_audit
        
        print_warning "You are pushing to the main branch"
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Push to main branch cancelled"
            return 1
        fi
    else
        # For feature branches, run a lighter test suite
        print_step "Running feature branch tests..."
        if npm run test; then
            print_success "Feature branch tests passed"
        else
            print_error "Feature branch tests failed"
            return 1
        fi
    fi
}

# Check for commit message compliance
check_commit_messages() {
    print_step "Checking commit messages..."
    
    # Get commit messages that will be pushed
    COMMITS=$(git log --oneline origin/$TARGET_BRANCH..HEAD 2>/dev/null || git log --oneline -n 5 HEAD)
    
    if [ -z "$COMMITS" ]; then
        print_warning "No new commits to check"
        return 0
    fi
    
    echo "Checking commit messages:"
    echo "$COMMITS"
    echo ""
    
    # Check for conventional commit format
    INVALID_COMMITS=$(echo "$COMMITS" | grep -v -E "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: " || true)
    
    if [ -n "$INVALID_COMMITS" ]; then
        print_error "Found non-conventional commit messages:"
        echo "$INVALID_COMMITS"
        echo ""
        print_error "Please follow conventional commit format:"
        print_error "  type(scope): description"
        print_error "  Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build"
        return 1
    else
        print_success "All commit messages follow conventional format"
    fi
}

# Check for large files
check_large_files() {
    print_step "Checking for large files..."
    
    LARGE_FILES=$(git diff --stat --name-only origin/$TARGET_BRANCH..HEAD 2>/dev/null | xargs ls -la 2>/dev/null | awk '$5 > 1048576 { print $9 " (" $5 " bytes)" }' || true)
    
    if [ -n "$LARGE_FILES" ]; then
        print_warning "Found large files (>1MB):"
        echo "$LARGE_FILES"
        echo ""
        print_warning "Consider using Git LFS or moving large files to external storage"
        echo ""
        
        read -p "Continue with push? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Push cancelled due to large files"
            return 1
        fi
    else
        print_success "No large files found"
    fi
}

# Check if remote exists and is accessible
check_remote_access() {
    print_step "Checking remote access..."
    
    if git ls-remote --exit-code $REMOTE_URL > /dev/null 2>&1; then
        print_success "Remote repository accessible"
    else
        print_error "Cannot access remote repository"
        return 1
    fi
}

# Generate push summary
generate_push_summary() {
    print_step "Generating push summary..."
    
    # Get commit range
    if git rev-parse --verify origin/$TARGET_BRANCH > /dev/null 2>&1; then
        COMMIT_RANGE="origin/$TARGET_BRANCH..HEAD"
        COMMITS_BEHIND=$(git rev-list --count HEAD..origin/$TARGET_BRANCH 2>/dev/null || echo "0")
        COMMITS_AHEAD=$(git rev-list --count origin/$TARGET_BRANCH..HEAD 2>/dev/null || echo "0")
    else
        COMMIT_RANGE="HEAD~5..HEAD"
        COMMITS_BEHIND="N/A"
        COMMITS_AHEAD=$(git rev-list --count HEAD~5..HEAD 2>/dev/null || echo "0")
    fi
    
    # Get statistics
    FILES_CHANGED=$(git diff --stat $COMMIT_RANGE | tail -n1 | awk '{print $1}' || echo "0")
    INSERTIONS=$(git diff --stat $COMMIT_RANGE | tail -n1 | awk '{print $4}' | sed 's/[^0-9]//g' || echo "0")
    DELETIONS=$(git diff --stat $COMMIT_RANGE | tail -n1 | awk '{print $6}' | sed 's/[^0-9]//g' || echo "0")
    
    echo -e "${BLUE}📊 Push Summary:${NC}"
    echo "  Branch: $CURRENT_BRANCH → $TARGET_BRANCH"
    echo "  Commits ahead: $COMMITS_AHEAD"
    echo "  Commits behind: $COMMITS_BEHIND"
    echo "  Files changed: $FILES_CHANGED"
    echo "  Insertions: +$INSERTIONS"
    echo "  Deletions: -$DELETIONS"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Iron Tracker Pre-push Hook${NC}"
    echo ""
    
    # Check remote access
    check_remote_access || exit 1
    echo ""
    
    # Check commit messages
    check_commit_messages || exit 1
    echo ""
    
    # Check large files
    check_large_files || exit 1
    echo ""
    
    # Check dependencies
    run_dependency_check || exit 1
    echo ""
    
    # Production build check
    check_production_build || exit 1
    echo ""
    
    # Branch-specific checks
    check_main_branch_push || exit 1
    echo ""
    
    # Security scan
    run_security_scan || exit 1
    echo ""
    
    # Generate summary
    generate_push_summary
    
    # Final success message
    echo -e "${GREEN}✅ All pre-push checks passed!${NC}"
    echo -e "${GREEN}🚀 Ready to push to $REMOTE_URL!${NC}"
    echo ""
    echo -e "${BLUE}Push command:${NC} git push origin $CURRENT_BRANCH"
}

# Run main function with all arguments
main "$@"