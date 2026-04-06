import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import ROUTES from '../../constants/routes.js'
import useAuth from '../../hooks/useAuth.js'
import useCart from '../../hooks/useCart.js'

export default function BottomNav() {
  const location = useLocation()
  const { isLoggedIn } = useAuth()
  const { itemCount } = useCart()

  const navItems = [
    { path: ROUTES.HOME, label: 'Home', icon: Home },
    { path: ROUTES.ORDER_HISTORY, label: 'Orders', icon: ShoppingBag, protected: true },
    { path: ROUTES.CART, label: 'Cart', icon: ShoppingCart, badge: itemCount, protected: true },
    { path: ROUTES.PROFILE, label: 'Profile', icon: User, protected: true },
  ]

  if (!isLoggedIn) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/80 backdrop-blur-xl border-t border-white/20 shadow-xl z-40">
      <div className="flex items-center justify-around">
        {navItems
          .filter(item => !item.protected || isLoggedIn)
          .map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
                           (item.path === ROUTES.HOME && location.pathname === '/')
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center justify-center py-4 relative transition-all duration-200
                  ${isActive ? 'text-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <div className="relative">
                  <Icon size={24} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-orange text-white text-xs font-bold 
                                   w-5 h-5 rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-semibold mt-1 ${isActive ? 'text-primary-500' : 'text-gray-500'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-orange rounded-full" />
                )}
              </Link>
            )
          })}
      </div>
    </nav>
  )
}
