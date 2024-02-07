require('dotenv').config();
const express = require('express');
const axios = require('axios');
const qs = require('qs');

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});