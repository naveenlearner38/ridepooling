import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">🚗 RidePool</NavLink>
      {user ? (
        <div className="nav-links">
          <NavLink to="/" end>Find Rides</NavLink>
          <NavLink to="/post">Post Ride</NavLink>
          <NavLink to="/upcoming">Upcoming</NavLink>
          <NavLink to="/history">History</NavLink>
          <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
          <button className="btn small ghost" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="nav-links">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </div>
      )}
    </nav>
  )
}
