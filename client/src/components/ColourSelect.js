/* eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import ColourSaved from './ColourSaved';
import ColourWheel from './ColourWheel';

function ColourSelect(props) {
	// const [colour, setColour] = useState('');
	let [clickCount, setClickCount] = useState(0);
	const [currentColour, setCurrentColour] = useState({
		hsl: { h: 0, s: 0, l: 0 },
	});

	const handleColourChange = useCallback((color) => {
		console.log(`Colour: (hue:${color.h}, sat:${color.s}, light:${color.l})`);
		setCurrentColour(color);
		setClickCount((prevCount) => prevCount + 1);
		props.playNext();
	}, []);

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
