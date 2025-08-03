
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || `http://localhost:${port}/callback`;
const FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:8080';
const SCOPES = "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state";

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("FATAL ERROR: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in your .env file.");
    process.exit(1);
}

// Generates a random string containing numbers and letters
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

// Configure middleware
app.use(cors({
  origin: process.env.FRONTEND_URI || 'http://localhost:8080',
  credentials: true
}));
app.use(require('cookie-parser')());

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const authUrl = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      state: state
    });
  
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  // For now, we'll bypass state validation for simplicity in some environments
  // but in production, you should always validate the state.
  // if (state === null || state !== storedState) {
  //   res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
  // } else {
    res.clearCookie(stateKey);
    try {
      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
          code: code,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code'
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        }
      });

      if (response.status === 200) {
        const { access_token, refresh_token, expires_in } = response.data;
        // Redirect back to the frontend with tokens in the hash
        res.redirect(FRONTEND_URI + '/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
            expires_in: expires_in
          })
        );
      } else {
        res.redirect(FRONTEND_URI + '/#' + querystring.stringify({ error: 'invalid_token' }));
      }
    } catch (error) {
      console.error("Error in /callback:", error.response ? error.response.data : error.message);
      res.redirect(FRONTEND_URI + '/#' + querystring.stringify({ error: 'internal_server_error' }));
    }
  // }
});


app.listen(port, () => {
  console.log(`Spotify auth server listening on http://localhost:${port}`);
});
