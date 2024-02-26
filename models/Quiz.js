const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    spotifyID: { type: String, required: true, ref: 'User' },
    songs: [{
        trackID: { type: String, required: true },
        colourHue: { type: Number, required: true, min: 0, max: 360 },
        colourSaturation: { type: Number, required: true, min: 0, max: 100 },
        colourLightness: { type: Number, required: true, min: 0, max: 100 },
    }]
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;