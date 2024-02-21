/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import ColourSaved from './ColourSaved';
// import ColourPlaylist from './ColourPlaylist';

function ColourSelect(props) {
	// for coloured square buttons
	const [colour, setColour] = useState('');
	let [clickCount, setClickCount] = useState(0);
	let [nextSong, setNextSong] = useState();
	const [message, setMessage] = React.useState('Hello World');
	// let msg = 'goodbye';
	// console.log('props obj:', props);
	// const playlistInstance = playlistRef.current.getInstance();
	// const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
	// const prop = JSON.stringify(props);

	// useEffect(() => {
	// 	if (prop) {
	// 		console.log(`playlistRef: ${prop}`);
	// 	}
	// }, [props]);

	const handleColourSelect = (event) => {
		event.preventDefault();
		const selectedColour = event.target.getAttribute('data-colour');
		setColour(selectedColour);
		// console.log(`selected: ${selectedColour}`);
		// console.log(`colour: ${colour}`);
		setClickCount((prevCount) => prevCount + 1);
		event.target.disabled = true;
		// const chooseMessage = (message) => {
		// 	setMessage(message);
	};

	// const basicFunction = () => {
	// 	event.preventDefault();
	// 	props.playNext;
	// };

	useEffect(() => {
		if (colour) {
			console.log(`Colour: ${colour}`);
		}
	}, [colour]);

	return (
		<div>
			<form>
				<div className={styles['colours-select']}>
					<button
						className={styles['square-1']}
						data-colour='#DF0000'
						onClick={handleColourSelect}
					></button>
					<button
						className={styles['square-2']}
						data-colour='#F58501'
						onClick={handleColourSelect}
					></button>
					<button
						className={styles['square-3']}
						data-colour='#FAFF01'
						onClick={handleColourSelect}
					></button>
					<button
						className={styles['square-4']}
						data-colour='#5EF105'
						onClick={handleColourSelect}
					></button>
					<button
						className={styles['square-5']}
						data-colour='#00B2FF'
						onClick={handleColourSelect}
					></button>
					<button
						className={styles['square-6']}
						data-colour='#BD00FF'
						onClick={handleColourSelect}
					></button>
					/>
				</div>
			</form>
			<div>
				<ColourSaved newColour={colour} clickCount={clickCount} />
				{/* <TrackFeatures colour={colour} /> */}
				{/* <ColourPlaylist handleColourSelect={handleColourSelect} /> */}
			</div>
		</div>
	);
}

export default ColourSelect;
