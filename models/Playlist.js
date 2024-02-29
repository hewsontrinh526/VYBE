const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    spotifyID: { type: String, required: true, ref: 'User' },
    playlist: [{
        playlistID: { type: String, required: true },
        colourHue: { type: Number, required: true, min: 0, max: 360 },
        colourSaturation: { type: Number, required: true, min: 0, max: 100 },
        colourLightness: { type: Number, required: true, min: 0, max: 100 },
    }]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;