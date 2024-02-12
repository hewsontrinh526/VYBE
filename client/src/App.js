import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';

function App() {
  return  (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        {/* add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
