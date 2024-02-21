/* eslint-disable */
import React, { Component } from 'react';
import styles from './ColourQuiz.module.css';
import './blobs.css';
import ColourSaved from './ColourSaved';
// import ColourPlaylist from './ColourPlaylist';

class ColourSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			colour: '',
			clickCount: 0,
		};
	}

	handleColourSelect = (event) => {
		event.preventDefault();
		const selectedColour = event.target.getAttribute('data-colour');
		this.setState(
			(prevState) => ({
				colour: selectedColour,
				clickCount: prevState.clickCount + 1,
			}),
			() => {
				console.log('test!');
			}
		);
		event.target.disabled = true;
		// this.props.playNext();
	};

	componentDidUpdate(prevProps, prevState) {
		if (this.state.colour !== prevState.colour) {
			console.log(`Colour: ${this.state.colour}`);
		}

		if (this.props.playNext !== prevProps.playNext) {
			console.log('playNext function updated');
		}
	}

	render() {
		const { colour, clickCount } = this.state;

		return (
			<div>
				<form>
					<div className={styles['colours-select']}>
						<button
							className={styles['square-1']}
							data-colour='#DF0000'
							onClick={this.handleColourSelect}
						></button>
						<button
							className={styles['square-2']}
							data-colour='#F58501'
							onClick={this.handleColourSelect}
						></button>
						<button
							className={styles['square-3']}
							data-colour='#FAFF01'
							onClick={this.handleColourSelect}
						></button>
						<button
							className={styles['square-4']}
							data-colour='#5EF105'
							onClick={this.handleColourSelect}
						></button>
						<button
							className={styles['square-5']}
							data-colour='#00B2FF'
							onClick={this.handleColourSelect}
						></button>
						<button
							className={styles['square-6']}
							data-colour='#BD00FF'
							onClick={this.handleColourSelect}
						></button>
					</div>
				</form>
				<div>
					<ColourSaved
						newColour={this.state.colour}
						clickCount={this.state.clickCount}
					/>
					{/* <TrackFeatures colour={colour} /> */}
					{/* <ColourPlaylist handleColourSelect={handleColourSelect} /> */}
				</div>
			</div>
		);
	}
}

export default ColourSelect;
