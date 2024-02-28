import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ColourQuiz from './components/ColourQuiz';
import LoadingAnimation from './components/Loading';
import ColourSelect from './components/ColourSelect';
import SpotifyCallback from './components/SpotifyCallback';

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<LoginPage />} />
				<Route path='/app/home' element={<HomePage />} />
				<Route path='/app/quiz' element={<ColourQuiz />} />
				<Route path='/app/loading' element={<LoadingAnimation />} />
				<Route path='/app/select' element={<ColourSelect />} />
				<Route path="/app/spotify-callback" element={<SpotifyCallback />} />
				{/* add other routes here */}
			</Routes>
		</Router>
	);
}

export default App;
