import React, { useState, useEffect } from "react";
import logo from './assets/images/aa.png';
import 'normalize.css';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faMapMarkerAlt, faPhone, faGlobe, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

// Manually Added Accommodation Data
const accommodations = [
  { id: 1, name: "Swadha Boy's PG", address: "15, Block A-06, AIISH Colony, Bogadi 2nd Stage, Bhogadi, Mysuru, Karnataka 570026", type: "boy", place_id: "PLACE_ID_1" },
  { id: 2, name: "Santrupthi Boys PG", address: "661, Sahukar Chennaiah Road, Janatha Nagar, Bogadi 2nd Stage, TK Layout, Mysuru, Karnataka 570009", type: "boy", place_id: "PLACE_ID_2" },
  { id: 3, name: "Roy Boys PG", address: "8J35+CGQ, Bogadi 2nd Stage, Bhogadi, Mysuru, Karnataka 570009", type: "boy", place_id: "PLACE_ID_3" },
  { id: 4, name: "Darshini Ladies PG", address: "North Nirmithi Kendra, 174, 6th cross, Bogadi 2nd stage Siddalingeshwara layout, Mysuru, Karnataka 570026", type: "girl", place_id: "PLACE_ID_4" },
  { id: 5, name: "Siri PG For Women", address: "Ladies Hostel, Bogadi 2nd Stage Main Rd, Bogadi 2nd Stage North, Bhogadi, Mysuru, Karnataka 570026", type: "girl", place_id: "PLACE_ID_5" },
  { id: 6, name: "Sai Prerna PG for Girls", address: "Do/No. 97/9, 2nd main, 4th Stage, Vijayanagar, Mysuru, Karnataka 570032", type: "girl", place_id: "PLACE_ID_6" },
];

const API_KEY = 'AlzaSy0S9F-IYJcDAXrz9UJgqD0XvBx-xfRfrUT'; // Replace with your GoMaps API key

const App = () => {
  const [location] = useState({ lat: 12.3084, lng: 76.6413 }); // Sample location
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGender, setSelectedGender] = useState('all'); // 'all', 'boy', 'girl'
  const [imageModal, setImageModal] = useState(null); // To handle large image modal

  useEffect(() => {
    // Adding Poppins font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
 
 
  

  const handleSearchInput = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    if (searchTerm.length > 2) {
      fetch(`https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(searchTerm)}&location=${location.lat},${location.lng}&radius=5000&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => setSuggestions(data.predictions || []))
        .catch((err) => console.error('Failed to fetch suggestions from GoMaps:', err));
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.description);
    setSuggestions([]);
    fetchPlaceDetails(suggestion.place_id);
  };

  const fetchPlaceDetails = (placeId) => {
    setLoading(true);
    fetch(`https://maps.gomaps.pro/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          setSelectedPlace(data.result);
        } else {
          console.error('Place details not found');
        }
      })
      .catch((err) => console.error('Failed to fetch place details from GoMaps:', err))
      .finally(() => setLoading(false));
  };

  const handleUberClick = () => {
    if (selectedPlace) {
      const uberURL = `https://m.uber.com/?action=setPickup&dropoff[latitude]=${selectedPlace.geometry.location.lat}&dropoff[longitude]=${selectedPlace.geometry.location.lng}`;
      window.open(uberURL, '_blank');
    }
  };

  const handleGetDirections = () => {
    if (selectedPlace) {
      const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.geometry.location.lat},${selectedPlace.geometry.location.lng}&travelmode=driving`;
      window.open(directionsURL, '_blank');
    }
  };
  

  const filteredAccommodations = accommodations.filter(accommodation => 
    selectedGender === 'all' || accommodation.type === selectedGender
  );

  // Handle manually added place selection
  const selectManuallyAddedPlace = (place) => {
    setQuery(place.name); // Place name into search bar
    handleSearchInput({ target: { value: place.name } }); // Trigger suggestions
  };

  const closeImageModal = () => setImageModal(null);

  return (
    <div className="app" style={{ fontFamily: 'Poppins, sans-serif' }}>
  <header>
    <center>
      <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img src={logo} alt="Logo" className="header-logo" style={{ height: '50px' }} />
      StaySpot
      </div>
      <p className="para">Student Accommodation Finder with Directions & Uber Rides</p>
    </center>
  </header>


      {/* Selected Place Overlay */}
      {selectedPlace && (
        <div className="selected-place-overlay">
          <div className="overlay-content">
            <button className="close-overlay" onClick={() => setSelectedPlace(null)}>
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
            <h2>{selectedPlace.name}</h2>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {selectedPlace.formatted_address}</p>
            <p><FontAwesomeIcon icon={faPhone} /> {selectedPlace.formatted_phone_number || 'Not Available'}</p>
            <p><FontAwesomeIcon icon={faGlobe} /> {selectedPlace.website || 'Not Available'}</p>
            <div className="place-images">
              {selectedPlace.photos && selectedPlace.photos.map((photo, index) => (
                <img
                  key={index}
                  src={`https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_KEY}`}
                  alt={selectedPlace.name}
                  onClick={() => setImageModal(photo.photo_reference)}
                />
              ))}
            </div>
            <div className="place-actions">
              <button className="uber-button" onClick={handleUberClick}>Get Uber</button>
              <button className="directions-button" onClick={handleGetDirections}>Get Directions</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal for large view */}
      {imageModal && (
        <div className="image-modal">
          <div className="modal-content">
            <img
              src={`https://maps.gomaps.pro/maps/api/place/photo?maxwidth=1000&photoreference=${imageModal}&key=${API_KEY}`}
              alt="Medium view"
            />
            <button className="close-modal" onClick={closeImageModal}>
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} className="icon" />
        <input
          type="text"
          value={query}
          onChange={handleSearchInput}
          placeholder="Search PG/Hostels near you"
          className="search-input"
        />
        <FontAwesomeIcon icon={faTimes} className="icon close-icon" onClick={() => setQuery('')} />
        {loading && <p>Loading...</p>}
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion" onClick={() => selectSuggestion(suggestion)}>
                {suggestion.description}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters Below Search Bar */}
      <div className="filters">
        <label>
          <center>
          <input 
            type="checkbox" 
            checked={selectedGender === 'boy'} 
            onChange={() => setSelectedGender(selectedGender === 'boy' ? 'all' : 'boy')} 
          />
          Boys
          </center>
        </label>
        <label><center>
          <input 
            type="checkbox" 
            checked={selectedGender === 'girl'} 
            onChange={() => setSelectedGender(selectedGender === 'girl' ? 'all' : 'girl')} 
          />
          Girls
          </center>
        </label>
      </div>

      {/* Accommodation List */}
      <div className="accommodation-list">
        {filteredAccommodations.map((accommodation) => (
          <div
            key={accommodation.id}
            className="accommodation-item"
            onClick={() => selectManuallyAddedPlace(accommodation)}
          >
            <h3>{accommodation.name}</h3>
            <p>{accommodation.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
