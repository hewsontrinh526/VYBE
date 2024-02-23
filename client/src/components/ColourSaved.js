/* eslint-disable */
import React, { useEffect } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
// import PushToDatabase from './ColourQuizData';

function ColourSaved({ newColour, clickCount }) {
	const circleStyles = [
		styles['circle-1'],
		styles['circle-2'],
		styles['circle-3'],
		styles['circle-4'],
		styles['circle-5'],
	];

	let circles = [];
	for (let index = 0; index < 5; index++) {
		const circleColour =
			index + 1 === clickCount ? newColour : circleStyles[index];
		circles.push(
			<div
				key={index}
				className={styles[`circle-${index + 1}`]}
				style={{ backgroundColor: circleColour }}
			></div>
		);
	}
	return <div className={styles['colours-saved']}>{circles}</div>;
}

export default ColourSaved;
