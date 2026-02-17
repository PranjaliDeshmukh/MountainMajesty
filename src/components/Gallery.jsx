import React from 'react'

export default function Gallery({ images = [], onClose }) {
  return (
    <div className="gallery-backdrop" onClick={onClose}>
      <div className="gallery" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>
        <div className="gallery-grid">
          {images.map((src, i) => (
            <img key={i} src={src} alt={`photo-${i}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
