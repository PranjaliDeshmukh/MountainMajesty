import React, { useState, useRef, useEffect } from 'react'

export default function DateRangeSearch({ onSearch, initialParams }) {
  const [location, setLocation] = useState(initialParams?.location || '')
  const [checkIn, setCheckIn] = useState(initialParams?.checkIn || '')
  const [checkOut, setCheckOut] = useState(initialParams?.checkOut || '')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [pets, setPets] = useState(0)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  const locationRef = useRef(null)
  const guestsRef = useRef(null)

  const destinations = [
    { name: 'Nearby', description: "Find what's around you", icon: '📍' },
    { name: 'Pune, Maharashtra', description: 'For sights like Dagdusheth Halwai Ganpati Temple', icon: '🏛️' },
    { name: 'North Goa, Goa', description: 'Popular beach destination', icon: '🏖️' },
    { name: 'Mumbai, Maharashtra', description: 'For its top-notch dining', icon: '🏙️' },
    { name: 'Lonavala, Maharashtra', description: 'For nature lovers', icon: '🏔️' },
    { name: 'Karjat, Maharashtra', description: 'Mountain escapes and waterfalls', icon: '🌲' },
    { name: 'Alibaug, Maharashtra', description: 'Beach getaway near Mumbai', icon: '🌊' }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false)
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setShowGuestsDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const totalGuests = adults + children
  const guestsText = totalGuests === 0 ? 'Add guests' : 
    `${totalGuests} guest${totalGuests > 1 ? 's' : ''}${infants > 0 ? `, ${infants} infant${infants > 1 ? 's' : ''}` : ''}${pets > 0 ? `, ${pets} pet${pets > 1 ? 's' : ''}` : ''}`

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch({
      location,
      checkIn,
      checkOut,
      guests: totalGuests
    })
  }

  const handleLocationSelect = (destination) => {
    setLocation(destination.name)
    setShowLocationDropdown(false)
  }

  return (
    <div className="date-range-search-container">
      <div className="search-card-airbnb">
        <div className="all-fields-row">
          <div className="date-field location-field-horizontal" ref={locationRef}>
            <label className="field-label">Where</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setShowLocationDropdown(true)}
              placeholder="Search destinations"
              className="date-input-airbnb"
            />
            {showLocationDropdown && (
              <div className="location-dropdown">
                <div className="dropdown-header">Suggested destinations</div>
                {destinations.map((dest, index) => (
                  <div
                    key={index}
                    className="destination-item"
                    onClick={() => handleLocationSelect(dest)}
                  >
                    <div className="destination-icon">{dest.icon}</div>
                    <div className="destination-info">
                      <div className="destination-name">{dest.name}</div>
                      <div className="destination-description">{dest.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="date-field">
            <label className="field-label">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              placeholder="Add date"
              className="date-input-airbnb"
            />
            {!checkIn && <span className="placeholder-text">Add date</span>}
          </div>

          <div className="date-field">
            <label className="field-label">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              placeholder="Add date"
              className="date-input-airbnb"
            />
            {!checkOut && <span className="placeholder-text">Add date</span>}
          </div>

          <div className="date-field guests-field-horizontal" ref={guestsRef}>
            <label className="field-label">Who</label>
            <div 
              className="guests-trigger"
              onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
            >
              <span className={totalGuests === 0 ? 'placeholder-text' : ''}>{guestsText}</span>
            </div>
            
            {showGuestsDropdown && (
              <div className="guests-dropdown">
                <div className="guest-category">
                  <div className="guest-info">
                    <div className="guest-title">Adults</div>
                    <div className="guest-subtitle">Age 13+</div>
                  </div>
                  <div className="guest-controls">
                    <button 
                      className="guest-btn"
                      onClick={() => setAdults(Math.max(0, adults - 1))}
                      disabled={adults === 0}
                    >
                      <span>−</span>
                    </button>
                    <span className="guest-count">{adults}</span>
                    <button 
                      className="guest-btn"
                      onClick={() => setAdults(adults + 1)}
                      disabled={totalGuests >= 16}
                    >
                      <span>+</span>
                    </button>
                  </div>
                </div>

                <div className="guest-category">
                  <div className="guest-info">
                    <div className="guest-title">Children</div>
                    <div className="guest-subtitle">Ages 2–12</div>
                  </div>
                  <div className="guest-controls">
                    <button 
                      className="guest-btn"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children === 0}
                    >
                      <span>−</span>
                    </button>
                    <span className="guest-count">{children}</span>
                    <button 
                      className="guest-btn"
                      onClick={() => setChildren(children + 1)}
                      disabled={totalGuests >= 16}
                    >
                      <span>+</span>
                    </button>
                  </div>
                </div>

                <div className="guest-category">
                  <div className="guest-info">
                    <div className="guest-title">Infants</div>
                    <div className="guest-subtitle">Under 2</div>
                  </div>
                  <div className="guest-controls">
                    <button 
                      className="guest-btn"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      disabled={infants === 0}
                    >
                      <span>−</span>
                    </button>
                    <span className="guest-count">{infants}</span>
                    <button 
                      className="guest-btn"
                      onClick={() => setInfants(infants + 1)}
                    >
                      <span>+</span>
                    </button>
                  </div>
                </div>

                <div className="guest-category">
                  <div className="guest-info">
                    <div className="guest-title">Pets</div>
                    <div className="guest-subtitle-link">Bringing a service animal?</div>
                  </div>
                  <div className="guest-controls">
                    <button 
                      className="guest-btn"
                      onClick={() => setPets(Math.max(0, pets - 1))}
                      disabled={pets === 0}
                    >
                      <span>−</span>
                    </button>
                    <span className="guest-count">{pets}</span>
                    <button 
                      className="guest-btn"
                      onClick={() => setPets(pets + 1)}
                    >
                      <span>+</span>
                    </button>
                  </div>
                </div>

                <div className="guests-note">
                  This place has a maximum of 5 guests, not including infants. Pets aren't allowed.
                </div>

                <div className="guests-footer">
                  <button 
                    className="guests-close-btn"
                    onClick={() => setShowGuestsDropdown(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="btn-wrapper">
            <button type="submit" onClick={handleSearch} className="btn-search-circle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentColor', strokeWidth: '4', overflow: 'visible'}}>
                <path fill="none" d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
