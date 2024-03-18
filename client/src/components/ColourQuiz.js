import React, { useState } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import ColourSelect from './ColourSelect';
import ColourPlaylist from './ColourPlaylist';
import ColourSaved from './ColourSaved';

function ColourQuiz() {
	const [showInfoModal, setShowInfoModal] = useState(false);
	return (
		<div className='quiz-container'>
			<header className={styles['header']}>
				<div className='container-logo'>
					<img src='/logo.png' alt='logo' className='logo' />
				</div>
			</header>
			<div className={styles['info-container']}>
				<button
					className={`${styles['info-button']} ${
						showInfoModal ? styles['hidden'] : ''
					}`}
					onClick={() => setShowInfoModal(true)}
				>
					?
				</button>
			</div>
			<div className={showInfoModal ? styles['hidden'] : ''}>
				<ColourSelect />
				<ColourPlaylist />
				<ColourSaved />
			</div>
			{showInfoModal && (
			<div className={styles['modal']}>
				<div className={styles['modal-content']}>
					<span
						className={styles['close-button']}
						onClick={() => setShowInfoModal(false)}
					>
						&times;
					</span>
					<h2>What's happening here?</h2>
					<p>
						To properly calibrate your vybe, you'll need to choose what colour best represents each song shown to you.
						There will be 5 songs in total.
					</p>
					<br />
					<p>
						Once you've chosen a colour that you're happy with, click on "Confirm" to move onto the next song.
					</p>
					<br />
					<p>
						When you're done selecting all 5 songs, your calibration will be set and ready for you to create vybes!
					</p>
					<br />
					<h2>Why do we need this?</h2>
					<p>
						This is the first step to customise your unique vybe!
					</p>
					<br />
					<p>
						Here, vybe is gathering your selections into our algorithm to capture your colour interpretations.
					</p>
					<br />
					<p>
						It's a crucial process to make sure the playlists you create will align with your personal colour to music connections.
					</p>
				</div>
			</div>
		)}
		</div>
	);
}

export default ColourQuiz;
