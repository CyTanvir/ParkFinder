import React from 'react';
import './Profileacc.css';

const AccountActions = () => {
  return (
    <div className="account-actions">
      {/* Profile Picture */}
      <div className="profile-pic-wrapper">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="profile-pic"
        />
      </div>

      {/* Name and Email */}
      <div className="action-box">
        <p><strong>First Name:</strong> John</p>
        <p><strong>Last Name:</strong> Doe</p>
        <p><strong>Email:</strong> john@example.com</p>
        <button className="mini-btn">Change Password</button>
      </div>

      {/* Parks Visited */}
      <div className="action-box">
        <p><strong>Parks Visited:</strong> 14</p>
      </div>

      {/* Check Your Reviews */}
      <div className="action-box clickable">
        <p><strong>Check Your Reviews</strong></p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Tap to view and edit reviews</p>
      </div>

      {/* Delete Account */}
      <div className="action-box delete clickable">
        <strong>Delete My Account</strong>
      </div>
    </div>
  );
};

export default AccountActions;
