const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    spotifyID: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    tokenExpiry: { type: Date, required: true },
});

module.exports = mongoose.model('User', userSchema);
