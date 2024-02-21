import React, { Component } from 'react';
import axios from 'axios';

class TrackFeatures extends Component {
	constructor(props) {
		super(props);
		this.state = {
			trackFeatures: null,
		};
		this.token =
			'BQABLWsmV-ZoxcXNPKqjRFHvL_dgYfBM5TiLpfGO_a9vwOfavQQSIfAtq6Wy7rRaxbbUaTSHkg00Q5Cd5-KYAAKEJecBNCo6z8pHsXdBMjdqCDVpUC-PJaV4yPd-tSTUtUHNYBvJNeWl9ME0vfYPyJj19wTDgL8mOkpwV6BddrCxrGNoDtzLixPZI3HdBbPKakgXWRXvmjTQJfJGR0-F9-UnWgQ-';
	}

	componentDidMount() {
		this.fetchTrackFeatures();
	}

	componentDidUpdate(prevProps) {
		if (this.props.trackId !== prevProps.trackId) {
			this.fetchTrackFeatures();
		}
	}

	fetchTrackFeatures = async () => {
		const { trackId } = this.props;
		try {
			const response = await axios.get(
				`https://api.spotify.com/v1/audio-features/${trackId}`,
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}
			);
			const trackFeaturesData = response.data;
			this.setState({ trackFeatures: trackFeaturesData });
		} catch (error) {
			console.error('Error fetching track features:', error);
		}
	};

	render() {
		const { trackFeatures } = this.state;
		const { trackId } = this.props;
		if (!trackFeatures) return null; // Render nothing until trackFeatures is fetched

		console.log(trackId);
		console.log(`Energy: ${trackFeatures.energy}`);
		console.log(`Valence: ${trackFeatures.valence}`);
		console.log(`Danceability: ${trackFeatures.danceability}`);

		return <div>{/* Render track features */}</div>;
	}
}

export default TrackFeatures;
