import React from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import ColourSelect from './ColourSelect';
import Playlist from './Playlist';
import ColourSaved from './ColourSaved';

function ColourQuiz() {
	return (
		<div className='quiz-container'>
			<header className={styles['header']}>
				<div className='container-logo'>
					<img src='/logo.png' alt='logo' className='logo' />
				</div>
			</header>
			<ColourSelect />
			<Playlist />
			<ColourSaved />
		</div>
	);
}

export default ColourQuiz;
