import { useNavigate } from 'react-router-dom'
import { LogOut, Star, ShoppingBag, Phone, Mail, User } from 'lucide-react'
import useAuth from '../../hooks/useAuth.js'
import { useMyOrders } from '../../hooks/useOrders.js'
import ROUTES from '../../constants/routes.js'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { data: orders } = useMyOrders()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate(ROUTES.HOME)
  }

  const totalSpent = orders?.reduce((s, o) => s + (o.paymentStatus === 'PAID' ? Number(o.totalAmount) : 0), 0) || 0

  return (
    <div className="page-container max-w-lg mx-auto">
      <h1 className="section-title">My Profile</h1>

      {/* Avatar + name */}
      <div className="card flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-bakery-green text-white rounded-full flex items-center justify-center text-2xl font-bold font-display">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-lg text-gray-800">{user?.name}</p>
          <span className="badge-green text-[11px]">{user?.role === 'ADMIN' ? 'Shop Owner' : 'Student'}</span>
        </div>
      </div>

      {/* Info */}
      <div className="card mb-4 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Mail size={16} className="text-gray-400" />
          <span>{user?.email}</span>
        </div>
        {user?.phone && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Phone size={16} className="text-gray-400" />
            <span>{user?.phone}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: ShoppingBag, label: 'Orders', value: orders?.length || 0 },
          { icon: Star, label: 'Points', value: user?.loyaltyPoints || 0 },
          { icon: User, label: 'Total Spent', value: `₹${Math.round(totalSpent)}` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card text-center py-4">
            <Icon size={20} className="text-bakery-green mx-auto mb-1" />
            <p className="font-bold text-gray-800 text-lg">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Loyalty info */}
      {(user?.loyaltyPoints || 0) > 0 && (
        <div className="card mb-4 bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2 mb-1">
            <Star size={16} className="text-bakery-gold" />
            <p className="font-semibold text-amber-800 text-sm">Loyalty Points</p>
          </div>
          <p className="text-amber-700 text-sm">
            You have <strong>{user.loyaltyPoints} points</strong>.
            {user.loyaltyPoints >= 100 && ` Redeem ${Math.floor(user.loyaltyPoints / 100) * 100} points for ₹${Math.floor(user.loyaltyPoints / 100) * 10} off on your next order!`}
          </p>
        </div>
      )}

      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors">
        <LogOut size={18} /> Logout
      </button>
    </div>
  )
}
