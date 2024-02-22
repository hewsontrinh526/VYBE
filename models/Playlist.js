const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    spotifyID: { type: String, required: true, ref: 'User' },
    playlistID: [{ type: String, required: true}]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;