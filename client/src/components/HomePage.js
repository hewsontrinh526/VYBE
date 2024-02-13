import React, { useEffect, useState } from 'react';
import './HomePage.css';

function HomePage() {
  const [showPlayVybeModal, setShowPlayVybeModal] = useState(false);
  // add functionality for create vybe button
  const handleCreateVybe = () => {
    console.log('create vybe button clicked');
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

  useEffect(() => {
    // calls function when Spotify iFrame API is ready
    if (window.Spotify) {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb('BQDuRzGNYb2KT5Mx9mikjHSZt0C5ZS2UXknnPtAfvmo26qPEjiMQTBlTOftA-NxaJBnlH2Gmi74Vpyl5y4VC-F-TptaFRVORx2-TwBlLlEb7eXmzWg83GwZC_45rUFFQOXiOkMBYov6ibi31mRa6nQCANAGzx_b42yf4Wu9_whcm0s9cE2Yywq3vbFkYGblqcmCEqbo-JUEmEwJqhEvVO5u3Es-D')}
      });

      // Readying the player
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Connecting to the player
      player.connect();
    }
    }, []);

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="title">vybe</h1>
      </header>
      <div className="button-container">
        <button className="home-button" onClick={handleCreateVybe}>create vybe</button>
        <button className="home-button" onClick={handlePlayVybe}>play vybe</button>
      </div>
      {showPlayVybeModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleClosePlayVybeModal}>&times;</span>
            <iframe
            src="https://open.spotify.com/embed/playlist/37i9dQZF1EIf9l7ez5L0Ms"
            allow="encrypted-media"
            name="spotify_iframe"
            className="spotify-iframe"
            title="Playlist"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;