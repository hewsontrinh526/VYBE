import React from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';

function ColourQuiz() {
	const handleSaveColour = (event) => {
		const selectedColour = event.target.getAttribute('data-colour');
		console.log(selectedColour);
	};

	return (
		<div className='quiz-container'>
			<header className={styles['header']}>
				<div className='container-logo'>
					<img src='/logo.png' alt='logo' className='logo' />
				</div>
			</header>
			<div className={styles['colours-select']}>
				<button
					className={styles['square-1']}
					data-colour='#DF0000'
					onClick={handleSaveColour}
				></button>
				<button
					className={styles['square-2']}
					data-colour='#F58501'
					onClick={handleSaveColour}
				></button>
				<button
					className={styles['square-3']}
					data-colour='#FAFF01'
					onClick={handleSaveColour}
				></button>
				<button
					className={styles['square-4']}
					data-colour='#5EF105'
					onClick={handleSaveColour}
				></button>
				<button
					className={styles['square-5']}
					data-colour='#00B2FF'
					onClick={handleSaveColour}
				></button>
				<button
					className={styles['square-6']}
					data-colour='#BD00FF'
					onClick={handleSaveColour}
				></button>
			</div>
			<div className={styles['playlist']}>
				<h1 id='playlistName'>Song Name</h1>
				<h2>Artist</h2>{' '}
			</div>
			<div className={styles['colours-saved']}>
				<div className={styles['circle-1']}></div>
				<div className={styles['circle-1']}></div>
				<div className={styles['circle-1']}></div>
				<div className={styles['circle-1']}></div>
				<div className={styles['circle-1']}></div>
			</div>
		</div>
	);
}

export default ColourQuiz;
