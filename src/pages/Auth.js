// src/pages/Auth.js
import React, { useState } from 'react';
import SignUp from '../components/SignUp';
import Login from '../components/Login';

function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div>
      <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
      {isSignUp ? <SignUp /> : <Login />}
      <button onClick={() => setIsSignUp(!isSignUp)}>
        Switch to {isSignUp ? 'Login' : 'Sign Up'}
      </button>
    </div>
  );
}

export default Auth;