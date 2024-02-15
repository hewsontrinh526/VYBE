/* Colour Distance Calculation
Used to find the distance between two colours such
that we can find the closest colour to a given colour */

function colourDistance(hsl1, hsl2) {
    /* This function takes two colours in HSL format and returns the distance between them
    The distance is found for every single point such that we can find the closest to
    the given colour */

    let hueDistance = Math.min(Math.abs(hsl1.hue - hsl2.hue), 360 - Math.abs(hsl1.hue - hsl2.hue));
    let saturationDistance = Math.abs(hsl1.saturation - hsl2.saturation);
    let lightnessDistance = Math.abs(hsl1.lightness - hsl2.lightness);

    // Uses Euclidean distance formula to calculate the distance between two colours
    // Similar to Pythagoras' theorem
    return Math.sqrt(hueDistance ** 2 + saturationDistance ** 2 + lightnessDistance ** 2);
}

/* Function to find the closest colour association, uses the colourDistance
function to find the closest colour to the given colour

This function will assume that the 'userProfile' is an array of objects each with
hsl values (object with 'h', 's', 'l' properties) and a 'musicFeatures' values (object
with 'energy', 'danceability', 'valence' properties) */

function findClosestColour(userProfile, selectedHSL) {
/* The function considers the user's profile and the selected colour*/

    // Calculates the distance from the selected colour to each colour in the
    // user's profile and includes all the profile entries in the interpolation process
    const distances = userProfile.map(profile => ({
        distances: colourDistance(profile.hsl, selectedHSL),
        features: profile.musicFeatures
    }));

    /* Instead of finding the closest colour and using its associated features, this
    weightedSumFeatures function will calculate the weighted sum of all the music
    features in the profile based on their distance to the selected colour. This
    weighting mechanism inversely relates the distance to the weightl; such that
    closer colours have more influence on the final music features. There is also
    an adjustment of +1 to avoid division by zero on the of-chance there is a
    division by zero */

    // Finds the two closest colours to the selected colour
    const twoClosest = distances.sort((a, b) => a.distance - b.distance).slice(0, 2);

    let weightedSumFeatures = { energy: 0, valence: 0, danceability: 0 };
    let totalWeight = 0;

    // Calculate the weighted sum for all colours of features and total weight
    /* distances.forEach(item => {
        let weight = 1 / (item.distances + 1); // Added 1 to avoid division by 0
        totalWeight += weight; */

    // Calculate the weighted sum of features for only the two closest colours
    twoClosest.forEach(item => {
        // We can have multiple weighting mechanisms. Each one does a slightly
        // different things.

        /* let weight = Math.exp(-alpha * item.distance);
        // Expoential weighting where alpha is a parameter that can control how
        // quickly the weight decreases with distance. A higher alpha value will
        // mean the weight drops off more rapidly with distance making the algorithm
        // more sensitive to small differences in distances */

        /* let weight = 1 / Math.pow(item.distance + 1, beta);
        // Power weighting. The beta parameter controls the influence of further
        // colours from the selected colour. When beta > 1, the influence of further
        // colours decreases more sharply. */

        /* let weight = Math.exp(-Math.pow(item.distance, 2) / (2 * sigma * sigma));
        // The Guassian weighting can be use to model weights such that the influence
        // of colours follows a bell curve relative to their distance. The method
        // provides a smooth transition in the influence of colours, with a
        // controllable rate of decrease.

        // The sigma parameter controls the spread of the bell curve. Smaller
        // sigma values will concentrate the influence around colours that are
        // very close to the selected colour, whereas larger values will allow
        // for a broader range of influence. */

        let weight = 1 / (item.distance + 1); // Still adding 1 to avoid division by zero
        totalWeight += weight;

        weightedSumFeatures.energy += item.features.energy * weight;
        weightedSumFeatures.valence += item.features.valence * weight;
        weightedSumFeatures.danceability += item.features.danceability * weight;
    });

    // Check to prevent division by zero in the case totalWeight is extremely
    // close to zero

    if (totalWeight === 0) {
        totalWeight = 1; // Set to 1 to avoid division by zero
    }

    // Calculate the weighted average of the music features
    const interpolatedFeatures = {
        energy: (weightedSumFeatures.energy / totalWeight).toPrecision(3),
        valence: (weightedSumFeatures.valence / totalWeight).toPrecision(3),
        danceability: (weightedSumFeatures.danceability / totalWeight).toPrecision(3)
    };

    return interpolatedFeatures
}

module.exports = { colourDistance, findClosestColour };
