#!/bin/bash
# EduConnect India — GitHub Push Script
# Made & maintained by GuardianX
#
# Usage:
#   1. Create a new GitHub repo (empty, no README/license)
#   2. Run: bash push-to-github.sh <your-github-username> <repo-name>
#   3. When prompted, enter your GitHub Personal Access Token (PAT)
#      (Create at: https://github.com/settings/tokens — needs "repo" scope)

set -e

USERNAME="${1:-your-username}"
REPO="${2:-educonnect-india}"
REMOTE_URL="https://github.com/$USERNAME/$REPO.git"

echo "=========================================="
echo "  EduConnect India → GitHub Push Script"
echo "=========================================="
echo ""
echo "Repository: $REMOTE_URL"
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
  echo "✓ Remote 'origin' exists — updating URL"
  git remote set-url origin "$REMOTE_URL"
else
  echo "✓ Adding remote 'origin'"
  git remote add origin "$REMOTE_URL"
fi

echo ""
echo "Pushing to GitHub..."
echo "(You may be prompted for your GitHub username + Personal Access Token)"
echo ""

# Push
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ SUCCESS! Code pushed to GitHub."
  echo ""
  echo "View your repo: https://github.com/$USERNAME/$REPO"
  echo ""
  echo "Next steps:"
  echo "  1. Add a description on GitHub"
  echo "  2. Add topics: education, saas, nextjs, india, edtech"
  echo "  3. Set up Vercel deployment (imports from GitHub automatically)"
  echo "  4. Share with your team!"
else
  echo ""
  echo "❌ Push failed. Common issues:"
  echo "  - Wrong username or token"
  echo "  - Repo doesn't exist yet (create at https://github.com/new)"
  echo "  - Token needs 'repo' scope"
  echo "  - Branch name mismatch (try: git push -u origin main:main)"
fi
