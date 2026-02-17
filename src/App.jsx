import { useState } from 'react'
import './App.css'
import { rooms } from './data/rooms'
import RoomList from './components/RoomList'
import DateRangeSearch from './components/DateRangeSearch'
import logo from './assets/logo.jpg'

function App() {
  const [filteredRooms, setFilteredRooms] = useState(rooms)
  const [bookings, setBookings] = useState([])
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  })

  const handleSearch = (params) => {
    setSearchParams(params)
    
    let filtered = rooms
    
    // Filter by location
    if (params.location.trim()) {
      const locationLower = params.location.toLowerCase()
      filtered = filtered.filter(room => 
        room.location.toLowerCase().includes(locationLower) || 
        room.region.toLowerCase().includes(locationLower) ||
        room.name.toLowerCase().includes(locationLower)
      )
    }
    
    // Filter by guests
    if (params.guests > 0) {
      filtered = filtered.filter(room => room.guests >= params.guests)
    }
    
    // Filter by availability (check-in and check-out dates)
    if (params.checkIn && params.checkOut) {
      filtered = filtered.filter(room => {
        // Check if check-in date is available
        return room.availability.includes(params.checkIn)
      })
    } else if (params.checkIn) {
      filtered = filtered.filter(room => 
        room.availability.includes(params.checkIn)
      )
    }
    
    setFilteredRooms(filtered)
  }

  const handleBook = (roomId, date, guestInfo) => {
    setBookings([...bookings, { roomId, date, guestInfo }])
    alert(`Successfully booked! Confirmation sent to ${guestInfo.email}`)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <img src={logo} alt="Logo" className="header-logo" />
          <div className="header-text">
            <h1 className="app-title">THE MAJESTY STAYS</h1>
            <p className="app-subtitle">View apartment availability, photos, and book your stay.</p>
          </div>
        </div>
      </header>

      <DateRangeSearch onSearch={handleSearch} initialParams={searchParams} />

      <main className="app-main">
        <div className="results-header">
          <h2>
            {filteredRooms.length === 0 
              ? 'No properties found' 
              : `${filteredRooms.length} properties available`}
          </h2>
          {searchParams.location && (
            <p className="search-summary">
              Location: {searchParams.location} 
              {searchParams.guests > 1 && ` • ${searchParams.guests} guests`}
              {searchParams.checkIn && ` • Check-in: ${searchParams.checkIn}`}
            </p>
          )}
        </div>
        
        {filteredRooms.length > 0 ? (
          <RoomList rooms={filteredRooms} onBook={handleBook} />
        ) : (
          <div className="no-results">
            <p>Try adjusting your search filters to find available properties</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Mountain Majesty. All rights reserved. | Your trusted vacation rental platform</p>
      </footer>
    </div>
  )
}

export default App
