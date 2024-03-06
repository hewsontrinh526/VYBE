// load env variables from .env
require('dotenv').config();

// various modules needed
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const qs = require('qs');
const path = require('path');
const cors = require('cors');

// models and utility functions
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Playlist = require('./models/Playlist');
const {
	exchangeCodeForTokens,
	getUserInfo,
	calculateTokenExpiry,
	refreshSpotifyAccessToken,
} = require('./spotifyUtils');
const {
	fetchUserProfile,
	findClosestColour,
	fetchUserAccessToken,
} = require('./algorithm');
const { createPlaylist } = require('./playlist');

// init express app
const app = express();
const port = 3500;

// connecting to mongoDB
mongoose
	.connect('mongodb://localhost:27017/VYBE')
	.then(() => console.log('MongoDB connected...'))
	.catch((err) => console.error(err));

// middlewares
// for parsing application/json
app.use(express.json());
// enable CORS for all routes
app.use(cors());

// use the static files from the react app build directory
app.use(express.static(path.join(__dirname, 'client/build')));

// endpoint /api/auth/url for the spotifyAuthUrl
app.get('/api/auth/url', (req, res) => {
	const scopes = [
		'user-read-private', // read access to sub details
		'user-library-read', // read access to user's library
		'user-read-recently-played', // read access to user's recently played
		'playlist-modify-public', // write access to user's public playlists
		'playlist-modify-private', // write access to user's private playlists
		'ugc-image-upload', // write access to user's image uploads
	].join(' ');

	// constructing url for spotify's auth page
	const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${qs.stringify(
		{
			response_type: 'code',
			client_id: process.env.SPOTIFY_CLIENT_ID,
			scope: scopes,
			redirect_uri: process.env.REDIRECT_URI,
			show_dialog: true,
		}
	)}`;
	res.json({ spotifyAuthUrl });
});

// refreshes the new access and refresh tokens for the user
async function updateTokensForUser(user, tokens) {
	user.accessToken = tokens.access_token;
	if (tokens.refresh_token) {
		user.refreshToken = tokens.refresh_token;
	}
	user.tokenExpiry = calculateTokenExpiry(tokens.expires_in);
	await user.save();
}

// commenting out to test the simple callback above works
// route for spotify callback
app.get('/callback', async (req, res) => {
	// code from the query parameters
	const code = req.query.code;
	// exchange the code for tokens here
	const spotifyTokens = await exchangeCodeForTokens(code);

	// retrieve user info using access token
	const userInfo = await getUserInfo(spotifyTokens.access_token);

	// find existing user in the database
	let user = await User.findOne({ spotifyID: userInfo.id });

	// create a new user if they don't already exist
	if (!user) {
		user = new User({
			spotifyID: userInfo.id,
			accessToken: spotifyTokens.access_token,
			refreshToken: spotifyTokens.refresh_token,
			tokenExpiry: calculateTokenExpiry(spotifyTokens.expires_in),
		});
		// save new user to db
		await user.save();
		console.log('New user created:', user);
	} else {
		// update user's existing tokens
		user.accessToken = spotifyTokens.access_token;
		user.refreshToken = spotifyTokens.refresh_token;
		user.tokenExpiry = calculateTokenExpiry(spotifyTokens.expires_in);
		// save updated user info
		await user.save();
		console.log('User info updated:', user);
	}

	quizCount = await Quiz.countDocuments({ spotifyID: user.spotifyID });
	const quizCompleted = quizCount > 0;

	const redirectUri = `http://localhost:3500/app/spotify-callback?access_token=${spotifyTokens.access_token}&spotify_id=${userInfo.id}&quiz_completed=${quizCompleted}`;
	res.redirect(redirectUri);
});

function authenticateToken(req, res, next) {
	const token =
		(req.headers.authorization && req.headers.authorization.split(' ')[1]) ||
		null;
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.SPOTIFY_CLIENT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

// route handler for GET /api/token in the client cred grant flow
// gets a token for the Spotify Web Playback SDK
app.get('/api/token', async (req, res) => {
	// url we send request to get token
	const tokenUrl = 'https://accounts.spotify.com/api/token';

	// Auth credentials for Spotify within the client credientials auth flow
	const credentials = Buffer.from(
		`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
	).toString('base64');

	try {
		// axois POST to spotify accounts ervice
		const response = await axios({
			method: 'post',
			url: tokenUrl,
			headers: {
				Authorization: `Basic ${credentials}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			// data sent in the request
			data: qs.stringify({
				grant_type: 'client_credentials',
			}),
		});
		// on success, send the access token and expiration time back to the client
		// client can use token to make requests to the Web API
		res.json({
			access_token: response.data.access_token,
			expires_in: response.data.expires_in,
		});
	} catch (error) {
		console.error('Error getting client creds token:', error);
		res.status(500).send('Error getting client creds token');
	}
});

