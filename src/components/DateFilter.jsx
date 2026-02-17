import React from 'react'

export default function DateFilter({ value, onChange }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <label>
        Filter by date: 
        <input
          type="date"
          value={value || ''}
          onChange={e => onChange(e.target.value || null)}
          style={{ marginLeft: 8 }}
        />
      </label>
      {value && (
        <button style={{ marginLeft: 12 }} onClick={() => onChange(null)}>Clear</button>
      )}
    </div>
  )
}
