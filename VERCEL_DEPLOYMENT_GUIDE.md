# Vercel Deployment Guide - CS ERP System

## Quick Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Production ready: Auth + Royal Blue UI"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - Root Directory: `cs-erp-app`
   - Framework: Next.js
4. Add Environment Variables (see .env file)
5. Click Deploy

### 3. Required Environment Variables
```
DATABASE_URL=your-database-url
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
SESSION_PASSWORD=your-session-password
NODE_ENV=production
```

### 4. Test Deployment
- Visit your Vercel URL
- Test login with credentials
- Verify all features work

Done! Your app is live.
