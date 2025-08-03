# Backend Deployment Guide (Railway)

## Quick Deploy Steps

1. **Login to Railway:**
   ```bash
   railway login
   ```

2. **Create a new project:**
   ```bash
   railway init
   ```

3. **Set environment variables:**
   ```bash
   railway variables set SPOTIFY_CLIENT_ID=d076bd005b224087a1feca57ae94a9ac
   railway variables set SPOTIFY_CLIENT_SECRET=6510370a9ee74e02897efb89599a0e3f
   railway variables set FRONTEND_URI=https://3d-cd-player-m015ys8kf-patricks-projects-1e98187f.vercel.app
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

5. **Get your deployment URL:**
   ```bash
   railway open
   ```

## After Deployment

1. **Copy your Railway URL** (it will be something like: https://your-app.railway.app)

2. **Update Spotify App:**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Add your Railway URL + `/callback` to Redirect URIs
   - Example: `https://your-app.railway.app/callback`

3. **Update Vercel Frontend:**
   - Go to your [Vercel Dashboard](https://vercel.com/patricks-projects-1e98187f/3d-cd-player/settings/environment-variables)
   - Add/Update `VITE_BACKEND_URL` with your Railway URL
   - Redeploy the frontend

4. **Set REDIRECT_URI in Railway:**
   ```bash
   railway variables set REDIRECT_URI=https://your-app.railway.app/callback
   ```

## Environment Variables Summary

Your backend needs these variables (already set in .env):
- `SPOTIFY_CLIENT_ID`: d076bd005b224087a1feca57ae94a9ac
- `SPOTIFY_CLIENT_SECRET`: 6510370a9ee74e02897efb89599a0e3f
- `FRONTEND_URI`: https://3d-cd-player-m015ys8kf-patricks-projects-1e98187f.vercel.app
- `REDIRECT_URI`: (set after getting Railway URL)

## Alternative: Deploy to Render

If you prefer Render:

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repo
4. Use these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add the same environment variables