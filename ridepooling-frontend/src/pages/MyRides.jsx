import { useEffect, useState } from 'react'
import { api } from '../api'
import RideCard from '../components/RideCard'

// One component powers both /upcoming and /history
export default function MyRides({ type }) {
  const [rides, setRides] = useState(null)
  const [error, setError] = useState('')
  const isUpcoming = type === 'upcoming'

  useEffect(() => {
    api('/rides/mine')
      .then((data) => setRides(data[type]))
      .catch((err) => setError(err.message))
  }, [type])

  return (
    <div>
      <h2>{isUpcoming ? 'Upcoming rides' : 'Ride history'}</h2>
      {error && <p className="error">{error}</p>}
      {!rides && !error && <p className="hint">Loading…</p>}
      {rides && rides.length === 0 && (
        <p className="hint">{isUpcoming ? 'No upcoming rides yet.' : 'No past rides yet.'}</p>
      )}

      <div className="list">
        {rides?.map((ride) => (
          <RideCard key={ride.id} ride={ride}>
            <div className="contacts">
              <strong>
                {ride.role === 'driver' ? 'You posted this ride' : 'You joined this ride'}
              </strong>
              {ride.contacts.length === 0 && <p className="hint">No one has applied yet.</p>}
              {ride.contacts.map((c, i) => (
                <div key={i} className="contact">
                  <span>{c.name} <small>({c.role})</small></span>
                  {isUpcoming
                    ? <a href={`tel:${c.phone}`}>📞 {c.phone}</a>
                    : <span className="hint">completed</span>}
                </div>
              ))}
            </div>
          </RideCard>
        ))}
      </div>
    </div>
  )
}
