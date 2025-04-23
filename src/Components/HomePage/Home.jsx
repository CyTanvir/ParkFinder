import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import './Home.css'; 

const Home = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [parkMarkers, setParkMarkers] = useState([]);
  const [userMarker, setUserMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState('');
  const [parksList, setParksList] = useState([]);
  const [searchMessage, setSearchMessage] = useState('Enter a location to find parks nearby.');

  const mapRef = useRef(null);
  const locationInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const currentInfoWindowRef = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places']
      });
  

      try {
        const google = await loader.load();
        const defaultLocation = { lat: 42.3297, lng: -83.0425 };

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 13,
          mapId: "PARK_FINDER_MAP",
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: false
        });

        setMap(mapInstance);
        setIsLoading(false);

        if (locationInputRef.current && google.maps.places) {
          autocompleteRef.current = new google.maps.places.Autocomplete(locationInputRef.current, {
            types: ['geocode']
          });
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        setIsLoading(false);
        setLocationError("Failed to load Google Maps. Please try again later.");
      }
    };

    initializeMap();

    return () => {
      if (currentInfoWindowRef.current) {
        currentInfoWindowRef.current.close();
      }
      clearParkMarkers();
    };
  }, []);

  const clearParkMarkers = () => {
    parkMarkers.forEach(marker => marker?.setMap(null));
    setParkMarkers([]);
    currentInfoWindowRef.current?.close();
    currentInfoWindowRef.current = null;
  };

  const findParksFromUserInput = async () => {
    clearParkMarkers();
    setSearchMessage("Finding location...");
    const locationInput = locationInputRef.current.value.trim();

    if (!locationInput) {
      setLocationError("Please enter a location");
      setSearchMessage("Please enter a location to find parks.");
      return;
    }

    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: locationInput }, (results, status) => {
          if (status === "OK" && results?.length > 0) resolve(results[0]);
          else reject(new Error(`Geocoding failed with status: ${status}`));
        });
      });

      const location = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng()
      };

      setUserLocation(location);
      setLocationError('');
      updateUserLocationMarker(location);
      map.setCenter(location);
      findParksNearLocation(location);
    } catch (error) {
      console.error("Geocoding error:", error);
      setLocationError("Could not find that location.");
      setSearchMessage("Location not found.");
    }
  };

  const useDefaultLocation = () => {
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };
    setLocationError('');
    setUserLocation(defaultLocation);
    updateUserLocationMarker(defaultLocation);
    map.setCenter(defaultLocation);
    findParksNearLocation(defaultLocation);
  };

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        updateUserLocationMarker(location);
        map.setCenter(location);
        findParksNearLocation(location);
        setLocationError('');
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError("Unable to retrieve your location. Please allow access.");
      }
    );
  };
  

  const updateUserLocationMarker = (location) => {
    userMarker?.setMap(null);

    const marker = new window.google.maps.Marker({
      map: map,
      position: location,
      title: "Your Location",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 2
      }
    });

    setUserMarker(marker);
  };

  const findParksNearLocation = (location) => {
    if (!window.google || !map || !window.google.maps.places) {
      setSearchMessage("Map services not fully loaded.");
      return;
    }

    const radius = parseInt(document.getElementById("radius-select").value);
    setSearchMessage("Searching for parks...");

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: location,
      radius: radius,
      keyword: 'park',
      type: 'park'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        displayParks(results, location);
      } else {
        setSearchMessage("No parks found or an error occurred.");
      }
    });
  };

  const displayParks = (parks, centerLocation) => {
    const processedParks = parks.map(park => {
      const parkLocation = {
        lat: park.geometry.location.lat(),
        lng: park.geometry.location.lng()
      };

      const distanceKm = calculateDistance(
        centerLocation.lat, centerLocation.lng,
        parkLocation.lat, parkLocation.lng
      );

      const distanceMiles = distanceKm * 0.621371;

      return {
        id: park.place_id,
        name: park.name,
        location: parkLocation,
        vicinity: park.vicinity,
        rating: park.rating,
        distance: distanceMiles
      };
    });

    processedParks.sort((a, b) => a.distance - b.distance);

    const newMarkers = processedParks.map(park => createParkMarker(park));
    setParkMarkers(newMarkers);
    setParksList(processedParks);
    setSearchMessage(`Found ${processedParks.length} parks nearby.`);
  };

  const createParkMarker = (park) => {
    const marker = new window.google.maps.Marker({
      map: map,
      position: park.location,
      title: park.name,
      animation: window.google.maps.Animation.DROP,
      icon: {
        url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
      }
    });

    marker.addListener("click", () => {
      map.panTo(park.location);
      showParkInfo(park, marker);
    });

    return marker;
  };

  const showParkInfo = (park, marker) => {
    const content = `
      <div style="padding: 8px; max-width: 260px;">
        <h3 style="margin: 0 0 8px; color: #4CAF50;">${park.name}</h3>
        <p>${park.vicinity || 'Address not available'}</p>
        <p>Distance: ${park.distance.toFixed(1)} mi</p>
        ${park.rating ? `<p>Rating: ${park.rating} / 5</p>` : ''}
        <p><a href="https://www.google.com/maps/place/?q=place_id:${park.id}" target="_blank">View on Google Maps</a></p>
      </div>
    `;

    const infoWindow = new window.google.maps.InfoWindow({ content });
    currentInfoWindowRef.current?.close();
    infoWindow.open(map, marker);
    currentInfoWindowRef.current = infoWindow;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleRadiusChange = () => {
    if (userLocation) {
      clearParkMarkers();
      findParksNearLocation(userLocation);
    }
  };

  const handleParkItemClick = (park, index) => {
    map.setCenter(park.location);
    map.setZoom(16);
    window.google.maps.event.trigger(parkMarkers[index], "click");
  };

  const handleLocationKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      findParksFromUserInput();
    }
  };

  return (
    <div className="park-finder">
      <header>
        <h1>Nearby Parks Finder</h1>
      </header>

      <main>
        <div id="map-container">
          <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
          {isLoading && <div id="loading"><p>Loading map...</p></div>}
        </div>

        <div id="sidebar">
          <div className="search-container">
            <input
              type="text"
              ref={locationInputRef}
              placeholder="Enter an address, city, or place"
              onKeyDown={handleLocationKeyDown}
            />
            <button onClick={findParksFromUserInput}>Find Parks</button>
            <button onClick={useDefaultLocation}>Use Default Location</button>
            <button onClick={getUserCurrentLocation}>Use My Current Location</button>
          </div>

          {locationError && (
            <div className="error-message" style={{ color: 'red' }}>
              <p>{locationError}</p>
            </div>
          )}

          <div className="controls">
            <label htmlFor="radius-select">Search Radius:</label>
            <select id="radius-select" defaultValue="1000" onChange={handleRadiusChange}>
              <option value="500">500 meters</option>
              <option value="1000">1 kilometer</option>
              <option value="2000">2 kilometers</option>
              <option value="5000">5 kilometers</option>
              <option value="10000">10 kilometers</option>
            </select>
          </div>

          <h2>Parks Near You</h2>
          <div id="parks-list">
            {parksList.length > 0 ? (
              parksList.map((park, index) => (
                <div
                  key={park.id}
                  className="park-item"
                  onClick={() => handleParkItemClick(park, index)}
                >
                  <h3>{park.name}</h3>
                  <p>Distance: {park.distance.toFixed(1)} mi</p>
                  {park.rating && <p>Rating: {park.rating} / 5</p>}
                  <p>{park.vicinity || ''}</p>
                </div>
              ))
            ) : (
              <p>{searchMessage}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
