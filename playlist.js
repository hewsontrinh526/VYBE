const axios = require('axios');
const qs = require('qs');
const colorNamer = require('color-namer');
const hslToHex = require('@davidmarkclements/hsl-to-hex');
const { getImageBase64 } = require('./playlistArt');
const { base } = require('./models/User');

async function createPlaylist({ spotifyID, accessToken, features, selectedColourName }) {
    // Extracting features
    const { energy, danceability, valence } = features;

    // Settings
    const endpointUrl = "https://api.spotify.com/v1/recommendations?";
    const token = accessToken;
    const seedGenres = ["pop", "rap", "hip-hop", "rock", "dance-pop"];

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
            name: `VYBE: ${selectedColourName} ${new Date().toLocaleDateString('en-AU')}`,
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

        // Get the base64 image for the playlist cover
        if (playlistId) {
            // try upload chex
            try {
                const base64Image = await getImageBase64();
                if (!base64Image) {
                    console.error('Error getting base64 image');
                    return;
                }
                const imageUrl = `https://api.spotify.com/v1/playlists/${playlistId}/images`;
                await axios.put(imageUrl, base64Image, {
                    headers:  {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "image/jpeg"
                    }
            });
            console.log('Playlist cover uploaded');
        } catch (error) {
            console.error('Error uploading playlist cover:', error);
        }
    }
        console.log(`Your playlist is ready at ${playlistUrl}`);
        return {
            playlistId: playlistId,
        };
    } catch (error) {
        console.error("Error in playlist creation:", error);
    }
}

module.exports = { createPlaylist };