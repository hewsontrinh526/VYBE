/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import ColourSelect from './ColourSelect';

const trackIds = [
	'4eHbdreAnSOrDDsFfc4Fpm', // i will always love you
	'5FVd6KXrgO9B3JPmC8OPst', // do i wanna know
	'4PTG3Z6ehGkBFwjybzWkR8', // rick roll
	'7wZUrN8oemZfsEd1CGkbXE', // bleeding love
	'03UrZgTINDqvnUMbbIMhql', // gangnam style
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
		setCurrentTrackIndex((prevIndex) => {
			const nextIndex = prevIndex + 1;
			if (nextIndex < trackIds.length) {
				// if next index is within bounds, set it as the new index
				return nextIndex;
			} else {
				// do not change the current index
				return prevIndex;
			}
		});
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
				<ColourSelect
					playNext={playNext}
					trackId={trackIds[currentTrackIndex]}
				/>
			</div>
		</>
	);
};
export default ColourPlaylist;
