import React from 'react'
import RoomCard from './RoomCard'

export default function RoomList({ rooms, onBook }) {
  return (
    <div className="room-list">
      {rooms.map(room => (
        <RoomCard key={room.id} room={room} onBook={onBook} />
      ))}
    </div>
  )
}
