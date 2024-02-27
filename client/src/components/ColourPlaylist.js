/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import TrackFeatures from './ColourTrackFeats';
import ColourSelect from './ColourSelect';

const trackIds = [
	'4PTG3Z6ehGkBFwjybzWkR8', // rick roll - e: high v: high
	'54X78diSLoUDI3joC2bjMz', // purple rain - e: mod v: mod
	'3M8FzayQWtkvOhqMn2V4T2', // lean on me - e: low v: high
	'3FAclTFfvUuQYnEsptbK8w', // back to black - e: low v: low
	'6JY1IdkZGeIcPegKxjSKeb', // since u been gone e: - high v: low
];

const ColourPlaylist = () => {
	useEffect(() => {
		window.onSpotifyWebPlaybackSDKReady = () => {
			const token =
				'BQB9w5uDysJc7Hovp5mG_AN-r0M31ADJ9ckXuKqbURHFaTyjsw3Sp1I6Hn9FwfttO3RsLZzDeHsqDFUzdO-HG2JwLgkzxelrVCF6H_IgBpqsV5IsJmO6OgXNLJNr4WvH25ypjisSFKTpbg7snYPxilZtzhPm9HE70CIjhn6OmwaVHrURuARcbkdlnpXCQ_L2aXTCxnzozCdxMdjaffZEoM4URozR';
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
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

	const playNext = () => {
		setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % trackIds.length);
	};

	return (
		<>
			<div className={styles['spotify-container']}>
				<iframe
					src={`https://open.spotify.com/embed/track/${trackIds[currentTrackIndex]}`}
					width='100%'
					height='200'
					frameBorder='0'
					allowtransparency='true'
					allow='encrypted-media'
				></iframe>
			</div>
			<div>
				<TrackFeatures trackId={trackIds[currentTrackIndex]} />
				<ColourSelect
					playNext={playNext}
					trackId={trackIds[currentTrackIndex]}
				/>
			</div>
		</>
	);
};
export default ColourPlaylist;
