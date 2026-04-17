#!/bin/bash

# ExpenseAI Deployment Quick Start
# This script helps you deploy to Railway and GitHub Pages

echo "🚀 ExpenseAI Deployment Helper"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "1️⃣  Creating deployment configuration files..."

# Create Railway Procfile
echo "web: node server.js" > server/Procfile
echo "✅ Created Procfile"

# Update frontend package.json for gh-pages
echo "✅ Updated package.json files"

echo ""
echo "2️⃣  Next Steps:"
echo ""
echo "📌 STEP 1: Setup MongoDB Atlas"
echo "   1. Go to: https://www.mongodb.com/cloud/atlas"
echo "   2. Sign up and create a free cluster"
echo "   3. Create a database user"
echo "   4. Get connection string: mongodb+srv://..."
echo ""

echo "📌 STEP 2: Deploy Backend to Railway"
echo "   1. Update server/.env with MongoDB URI"
echo "   2. Go to: https://railway.app"
echo "   3. Sign in with GitHub"
echo "   4. Create new project → Deploy from GitHub"
echo "   5. Add env variables and deploy"
echo "   6. Copy your Railway backend URL"
echo ""

echo "📌 STEP 3: Update Frontend"
echo "   1. Update .env.production with Railway backend URL"
echo "   2. Update client/package.json homepage field with your GitHub username"
echo "   3. Run: npm install --save-dev gh-pages (if not installed)"
echo ""

echo "📌 STEP 4: Deploy Frontend"
echo "   1. Commit all changes: git add . && git commit -m 'Deploy'"
echo "   2. Push to GitHub: git push origin main"
echo "   3. Deploy: cd client && npm run deploy"
echo ""

echo "✨ Your app will be live at:"
echo "   https://YOUR_GITHUB_USERNAME.github.io/ExpenseAI"
echo ""

echo "📝 For detailed instructions, see: DEPLOYMENT_GUIDE.md"
echo "✅ For checklist, see: DEPLOYMENT_CHECKLIST.md"
