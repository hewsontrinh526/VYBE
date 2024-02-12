require('dotenv').config();
const express = require('express');
const axios = require('axios');
const qs = require('qs');
const User = require('./models/User');
const { exchangeCodeForTokens, getUserInfo, calculateTokenExpiry } = require('./spotifyUtils');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    const scopes = [
        'user-read-private',
        'user-library-read',
        'user-read-recently-played',
        'playlist-modify-public'
    ].join(' ');

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${qs.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scopes,
        redirect_uri: process.env.REDIRECT_URI,
        show_dialog: true,
    })}`;
    res.render('login', { spotifyAuthUrl });
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const spotifyTokens = await exchangeCodeForTokens(code);

    const userInfo = await getUserInfo(spotifyTokens.access_token);

    let user = await User.findOne({ spotifyId: userInfo.id });

    // create a new user if they don't exist
    if (!user) {
        user = new User({
            spotifyID: userInfo.id,
            accessToken: spotifyTokens.access_token,
            refreshToken: spotifyTokens.refresh_token,
            tokenExpiry: calculateTokenExpiry(spotifyTokens.expires_in)
        });
        await user.save();
    } else {
        // update user's existing tokens
        user.accessToken = spotifyTokens.access_token;
        user.refreshToken = spotifyTokens.refresh_token;
        user.tokenExpiry = calculateTokenExpiry(spotifyTokens.expires_in);
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
        res.redirect('/home');
    } else {
        res.redirect('/quiz');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
