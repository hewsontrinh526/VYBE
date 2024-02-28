import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SpotifyCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const quizCompleted = urlParams.get('quiz_completed') === 'true';

  localStorage.setItem('accessToken', accessToken);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('URL Params:', window.location.search);
    console.log('Access token stored:', accessToken)
    console.log('Quiz completed:', quizCompleted);

    const redirectPath = quizCompleted ? '/app/home' : '/app/quiz';
    navigate(redirectPath, { replace: true });
  }, [navigate, quizCompleted]);
  return null;
}

export default SpotifyCallback;