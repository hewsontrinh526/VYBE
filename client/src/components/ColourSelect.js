import React, { useState } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import ColourSaved from './ColourSaved';

function ColourSelect() {
	// for coloured square buttons
	const [colour, setColour] = useState('');
	let [clickCount, setClickCount] = useState(0);

	const handleColourSelect = (event) => {
		event.preventDefault();
		const selectedColour = event.target.getAttribute('data-colour');
		setColour(selectedColour);
		setClickCount((prevCount) => prevCount + 1);
		// console.log(selectedColour);

		// for colour wheel
		// const [colour, setColour] = React.useState('');
		// data store in react
		// };
	};

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
