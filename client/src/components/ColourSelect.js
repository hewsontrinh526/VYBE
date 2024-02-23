/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import ColourSaved from './ColourSaved';

function ColourSelect(props) {
	const [colour, setColour] = useState('');
	let [clickCount, setClickCount] = useState(0);
	let [nextSong, setNextSong] = useState();
	const [message, setMessage] = React.useState('Hello World');

	const handleColourSelect = (event) => {
		event.preventDefault();
		const selectedColour = event.target.getAttribute('data-colour');
		setColour(selectedColour);
		setClickCount((prevCount) => prevCount + 1);
		event.target.disabled = true;
		props.playNext();
	};

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
			</div>
		</div>
	);
}

export default ColourSelect;
