/* eslint-disable */
import React, { useEffect } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
// import PlayNext from './PlayNext';

function PlaylistDisplay() {
	useEffect(() => {
		window.onSpotifyWebPlaybackSDKReady = () => {
			const token =
				'BQAd6omlDxJL4NZltYbTtx5FYaz3a50XaZ-Am90eiuTKDOknguFYFoNSr1hhrpuHZtf0IPS1RNAXQ97EBZI-7AGkpszgqKayvf8EtVLL13T5nJwnbC_WeuvrhxlIgLDvbiwRDXZBIvToOWJ_ynm8uYTKzU4w0X8e7pHl8cxiEsyfGrdRe4tFaecqAoKQJ7i-BVxer32ZJBY2SSNEcSBL32Dp-8pj';
			const player = new Spotify.Player({
				name: 'Web Playback SDK Quick Start Player',
				getOAuthToken: (cb) => {
					cb(token);
				},
				volume: 0.5,
			});

			// Ready
			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
				PlayNext(0);
			});

			// Not Ready
			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});

			player.addListener('initialization_error', ({ message }) => {
				console.error(message);
			});

			player.addListener('authentication_error', ({ message }) => {
				console.error(message);
			});

			player.addListener('account_error', ({ message }) => {
				console.error(message);
			});

			player.connect();
		};
	});
	return (
		<div className='playlist-container'>
			<header className={styles['header']}>
				<div className='container-logo'>
					<img src='/logo.png' alt='logo' className='logo' />
				</div>
			</header>
			<div className={styles['spotify-container']}>
				<iframe
					src='https://open.spotify.com/embed/track/4PTG3Z6ehGkBFwjybzWkR8'
					width='450'
					height='200'
					frameBorder='0'
					allowtransparency='true'
					allow='encrypted-media'
				></iframe>
				{/* <button id='togglePlay'>Toggle Play</button> */}
			</div>
			{/* <div className={styles['playlist']}>
				<h1 id='playlistName'>Song Name</h1>
				<h2>Artist</h2>{' '}
			</div> */}
		</div>
	);
}

export default PlaylistDisplay;
