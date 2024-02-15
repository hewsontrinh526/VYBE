import styles from './ColourQuiz.module.css';
import './blobs.css';

function Playlist() {
	return (
		<div className={styles['playlist']}>
			<h1 id='playlistName'>Song Name</h1>
			<h2>Artist</h2>{' '}
		</div>
	);
}

export default Playlist;
