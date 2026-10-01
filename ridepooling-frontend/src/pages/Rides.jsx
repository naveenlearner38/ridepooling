import { useEffect, useState } from 'react'
import { api } from '../api'
import { CITIES } from '../cities'
import RideCard from '../components/RideCard'

export default function Rides() {
  const [rides, setRides] = useState([])
  const [search, setSearch] = useState({ source: '', destination: '' }) // what the user is typing
  const [filters, setFilters] = useState(search) // what was actually searched
  const [reload, setReload] = useState(0) // bump this number to fetch again
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null) // { type: 'ok' | 'error', text }

  // Runs on first load, and again whenever a search is submitted or a ride is joined
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.source) params.set('source', filters.source)
    if (filters.destination) params.set('destination', filters.destination)
    api(`/rides?${params}`)
      .then(setRides)
      .catch((err) => setMessage({ type: 'error', text: err.message }))
      .finally(() => setLoading(false))
  }, [filters, reload])

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters(search)
  }

  const handleJoin = async (id) => {
    try {
      const data = await api('/rides/join', { method: 'POST', body: { id } })
      setMessage({ type: 'ok', text: `${data.message} Check the Upcoming tab for contact details.` })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
    setReload((n) => n + 1)
  }

  return (
    <div>
      <h2>Find a ride</h2>
      <form className="search" onSubmit={handleSearch}>
        <select value={search.source} onChange={(e) => setSearch({ ...search, source: e.target.value })}>
          <option value="">Any source</option>
          {CITIES.map((city) => <option key={city}>{city}</option>)}
        </select>
        <select value={search.destination} onChange={(e) => setSearch({ ...search, destination: e.target.value })}>
          <option value="">Any destination</option>
          {CITIES.map((city) => <option key={city}>{city}</option>)}
        </select>
        <button className="btn">Search</button>
      </form>

      {message && <p className={message.type === 'ok' ? 'success' : 'error'}>{message.text}</p>}
      {loading && <p className="hint">Loading rides…</p>}
      {!loading && rides.length === 0 && <p className="hint">No upcoming rides found. Why not post one?</p>}

      <div className="list">
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride}>
            {ride.isMine ? (
              <span className="badge">Your ride</span>
            ) : ride.joined ? (
              <span className="badge ok">✓ Joined</span>
            ) : ride.seatsLeft === 0 ? (
              <span className="badge">Full</span>
            ) : (
              <button className="btn small" onClick={() => handleJoin(ride.id)}>Apply</button>
            )}
          </RideCard>
        ))}
      </div>
    </div>
  )
}
