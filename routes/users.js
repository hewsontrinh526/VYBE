const express = require('express');
const colourToMusicFeatures = require('./colourToMusicFeatures');

const app = express();

app.post('/quiz_submission', function (req, res) {
    const { userID, colourPreferences } = req.body;
    // process the quiz results
    colourToMusicFeatures.saveUserPreferences(userID, colourPreferences);
    // send response to user
});

app.get('/generate_platlist/:colour', function(req, res) {
    const { colour } = req.params;
    const accessToken = await getUserSpotifyAccessToken(req.userID);
    // ^^^ Needs a function to get the user's Spotify access token
    // Access Token, possibly Chelsey is completing?

    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    // ^^^ Access token use in the authorisation header

    // Make a request ot Spotify API with headers
    try {
        const returnTracks = await axios.get(
            `https://api.spotify.com/v1/recommendations?seed_genres=pop&target_
            energy=${energy}&target_danceability=${danceability}&target_
            valence=${valence}`, { headers });
            // Processes the Spotify data and generate a playlist based on colour
    } catch (error) {
        // Handle errors
    }
})