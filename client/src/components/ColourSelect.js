/* eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import ColourSaved from './ColourSaved';
import ColourWheel from './ColourWheel';
import axios from 'axios';

function ColourSelect({ playNext }) {
	let [clickCount, setClickCount] = useState(0);
	const [currentColour, setCurrentColour] = useState({
		hsl: { h: 0, s: 0, l: 0 },
	});
	const [arrayColours, setColourArray] = useState([]);
	const [spotifyID, setSpotifyID] = useState('');
	const navigate = useNavigate();
	const accessToken = localStorage.getItem('accessToken');
	console.log(accessToken);

	const handleColourChange = useCallback((color) => {
		console.log(`Colour: (hue:${color.h}, sat:${color.s}, light:${color.l})`);
		setCurrentColour(color);
		setColourArray((prevArray) => [
			...prevArray,
			{
				colourHue: color.h,
				colourSaturation: color.s,
				colourLightness: color.l,
			},
		]);
		setClickCount((prevCount) => prevCount + 1);
		playNext();
	}, []);

	const trackIds = [
		{ trackId: '4PTG3Z6ehGkBFwjybzWkR8' }, // rick roll
		{ trackId: '54X78diSLoUDI3joC2bjMz' }, // purple rain
		{ trackId: '3M8FzayQWtkvOhqMn2V4T2' }, // lean on me
		{ trackId: '3FAclTFfvUuQYnEsptbK8w' }, // back to black
		{ trackId: '6JY1IdkZGeIcPegKxjSKeb' }, // since u been gone
	];

	useEffect(() => {
		const getSpotifyID = async () => {
			try {
				// const accessToken = localStorage.getItem('accessToken');
				const response = await axios.get('/user/spotifyID', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setSpotifyID(response.data.spotifyID);
			} catch (error) {
				console.error('getSpotifyId error', error);
			}
		};
		getSpotifyID();
	}, []);

	useEffect(() => {
		if (clickCount === 5) {
			setTimeout(() => {
				navigate('/app/loading');
			}, 2000);

			const songs = arrayColours.map((item, index) => ({
				trackID: trackIds[index].trackId,
				colourHue: item.colourHue,
				colourSaturation: item.colourSaturation,
				colourLightness: item.colourLightness,
			}));

			// const spotifyID = 'x70mz3mucf0xukuqjqpv3tepg';

			const quizData = {
				spotifyID: spotifyID,
				songs: songs,
			};

			axios
				.post('/quiz/save', quizData)
				.then((response) => {
					console.log('Data saved successfully:', response.data);
				})
				.catch((error) => {
					console.error('Error saving data:', error);
				})
				.finally(() => {
					// Reset click count and arrays
					setClickCount(0);
					setColourArray([]);
				});
		}
		console.log(`arrayColours:`, arrayColours);
	}, [clickCount, navigate, arrayColours]);

	return (
		<div>
			<div>
				<form>
					<div className={styles['colours-select']}>
						<ColourWheel onColourChange={handleColourChange} />
					</div>
				</form>
				<div>
					<ColourSaved newColour={currentColour} clickCount={clickCount} />
				</div>
			</div>
		</div>
	);
}

export default ColourSelect;
