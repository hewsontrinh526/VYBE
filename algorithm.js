const axios = require('axios');
const Quiz = require("./models/Quiz");
const User = require("./models/User");

// This works as expected. Access token needs to be updated though
const fetchTrackFeatures = async (trackId, userAccessToken) => {
    const url = `https://api.spotify.com/v1/audio-features/${trackId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${userAccessToken}`,
            },
        });
        const trackFeatures = response.data;

        // Transforming the response into the desired format
        const musicFeatures = {
            energy: trackFeatures.energy,
            danceability: trackFeatures.danceability,
            valence: trackFeatures.valence,
        };
        // console.log(musicFeatures);
        return musicFeatures;
        // Now, 'musicFeatures' contains the data in the specified format:
    } catch (error) {
        console.error(`Error fetching track features: ${error.message}`);
    }
};

// Fetches the user profile from the quiz collection and returns the songs array
async function fetchUserProfile(spotifyID) {
    try {
        const userProfileData = await Quiz.findOne({ spotifyID: spotifyID });
        if (userProfileData) {
            console.log('User profile fetched successfully');
            return userProfileData.songs;
        } else {
            console.log('User profile not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

// Fetches the user profile access token from the user table
async function fetchUserAccessToken(spotifyID) {
    try {
        const user = await User.findOne({ spotifyID: spotifyID });
        if (user) {
            console.log('Access token fetched successfully');
            return user.accessToken; // Return the access token directly
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
}

// Calculates the Euclidean distance between two colours
function colourDistance(hsl1, hsl2) {
    let hueDistance = Math.min(Math.abs(hsl1.hue - hsl2.hue), 360 - Math.abs(hsl1.hue - hsl2.hue));
    let saturationDistance = Math.abs(hsl1.saturation - hsl2.saturation);
    let lightnessDistance = Math.abs(hsl1.lightness - hsl2.lightness);

    return Math.sqrt(hueDistance ** 2 + saturationDistance ** 2 + lightnessDistance ** 2);
}

// Determines the two closest colours to the selected colour and calculates the weighted sum of their music features
async function findClosestColour(userProfile, selectedHSL, userAccessToken) {
    const distances = userProfile.map(profile => {
        const hsl = {
            hue: profile.colourHue,
            saturation: profile.colourSaturation,
            lightness: profile.colourLightness
        };
        return {
            distance: colourDistance(hsl, selectedHSL),
            trackID: profile.trackID
        };
    });

    const twoClosest = distances.sort((a, b) => a.distance - b.distance).slice(0, 2);

    // Use an array to store the promises
    const trackFeaturesPromises = twoClosest.map(closest => fetchTrackFeatures(closest.trackID, userAccessToken));

    // Wait for all promises to resolve
    const trackFeatures = await Promise.all(trackFeaturesPromises);

    // console.log(trackFeatures);
    // console.log(twoClosest);

    const combinedData = trackFeatures.map((feature, index) => ({
        ...feature, // Spread the properties of the feature object
        ...twoClosest[index] // Spread the properties of the corresponding object from twoClosest
    }));

    // console.log(combinedData);

    let weightedSumFeatures = { energy: 0, danceability: 0, valence: 0 };
    let totalWeight = 0;

    combinedData.forEach(item => {
        let weight = 1 / (item.distance + 2);
        totalWeight += weight;

        weightedSumFeatures.energy += item.energy * weight;
        weightedSumFeatures.danceability += item.danceability * weight;
        weightedSumFeatures.valence += item.valence * weight;
    });

    // console.log(weightedSumFeatures);
    // console.log(totalWeight);

    if (totalWeight === 0) totalWeight = 1;

    const averageFeatures = {
        energy: (weightedSumFeatures.energy / totalWeight).toPrecision(3),
        danceability: (weightedSumFeatures.danceability / totalWeight).toPrecision(3),
        valence: (weightedSumFeatures.valence / totalWeight).toPrecision(3)
    }

    // console.log(averageFeatures);

    return averageFeatures;
}

module.exports = { fetchUserProfile, findClosestColour, fetchUserAccessToken };
