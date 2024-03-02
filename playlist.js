const axios = require('axios');
const qs = require('qs');

async function createPlaylist({ spotifyID, accessToken, features }) {
    // Extracting features
    const { energy, danceability, valence } = features;

    // Settings
    const endpointUrl = "https://api.spotify.com/v1/recommendations?";
    const token = accessToken;
    const seedGenres = ["pop", "alternative", "r-n-b", "rock", "punk"];

    // Filters
    const queryParams = qs.stringify({
        limit: 25,
        seed_genres: seedGenres.join(','), // Example genre, replace or make dynamic as needed
        target_energy: energy,
        target_danceability: danceability,
        target_valence: valence
    });

    // Initialize the uris array for storing track URIs
    let uris = [];

    // Constructing the full query URL
    const query = `${endpointUrl}${queryParams}`;

    try {
        const recommendationsResponse = await axios.get(query, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const tracks = recommendationsResponse.data.tracks;
        console.log('Recommended Songs:');
        tracks.forEach((track, index) => {
            uris.push(track.uri);
            console.log(`${index + 1}) "${track.name}" by ${track.artists[0].name}`);
        });

        // Create a new playlist
        const playlistEndpointUrl = `https://api.spotify.com/v1/users/${spotifyID}/playlists`;

        const playlistResponse = await axios.post(playlistEndpointUrl, {
            name: "Playlist created via Spotify API",
            description: "A programmatically created playlist based on specified features.",
            public: false
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const playlistId = playlistResponse.data.id;
        const playlistUrl = playlistResponse.data.external_urls.spotify;

        // Fills the new playlist with the recommended tracks
        const fillPlaylistEndpointUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

        await axios.post(fillPlaylistEndpointUrl, { uris: uris }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        console.log(`Your playlist is ready at ${playlistUrl}`);
        return {
            playlistId: playlistId,
        };
    } catch (error) {
        console.error("Error in playlist creation:", error);
    }
}

module.exports = { createPlaylist };
