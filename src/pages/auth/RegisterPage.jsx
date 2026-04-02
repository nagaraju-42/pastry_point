import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import useAuth from '../../hooks/useAuth.js'
import ROUTES from '../../constants/routes.js'

export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPw, setShowPw] = useState(false)

  const handleChange = e => {
    clearError()
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await register(form)
      navigate(ROUTES.HOME)
    } catch { /* error shown via store */ }
  }

  return (
    <div className="min-h-screen bg-bakery-cream flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🥐</div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Create an account</h1>
          <p className="text-gray-500 text-sm mt-1">Skip the queue, order online!</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="label">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="input" placeholder="Arjun Sharma" required />
            </div>

            <div>
              <label className="label">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="input" placeholder="you@example.com" required />
            </div>

            <div>
              <label className="label">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                className="input" placeholder="9876543210" maxLength={10} />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  className="input pr-10" placeholder="Min 6 characters" required minLength={6} />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-bakery-green font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
