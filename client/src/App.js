import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ColourQuiz from './components/ColourQuiz';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/quiz" element={<ColourQuiz />} />
        {/* add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
