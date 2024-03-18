import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransitionWrap from './components/TransitionWrap';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ColourQuiz from './components/ColourQuiz';
import LoadingAnimation from './components/Loading';
import ColourSelect from './components/ColourSelect';
import SpotifyCallback from './components/SpotifyCallback';
import CompletedAnimation from './components/CompletedAnimation';
import PreStart from './components/PreStart';

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={
				<TransitionWrap>
					<LoginPage />
				</TransitionWrap>
			} />
				<Route path='/app/home' element={
					<HomePage />
			} />
				<Route path='/app/quiz' element={
					<ColourQuiz />
			} />
				<Route path='/app/loading' element={
				<TransitionWrap>
					<LoadingAnimation />
				</TransitionWrap>
			} />
				<Route path='/app/select' element={
				<TransitionWrap>
					<ColourSelect />
				</TransitionWrap>
			} />
				<Route path="/app/spotify-callback" element={
					<SpotifyCallback />
			} />
				<Route path='/app/completed' element={
					<TransitionWrap>
						<CompletedAnimation />
					</TransitionWrap>
			} />
				<Route path='/app/prestart' element={
					<TransitionWrap>
						<PreStart />
					</TransitionWrap>
			} />
			</Routes>
		</Router>
	);
}

export default App;
