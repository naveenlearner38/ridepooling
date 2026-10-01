import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { CITIES } from '../cities'

// datetime-local wants "YYYY-MM-DDTHH:mm" in LOCAL time (toISOString would give UTC)
const toInputValue = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

export default function PostRide() {
  const navigate = useNavigate()
  // the function form runs once, so the default time is "now + 1 hour" when the page opens
  const [form, setForm] = useState(() => ({
    source: '',
    destination: '',
    departureTime: toInputValue(new Date(Date.now() + 60 * 60000)),
    price: '',
    vehicleType: 'Car',
    allowedCount: 1,
  }))
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      // datetime-local gives local time without a zone; convert to a real ISO date
      await api('/rides', {
        method: 'POST',
        body: { ...form, departureTime: new Date(form.departureTime).toISOString() },
      })
      navigate('/upcoming')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Post a ride</h2>
      {error && <p className="error">{error}</p>}
      <label>Source
        <select name="source" value={form.source} onChange={handleChange} required>
          <option value="">Select source</option>
          {CITIES.map((city) => <option key={city}>{city}</option>)}
        </select>
      </label>
      <label>Destination
        <select name="destination" value={form.destination} onChange={handleChange} required>
          <option value="">Select destination</option>
          {CITIES.map((city) => <option key={city}>{city}</option>)}
        </select>
      </label>
      <label>Departure date & time
        <input name="departureTime" type="datetime-local" min={toInputValue(new Date())} value={form.departureTime} onChange={handleChange} required />
      </label>
      <div className="row">
        <label>Price per person (₹)
          <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
        </label>
        <label>Seats available
          <input name="allowedCount" type="number" min="1" max="10" value={form.allowedCount} onChange={handleChange} required />
        </label>
      </div>
      <label>Vehicle type
        <select name="vehicleType" value={form.vehicleType} onChange={handleChange}>
          <option>Bike</option>
          <option>Auto</option>
          <option>Car</option>
          <option>Van</option>
        </select>
      </label>
      <button className="btn">Post ride</button>
    </form>
  )
}
