import React, { useState } from "react";
import "./MostVisited.css";

const MostVisited = () => {
  const [parks, setParks] = useState([]);
  const [zipcode, setZipcode] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const proxy = "https://corsproxy.io/?";
  const radius = 80000; // ~50 miles

  const fetchParks = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=park&keyword=park&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(`${proxy}${encodeURIComponent(url)}`);
    const data = await response.json();

    const filteredParks = data.results.filter(
      (place) => place.types && place.types.includes("park")
    );

    const sortedParks = filteredParks
      .filter((p) => p.user_ratings_total)
      .sort((a, b) => b.user_ratings_total - a.user_ratings_total);

    setParks(sortedParks.slice(0, 9));
  };

  const handleZipSearch = async () => {
    setHasSearched(true);
    try {
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
      const geoRes = await fetch(`${proxy}${encodeURIComponent(geoUrl)}`);
      const geoData = await geoRes.json();
      const { lat, lng } = geoData.results[0].geometry.location;
      fetchParks(lat, lng);
    } catch (err) {
      console.error("Failed to fetch geolocation:", err);
    }
  };

  return (
    <div id="mid">
      <div className="mid-h1">Most Visited Parks</div>
      <div className="mid-a1">
        Discover the top-rated and most visited parks around your area. Search by ZIP code and explore your next favorite spot.
      </div>
      <div className="zip-search">
        <input
          type="text"
          placeholder="Enter Zip Code"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />
        <button onClick={handleZipSearch}>Search</button>
      </div>
      <div className="park-grid">
        {parks.length > 0 ? (
          parks.map((park, index) => (
            <div
              key={index}
              className="park-box"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/place/?q=place_id:${park.place_id}`,
                  "_blank"
                )
              }
            >
              {park.photos && park.photos.length > 0 ? (
                <img
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${park.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                  alt={park.name}
                />
              ) : (
                <img src="/default-park.jpg" alt="No image available" />
              )}
              <h3>{park.name}</h3>
              <p>{park.vicinity}</p>
              {park.rating && <p>Rating: {park.rating} / 5</p>}
              {park.user_ratings_total && (
                <p>{park.user_ratings_total.toLocaleString()} ratings</p>
              )}
            </div>
          ))
        ) : (
          hasSearched && <p>No parks found. Try another ZIP code.</p>
        )}
      </div>
    </div>
  );
};

export default MostVisited;
