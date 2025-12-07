#!/bin/bash

# Deploy script for restaurant-platform-core
# This script runs quality checks, commits changes, and pushes to origin

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Verify we're in the correct directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Are you in the project root?"
  exit 1
fi

# Check if we're on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "⚠️  Warning: Not on main branch (currently on $CURRENT_BRANCH)"
  echo "   Continuing anyway..."
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "📝 Staging all changes..."
  git add -A
else
  echo "ℹ️  No changes to commit"
  exit 0
fi

# Run linting
echo "🔍 Running linter..."
npm run lint || {
  echo "❌ Linting failed. Please fix errors before deploying."
  exit 1
}

# Run tests (using safe JSON output)
echo "🧪 Running tests..."
npm run test -- --run --reporter=json --outputFile=/tmp/vitest-results.json || {
  echo "❌ Tests failed. Please fix failing tests before deploying."
  exit 1
}

# Check test results
if [ -f "/tmp/vitest-results.json" ]; then
  FAILED_TESTS=$(node -e "const fs = require('fs'); const data = JSON.parse(fs.readFileSync('/tmp/vitest-results.json', 'utf8')); console.log(data.numFailedTests || 0);")
  if [ "$FAILED_TESTS" -gt 0 ]; then
    echo "❌ $FAILED_TESTS test(s) failed. Please fix failing tests before deploying."
    exit 1
  fi
  PASSED_TESTS=$(node -e "const fs = require('fs'); const data = JSON.parse(fs.readFileSync('/tmp/vitest-results.json', 'utf8')); console.log(data.numPassedTests || 0);")
  echo "✅ All $PASSED_TESTS test(s) passed"
fi

# Generate commit message from staged changes
COMMIT_MSG=$(git diff --cached --name-only | head -1 | sed 's|.*/||' | sed 's/\.[^.]*$//' | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')
if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="chore: update files"
fi

# If there's a TASK reference in the commit message or we can infer it, use it
if git diff --cached --name-only | grep -q "TASK\|task"; then
  TASK_ID=$(git diff --cached --name-only | grep -oE "TASK-[0-9.]+" | head -1 || echo "")
  if [ -n "$TASK_ID" ]; then
    COMMIT_MSG="feat(phase-3): $COMMIT_MSG ($TASK_ID)"
  else
    COMMIT_MSG="feat(phase-3): $COMMIT_MSG"
  fi
else
  COMMIT_MSG="feat(phase-3): $COMMIT_MSG"
fi

# Commit changes
echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG" || {
  echo "❌ Commit failed. This might mean there are no changes to commit."
  exit 1
}

# Push to origin
echo "📤 Pushing to origin..."
git push origin "$CURRENT_BRANCH" || {
  echo "❌ Push failed. Please check your git remote configuration."
  exit 1
}

echo "✅ Deployment complete!"
echo "   Branch: $CURRENT_BRANCH"
echo "   Commit: $(git rev-parse --short HEAD)"

