# 📋 Deployment Checklist

## Before Deployment

### MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- [ ] Create free cluster
- [ ] Add IP address (0.0.0.0/0 for testing, restrict in production)
- [ ] Create database user with strong password
- [ ] Copy connection string
- [ ] Note: MongoDB URI example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expenseai?retryWrites=true&w=majority`

### Backend Preparation
- [ ] Update `server/.env` with MongoDB Atlas URI
- [ ] Generate strong JWT_SECRET for production
- [ ] Set `NODE_ENV=production`
- [ ] Test locally with MongoDB Atlas connection
- [ ] Commit all changes to GitHub

### Frontend Preparation
- [ ] Update `client/package.json` homepage with your GitHub username
- [ ] Install gh-pages: `npm install --save-dev gh-pages`
- [ ] Create `client/.env.production` with backend URL
- [ ] Test build locally: `npm run build`
- [ ] Commit all changes to GitHub

---

## Deployment Steps

### 1. Deploy Backend to Railway (First)
- [ ] Go to https://railway.app
- [ ] Sign in with GitHub
- [ ] Create new project → Deploy from GitHub
- [ ] Select ExpenseAI repository
- [ ] Add environment variables from `server/.env`
- [ ] Wait for deployment (usually 2-3 minutes)
- [ ] Copy Railway URL: (will be shown on dashboard)
- [ ] Note format: `https://expenseai-backend-xxxxxx.up.railway.app`

### 2. Update Frontend with Backend URL
- [ ] Get backend URL from Railway dashboard
- [ ] Update `client/.env.production`: `REACT_APP_API_URL=<railway_backend_url>/api`
- [ ] Update `server/server.js` CORS: add your GitHub Pages domain
- [ ] Commit changes to GitHub

### 3. Deploy Frontend to GitHub Pages
- [ ] Push all changes to GitHub main branch
- [ ] Run: `cd client && npm run deploy`
- [ ] Wait for build (2-5 minutes)
- [ ] Check GitHub Actions tab for success
- [ ] Your app is live at: `https://<username>.github.io/ExpenseAI`

---

## Post-Deployment Verification

### Test Frontend
- [ ] Open https://<username>.github.io/ExpenseAI
- [ ] Sign up with test account
- [ ] Add test expense
- [ ] Verify charts load
- [ ] Set budget
- [ ] Check analytics

### Test Backend
- [ ] Open https://expenseai-backend-xxxxxx.up.railway.app/api/health
- [ ] Should return: `{"message":"Server is running"}`

### Test API Connectivity
- [ ] Sign up from deployed frontend
- [ ] Login with credentials
- [ ] Add expense - should work
- [ ] Delete expense - should work
- [ ] Check browser DevTools for API errors

---

## Useful Links

| Service | Link |
|---------|------|
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas |
| Railway Dashboard | https://railway.app/dashboard |
| GitHub Actions | https://github.com/<username>/ExpenseAI/actions |
| Your Frontend | https://<username>.github.io/ExpenseAI |
| Your Backend | https://expenseai-backend-xxxxxx.up.railway.app |

---

## Troubleshooting

### Frontend shows blank page
- Check browser console for errors (F12)
- Verify backend URL in Network tab
- Check GitHub Pages settings in repo

### Can't login after deployment
- Check MongoDB Atlas is running
- Verify connection string in Railway env
- Check Railway logs: `railway logs`
- Verify CORS settings in backend

### API calls failing
- Check backend URL matches in frontend .env
- Verify CORS origin includes GitHub Pages URL
- Check Network tab in DevTools for error responses

### Need to update code
- Make changes locally
- Commit to GitHub
- Railway auto-deploys backend
- Run `npm run deploy` for frontend

---

## 🎉 Success!

Your ExpenseAI application is now live!

**Share your live URL:**
```
Frontend: https://<username>.github.io/ExpenseAI
Backend: https://expenseai-backend-xxxxxx.up.railway.app
```
