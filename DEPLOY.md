# Deployment Guide

This guide explains how to deploy the 3D CD Player with Spotify integration.

## Architecture

- **Frontend**: Static React app deployed to Vercel
- **Backend**: Express server deployed to Railway/Render

## Prerequisites

1. Spotify App with production redirect URI
2. Vercel account (for frontend)
3. Railway or Render account (for backend)

## Frontend Deployment (Vercel)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Copy frontend package.json:
   ```bash
   cp frontend-package.json package.json
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Deploy to Vercel:
   ```bash
   vercel
   ```

5. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`: Your Gemini API key

6. Update your frontend code to use the deployed backend URL:
   - In `App.tsx`, update the login URL to point to your deployed backend

## Backend Deployment (Railway)

1. Create a new Railway project

2. Deploy from GitHub or use Railway CLI:
   ```bash
   railway login
   railway init
   railway up
   ```

3. Set environment variables in Railway:
   - `SPOTIFY_CLIENT_ID`: Your Spotify Client ID
   - `SPOTIFY_CLIENT_SECRET`: Your Spotify Client Secret
   - `REDIRECT_URI`: https://your-backend-url.railway.app/callback
   - `FRONTEND_URI`: https://your-frontend.vercel.app

4. Update Spotify App settings:
   - Add `https://your-backend-url.railway.app/callback` to redirect URIs

## Backend Deployment (Render)

1. Create a new Web Service on Render

2. Connect your GitHub repository

3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`

4. Set environment variables:
   - `SPOTIFY_CLIENT_ID`: Your Spotify Client ID
   - `SPOTIFY_CLIENT_SECRET`: Your Spotify Client Secret
   - `REDIRECT_URI`: https://your-backend-url.onrender.com/callback
   - `FRONTEND_URI`: https://your-frontend.vercel.app

5. Update Spotify App settings:
   - Add `https://your-backend-url.onrender.com/callback` to redirect URIs

## Post-Deployment

1. Update `App.tsx` to use production backend URL:
   ```typescript
   const BACKEND_URL = 'https://your-backend-url.railway.app';
   // or
   const BACKEND_URL = 'https://your-backend-url.onrender.com';
   ```

2. Redeploy frontend after updating backend URL

## Environment Variables Summary

### Frontend (.env.production)
- `GEMINI_API_KEY`: Gemini API key

### Backend (.env)
- `SPOTIFY_CLIENT_ID`: Spotify Client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify Client Secret
- `REDIRECT_URI`: Backend callback URL
- `FRONTEND_URI`: Frontend URL
- `PORT`: (automatically set by hosting platform)

## Testing

1. Visit your deployed frontend URL
2. Click "Login with Spotify"
3. Authorize the app
4. Test playback functionality

## Troubleshooting

- **CORS errors**: Ensure FRONTEND_URI matches your deployed frontend URL
- **Redirect URI mismatch**: Update Spotify app settings with production callback URL
- **Playback not working**: Ensure you have Spotify Premium and an active device