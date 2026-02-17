import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { fetchGoogleReviews } from '../services/googleReviews'

export default function ReviewsModal({ room, onClose }) {
  const [googleReviews, setGoogleReviews] = useState([])
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(true)

  // Fetch Google reviews on mount
  useEffect(() => {
    async function loadGoogleReviews() {
      if (room.googlePlaceId) {
        setIsLoadingGoogle(true)
        const reviews = await fetchGoogleReviews(room.googlePlaceId)
        setGoogleReviews(reviews)
        setIsLoadingGoogle(false)
      } else {
        setIsLoadingGoogle(false)
      }
    }

    loadGoogleReviews()
  }, [room.googlePlaceId])

  // Sample reviews from Airbnb and Booking.com platforms
  const otherPlatformReviews = [
    {
      id: 1,
      author: 'Priya S.',
      date: 'December 2025',
      rating: 5,
      comment: 'Amazing place! The mountain views were breathtaking and the host was very accommodating. The pool was clean and the property was exactly as described. Perfect weekend getaway!',
      avatar: 'P',
      platform: 'airbnb'
    },
    {
      id: 3,
      author: 'Sneha K.',
      date: 'October 2025',
      rating: 4,
      comment: 'Lovely place with beautiful views. The host was responsive and helpful. Only minor issue was the WiFi could be faster, but overall a great experience.',
      avatar: 'S',
      platform: 'booking'
    },
    {
      id: 4,
      author: 'Amit P.',
      date: 'September 2025',
      rating: 5,
      comment: 'Perfect for a family getaway! Kids loved the pool and the game area. The property is spacious and comfortable. Host provided excellent local recommendations.',
      avatar: 'A',
      platform: 'airbnb'
    },
    {
      id: 6,
      author: 'Vikram R.',
      date: 'July 2025',
      rating: 5,
      comment: 'Excellent value for money. Beautiful property with stunning views. Host was quick to respond to any queries. Highly recommended for nature lovers!',
      avatar: 'V',
      platform: 'booking'
    }
  ]

  // Combine Google reviews (from API) with other platform reviews
  const sampleReviews = [...googleReviews, ...otherPlatformReviews]

  const platformNames = {
    airbnb: 'Airbnb',
    google: 'Google',
    booking: 'Booking.com'
  }

  const platformColors = {
    airbnb: '#FF5A5F',
    google: '#4285F4',
    booking: '#003580'
  }

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  // Calculate platform-specific ratings
  const getPlatformRatings = () => {
    const platforms = {
      google: { total: 0, count: 0 },
      airbnb: { total: 0, count: 0 },
      booking: { total: 0, count: 0 }
    }

    sampleReviews.forEach(review => {
      platforms[review.platform].total += review.rating
      platforms[review.platform].count += 1
    })

    return {
      google: platforms.google.count > 0 ? (platforms.google.total / platforms.google.count).toFixed(1) : 0,
      airbnb: platforms.airbnb.count > 0 ? (platforms.airbnb.total / platforms.airbnb.count).toFixed(1) : 0,
      booking: platforms.booking.count > 0 ? (platforms.booking.total / platforms.booking.count).toFixed(1) : 0
    }
  }

  const platformRatings = getPlatformRatings()

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="reviews-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reviews-modal-header">
          <div>
            <h2>★ {room.rating} • {room.reviews} reviews</h2>
            <p className="reviews-subtitle">Combined reviews from Google, Airbnb & Booking.com</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Platform Ratings Breakdown */}
        <div className="platform-ratings-container">
          <div className="platform-rating-item">
            <span 
              className="platform-rating-badge" 
              style={{backgroundColor: platformColors.google}}
            >
              Google {isLoadingGoogle && '⏳'}
            </span>
            <span className="platform-rating-stars">
              {isLoadingGoogle ? 'Loading...' : `★ ${platformRatings.google}`}
            </span>
          </div>
          <div className="platform-rating-item">
            <span 
              className="platform-rating-badge" 
              style={{backgroundColor: platformColors.airbnb}}
            >
              Airbnb
            </span>
            <span className="platform-rating-stars">★ {platformRatings.airbnb}</span>
          </div>
          <div className="platform-rating-item">
            <span 
              className="platform-rating-badge" 
              style={{backgroundColor: platformColors.booking}}
            >
              Booking.com
            </span>
            <span className="platform-rating-stars">★ {platformRatings.booking}</span>
          </div>
        </div>
        
        <div className="reviews-list">
          {sampleReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="review-author-info">
                  <div className="review-avatar">{review.avatar}</div>
                  <div>
                    <div className="review-author-row">
                      <span className="review-author">{review.author}</span>
                      <span 
                        className="review-platform-badge" 
                        style={{backgroundColor: platformColors[review.platform]}}
                      >
                        {platformNames[review.platform]}
                      </span>
                    </div>
                    <div className="review-date">{review.date}</div>
                  </div>
                </div>
                <div className="review-rating">{renderStars(review.rating)}</div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}
