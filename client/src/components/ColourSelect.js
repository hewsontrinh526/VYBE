/* eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import ColourSaved from './ColourSaved';
import ColourWheel from './ColourWheel';
import axios from 'axios';

function ColourSelect({ playNext }) {
	// const [colour, setColour] = useState('');
	let [clickCount, setClickCount] = useState(0);
	const [currentColour, setCurrentColour] = useState({
		hsl: { h: 0, s: 0, l: 0 },
	});
	const [arrayColours, setColourArray] = useState([]);
	const [spotifyID, setSpotifyID] = useState('');

	const handleColourChange = useCallback(
		(color) => {
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
		},
		[playNext]
	);

	const handleSortData = () => {};

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
				const response = await axios.get('/user/spotifyID');
				setSpotifyID(response.data.spotifyID);
			} catch (error) {
				console.error('getSpotifyId error', error);
			}
		};
		getSpotifyID();
	}, []);

	useEffect(() => {
		if (clickCount === 5) {
			const saveArrays = arrayColours.map((item, index) => [
				item,
				trackIds[index],
			]);
			saveArrays.push({ spotifyID: spotifyID });

			axios
				.post('/quiz/save', saveArrays)
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
	}, [clickCount, spotifyID, arrayColours, trackIds]);

	// console.log(`saveArrays: ${saveArrays}`);
	// console.log(`arrayColours: ${arrayColours}`);

	return (
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
	);
}

export default ColourSelect;
