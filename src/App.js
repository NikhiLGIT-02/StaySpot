import React, { useState } from 'react';
import './App.css';

function App() {
  const [pgs] = useState([
    { id: 1, name: 'PG 1 Boys PG', location: 'Near OM collections, Triveni Circle, Mysuru', priceRange: '₹7500 - ₹9000', roomType: 'Single', mapsLink: 'https://maps.google.com', uberLink: 'https://www.uber.com' },
    { id: 2, name: 'PG 1 Girls PG', location: 'Near Amrita Vishwa Vidyapeetham, Bogadi, Mysuru', priceRange: '₹5000 - ₹7500', roomType: 'Double Sharing', mapsLink: 'https://maps.google.com', uberLink: 'https://www.uber.com' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPG, setSelectedPG] = useState(null);
  const [selectedBudgets, setSelectedBudgets] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);

  const handlePGClick = (pg) => {
    setSelectedPG(pg);
  };

  const handleGoogleMapsClick = (mapsLink) => {
    window.open(mapsLink, '_blank');
  };

  const handleUberClick = (uberLink) => {
    window.open(uberLink, '_blank');
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    setSelectedBudgets(prevBudgets =>
      prevBudgets.includes(value) ? prevBudgets.filter(b => b !== value) : [...prevBudgets, value]
    );
  };

  const handleRoomTypeChange = (e) => {
    const value = e.target.value;
    setSelectedRoomTypes(prevTypes =>
      prevTypes.includes(value) ? prevTypes.filter(t => t !== value) : [...prevTypes, value]
    );
  };

  const filteredPGs = pgs.filter(pg =>
    pg.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedBudgets.length === 0 || selectedBudgets.some(budget => pg.priceRange.includes(budget))) &&
    (selectedRoomTypes.length === 0 || selectedRoomTypes.includes(pg.roomType))
  );

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1 className="title">StaySpot</h1>
        </header>

        <div className="content">
          {!selectedPG ? (
            <>
              <div className="filter-section">
                <div className="filters">
                  <h3>Budget</h3>
                  <label>
                    <input type="checkbox" value="₹9000" onChange={handleBudgetChange} />
                    ₹9000
                  </label>
                  <label>
                    <input type="checkbox" value="₹7500" onChange={handleBudgetChange} />
                    ₹7500
                  </label>
                  <label>
                    <input type="checkbox" value="₹5000" onChange={handleBudgetChange} />
                    ₹5000
                  </label>

                  <h3>Room Type</h3>
                  <label>
                    <input type="checkbox" value="Single" onChange={handleRoomTypeChange} />
                    Single
                  </label>
                  <label>
                    <input type="checkbox" value="Double Sharing" onChange={handleRoomTypeChange} />
                    Double Sharing
                  </label>
                  <label>
                    <input type="checkbox" value="Group Sharing" onChange={handleRoomTypeChange} />
                    Group Sharing
                  </label>
                </div>

                <div className="search-filter">
                  <input
                    type="text"
                    placeholder="Search PG by Name"
                    className="search-bar"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="pg-list">
                {filteredPGs.length > 0 ? (
                  filteredPGs.map((pg) => (
                    <div key={pg.id} className="pg-item" onClick={() => handlePGClick(pg)}>
                      <div className="pg-image-placeholder"></div>
                      <div className="pg-info">
                        <strong>{pg.name}</strong> <br />
                        {pg.location}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No PGs found.</p>
                )}
              </div>
            </>
          ) : (
            <div className="pg-detail">
              <div className="pg-image-placeholder-large"></div>
              <div className="pg-info">
                <h2>{selectedPG.name}</h2>
                <p>All types of Rooms available</p>
                <p>{selectedPG.location}</p>
                <div className="price-range">
                  {selectedPG.priceRange}
                </div>
              </div>

              <div className="button-group">
                <button
                  className="maps-button"
                  onClick={() => handleGoogleMapsClick(selectedPG.mapsLink)}
                >
                  Google Maps
                </button>
                <button
                  className="uber-button"
                  onClick={() => handleUberClick(selectedPG.uberLink)}
                >
                  Ride With Uber
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
