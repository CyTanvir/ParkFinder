import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext/authContext';
import './ProfileAcc.css';
import teamImg from '../../Assets/team.png';
import { db } from '../../firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';


const ProfileAcc = () => {
  const { currentUser, signOut } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return;

      try {
        const favRef = collection(db, "users", currentUser.uid, "favorites");
        const snapshot = await getDocs(favRef);
        const favs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFavorites(favs);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to log out:", error);
      alert("Logout failed. Try again.");
    }
  };

  const handleRemoveFavorite = async (favId) => {
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "favorites", favId));
      setFavorites((prev) => prev.filter((fav) => fav.id !== favId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("❌ Failed to remove favorite.");
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
              <span className="label">Favorites:</span>
              <span className="value">{favorites.length} saved</span>
            </div>
          </div>

          <img src={teamImg} alt="Profile" className="profile-avatar" />
        </div>

        {favorites.length > 0 && (
          <div className="favorites-list">
            <h3>Favorited Parks</h3>
            <ul className="favorites-ul">
  {favorites.map((fav) => (
    <li key={fav.id} className="favorite-item">
      <button
        className="remove-btn"
        onClick={() => handleRemoveFavorite(fav.id)}
        title="Remove from favorites"
      >
        ❌
      </button>
      {fav.photo ? (
        <img
          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=${fav.photo}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
          alt={fav.name}
        />
      ) : (
        <img src="/default-park.jpg" alt="Default park" />
      )}
      <div>
        <strong>{fav.name}</strong>
        <p>{fav.vicinity}</p>
        {fav.rating && <p>Rating: {fav.rating}/5</p>}
      </div>
    </li>
  ))}
</ul>

          </div>
        )}

        <div className="profile-actions">
          <button className="btn btn-red" onClick={() => alert("Delete Account TBD")}>Delete My Account</button>
          <button className="btn btn-outline" onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileAcc;
