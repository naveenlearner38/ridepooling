import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Rides from './pages/Rides'
import PostRide from './pages/PostRide'
import MyRides from './pages/MyRides'

// Wrap pages that need a logged-in user
function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="hint">Loading…</p>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Protected><Rides /></Protected>} />
            <Route path="/post" element={<Protected><PostRide /></Protected>} />
            <Route path="/upcoming" element={<Protected><MyRides type="upcoming" /></Protected>} />
            <Route path="/history" element={<Protected><MyRides type="history" /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  )
}
