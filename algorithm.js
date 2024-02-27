const axios = require('axios');
const Quiz = require("./models/Quiz");

// Hardcoded access token
const token = 'BQCTSW9LsSWyI_qgqKH02jUweiPAXtP6rniA8w5GskAF8uEjlGitID9y2KKJPszG_57Sl5l7wgs2d8_F_Phq1WZrhd6k4FP-D36anYbxdf0oe9dNoUY'

// This works as expected. Access token needs to be updated though
const fetchTrackFeatures = async (trackId) => {
    const url = `https://api.spotify.com/v1/audio-features/${trackId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const trackFeatures = response.data;

        // Transforming the response into the desired format
        const musicFeatures = {
            energy: trackFeatures.energy,
            danceability: trackFeatures.danceability,
            valence: trackFeatures.valence,
        };
        return musicFeatures;
        // Now, 'musicFeatures' contains the data in the specified format:
        console.log(musicFeatures);
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

// Calculates the Euclidean distance between two colours
function colourDistance(hsl1, hsl2) {
    let hueDistance = Math.min(Math.abs(hsl1.hue - hsl2.hue), 360 - Math.abs(hsl1.hue - hsl2.hue));
    let saturationDistance = Math.abs(hsl1.saturation - hsl2.saturation);
    let lightnessDistance = Math.abs(hsl1.lightness - hsl2.lightness);

    return Math.sqrt(hueDistance ** 2 + saturationDistance ** 2 + lightnessDistance ** 2);
}

// Determines the two closest colours to the selected colour and calculates the weighted sum of their music features
async function findClosestColour(userProfile, selectedHSL) {
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
    const trackFeaturesPromises = twoClosest.map(closest => fetchTrackFeatures(closest.trackID));

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
        energy: (weightedSumFeatures.energy / totalWeight).toPrecision(1),
        danceability: (weightedSumFeatures.danceability / totalWeight).toPrecision(1),
        valence: (weightedSumFeatures.valence / totalWeight).toPrecision(1)
    }

    // console.log(averageFeatures);

    return averageFeatures;
}

/* async function main() {
    const userProfile = await fetchUserProfile('1299798826');
    const userTrackIDs = userProfile.map((song) => song.trackID);
    const selectedHSL = {
        hue: 100,
        saturation: 45,
        lightness: 75,
    };
    //console.log(userProfile);
    //console.log(userTrackIDs);
    //for (let i = 0; i < userTrackIDs.length; i++) {
        //await fetchTrackFeatures(userTrackIDs[i]);
    //}
    //console.log(selectedHSL);
    const closestColourResult = await findClosestColour(userProfile, selectedHSL);
    console.log(closestColourResult); // This will now log the result correctly
    mongoose.connection.close();
}

main(); */

module.exports = { fetchUserProfile, findClosestColour };
