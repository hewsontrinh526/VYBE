const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    spotifyID: { type: String, required: true, ref: 'User' },
    songs: [{
        colourHue: { type: Number, required: true, min: 0, max: 360 },
        colourSaturation: { type: Number, required: true, min: 0, max: 100 },
        colourLightness: { type: Number, required: true, min: 0, max: 100 },
        energy: { type: Number, required: true, min: 0, max: 1 },
        danceability: { type: Number, required: true, min: 0, max: 1 },
        valence: { type: Number, required: true, min: 0, max: 1 },
    }]
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;