import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth/AuthContext.jsx'

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    // Session check happens synchronously against localStorage in practice,
    // but this guards against ever flashing protected content before the
    // check completes.
    return null
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
