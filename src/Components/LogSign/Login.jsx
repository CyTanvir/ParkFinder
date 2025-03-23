import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

import email_icon from '../Assets/email.png';
import pass_icon from '../Assets/pass.png';
import google_icon from '../Assets/google.png';

const Login = () => {
  
  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>Welcome Back</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={email_icon} alt="" />
          <input type="email" placeholder="Email" />
        </div>
        <div className="input">
          <img src={pass_icon} alt="" />
          <input type="password" placeholder="Password" />
        </div>
      </div>
      <div className="submit-container">
        <button className="submit">Sign In</button>
      </div>
      <div className="footer">
        <p>Don't have an account? <Link className='signIN' to="/">Sign up</Link></p> {}
        <p>OR</p>
        <button className="google-signin">
          <img className='google-icon' src={google_icon} alt="" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
