import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext/authContext';
import './ProfileAcc.css';
import teamImg from '../../Assets/team.png'

const ProfileAcc = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2 className="profile-title">Welcome to ParkFinder</h2>

        <div className="profile-main-row">
          <div className="profile-info">
            <div className="profile-row">
              <span className="label">Email:</span>
              <span className="value">{currentUser.email}</span>
            </div>
            <div className="profile-row">
              <span className="label">Name:</span>
              <span className="value">{currentUser.displayName || "Not Set"}</span>
            </div>
            <div className="profile-row">
              <span className="label">Parks Visited:</span>
              <span className="value">N/A</span>
            </div>
          </div>


          <img
            src={teamImg}
            alt="Profile"
            className="profile-avatar"
          />
        </div>

        <div className="reviews-note">
          <strong>Check Your Reviews</strong>
          <span>Tap to view and edit reviews</span>
        </div>

        <div className="profile-actions">
          <button className="btn btn-green" onClick={() => alert("Change Password TBD")}>Change Password</button>
          <button className="btn btn-red" onClick={() => alert("Delete Account TBD")}>Delete My Account</button>
          <button className="btn btn-outline" onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileAcc;
