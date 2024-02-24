// Fetches the user profile from the database
async function fetchUserProfile(spotifyID) {
    try {
        const userProfileData = await Quiz.findOne({ spotifyID: spotifyID });
        return userProfileData ? convertToAlgorithmFormat(userProfileData.songs) : null;
        console.log('User profile fetched successfully');
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

// Converts the user profile data to the format required by the algorithm
function convertToAlgorithmFormat(songs) {
    return songs.map(song => ({
        hsl: {
            hue: song.colourHue,
            saturation: song.colourSaturation,
            lightness: song.colourLightness,
        },
        musicFeatures: {
            energy: song.energy,
            danceability: song.danceability,
            valence: song.valence,
        }
    }));
}

// Calculates the Euclidean distance between two colours
function colourDistance(hsl1, hsl2) {
    let hueDistance = Math.min(Math.abs(hsl1.hue - hsl2.hue), 360 - Math.abs(hsl1.hue - hsl2.hue));
    let saturationDistance = Math.abs(hsl1.saturation - hsl2.saturation);
    let lightnessDistance = Math.abs(hsl1.lightness - hsl2.lightness);

    return Math.sqrt(hueDistance ** 2 + saturationDistance ** 2 + lightnessDistance ** 2);
}

// Determines the two closest colours to the selected colour and calculates the weighted sum of their music features
function findClosestColour(userProfile, selectedHSL) {
    const distances = userProfile.map(profile => ({
        distance: colourDistance(profile.hsl, selectedHSL),
        features: profile.musicFeatures
    }));
    const twoClosest = distances.sort((a, b) => a.distance - b.distance).slice(0, 2);

    let weightedSumFeatures = { energy: 0, danceability: 0, valence: 0 };
    let totalWeight = 0;

    twoClosest.forEach(item => {
        let weight = 1 / (item.distance + 2);
        totalWeight += weight;

        weightedSumFeatures.energy += item.features.energy * weight;
        weightedSumFeatures.danceability += item.features.danceability * weight;
        weightedSumFeatures.valence += item.features.valence * weight;
    });

    if (totalWeight === 0) totalWeight = 1;

    return {
        energy: (weightedSumFeatures.energy / totalWeight).toPrecision(2),
        danceability: (weightedSumFeatures.danceability / totalWeight).toPrecision(2),
        valence: (weightedSumFeatures.valence / totalWeight).toPrecision(2)
    };
}

async function getInterpolatedMusicFeatures(spotifyID, selectedHSL) {
    const userProfile = await fetchUserProfile(spotifyID);
    if (!userProfile) {
        throw new Error('User profile not found');
    }
    return findClosestColour(userProfile, selectedHSL);
}

module.exports = { getInterpolatedMusicFeatures };

