# Deploy Backend to Render (FREE)

## 🚨 IMPORTANT: Fix Applied
This deployment includes fixes for the ES module errors you encountered.

## Step-by-Step Deployment

### 1. GitHub Repository Ready
Your code is already in: https://github.com/BrandeisPatrick/poetry-music-coffee

### 2. Deploy to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository: `BrandeisPatrick/poetry-music-coffee`
5. Configure the service:
   - **Name**: `spotify-cd-player-backend`
   - **Region**: Choose the closest to you
   - **Branch**: `master` (not main)
   - **Root Directory**: Leave empty (uses root)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Select **"Free"**

### 3. ⚠️ CRITICAL: Add Environment Variables

**BEFORE** clicking "Create Web Service", scroll down to **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `SPOTIFY_CLIENT_ID` | `d076bd005b224087a1feca57ae94a9ac` |
| `SPOTIFY_CLIENT_SECRET` | `6510370a9ee74e02897efb89599a0e3f` |
| `FRONTEND_URI` | `https://3d-cd-player-eppi5tk91-patricks-projects-1e98187f.vercel.app` |
| `NODE_ENV` | `production` |

**⚠️ DO NOT** set `REDIRECT_URI` yet - we'll add it after getting the Render URL.

4. Click **"Create Web Service"**

### 3. After Deployment

1. **Get your Render URL**: It will be something like `https://spotify-cd-player-backend.onrender.com`

2. **Update Environment Variables in Render**:
   - Go to your service dashboard → Environment
   - Update `REDIRECT_URI` to: `https://YOUR-SERVICE-NAME.onrender.com/callback`

3. **Update Spotify App**:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Select your app
   - Go to Settings
   - Add your Render callback URL to **Redirect URIs**:
     `https://YOUR-SERVICE-NAME.onrender.com/callback`
   - Click Save

4. **Update Frontend on Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/patricks-projects-1e98187f/3d-cd-player/settings/environment-variables)
   - Add/Update environment variable:
     - `VITE_BACKEND_URL` = `https://YOUR-SERVICE-NAME.onrender.com`
   - Redeploy by going to Deployments → Three dots menu → Redeploy

## Important Notes

- **Free Tier Limitations**: Render free tier services spin down after 15 minutes of inactivity. First request after inactivity may take 30-60 seconds.
- **Custom Domain**: You can add a custom domain later if needed
- **Logs**: Check logs in Render dashboard if something goes wrong

## Test Your Deployment

1. Visit your frontend URL: https://3d-cd-player-m015ys8kf-patricks-projects-1e98187f.vercel.app
2. Click "Login with Spotify"
3. Authorize the app
4. Enjoy your 3D CD Player!

## Troubleshooting

- **Login redirect not working**: Double-check redirect URIs match exactly in Spotify app settings
- **CORS errors**: Make sure FRONTEND_URI environment variable matches your Vercel URL
- **Slow initial load**: This is normal for free tier - the service needs to "wake up"