/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import PushToDatabase from './ColourQuizData';

const TrackFeatures = ({ trackId }) => {
	const [trackFeatures, setTrackFeatures] = useState(null);
	const token =
		'BQDxJzbww84BLAJa2kGUtabBwC40eqUNGFmoEPqaS7agT8DKpZRr3HdbFXB9IIhjOBJ_xFosHZY-a01du7hlbNdahBz4EzZg17hYZJq0k6RA5sUFMMRvxJQYEgztq6rtlQaCb_lV3GnUVguNozHAGweXiehqSsffuuzKfS6VGRyjCwZFmlSMzK9hge5o5_f1M43oCPCdHRcIpEVbkAaG6Ha7QPRJ';
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
			console.log(trackId);
			console.log(`Energy: ${trackFeatures.energy}`);
			console.log(`Valence: ${trackFeatures.valence}`);
			console.log(`Danceability: ${trackFeatures.danceability}`);
		}
	}, [trackFeatures, trackId]);

	return <div>{/* <PushToDatabase trackFeatures={trackFeatures} /> */}</div>;
};

export default TrackFeatures;
