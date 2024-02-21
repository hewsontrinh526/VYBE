/* eslint-disable */
import React, { Component } from 'react';
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

class ColourPlaylist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTrackIndex: 0,
			token:
				'BQABLWsmV-ZoxcXNPKqjRFHvL_dgYfBM5TiLpfGO_a9vwOfavQQSIfAtq6Wy7rRaxbbUaTSHkg00Q5Cd5-KYAAKEJecBNCo6z8pHsXdBMjdqCDVpUC-PJaV4yPd-tSTUtUHNYBvJNeWl9ME0vfYPyJj19wTDgL8mOkpwV6BddrCxrGNoDtzLixPZI3HdBbPKakgXWRXvmjTQJfJGR0-F9-UnWgQ-',
		};
		this.playNext = this.playNext.bind(this);
	}

	playNext() {
		this.setState((prevState) => ({
			currentTrackIndex: (prevState.currentTrackIndex + 1) % trackIds.length,
		}));

		// console.log('Function ran in Child');
	}

	componentDidMount() {
		window.onSpotifyWebPlaybackSDKReady = () => {
			const { token } = this.state;
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
	}

	// useEffect(() => {
	// 	console.log(`playlistRef: ${playlistRef}`);
	// }, [playlistRef]);

	render() {
		return (
			<>
				<div className={styles['spotify-container']}>
					<iframe
						src={`https://open.spotify.com/embed/track/${
							trackIds[this.state.currentTrackIndex]
						}`}
						width='450'
						height='200'
						frameBorder='0'
						allowtransparency='true'
						allow='encrypted-media'
					></iframe>
					<button className={styles['square-7']} onClick={this.playNext}>
						Next Song
					</button>
				</div>
				<div>
					<TrackFeatures trackId={trackIds[this.state.currentTrackIndex]} />
					<ColourSelect playNext={this.playNext} />
					{/* <ColourSelect setCurrentTrackIndex={setCurrentTrackIndex} /> */}
				</div>
			</>
		);
	}
}
export default ColourPlaylist;
