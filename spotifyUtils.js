const axios = require('axios');
const qs = require('qs');

async function exchangeCodeForTokens(code) {
  const tokenUrl = 'http://accounts.spotify.com/api/token';
  const body = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  };

  try {
    const response = await axios.post(tokenUrl, qs.stringify(body), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // return an object with access_token, refresh_token, expires_in
    return response.data;
  } catch (error) {
    console.error('Error exchanging code for tokens', error.response ? error.response.data : error);
    throw new Error('Error exchanging code for tokens');
  }
}

async function getUserInfo(accessToken) {
  const userUrl = 'https://api.spotify.com/v1/me';

  try {
    const response = await axios.get(userUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // return the user info
    return response.data;
  } catch (error) {
    console.error('Error getting user info', error.response.data);
    throw new Error('Error getting user info');
  }
}

function calculateTokenExpiry(expiresIn) {
  const currentTime = new Date();
  const expiryTime = new Date(currentTime.getTime() + expiresIn * 1000);
  return expiryTime;
}

module.exports = { exchangeCodeForTokens, getUserInfo, calculateTokenExpiry };