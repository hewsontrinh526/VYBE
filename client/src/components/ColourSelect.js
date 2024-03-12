/* eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import ColourSaved from './ColourSaved';
import ColourWheel from './ColourWheel';
import axios from 'axios';

const trackIds = [
	{ trackId: '4eHbdreAnSOrDDsFfc4Fpm' }, // i will always love you
	{ trackId: '5FVd6KXrgO9B3JPmC8OPst' }, // do i wanna know
	{ trackId: '4PTG3Z6ehGkBFwjybzWkR8' }, // rick roll
	{ trackId: '7wZUrN8oemZfsEd1CGkbXE' }, // bleeding love
	{ trackId: '03UrZgTINDqvnUMbbIMhql' }, // gangnam style
];

function ColourSelect({ playNext }) {
	let [clickCount, setClickCount] = useState(0);
	const [currentColour, setCurrentColour] = useState({
		hsl: { hue: 0, saturation: 0, lightness: 0 },
	});
	const [colourArray, setColourArray] = useState([]);
	const navigate = useNavigate();
	const [hasNavigated, setHasNavigated] = useState(false);
	const spotifyID = localStorage.getItem('spotifyID');
	const [savedColour, setSavedColour] = useState('');

	const handleColourChange = useCallback((color) => {
		// console.log(`Selected colour: hsl(${color.h}, ${color.s}%, ${color.l}%)`);
		// Update setCurrentColour to match the expected structure
		setCurrentColour({
			h: color.h,
			s: color.s,
			l: color.l,
		});
	}, []);

	const handleConfirmColour = useCallback(() => {
		// console.log(
		// 	`Colour: (hue:${currentColour.h}, sat:${currentColour.s}, light:${currentColour.l})`
		// );

		setColourArray((prevArray) => [
			...prevArray,
			{
				colourHue: currentColour.h,
				colourSaturation: currentColour.s,
				colourLightness: currentColour.l,
			},
		]);
		setSavedColour(currentColour);
		setCurrentColour({});
		setClickCount((prevCount) => prevCount + 1);
		playNext();
		// console.log(
		// 	`Confirmed colour: (hue:${currentColour.h}, sat:${currentColour.s}, light:${currentColour.l})`
		// );
		console.log(`click: ${clickCount}`);
	}, [
		currentColour,
		savedColour,
		// setCurrentColour,
		// setColourArray,
		// setClickCount,
		// playNext,
	]);

	useEffect(() => {
		if (clickCount === 5 && !hasNavigated) {
			setHasNavigated(true);
			setTimeout(() => {
				navigate('/app/completed');
			}, 2000);

			const songs = colourArray.map((item, index) => ({
				trackID: trackIds[index].trackId,
				colourHue: item.colourHue,
				colourSaturation: item.colourSaturation,
				colourLightness: item.colourLightness,
			}));

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
				});
		}
		console.log(`colourArray:`, colourArray);
	}, [clickCount, navigate, colourArray, hasNavigated]);

	return (
		<div>
			<div>
				<form>
					<div className={styles['colours-select']}>
						<ColourWheel onColourChange={handleColourChange} />
					</div>
				</form>
				<button
					onClick={handleConfirmColour}
					// needs % in s and l for colour wheel background to work because sat and light are calculated by %
					style={{
						backgroundColor: `hsl(${currentColour.h}, ${currentColour.s}%, ${currentColour.l}%)`,
					}}
					className={styles['confirm-button']}
				>
					Confirm
				</button>
				<div>
					<ColourSaved newColour={savedColour} clickCount={clickCount} />
				</div>
			</div>
		</div>
	);
}

export default ColourSelect;
