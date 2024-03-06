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
		hsl: { h: 0, s: 0, l: 0 },
	});
	const [arrayColours, setColourArray] = useState([]);
	const navigate = useNavigate();
	const [hasNavigated, setHasNavigated] = useState(false);
	const spotifyID = localStorage.getItem('spotifyID');
	console.log(spotifyID);

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

	useEffect(() => {
		if (clickCount === 5 && !hasNavigated) {
			setHasNavigated(true);
			setTimeout(() => {
				navigate('/app/completed');
			}, 2000);

			const songs = arrayColours.map((item, index) => ({
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
		console.log(`arrayColours:`, arrayColours);
	}, [clickCount, navigate, arrayColours, hasNavigated]);

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
