function calculateMusicFeatures(r, g, b) {
    // Normalise and calculate the music features
    // Return an object with energy, danceability and
    // valence (or tempo, depending on what we decide

    // Other suggestions could be to use Gamma Correction for normalisation

    /* const normalised_R = gammaCorrection(r)
    const normalised_G = gammaCorrection(g)
    const normalised_B = gammaCorrection(b) */

    // Normalising the RGB values
    const normalised_R = r / 255;
    const normalised_G = g / 255;
    const normalised_B = b / 255;

    // Adding weights for each feature
    const weights = {
        energy: { r: 0.5, g: 0.3, b: 0.2 },
        danceability: { r: 0.3, g: 0.5, b: 0.2 },
        valence: { r: 0.2, g: 0.3, b: 0.5 }
    };
    // These weights can be changed upon discussion with the team
    // and more features can be added if needed
    // These weights could also be used for different genres if that is within scope

    // Calculating the track features
    let energy =
        normalised_R * weights.energy.r +
        normalised_G * weights.energy.g +
        normalised_B * weights.energy.b;
    let danceability =
        normalised_R * weights.danceability.r +
        normalised_G * weights.danceability.g +
        normalised_B * weights.danceability.b;
    let valence =
        normalised_R * weights.valence.r +
        normalised_G * weights.valence.g +
        normalised_B * weights.valence.b;

    // Applying outlier handling and sigmoid scaling
    energy = sigmoidScale(outlierHandler(energy));
    danceability = sigmoidScale(outlierHandler(danceability));
    valence = sigmoidScale(outlierHandler(valence));

    // Return object with track features
    return { energy, danceability, valence };
}

function gammaCorrection(value, gamma = 2.2) {
    // Gamma correction function
    return Math.pow(value / 255, gamma);
}

function handleOutliers(value) {
    // Outlier handling function, essentially IQR method

    // Outlier handling could be more dynamic for future iterations when
    // there is a data set to work with

    const upperBound = 0.9; // Upper bound for the feature, can be changed if needed
    const lowerBound = 0.1; // Lower bound for the feature, can be changed if needed

    if (value > upperBound) {
        return upperBound;
    } else if (value < lowerBound) {
        return lowerBound;
    } else {
        return value;
    }
}

function sigmoidScale(value, steepness = 1, midpoint = 0) {
    // Sigmoid scaling function

    // Steepness: Higher steepness means that small changes in RGB values can
    // lead to larger changes in the calculated music features, especially around
    // the midpoint of the function. This could be use if we were to ever
    // implement a colour wheel. A smaller steepness value i.e. < 1, would mean
    // that small differences in the RGB values would lead to smaller changes in
    // the music features, i.e. different shades of blue

    // Midpoint: Moving the midpoint shifts the range of the RGB values that
    // result in a moderate music feature value. Setting the midpoint to 0
    // essentially means that this is the point at which I expect the transition
    // from low to high in the musical feature to start becoming more noticeable

    return 1 / (1 + Math.exp(-steepness * (value - midpoint)));
}

/* saveUserPreferences: function(userID, colourPreferences) {
    // Save the user's colour preferences to the database
}

getUserPreferences: function(userID) {
    // Retrieve the user's colour preferences from the database
} */
