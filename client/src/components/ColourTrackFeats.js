/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import PushToDatabase from './ColourQuizData';

const TrackFeatures = ({ trackId }) => {
	const [trackFeatures, setTrackFeatures] = useState(null);
	const token =
		'BQC-zl-cvTMVC1rKD0Ka0HRVXGuU9eghpQEA22kRftYcgwZ7FN_ILusQEqd3Foa5PKioxzpOrywrBeCnCAzKWv3ZZibgR07J4iJrYdHpwv2xF506w3cHRH2pi7Su6XIdKwrreACoEPzsKvsYZ14HUkSwVv8xVjsVGOHeUQxbFXqPjWQtXeXhS6aOdocakZIXHYuQ4dXhQs7ZTjpKcs9rRS5LYj1a';
	useEffect(() => {
		const fetchTrackFeatures = async () => {
			try {
				const response = await axios.get(
					`https://api.spotify.com/v1/audio-features/${trackId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const trackFeaturesData = response.data;
				setTrackFeatures(trackFeaturesData);
			} catch (error) {
				console.error('Error fetching track features:', error);
			}
		};

		fetchTrackFeatures();
	}, [trackId]);

	useEffect(() => {
		if (trackFeatures) {
			// console.log(colour);
			console.log(trackId);
			console.log(`Energy: ${trackFeatures.energy}`);
			console.log(`Valence: ${trackFeatures.valence}`);
			console.log(`Danceability: ${trackFeatures.danceability}`);
		}
	}, [trackFeatures, trackId]);

	// useEffect(() => {
	// 	const sendDataToDatabase = async () => {
	// 		try {
	// 			if (trackFeatures) {
	// 				console.log(trackId);
	// 				console.log(`Energy: ${trackFeatures.energy}`);
	// 				console.log(`Valence: ${trackFeatures.valence}`);
	// 				console.log(`Danceability: ${trackFeatures.danceability}`);

	// 				const data = await PushToDatabase({ colour, trackId, trackFeatures });
	// 				console.log('Yay!', data);
	// 			}
	// 		} catch (error) {
	// 			console.log('Nay!', error);
	// 		}
	// 	};

	// 	sendDataToDatabase();
	// }, [trackFeatures, trackId, colour]);

	// useEffect(() => {
	// 	if (trackFeatures) {
	// 		trackFeatures.forEach((trackFeature, index) => {
	// 			console.log(`Track ${index + 1} - Energy: ${trackFeature.energy}`);
	// 			console.log(`Track ${index + 1} - Valence: ${trackFeature.valence}`);
	// 			console.log(
	// 				`Track ${index + 1} - Danceability: ${trackFeature.danceability}`
	// 			);
	// 		});
	// 	}
	// }, [trackFeatures]);

	return (
		<div>
			{/* <PushToDatabase trackFeatures={trackFeatures} trackId={trackId} /> */}
		</div>
	);
};

export default TrackFeatures;
