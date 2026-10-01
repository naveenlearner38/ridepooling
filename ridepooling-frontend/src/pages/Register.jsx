import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Create your account</h2>
      {error && <p className="error">{error}</p>}
      <label>Full name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>Email
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>Phone number
        <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
      </label>
      <label>Password
        <input name="password" type="password" minLength={6} value={form.password} onChange={handleChange} required />
      </label>
      <button className="btn">Register</button>
      <p className="hint">Already registered? <Link to="/login">Login</Link></p>
    </form>
  )
}
