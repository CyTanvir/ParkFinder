import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import './HotSpot.css';

export default function ParkFinder() {
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
    parkMarkers.forEach(marker => {
      if (marker) {
        if (marker.map) {
          marker.map = null;
        } else if (marker.setMap) {
          marker.setMap(null);
        }
      }
    });
    
    setParkMarkers([]);
    
    if (currentInfoWindowRef.current) {
      currentInfoWindowRef.current.close();
      currentInfoWindowRef.current = null;
    }
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
          if (status === "OK" && results && results.length > 0) {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocoding failed with status: ${status}`));
          }
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
      setLocationError("Could not find that location. Please try again.");
      setSearchMessage("Location not found. Please check your spelling or try a different location.");
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
  
  
  const updateUserLocationMarker = (location) => {
    if (!window.google || !map) return;
    
    
    if (userMarker) {
      if (userMarker.map) {
        userMarker.map = null;
      } else if (userMarker.setMap) {
        userMarker.setMap(null);
      }
    }
    
    let newMarker;
  
    if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
      const pinElement = document.createElement("div");
      pinElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <circle cx="12" cy="12" r="10" fill="#4285F4" stroke="#ffffff" stroke-width="2" />
        </svg>
      `;
      
      newMarker = new window.google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: location,
        title: "Your Location",
        content: pinElement
      });
    } else {
      
      newMarker = new window.google.maps.Marker({
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
    }
    
    setUserMarker(newMarker);
  };
  
 
// Find parks near location
const findParksNearLocation = (location) => {
  if (!window.google || !map) {
    console.error("Google Maps not fully loaded");
    setSearchMessage("Map services not fully loaded. Please refresh the page.");
    return;
  }
  
  // Check if Places API is available
  if (!window.google.maps.places) {
    console.error("Google Maps Places library not loaded");
    setSearchMessage("Places API not loaded. Make sure your API key has Places API enabled.");
    return;
  }
  
  // Get radius
  const radius = parseInt(document.getElementById("radius-select").value);
  
  // Update search message
  setSearchMessage("Searching for parks...");
  
  try {
    // Create Places Service
    const service = new window.google.maps.places.PlacesService(map);
    
    // Define request
    const request = {
      location: location,
      radius: radius,
      keyword: 'park',
      type: 'park'  // Changed from ['park'] to 'park'
    };
    
    console.log("Places API request:", request); // Debug log
    
    // Nearby search
    service.nearbySearch(request, (results, status) => {
      console.log("Places API response status:", status); // Debug log
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        console.log("Found parks:", results.length); // Debug log
        if (results.length > 0) {
          displayParks(results, location);
        } else {
          setSearchMessage("No parks found within the selected radius.");
        }
      } else {
        // Handle errors
        console.error("Places API error:", status);
        let errorMsg = "Error searching for parks.";
        
        if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          errorMsg = "No parks found in this area.";
        } else if (status === window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
          errorMsg = "API quota exceeded. Please try again later.";
        } else if (status === window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
          errorMsg = "API request denied. Check your API key configuration.";
        } else if (status === window.google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
          errorMsg = "Invalid request. Please try a different location.";
        }
        
        setSearchMessage(errorMsg);
      }
    });
  } catch (error) {
    console.error("Error finding parks:", error);
    setSearchMessage("An error occurred while searching for parks. Please try again later.");
  }
};
  
  
  const displayParks = (parks, centerLocation) => {
    
    const processedParks = parks.map(park => {
      const parkLocation = {
        lat: park.geometry.location.lat(),
        lng: park.geometry.location.lng()
      };
      
      const distance = calculateDistance(
        centerLocation.lat,
        centerLocation.lng,
        parkLocation.lat,
        parkLocation.lng
      );
      
      return {
        id: park.place_id,
        name: park.name,
        location: parkLocation,
        vicinity: park.vicinity,
        rating: park.rating,
        distance: distance
      };
    });
    
   
    processedParks.sort((a, b) => a.distance - b.distance);
    
   
    const newMarkers = [];
    processedParks.forEach(park => {
      const marker = createParkMarker(park);
      newMarkers.push(marker);
    });
    
    setParkMarkers(newMarkers);
    setParksList(processedParks);
    
    
    setSearchMessage(`Found ${processedParks.length} parks nearby.`);
  };
  
  
  const createParkMarker = (park) => {
    if (!window.google || !map) return null;
    
    let parkMarker;
    
    
    if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
      
      const element = document.createElement("div");
      element.innerHTML = `
        <div style="cursor: pointer; width: 32px; height: 32px;">
          <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                  fill="#4CAF50" stroke="#ffffff" stroke-width="1"></path>
            <circle cx="12" cy="9" r="3" fill="#ffffff"></circle>
          </svg>
        </div>
      `;
      
      parkMarker = new window.google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: park.location,
        title: park.name,
        content: element
      });
      
      
      if (parkMarker.addListener) {
        parkMarker.addListener("click", () => {
        
          map.panTo(park.location);
          
          
          showParkInfo(park, parkMarker);
        });
      }
    } else {
      
      parkMarker = new window.google.maps.Marker({
        map: map,
        position: park.location,
        title: park.name,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
        }
      });
      
     
      parkMarker.addListener("click", () => {
       
        map.panTo(park.location);
        
        
        showParkInfo(park, parkMarker);
      });
    }
    
    return parkMarker;
  };
  
  
  const showParkInfo = (park, marker) => {
    if (!window.google || !map) return;
    
  
    const content = `
      <div style="padding: 8px; max-width: 260px;">
        <h3 style="margin: 0 0 8px; color: #4CAF50;">${park.name}</h3>
        <p>${park.vicinity || 'Address not available'}</p>
        <p>Distance: ${park.distance.toFixed(1)} km</p>
        ${park.rating ? `<p>Rating: ${park.rating} / 5</p>` : ''}
        <p><a href="https://www.google.com/maps/place/?q=place_id:${park.id}" target="_blank">View on Google Maps</a></p>
      </div>
    `;
    
    
    const infoWindow = new window.google.maps.InfoWindow({
      content: content
    });
    
    
    if (currentInfoWindowRef.current) {
      currentInfoWindowRef.current.close();
    }
    
   
    infoWindow.open(map, marker);
    currentInfoWindowRef.current = infoWindow;
  };
  
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    return distance;
  };
  
 
  const handleRadiusChange = (e) => {
    if (userLocation) {
      clearParkMarkers();
      findParksNearLocation(userLocation);
    }
  };
  

  const handleParkItemClick = (park, index) => {
    if (!map || !parkMarkers[index] || !window.google) return;
    
 
    map.setCenter(park.location);
    map.setZoom(16);
    
   
    if (window.google.maps.event && parkMarkers[index]) {
      window.google.maps.event.trigger(parkMarkers[index], "click");
    } else {
      showParkInfo(park, parkMarkers[index]);
    }
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
          {isLoading && (
            <div id="loading">
              <p>Loading map...</p>
            </div>
          )}
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
                  <p>Distance: {park.distance.toFixed(1)} km</p>
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
}