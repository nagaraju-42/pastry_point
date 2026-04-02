import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import useAuth from '../../hooks/useAuth.js'
import ROUTES from '../../constants/routes.js'

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || ROUTES.HOME

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)

  const handleChange = e => {
    clearError()
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch { /* error shown via store */ }
  }

  return (
    <div className="min-h-screen bg-bakery-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🥐</div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Welcome back!</h1>
          <p className="text-gray-500 text-sm mt-1">Login to start ordering</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="input" placeholder="you@example.com" required />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  className="input pr-10" placeholder="••••••" required />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-bakery-green font-semibold hover:underline">Sign up</Link>
          </p>
        </div>

        {/* Quick-fill for demo */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-center">
          <p className="font-semibold mb-1">Demo credentials</p>
          <p>Student: <span className="font-mono">student@test.com / test123</span></p>
          <p>Admin: <span className="font-mono">admin@bakeryq.com / admin123</span></p>
        </div>
      </div>
    </div>
  )
}
