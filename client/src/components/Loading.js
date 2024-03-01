import React, { useEffect } from 'react';
import styles from './Loading.module.css';
import './blobs.css';
import { useNavigate } from 'react-router-dom';

const LoadingAnimation = () => {
	// redirects to home after x milliseconds
	const navigate = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			navigate('/app/home');
		}, 5000);
	}, [navigate]);

	// Use a fixed sequence of animations for illustration
	const animations = ['quiet', 'normal', 'loud', 'normal', 'quiet'];

	// Adjusted to introduce a slight delay for each box to start its animation
	// to create a more coordinated and smooth visual effect
	const boxAnimations = animations.map((animation, index) => {
		const duration = '1s'; // Consider slightly varying durations if it enhances smoothness
		const delay = `${index * 0.25}s`; // Staggered start times for each animation
		return {
			animationName: `${styles[animation]}`,
			animationDuration: duration,
			animationDelay: delay,
			animationTimingFunction: 'ease-in-out',
			animationIterationCount: 'infinite',
			animationFillMode: 'forwards', // Ensure the style stays at the last keyframe post-animation
		};
	});

	// Generate boxes with animation
	const renderBoxes = (boxCount, isTop = true) => {
		return [...Array(boxCount)].map((_, index) => {
			const animationStyle = {
				...boxAnimations[index % animations.length], // Cycle through animations based on index
				transformOrigin: isTop ? 'bottom' : 'top',
			};

			return (
				<div
					key={index}
					className={`${styles.box} ${styles[`box${index + 1}`]}`}
				>
					<div className={styles['centreRect']} style={animationStyle}></div>
				</div>
			);
		});
	};

	// const redirectToHome = () => {
	// 	const navigate = useNavigate();
	// 	const location = useLocation();
	// 	useEffect(() => {
	// 		if (location.state && location.state.from === '/app/quiz') {
	// 			setTimeout(() => {
	// 				navigate('/app/home');
	// 			}, 6000);
	// 		}
	// 	}, []);
	// };

	return (
		<div>
			<header className={styles['header']}>
				<div className='container-logo'>
					<img src='/logo.png' alt='logo' className='logo' />
				</div>
			</header>
			<div className={styles['loadingContainer']}>
				<div className={styles['boxContainerTop']}>{renderBoxes(5)}</div>
				<div className={styles['boxContainerBottom']}>
					{renderBoxes(5, false)}
				</div>
			</div>
		</div>
	);
};

export default LoadingAnimation;
