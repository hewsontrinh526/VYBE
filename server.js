const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    const spotifyAuthUrl = 'ADD_SPOTIFY_AUTH_URL';
    res.render('login', { spotifyAuthUrl });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});