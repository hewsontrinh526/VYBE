// http client for making requests
const axios = require('axios');
// querystring for parsing and stringifying
const qs = require('qs');

// exchange authorisation code for access and refresh tokens
async function exchangeCodeForTokens(code) {
  // send POST request with data below
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const body = {
    // requesting tokens with an auth code
    grant_type: 'authorization_code',
    // auth code recieved
    code: code,
    // redirect uri after auth (same as spotify dev dashboard)
    redirect_uri: process.env.REDIRECT_URI,
    // creds from spotify
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  };

  try {
    const response = await axios.post(tokenUrl, qs.stringify(body), {
      headers: {
        // request content required by spotify
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

// retrieves current user's info from spotify using access token
async function getUserInfo(accessToken) {
  // send a GET request
  const userUrl = 'https://api.spotify.com/v1/me';

  try {
    const response = await axios.get(userUrl, {
      headers: {
        // authenticates the request with this header
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // return the user info, e.g. spotify ID, display name, sub type, etc.
    // depends on scopes included
    return response.data;
  } catch (error) {
    console.error('Error getting user info', error.response.data);
    throw new Error('Error getting user info');
  }
}

// calculates expiry time of access token based on current time and "expires_in"
// expires_in = lifespan of access token in seconds provided by spotify
function calculateTokenExpiry(expiresIn) {
  // retrieve current date and time
  const currentTime = new Date();
  // add expires_in duration to current time. Converted to milliseconds
  const expiryTime = new Date(currentTime.getTime() + expiresIn * 1000);
  return expiryTime;
}

module.exports = { exchangeCodeForTokens, getUserInfo, calculateTokenExpiry };