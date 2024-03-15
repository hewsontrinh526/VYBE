import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SpotifyCallback() {
	const urlParams = new URLSearchParams(window.location.search);
	const accessToken = urlParams.get('access_token');
	const spotifyID = urlParams.get('spotify_id');
	const quizCompleted = urlParams.get('quiz_completed') === 'true';
	const playlistNone = urlParams.get('playlist_none');

	localStorage.setItem('accessToken', accessToken);

	if (spotifyID) {
		localStorage.setItem('spotifyID', spotifyID);
	}

	if (playlistNone !== null) {
		localStorage.setItem('playlistNone', playlistNone);
	}

	const navigate = useNavigate();

	useEffect(() => {
		console.log('URL Params:', window.location.search);
		console.log('Access token stored:', accessToken);
		console.log('Quiz completed:', quizCompleted);
		console.log('Spotify ID stored:', spotifyID);
		console.log('Playlist none:', playlistNone);

		const redirectPath = quizCompleted ? '/app/home' : '/app/prestart';
		navigate(redirectPath, { replace: true });
	}, [navigate, quizCompleted]);
	return null;
}

export default SpotifyCallback;
