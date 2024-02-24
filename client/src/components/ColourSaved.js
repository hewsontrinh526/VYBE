/* eslint-disable */
import React, { useEffect, useContext } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
// import { useData } from './ColourDataContext';

function ColourSaved({ newColour, clickCount }) {
	// const { sendDataToDatabase } = useData();

	// need this array to have the saved colours displayed
	let circleStyles = [
		styles['circle-1'],
		styles['circle-2'],
		styles['circle-3'],
		styles['circle-4'],
		styles['circle-5'],
	];

	let circles = [];
	for (let index = 0; index < 5; index++) {
		const circleColour =
			index + 1 === clickCount
				? `hsl(${newColour.h}, ${newColour.s}%, ${newColour.l}%)`
				: circleStyles[index];
		circles.push(
			<div
				key={index}
				className={styles[`circle-${index + 1}`]}
				style={{ backgroundColor: circleColour }}
			></div>
		);
	}

	// const handleSendData = () => {
	// 	if (clickCount === 5) {
	// 		const payload = {
	// 			colourHue: newColour.h,
	// 			colourSaturation: color.s,
	// 			colourLightness: color.l,
	// 		};
	// 		console.log('click confirmed');
	// 		sendDataToDatabase(payload);
	// 	}
	// };

	// console.log(
	// 	'Colours:',
	// 	circleStyles.map((circle) => circleStyles)
	// );

	return (
		<>
			<div className={styles['colours-saved']}>{circles}</div>
			{/* <div className={styles['colour-data-select']}>
				<button onClick={handleSendData}>Send Data from Colour Saved 2</button>
			</div> */}
		</>
	);
}

export default ColourSaved;
