import React from 'react';
import styles from './Loading.module.css';
import './blobs.css';

const LoadingAnimation = () => {
  // Predefine animation styles for each box
  const animations = ['quiet', 'normal', 'loud'];
  const boxAnimations = Array(5).fill(null).map(() => {
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    const duration = `${1 + Math.random()}s`;
    const delay = `${Math.random() * 0.5}s`;
    return {
      animationName: `${styles[randomAnimation]}`,
      animationDuration: duration,
      animationDelay: delay,
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    };
  });

  // Function to generate boxes with repeated structure
  const renderBoxes = (boxCount, isTop = true) => {
    return [...Array(boxCount)].map((_, index) => {
      const animationStyle = {
        ...boxAnimations[index],
        transformOrigin: isTop ? 'bottom' : 'top',
      };

      return (
        <div key={index} className={`${styles.box} ${styles[`box${index + 1}`]}`}>
          <div className={styles['topSemi']}></div>
          <div className={styles['centreRect']} style={animationStyle}></div>
          <div className={styles['bottomSemi']}></div>
        </div>
      );
    });
  };

  return (
    <div className={styles['loadingContainer']}>
      <div className={styles['boxContainerTop']}>
        {renderBoxes(5)}
      </div>
      <div className={styles['boxContainerBottom']}>
        {renderBoxes(5, false)}
      </div>
    </div>
  );
};

export default LoadingAnimation;
