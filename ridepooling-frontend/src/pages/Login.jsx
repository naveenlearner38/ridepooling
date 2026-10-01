import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Welcome back</h2>
      {error && <p className="error">{error}</p>}
      <label>Email
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>Password
        <input name="password" type="password" value={form.password} onChange={handleChange} required />
      </label>
      <button className="btn">Login</button>
      <p className="hint">New here? <Link to="/register">Create an account</Link></p>
    </form>
  )
}
