const mongoose = require('mongoose');

const trackFeatureSchema = new mongoose.Schema({
    colorValue: {
        type: String,
        required: true
    },
    energy: { type: Number, required: true, min: 0, max: 1 },
    danceability: { type: Number, required: true, min: 0, max: 1 },
    valence: { type: Number, required: true, min: 0, max: 1 }
});

const quizSchema = new mongoose.Schema({
    spotifyID: { type: String, required: true, unique: true },
    results: [trackFeatureSchema]
/* }, { timestamps: true }); // Enable timestamps to track creation/update */
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;




/* const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    spotifyID: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    tokenExpiry: { type: Date, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User; */