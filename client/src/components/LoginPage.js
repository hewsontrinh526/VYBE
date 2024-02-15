import React, { useState, useEffect } from 'react';
import styles from './LoginPage.module.css';
import './blobs.css';

function LoginPage() {
  const [spotifyAuthUrl, setSpotifyAuthUrl] = useState('');

  useEffect(() => {
    // fetch spotifyAuthUrl from the backend
    fetch('/api/auth/url')
      .then(response => response.json())
      .then(data => setSpotifyAuthUrl(data.spotifyAuthUrl))
      .catch(error => console.error('Error fetching auth URL:', error));
  }, []);

  return (
    <div>
      <div className={styles['container']}>
        <div className={styles['orb-red']}></div>
        <div className={styles['orb-blue']}></div>
        <img src="/logo.png" alt="logo" className={styles['overlay-image']} />
      </div>
      <div className={styles['button-container']}>
        <a href={spotifyAuthUrl} className={styles['spotify-login-button']}>
          <img src="/spotify-logo.png" alt="spotify-logo" className={styles['spotify-logo']} />Continue with Spotify
        </a>
      </div>
    </div>
  )
}

export default LoginPage;