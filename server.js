// load env variables from .env
require('dotenv').config();

// various modules needed
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const qs = require('qs');
const path = require('path');
const cors = require('cors');

// models and utility functions
const User = require('./models/User');
const { exchangeCodeForTokens, getUserInfo, calculateTokenExpiry } = require('./spotifyUtils');

// init express app
const app = express();
const port = 3500;

// middlewares
// for parsing application/json
app.use(express.json())
// enable CORS for all routes
app.use(cors());

// use the static files from the react app build directory
app.use(express.static(path.join(__dirname, 'client/build')));

// endpoint /api/auth/url for the spotifyAuthUrl
app.get('/api/auth/url', (req, res) => {
    const scopes = [
        'user-read-private', // read access to sub details
        'user-library-read', // read access to user's library
        'user-read-recently-played', // read access to user's recently played
        'playlist-modify-public' // write access to user's public playlists
    ].join(' ');

    // constructing url for spotify's auth page
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${qs.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scopes,
        redirect_uri: process.env.REDIRECT_URI,
        show_dialog: true,
    })}`;
    res.json({ spotifyAuthUrl });
});

// simple route to test the callback
app.get('/callback', async (req, res) => {
    const code = req.query.code; // the code from spotify's redirect

    try {
        const spotifyTokens = await exchangeCodeForTokens(code);
        console.log(spotifyTokens);

        // directly redirect to /quiz without checking database
        res.redirect('/app/quiz');
    } catch (error) {
        console.error('Error during code exchange:', error);
    }
})

/* commenting out to test the simple callback above works
// route for spotify callback
app.get('/callback', async (req, res) => {
    // code from the query parameters
    const code = req.query.code;
    // exchange the code for tokens here
    const spotifyTokens = await exchangeCodeForTokens(code);

    // retrieve user info using access token
    const userInfo = await getUserInfo(spotifyTokens.access_token);

    // find existing user in the database
    let user = await User.findOne({ spotifyId: userInfo.id });

    // create a new user if they don't already exist
    if (!user) {
        user = new User({
            spotifyID: userInfo.id,
            accessToken: spotifyTokens.access_token,
            refreshToken: spotifyTokens.refresh_token,
            tokenExpiry: calculateTokenExpiry(spotifyTokens.expires_in)
        });
        // save new user to db
        await user.save();
    } else {
        // update user's existing tokens
        user.accessToken = spotifyTokens.access_token;
        user.refreshToken = spotifyTokens.refresh_token;
        user.tokenExpiry = calculateTokenExpiry(spotifyTokens.expires_in);
        // save updated user info
        await user.save();
    }
    // not yet implemented, waiting on quiz schema
    const userQuizCompleted = async (userId) => {
        const quizCount = await Quiz.countDocuments({ userId: userId });
        return quizCount > 0;
    }
    // not yet implemented, waiting on quiz schema
    const hasCompletedQuiz = await userQuizCompleted(user._id);
    if (hasCompletedQuiz) {
        res.redirect('/app/home');
    } else {
        res.redirect('/app/quiz');
    }
});
*/

// fallback to serve react app for any other routes
app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
