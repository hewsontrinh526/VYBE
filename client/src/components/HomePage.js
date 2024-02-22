/* eslint-disable */
import React, { useEffect, useState } from 'react';
import './blobs.css';
import styles from './HomePage.module.css';
import axios from 'axios';
import ColourWheel from './ColourWheel';

function HomePage() {
  const [showPlayVybeModal, setShowPlayVybeModal] = useState(false);
  const [showCreateVybeModal, setShowCreateVybeModal] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('/api/token');
        setSpotifyToken(response.data.access_token);
        initSpotifyPlayer(response.data.access_token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

    // calls function when Spotify iFrame API is ready
    const initSpotifyPlayer = (token) => {
      if (window.Spotify && token) {
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: cb => { cb(token); }
        });

        // event listener for spotify player
        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
        });

        player.connect();
      }
    };

    // add functionality for create vybe button
  const handleCreateVybe = () => {
    console.log('create vybe button clicked');
    setShowCreateVybeModal(true);
  };

  // show the play vybe modal
  const handlePlayVybe  = () => {
    console.log('play vybe button clicked');
    setShowPlayVybeModal(true);
  };
  // close the play vybe modal
  const handleClosePlayVybeModal = () => {
    setShowPlayVybeModal(false);
  }

  return (
    <div className="home-container">
      <header className={styles['header']}>
				<div className='container-logo'>
					<img src='/logo.png' alt='logo' className='logo' />
				</div>
      </header>
      <div className={styles['button-container']}>
        <button className={`${styles['home-button']} ${showCreateVybeModal ? styles['hidden'] : ''}`} onClick={handleCreateVybe}>create vybe</button>
        <button className={`${styles['home-button']} ${showCreateVybeModal ? styles['hidden'] : ''}`} onClick={handlePlayVybe}>play vybe</button>
      </div>
      {showCreateVybeModal && (
        <div className={styles['modal']}>
          <div className={styles['modal-content']}>
            <span className={styles['close-button']} onClick={() => setShowCreateVybeModal(false)}>&times;</span>
            <ColourWheel onColourChange={(color) => console.log(`Selected colour: hsl(${color.hsl.h}, ${color.hsl.s}, ${color.hsl.l})`)} />
          </div>
        </div>
      )}
      {showPlayVybeModal && (
        <div className={styles['modal']}>
          <div className={styles['modal-content']}>
            <span className={styles['close-button']} onClick={handleClosePlayVybeModal}>&times;</span>
            <iframe
            src="https://open.spotify.com/embed/playlist/5OAu0ZRy6pWVnPaSarvdzs"
            allow="encrypted-media"
            name="spotify_iframe"
            className={styles['spotify-iframe']}
            title="Playlist"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;