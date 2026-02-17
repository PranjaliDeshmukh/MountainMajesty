import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { sendBookingEmail } from '../services/emailService'

export default function BookingForm({ room, date, onCancel, onConfirm }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const guestInfo = { name, email, mobile }
    
    try {
      // Send email notification
      await sendBookingEmail({
        room,
        date,
        guest: guestInfo
      })

      // Call the onConfirm callback
      onConfirm(guestInfo)
    } catch (error) {
      console.error('Booking error:', error)
      // Still proceed with booking even if email fails
      onConfirm(guestInfo)
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="booking-form-modal" onClick={e => e.stopPropagation()}>
        <div className="booking-form-header">
          <h2>Reserve {room.name}</h2>
          <button className="modal-close-btn" onClick={onCancel}>×</button>
        </div>
        
        <div className="booking-form-content">
          <div className="booking-details">
            <p className="booking-date">
              <strong>Check-in date:</strong> {date}
            </p>
            <p className="booking-price">
              <strong>Price:</strong> ₹{room.price}/night
            </p>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text"
                required 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email"
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input 
                type="tel"
                required 
                value={mobile} 
                onChange={e => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                className="form-input"
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit mobile number"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={onCancel} className="btn-cancel" disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn-confirm" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}
