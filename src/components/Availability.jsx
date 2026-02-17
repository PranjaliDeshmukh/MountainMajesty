import React from 'react'

export default function Availability({ dates = [], roomId, onRequestBook }) {
  if (!dates.length) {
    return (
      <div className="availability-section">
        <p style={{ color: '#999', fontSize: '0.9rem' }}>No dates available</p>
      </div>
    )
  }

  // Format date to readable format
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="availability-section">
      <h4>Available Dates</h4>
      <div className="availability-dates">
        {dates.slice(0, 8).map(d => (
          <button
            key={d}
            className="date-btn available"
            onClick={() => onRequestBook(d)}
            title={d}
          >
            {formatDate(d)}
          </button>
        ))}
        {dates.length > 8 && (
          <span className="date-btn" style={{ cursor: 'default', background: '#f5f5f5' }}>
            +{dates.length - 8} more
          </span>
        )}
      </div>
    </div>
  )
}
