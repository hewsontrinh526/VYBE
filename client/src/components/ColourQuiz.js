import React from 'react';
import './ColourQuiz.css';

function ColourQuiz() {
  const handleSaveColour = (event) => {
    const selectedColour = event.target.getAttribute('data-colour');
    console.log(selectedColour);
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
            onClick={handleSaveColour}
          ></button>
          <button
            className="square-2"
            data-colour="#F58501"
            onClick={handleSaveColour}
          ></button>
          <button
            className="square-3"
            data-colour="#FAFF01"
            onClick={handleSaveColour}
          ></button>
        </div>
        <div className="row">
          <button
            className="square-4"
            data-colour="#5EF105"
            onClick={handleSaveColour}
          ></button>
          <button
            className="square-5"
            data-colour="#00B2FF"
            onClick={handleSaveColour}
          ></button>
          <button
            className="square-6"
            data-colour="#BD00FF"
            onClick={handleSaveColour}
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
