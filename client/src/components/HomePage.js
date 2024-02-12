import React from 'react';
import './HomePage.css';

function HomePage() {
  // add functionality for create vybe button
  const handleCreateVybe = () => {
    console.log('create vybe button clicked');
  };

  const handlePlayVybe  = () => {
    console.log('play vybe button clicked');
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="title">vybe</h1>
      </header>
      <div className="button-container">
        <button className="home-button" onClick={handleCreateVybe}>create vybe</button>
        <button className="home-button" onClick={handlePlayVybe}>play vybe</button>
      </div>
    </div>
  );
}

export default HomePage;