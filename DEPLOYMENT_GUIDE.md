# ExpenseAI Deployment Guide

## 🚀 Deployment Plan

- **Frontend:** GitHub Pages (React)
- **Backend:** Railway (Node.js)
- **Database:** MongoDB Atlas (Cloud)

---

## Step 1: Setup MongoDB Atlas

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up with email or Google
3. Create a free cluster

### 2. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Example: `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/expenseai?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend to Railway

### 1. Prepare Backend for Deployment

Update `server/.env` with production values:
```
PORT=5000
MONGODB_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<generate_strong_secret>
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
NODE_ENV=production
```

### 2. Create Deployment Files

Create `server/Procfile`:
```
web: node server.js
```

Update `server/package.json` - add engines section:
```json
"engines": {
  "node": "18.x",
  "npm": "9.x"
}
```

### 3. Deploy to Railway
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your ExpenseAI repository
5. Set environment variables (from .env file)
6. Railway auto-detects and deploys

### 4. Get Backend URL
- Railway provides URL like: `https://expenseai-backend-production.up.railway.app`
- Your API endpoints: `https://expenseai-backend-production.up.railway.app/api/...`

---

## Step 3: Deploy Frontend to GitHub Pages

### 1. Update API URL

Create `client/src/utils/api.js` with production URL:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://expenseai-backend-production.up.railway.app/api';
```

Create `client/.env.production`:
```
REACT_APP_API_URL=https://expenseai-backend-production.up.railway.app/api
```

### 2. Setup GitHub Pages

Update `client/package.json`:
```json
{
  "homepage": "https://yourusername.github.io/ExpenseAI",
  "name": "expenseai-client",
  ...
}
```

### 3. Install GitHub Pages Package
```bash
cd client
npm install --save-dev gh-pages
```

### 4. Update package.json Scripts
Add to scripts:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  "start": "react-scripts start",
  ...
}
```

### 5. Deploy
```bash
cd client
npm run deploy
```

Your app will be live at: `https://yourusername.github.io/ExpenseAI`

---

## Step 4: Enable CORS on Backend

Update `server/server.js`:
```javascript
app.use(cors({
  origin: [
    'https://yourusername.github.io',
    'http://localhost:3000' // for local testing
  ],
  credentials: true
}));
```

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Backend deployed to Railway
- [ ] Backend environment variables configured
- [ ] Frontend env file updated with backend URL
- [ ] Frontend deployed to GitHub Pages
- [ ] CORS enabled on backend
- [ ] Can signup and login from deployed frontend
- [ ] Can add expenses and see analytics

---

## 📊 Live URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | https://yourusername.github.io/ExpenseAI |
| Backend API | https://expenseai-backend-production.up.railway.app |
| Database | MongoDB Atlas (Cloud) |

---

## 🔧 Useful Commands

```bash
# Deploy backend updates
git push  # Railway auto-deploys from main branch

# Deploy frontend updates
npm run deploy

# Test production build locally
npm run build
npm install -g serve
serve -s build
```

---

## ⚠️ Important Notes

1. **GitHub Token:** You may need to authenticate with GitHub for gh-pages
2. **MongoDB Password:** Use URL-encoded password in connection string
3. **CORS:** Update frontend origin in backend after getting final URL
4. **Environment Variables:** Keep secrets safe, never commit .env files
5. **API Rate:** Railway free tier has usage limits - monitor your usage

---

## 🆘 Troubleshooting

### Frontend can't connect to backend
- Check CORS origin in backend matches frontend URL
- Verify MongoDB Atlas connection string in backend env
- Check Railway logs for backend errors

### Login/Signup not working
- Verify MongoDB Atlas is running
- Check JWT_SECRET is set in backend
- Look at Railway backend logs

### GitHub Pages showing blank page
- Verify homepage URL in package.json matches your username
- Check that all API calls use production backend URL

