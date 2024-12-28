import React from 'react';
import './Login.css';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-top-read', // Add this scope to access top tracks
  ].join('%20');
  

const Login = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

  return (
    <div className='login-app'>
      <h1 className='header'>My Music Player</h1>
      <p className='warning'>Recomended: Use desktop view !!</p>
      <a className='get-started' href={authUrl}>Get Started</a>
    </div>
  );
};

export default Login;
