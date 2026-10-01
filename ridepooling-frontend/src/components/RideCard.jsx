const ICONS = { Bike: '🏍️', Auto: '🛺', Car: '🚗', Van: '🚐' }

const formatTime = (iso) =>
  new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })

// Shared card. "children" lets each page add its own footer (join button, phone numbers...)
export default function RideCard({ ride, children }) {
  return (
    <div className="card ride">
      <div className="route">
        <span>{ride.source}</span>
        <span className="arrow">→</span>
        <span>{ride.destination}</span>
      </div>
      <div className="meta">
        <span>🕒 {formatTime(ride.departureTime)}</span>
        <span>{ICONS[ride.vehicleType]} {ride.vehicleType}</span>
        <span>₹{ride.price} / person</span>
        <span>💺 {ride.seatsLeft} of {ride.allowedCount} seats left</span>
      </div>
      <div className="posted-by">Posted by {ride.isMine ? 'you' : ride.creatorName}</div>
      {children}
    </div>
  )
}
