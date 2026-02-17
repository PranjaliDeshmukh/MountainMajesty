import React, { useState } from 'react'
import Availability from './Availability'
import Gallery from './Gallery'
import BookingForm from './BookingForm'
import ReviewsModal from './ReviewsModal'

const amenityIcons = {
  'WiFi': '📶',
  'Swimming Pool': '🏊',
  'Kitchen': '🍳',
  'Free Parking': '🅿️',
  'Mountain View': '⛰️',
  'Garden View': '🌳',
  'Restaurant': '🍽️',
  'Game Area': '🎮',
  'TV': '📺',
  'Air Conditioning': '❄️',
  'Heating': '🔥',
  'Washer': '🧺',
  'Dryer': '👔',
  'Iron': '👗',
  'Hair dryer': '💨',
  'Essentials': '🧴',
  'Private entrance': '🚪',
  'Workspace': '💻'
}

export default function RoomCard({ room, onBook }) {
  const [open, setOpen] = useState(false)
  const [booking, setBooking] = useState(null)
  const [showReviews, setShowReviews] = useState(false)

  const shortDescription = room.description.split('.')[0] + '.'

  // Handle review click - open Google Travel for Mountain Majesty, modal for others
  const handleReviewClick = () => {
    if (room.name.includes('Mountain Majesty')) {
      window.open('https://www.google.com/travel/search?q=mountain%20majesty%20karjat&g2lb=4965990%2C72317059%2C72414906%2C72471280%2C72485658%2C72560029%2C72573224%2C72647020%2C72686036%2C72799179%2C72803964%2C72882230%2C72958624%2C73059275%2C73064764%2C73107089%2C73169520%2C73192290%2C73198319&hl=en-IN&gl=in&ssta=1&ts=CAEaRwopEicyJTB4M2JkZDU3MWNkMmE0OGYxNToweGVhNTc0ODY0ZDI3YzVkYTISGhIUCgcI6g8QARgMEgcI6g8QARgNGAEyAhAA&qs=CAEyFENnc0lvcnZ4azgyTTBxdnFBUkFCOAJCCQmiXXzSZEhX6kIJCaJdfNJkSFfq&ap=ugEHcmV2aWV3cw&ictx=111&ved=0CAAQ5JsGahcKEwiI15DB3vuRAxUAAAAAHQAAAAAQBQ', '_blank')
    } else {
      setShowReviews(true)
    }
  }

  return (
    <div className="room-card">
      <div className="room-image-container">
        <img src={room.images[0]} alt={room.name} className="room-thumb" />
        <div className="room-price-badge">₹{room.price}/night</div>
        <div className="room-reviews-badge" onClick={handleReviewClick}>
          <span className="review-star">★</span> {room.rating} ({room.reviews})
        </div>
      </div>

      <div className="room-info">
        <div className="room-header">
          <h2>{room.name}</h2>
        </div>

        <p className="room-location">📍 {room.location} • {room.region}</p>
        
        <div className="room-details-compact">
          <span>{room.guests} guests</span>
          <span>•</span>
          <span>{room.bedrooms} bedroom{room.bedrooms > 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{room.beds} bed{room.beds > 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{room.bathrooms} bath{room.bathrooms > 1 ? 's' : ''}</span>
        </div>

        <p className="room-description-short">{shortDescription}</p>

        <div className="room-amenities-icons">
          {room.amenities.slice(0, 6).map((amenity, idx) => (
            <div key={idx} className="amenity-icon-item" title={amenity}>
              <span className="amenity-icon">{amenityIcons[amenity] || '✓'}</span>
              <span className="amenity-name">{amenity}</span>
            </div>
          ))}
        </div>

        <div className="room-host-section">
          <div className="host-info">
            <div className="host-avatar">{room.hostName.charAt(0)}</div>
            <div className="host-details">
              <div className="host-name">Hosted by {room.hostName}</div>
              <div className="host-rating-info" onClick={handleReviewClick}>
                ★ {room.hostRating} • {room.hostReviews} reviews
              </div>
            </div>
          </div>
        </div>

        <div className="room-actions">
          <button 
            className="btn-view-details" 
            onClick={() => {
              if (room.airbnbLink) {
                window.open(room.airbnbLink, '_blank')
              }
            }}
          >
            View More Details
          </button>
          <button className="btn-reserve" onClick={() => {
            if (room.availability.length > 0) {
              setBooking(room.availability[0])
            }
          }}>
            Reserve
          </button>
        </div>
      </div>

      {open && <Gallery images={room.images} onClose={() => setOpen(false)} />}

      {showReviews && <ReviewsModal room={room} onClose={() => setShowReviews(false)} />}

      {booking && (
        <BookingForm
          room={room}
          date={booking}
          onCancel={() => setBooking(null)}
          onConfirm={(guest) => { onBook(room.id, booking, guest); setBooking(null); }}
        />
      )}
    </div>
  )
}
