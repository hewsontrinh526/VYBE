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

    let weightedSumFeatures = { energy: 0, valence: 0, danceability: 0 };
    let totalWeight = 0;

    // Calculate the weighted sum of features and total weight
    distances.forEach(item => {
        let weight = 1 / (item.distances + 1); // Added 1 to avoid division by 0
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
        energy: weightedSumFeatures.energy / totalWeight,
        valence: weightedSumFeatures.valence / totalWeight,
        danceability: weightedSumFeatures.danceability / totalWeight
    };

    return interpolatedFeatures
}