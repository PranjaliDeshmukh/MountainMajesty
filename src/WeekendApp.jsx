import React, { useEffect, useState } from 'react'
import './styles.css'
import { rooms as initialRooms } from './data/rooms'
import RoomList from './components/RoomList'
import DateRangeSearch from './components/DateRangeSearch'

const STORAGE_KEY = 'mm_bookings'

function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveBookings(b) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(b))
}

export default function WeekendApp() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [searchFrom, setSearchFrom] = useState(null)
  const [searchTo, setSearchTo] = useState(null)
  const [bookings, setBookings] = useState(() => loadBookings())

  useEffect(() => { saveBookings(bookings) }, [bookings])

  const isBooked = (roomId, date) => bookings.some(b => b.roomId === roomId && b.date === date)

  const rooms = initialRooms.map(r => ({
    ...r,
    availability: r.availability.filter(d => !isBooked(r.id, d))
  }))

  const handleBook = (roomId, date, guest) => {
    setBookings(prev => [...prev, { roomId, date, guest }])
  }

  // initial: show all properties. If a date-range search is active, filter properties
  // that have any availability date within the inclusive range.
  const filtered = (searchFrom || searchTo || selectedDate)
    ? rooms.filter(r => {
        const hasMatch = r.availability.some(d => {
          if (selectedDate) return d === selectedDate
          const t = (dateStr) => new Date(dateStr)
          if (searchFrom && searchTo) {
            return t(d) >= t(searchFrom) && t(d) <= t(searchTo)
          }
          if (searchFrom) return t(d) >= t(searchFrom)
          if (searchTo) return t(d) <= t(searchTo)
          return false
        })
        return hasMatch
      })
    : rooms

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-logo">THE MAJESTY STAYS</div>
        <div style={{textAlign:'center'}}>
          <p style={{margin:0}}>View apartment availability, photos, and book your stay.</p>
        </div>
      </header>

      <div className="header-search">
        <DateRangeSearch onSearch={(from, to) => { setSearchFrom(from); setSearchTo(to); setSelectedDate(null) }} />
      </div>

      <main>
        <RoomList rooms={filtered} onBook={handleBook} />
      </main>

      <footer className="site-footer">© THE MAJESTY STAYS</footer>
    </div>
  )
}
