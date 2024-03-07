import React, { useEffect } from 'react';
import styles from './PreStart.module.css';
import './blobs.css';
import { useNavigate } from 'react-router-dom';

const PreStart = () => {
  // redirects to quiz after x milliseconds
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/app/quiz');
    }, 7000);
  }, [navigate]);


  return (
    <div>
      <header className={styles['header']}>
        <div className='container-logo'>
          <img src='/logo.png' alt='logo' className='logo' />
        </div>
      </header>
      <div className={styles['prestart-container']}>
        <h1 className={styles['text']}>
          Time to calibrate your vybe!<br />
          <br />
          Tap to select a colour.
        </h1>
        </div>
      </div>
  )};

export default PreStart;
