# 3D CD Player with Spotify Integration

A 3D interactive CD player that integrates with Spotify for music playback.

## Prerequisites

- Node.js
- Spotify Premium account (required for playback)
- Spotify App credentials

## Setup

### 1. Spotify App Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:3000/callback` to Redirect URIs
4. Note your Client ID and Client Secret

### 2. Backend Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and add your Spotify credentials:
   ```
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

### 3. Frontend Configuration

Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

### 4. Install Dependencies

```bash
npm install
```

## Run Locally

1. Start the backend server (required for Spotify authentication):
   ```bash
   node server.js
   ```
   The backend runs on http://localhost:3000

2. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```
   The frontend runs on http://localhost:8080

3. Open http://localhost:8080 in your browser

## Usage

1. Click "Login with Spotify" to authenticate
2. Select a CD from the collection
3. Use the play/pause controls to manage playback
4. The 3D CD will rotate while playing
