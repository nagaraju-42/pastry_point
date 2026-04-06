import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth.js'
import useCart from '../../hooks/useCart.js'
import ROUTES from '../../constants/routes.js'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth()
  const { itemCount, toggleCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate(ROUTES.HOME)
  }

  const navLinks = [
    { to: ROUTES.HOME, label: 'Home' },
    { to: ROUTES.MENU, label: 'Menu' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 font-bold text-lg md:text-xl font-sans bg-gradient-orange bg-clip-text text-transparent">
            Pastry Point
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${location.pathname === link.to
                    ? 'text-primary-500 font-semibold'
                    : 'text-gray-700 hover:text-primary-500'}`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to={ROUTES.ADMIN_DASHBOARD}
                className="px-4 py-2 rounded-xl text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1.5">
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Cart button */}
            {isLoggedIn && (
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-xl text-gray-600 hover:text-primary-500 hover:bg-gray-50 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-orange text-white text-[10px] font-bold
                                   w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center px-1 animate-bounce-soft">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth buttons */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to={ROUTES.PROFILE}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100/50 transition-all duration-200">
                  <div className="w-7 h-7 bg-gradient-orange text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout}
                  className="p-2 rounded-xl text-gray-500 hover:text-primary-500 transition-colors duration-200"
                  title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to={ROUTES.LOGIN} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors">Login</Link>
                <Link to={ROUTES.REGISTER} className="px-4 py-2 text-sm font-bold text-white bg-gradient-orange rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200">Sign Up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-slide-up">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link to={ROUTES.ORDER_HISTORY} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                My Orders
              </Link>
              <Link to={ROUTES.PROFILE} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Profile
              </Link>
              {isAdmin && (
                <Link to={ROUTES.ADMIN_DASHBOARD} onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={() => { handleLogout(); setMobileOpen(false) }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Login
              </Link>
              <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
