import React, { useEffect }  from 'react';
import styles from './CompletedAnimation.module.css';
import './blobs.css';
import { useNavigate } from 'react-router-dom';

const  CompletedAnimation = () => {
  const navigate = useNavigate();

  useEffect(() => {
		setTimeout(() => {
			navigate('/app/home');
		}, 3000);
	}, [navigate]);

  return (
    <div className={styles['wrapper']}>
      <svg className={styles['animated-check']} viewBox='0 0 24 24'>
      <path d='M4.1 12.7L9 17.6 20.3 6.3' fill='none' /> </svg>
    </div>
  );
};

export default CompletedAnimation;