import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./Login.css";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../../contexts/authContext/authContext"; 

import email_icon from "../Assets/email.png";
import pass_icon from "../Assets/pass.png";
import google_icon from "../Assets/google.png";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  if (userLoggedIn) return <Navigate to="/home" replace={true} />;

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="header">
          <div className="text">Welcome Back</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={email_icon} alt="email" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={pass_icon} alt="password" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div className="submit-container">
          <button className="submit" disabled={isSigningIn}>
            {isSigningIn ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>

      <div className="footer">
        <p> Don't have an account?{" "} 
          <Link className="signIN" to="/Signup">
            Sign up
          </Link>
        </p>
        <p>OR</p>
        <button
          className="google-signin"
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
        >
          <img className="google-icon" src={google_icon} alt="Google" />
          {isSigningIn ? "Signing In..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;
