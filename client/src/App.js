import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ColourQuiz from './components/ColourQuiz';
import LoadingAnimation from './components/Loading';
import ColourSelect from './components/ColourSelect';

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<LoginPage />} />
				<Route path='/app/home' element={<HomePage />} />
				<Route path='/app/quiz' element={<ColourQuiz />} />
				<Route path='/app/loading' element={<LoadingAnimation />} />
				<Route path='/app/select' element={<ColourSelect />} />
				{/* add other routes here */}
			</Routes>
		</Router>
	);
}

export default App;
