import React from 'react';
import './ColourQuiz.css';

function ColourQuiz() {
  const handleSaveRed = () => {
    console.log('Red has been selected');
  };
  const handleSaveOrange = () => {
    console.log('Orange has been selected');
  };
  const handleSaveYellow = () => {
    console.log('Yellow has been selected');
  };
  const handleSaveGreen = () => {
    console.log('Green has been selected');
  };
  const handleSaveBlue = () => {
    console.log('Blue has been selected');
  };
  const handleSavePurple = () => {
    console.log('Purple has been selected');
  };

  return (
    <div className="quiz-container">
      <header className="header">
        <h1 className="title">vybe</h1>
      </header>
      <div className="colours-select">
        <div className="row">
          <button
            className="square-1"
            data-colour="#DF0000"
            onClick={handleSaveRed}
          ></button>
          <button
            className="square-2"
            data-colour="#F58501"
            onClick={handleSaveOrange}
          ></button>
          <button
            className="square-3"
            data-colour="#FAFF01"
            onClick={handleSaveYellow}
          ></button>
        </div>
        <div className="row">
          <button
            className="square-4"
            data-colour="#5EF105"
            onClick={handleSaveGreen}
          ></button>
          <button
            className="square-5"
            data-colour="#00B2FF"
            onClick={handleSaveBlue}
          ></button>
          <button
            className="square-6"
            data-colour="#BD00FF"
            onClick={handleSavePurple}
          ></button>
        </div>
      </div>
      <div className="playlist">
        <h1 id="playlistName">Song Name</h1>
        <h2>Artist</h2>{' '}
      </div>
      <div className="colours-saved">
        <div className="circle-1"></div>
        <div className="circle-2"></div>
        <div className="circle-3"></div>
        <div className="circle-4"></div>
        <div className="circle-5"></div>
      </div>
    </div>
  );
}

export default ColourQuiz;
