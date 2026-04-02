import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'
import ROUTES from '../../constants/routes.js'
import { LayoutDashboard } from 'lucide-react'

export default function AdminLoginPage() {
  const { login, loading, error, clearError, isAdmin, isKitchen } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  // Already logged in as admin
  if (isAdmin || isKitchen) {
    navigate(ROUTES.ADMIN_DASHBOARD, { replace: true })
    return null
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const data = await login(form)
      if (data.role === 'ADMIN' || data.role === 'KITCHEN_STAFF') {
        navigate(ROUTES.ADMIN_DASHBOARD)
      } else {
        clearError()
        alert('This login is for shop staff only.')
      }
    } catch { /* error from store */ }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-bakery-green rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Staff Login</h1>
          <p className="text-gray-400 text-sm mt-1">BakeryQ Admin Panel</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input name="email" type="email" value={form.email}
                onChange={e => { clearError(); setForm(f => ({...f, email: e.target.value})) }}
                className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bakery-green text-sm"
                placeholder="admin@bakeryq.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input name="password" type="password" value={form.password}
                onChange={e => { clearError(); setForm(f => ({...f, password: e.target.value})) }}
                className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bakery-green text-sm"
                placeholder="••••••" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-bakery-green text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
