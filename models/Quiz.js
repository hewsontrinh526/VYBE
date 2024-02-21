const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    spotifyID: { type: String, required: true, ref: 'User'},
    songs: [{
        // songID: { type: String, required: true },
        colorValue: { type: String, required: true }, // HEX, RGB, or HSL value
        energy: { type: Number, required: true, min: 0, max: 1 },
        danceability: { type: Number, required: true, min: 0, max: 1 },
        valence: { type: Number, required: true, min: 0, max: 1 },
    }]
});

const Quiz = mongoose.model('Quiz', quizSchema);