// Using refresh token to update access token
app.get('/api/refresh', async (req, res) => {
	const userId = req.query.userId;

	try {
		const result = await refreshSpotifyAccessToken(userId);
		console.log('User access token updated:', result);
		res.json(result);
	} catch (error) {
		console.error('Error refreshing token:', error);
		res.status(500).json({ error: 'Error refreshing token' });
	}
});

app.get('/user/spotifyID', authenticateToken, (req, res) => {
	try {
		res.json({ spotifyID: req.user.spotifyID }); // Send the Spotify user ID as JSON response
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Saving quiz to database
app.post('/quiz/save', async (req, res) => {
	const quizData = req.body; // Use the body of the request directly
	try {
		const newQuiz = new Quiz(quizData);
		await newQuiz.save();
		res.send('Quiz saved successfully');
	} catch (error) {
		console.error('Error saving quiz:', error);
		res.status(500).send('Error saving quiz');
	}
});

// Executing Algorithm
app.post('/quiz/algo', async (req, res) => {
	const { spotifyID, selectedHSL } = req.body;

	try {
		// Fetch the user profile using the Spotify ID
		const userProfile = await fetchUserProfile(spotifyID);
		const userAccessToken = await fetchUserAccessToken(spotifyID);

		// If no user profile is found, send an appropriate response
		if (!userProfile) {
			return res.status(404).json({ message: 'User profile not found' });
		} else if (!userAccessToken) {
			return res.status(404).json({ message: 'User access token not found' });
		}

		// Calculate the interpolated music features based on the closest colour
		const interpolatedFeatures = await findClosestColour(
			userProfile,
			selectedHSL,
			userAccessToken
		);
		console.log('Interpolated Music Features:', interpolatedFeatures);

		// Send the interpolated music features as a response
		res.json(interpolatedFeatures);
	} catch (error) {
		console.error('Error executing algorithm:', error.message);
		res.status(500).json({ message: 'Error executing algorithm' });
	}
});

app.post('/playlist/create/', async (req, res) => {
	try {
		const result = await createPlaylist(req.body); // Pass the entire body to the function
		res.status(200).json(result);
	} catch (error) {
		console.error('Error creating playlist:', error);
		res.status(500).send('Error creating playlist');
	}
});

app.post('/playlist/save/', async (req, res) => {
	const { spotifyID, playlist } = req.body; // Extracts the SpotifyID and playlist data from request

	try {
		// Attempts to find any existing user in the playlist collection
		const userData = await Playlist.findOne({ spotifyID: spotifyID });

		if (userData) {
			const newPlaylistEntry = {
				playlistID: playlist.playlistID,
				colourHue: playlist.colourHue,
				colourSaturation: playlist.colourSaturation,
				colourLightness: playlist.colourLightness,
			};

			userData.playlist.push(newPlaylistEntry); // If found, add the new playlist to the existing user's playlist array
			await userData.save(); // Save the updated user data
			res.send('Playlist saved successfully');
		} else {
			let newPlaylist = new Playlist({
				spotifyID: spotifyID,
				playlist: [
					{
						playlistID: playlist.playlistID,
						colourHue: playlist.colourHue,
						colourSaturation: playlist.colourSaturation,
						colourLightness: playlist.colourLightness,
					},
				],
			});
			await newPlaylist.save();
			res.send('New playlist saved successfully');
		}
	} catch (error) {
		console.error('Error saving playlist:', error);
		res.status(500).send('Error saving playlist');
	}
});

app.post('/playlist/fetch/', async (req, res) => {
	const { spotifyID } = req.body; // Client will send Spotify ID and access token

	if (!spotifyID) {
		return res.status(400).json({ error: 'Missing required SpotifyID' });
	}

	try {
		const userPlaylist = await Playlist.findOne({
			spotifyID: spotifyID,
		}).exec();

		if (!userPlaylist) {
			return res
				.status(404)
				.json({ error: 'No playlists found for this user' });
		}

		res.json(userPlaylist.playlist);
	} catch (error) {
		console.error('Error fetching playlists:', error);
		res.status(500).json({ error: 'Error fetching playlists' });
	}
});

// fallback to serve react app for any other routes
app.get('/app/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// drop quizzes collection to redo quiz
app.post('/home/drop', async (req, res) => {
	const { spotifyID } = req.body;

	try {
		const userData = await Quiz.findOne({ spotifyID: spotifyID });
		if (userData) {
			await Quiz.collection.drop();
			res.send('Quiz collection dropped successfully');
		} else {
			res.status(404).send('User data not found');
		}
	} catch (error) {
		console.error('Error dropping quiz collection:', error);
		res.status(500).json({ error: 'Error fetching playlists' });
	}
});

// start the server
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
