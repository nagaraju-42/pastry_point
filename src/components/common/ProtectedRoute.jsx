import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'
import ROUTES from '../../constants/routes.js'

/** Redirects to login if not authenticated */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }
  return children
}
