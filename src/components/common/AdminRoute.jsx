import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'
import ROUTES from '../../constants/routes.js'

/** Only allows ADMIN and KITCHEN_STAFF roles */
export default function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin, isKitchen } = useAuth()

  if (!isLoggedIn) return <Navigate to={ROUTES.ADMIN_LOGIN} replace />
  if (!isAdmin && !isKitchen) return <Navigate to={ROUTES.HOME} replace />
  return children
}
