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
const Quiz = require('./models/Quiz');
const { exchangeCodeForTokens, getUserInfo, calculateTokenExpiry } = require('./spotifyUtils');

// init express app
const app = express();
const port = 3500;

// connecting to mongoDB 
mongoose.connect('mongodb://localhost:27017/VYBE')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

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
/* app.get('/callback', async (req, res) => {
    const code = req.query.code; // the code from spotify's redirect

    try {
        const spotifyTokens = await exchangeCodeForTokens(code);
        console.log(spotifyTokens);

        // directly redirect to /quiz without checking database
        res.redirect('/app/quiz');
    } catch (error) {
        console.error('Error during code exchange:', error);
    }
}) */

// commenting out to test the simple callback above works
// route for spotify callback
app.get('/callback', async (req, res) => {
    // code from the query parameters
    const code = req.query.code;
    // exchange the code for tokens here
    const spotifyTokens = await exchangeCodeForTokens(code);

    // retrieve user info using access token
    const userInfo = await getUserInfo(spotifyTokens.access_token);

    // find existing user in the database
    let user = await User.findOne({ spotifyID: userInfo.id });

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
        console.log('New user created:', user);
    } else {
        // update user's existing tokens
        user.accessToken = spotifyTokens.access_token;
        user.refreshToken = spotifyTokens.refresh_token;
        user.tokenExpiry = calculateTokenExpiry(spotifyTokens.expires_in);
        // save updated user info
        await user.save();
        console.log('User info updated:', user);
    }
    // not yet implemented, waiting on quiz schema

    /* commenting out while testing wheel
    // Check if the user has completed the quiz
    const quizCount = await Quiz.countDocuments({ spotifyID: user.spotifyID });
    if (quizCount > 0) {
        res.redirect('/app/home'); // Redirect to /app/home if quiz is completed
    } else {
        res.redirect('/app/quiz'); // Redirect to /app/quiz if quiz is not completed
    } catch (error) {
        console.error('Error in quiz count', error);
        res.status(500).send('Error in quiz count');
    }
*/
    /* const userQuizCompleted = async (userId) => {
        const quizCount = await Quiz.countDocuments({ userId: userId });
        return quizCount > 0;
    }
    // not yet implemented, waiting on quiz schema
    const hasCompletedQuiz = await userQuizCompleted(user._id);
    if (hasCompletedQuiz) {
        res.redirect('/app/home');
    } else {
        res.redirect('/app/quiz');
    } */

    // redirect to /app/home for testing purposes
    res.redirect('/app/home');
});

// route handler for GET /api/token in the client cred grant flow
// gets a token for the Spotify Web Playback SDK
app.get('/api/token', async (req, res) => {
    // url we send request to get token
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    // Auth credentials for Spotify within the client credientials auth flow
    const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

    try {
        // axois POST to spotify accounts ervice
        const response = await axios({
            method: 'post',
            url: tokenUrl,
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            // data sent in the request
            data: qs.stringify({
                grant_type: 'client_credentials'
            })
        });
        // on success, send the access token and expiration time back to the client
        // client can use token to make requests to the Web API
        res.json({
            access_token: response.data.access_token,
            expires_in: response.data.expires_in
        });
    } catch (error) {
        console.error('Error getting client creds token:', error);
        res.status(500).send('Error getting client creds token');
    }
});

// Starting the quiz
app.post('/quiz/start', (req, res) => {
    // Initialise the quiz data in the session
    req.session.quizData = {
        spotifyID: req.body.spotifyID,
        results: []
    };
    res.send('Quiz started');
});

// Updating Quiz results
app.post('/quiz/update', (req, res) => {
    // Destructure songData from the request body
    const { songData } = req.body;
    let quizData = req.session.quizData;
    // Retrieves the current quiz data from the session
    const songIndex = quizData.results.findIndex(song => song.title === songData.title);
    // Searches for the index of a song in the results array that matches the songData
    // If found, update the songData, else add the songData to the results array
    if (songIndex > -1) {
        quizData.results[songIndex] = songData;
    } else {
        if (quizData.results.length < 5) {
            quizData.results.push(songData);
        } else {
            return res.status(400).send('Quiz is already full');
        }
    }
    // Sends the updated quiz data back to the session
    req.session.quizData = quizData;
    res.send('Quiz updated successfully');
});


// Saving quiz to database
app.post('/quiz/save', async (req, res) => {
    const quizData = req.body; // Use the body of the request directly
    try {
        const newQuiz = new Quiz(quizData);
        await newQuiz.save();
        res.send('Quiz saved successfully');
    } catch (error) {
        console.error('Error saving quiz:', error);
        res.status(500).send('Error saving quiz');
    }
});

// fallback to serve react app for any other routes
app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
