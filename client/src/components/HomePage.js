/* eslint-disable */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import './blobs.css';
import styles from './HomePage.module.css';
import axios from 'axios';
import ColourWheel from './ColourWheel';
import LoadingAnimation from './Loading';

function HomePage() {
  const [showPlayVybeModal, setShowPlayVybeModal] = useState(false);
  const [showCreateVybeModal, setShowCreateVybeModal] = useState(false);
  const [showSpotifyIframeModal, setShowSpotifyIframeModal] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState('');
  const [currentColour, setCurrentColour] = useState({ hsl: { hue: 0, saturation: 0, lightness: 0 } });
  const modalContentRef = useRef(null);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [interpolatedFeatures, setInterpolatedFeatures] = useState(null);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlists, setPlaylists] = useState([]);


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
  const handlePlayVybe = async () => {
    console.log('play vybe button clicked');
    setShowLoadingAnimation(true); // Opens loading screen whilst fetching data

    const userSpotifyID = localStorage.getItem('spotifyID');

    try {
      const response = await axios.post('/playlist/fetch', { spotifyID: userSpotifyID });
      console.log(response.data); // Log the response data to verify its structure
      setPlaylists(response.data);
      setShowPlayVybeModal(true);
    } catch (error) {
      console.log('Error fetching playlists:', error);
    } finally {
      setShowLoadingAnimation(false);
    }
  };


  const handlePlaylistClick = (playlistID) => {
    const playlistBaseUrl = "https://open.spotify.com/embed/playlist/";
    setPlaylistUrl(`${playlistBaseUrl}${playlistID}`);
    setShowSpotifyIframeModal(true);
  };


  const handleSpotifyIframe = () => {
    console.log('spotify iframe button clicked');
    setShowSpotifyIframeModal(true);
  }

  const handleColourChange = useCallback((color) => {
    console.log(`Selected colour: hsl(${color.h}, ${color.s}%, ${color.l}%)`);
    // Update setCurrentColour to match the expected structure
    setCurrentColour({
      hue: color.h,
      saturation: color.s,
      lightness: color.l
    });
  }, []);

  const handleConfirmColour = async () => {
    console.log("Confirmed colour:", currentColour);
    setShowLoadingAnimation(true); // Show the loading animation upon confirmation

    let operationCompleted = false; // Flag to indicate if the main operation has completed
    let minimumTimeElapsed = false; // Flag to indicate if the minimum time of 10 seconds has elapsed

    // Function to hide the loading animation if both conditions are met
    const maybeHideLoading = () => {
      if (operationCompleted && minimumTimeElapsed) {
        setShowLoadingAnimation(false);
      }
    };

    // Set a timeout to mark the minimum display time of the loading animation as elapsed
    setTimeout(() => {
      minimumTimeElapsed = true;
      maybeHideLoading(); // Attempt to hide the loading animation
    }, 5000); // Note: Adjusted to 5 seconds based on your setTimeout, but you mentioned 10 seconds in the comment

    const userSpotifyID = localStorage.getItem('spotifyID');
    const userAccessToken = localStorage.getItem('accessToken');

    try {
      const payload = {
        spotifyID: userSpotifyID,
        selectedHSL: {
          hue: currentColour.hue,
          saturation: currentColour.saturation,
          lightness: currentColour.lightness,
        },
      };

      // First Axios POST request
      const featuresResponse = await axios.post('/quiz/algo', payload);
      const features = featuresResponse.data;
      setInterpolatedFeatures(features);
      console.log('Interpolated features:', features);

      // Second Axios POST request using async/await
      const createResponse = await axios.post('/playlist/create', {
        spotifyID: userSpotifyID,
        accessToken: userAccessToken,
        features: features,
      });
      const playlistId = createResponse.data.playlistId;
      console.log('Playlist ID:', playlistId);

      // Preparing the data in the correct format for saving
      const savePlaylistPayload = {
        spotifyID: userSpotifyID,
        playlist: {
          playlistID: playlistId,
          colourHue: currentColour.hue,
          colourSaturation: currentColour.saturation,
          colourLightness: currentColour.lightness,
        },
      };

      // Third Axios POST request to save the playlist data
      await axios.post('/playlist/save/', savePlaylistPayload);
      console.log('Playlist saved successfully');

      const createdPlaylistUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;
      setPlaylistUrl(createdPlaylistUrl); // Update the state with the new URL
      setShowSpotifyIframeModal(true);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      operationCompleted = true;
      maybeHideLoading(); // Attempt to hide the loading animation
    }
  };

  const handleShowVybe = () => {
    setShowVybeModal(true); // Show the modal when the button is clicked
  };

  return (
    <div className="home-container">
      {showLoadingAnimation ? (
        <LoadingAnimation />
      ) : (
        <>
          <header className={styles['header']}>
            <div className='container-logo'>
              <img src='/logo.png' alt='logo' className='logo' />
            </div>
          </header>
          <div className={styles['button-container']}>
            <button className={`${styles['home-button']} ${showCreateVybeModal || showPlayVybeModal ? styles['hidden'] : ''}`} onClick={handleCreateVybe}>create vybe</button>
            <button className={`${styles['home-button']} ${showCreateVybeModal || showPlayVybeModal ? styles['hidden'] : ''}`} onClick={handlePlayVybe}>play vybe</button>
          </div>
          {showCreateVybeModal && (
            <div className={styles['modal']}>
              <div ref={modalContentRef} className={styles['modal-content']}>
                <span className={styles['close-button']} onClick={() => setShowCreateVybeModal(false)}>&times;</span>
                <ColourWheel onColourChange={handleColourChange} containerRef={modalContentRef} />
                <button
                  onClick={handleConfirmColour}
                  style={{ backgroundColor: `hsl(${currentColour.hue}, ${currentColour.saturation}%, ${currentColour.lightness}%)` }}
                  className={styles['confirm-button']}>
                  Confirm
                </button>
              </div>
            </div>
          )}
          {showPlayVybeModal && (
            <div className={styles['modal']}>
              <div className={styles['modal-content']}>
                <span className={styles['close-button']} onClick={() => setShowPlayVybeModal(false)}>&times;</span>
                <div className={styles['playlist-circle-container']}>
                  {Array.isArray(playlists) && playlists.map((playlist, index) => (
                    <div key={index} className={styles['playlist-circle']} style={{
                      backgroundColor: `hsl(${playlist.colourHue}, ${playlist.colourSaturation}%, ${playlist.colourLightness}%)`,
                    }} onClick={() => handlePlaylistClick(playlist.playlistID)}>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {showSpotifyIframeModal && (
            <div className={styles['modal']}>
              <div className={styles['modal-content']}>
                <span className={styles['close-button']} onClick={() => setShowSpotifyIframeModal(false)}>&times;</span>
                <iframe
                  src={playlistUrl} // Use the state variable here
                  allow="encrypted-media"
                  name="spotify_iframe"
                  className={styles['spotify-iframe']}
                  title="Playlist"
                ></iframe>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;