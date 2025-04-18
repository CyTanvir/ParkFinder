import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext/authContext';
import './Signup.css';

import user_icon from '../Assets/user.png';
import email_icon from '../Assets/email.png';
import pass_icon from '../Assets/pass.png';
import google_icon from '../Assets/google.png';

const Signup = () => {
  const { userLoggedIn, signUp, signInWithGoogle } = useAuth(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (userLoggedIn) return <Navigate to="/home" replace={true} />;

  const handleSignup = async () => {
    try {
      await signUp(email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>Welcome</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img className='user-icon' src={user_icon} alt="" />
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="input">
          <img className='email-icon' src={email_icon} alt="" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input">
          <img className='pass-icon' src={pass_icon} alt="" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      <div className="submit-container">
        <button className="submit" onClick={handleSignup}>Sign Up</button>
      </div>
      <div className="footer">
        <p>Already have an account? <Link to="/" className="signIN">Log In</Link></p>
        <p>OR</p>
        <button className="google-signin" onClick={handleGoogleSignup}>
          <img className='google-icon' src={google_icon} alt="" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
