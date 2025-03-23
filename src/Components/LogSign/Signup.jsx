import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

import user_icon from '../Assets/user.png';
import email_icon from '../Assets/email.png';
import pass_icon from '../Assets/pass.png';
import google_icon from '../Assets/google.png'

const Signup = () => {
  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>Welcome</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img className='user-icon' src={user_icon} alt="" />
          <input type="text" placeholder="Name" />
        </div>
        <div className="input">
          <img className='email-icon' src={email_icon} alt="" />
          <input type="email" placeholder="Email" />
        </div>
        <div className="input">
          <img className='pass-icon' src={pass_icon} alt="" />
          <input type="password" placeholder="Password" />
        </div>
      </div>
      <div className="submit-container">
        <button className="submit">Sign Up</button>
      </div>
      <div className="footer">
        <p>Already have an account? <Link to="/Login" className="signIN">Log In</Link></p>
        <p>OR</p>
        <button className="google-signin">
          <img className='google-icon' src={google_icon} alt="" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Signup;
