import { create } from 'zustand'
import { authApi } from '../api/authApi.js'

const TOKEN_KEY = 'bakeryq_token'
const USER_KEY  = 'bakeryq_user'

const useAuthStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────
  user:  JSON.parse(localStorage.getItem(USER_KEY)  || 'null'),
  token: localStorage.getItem(TOKEN_KEY) || null,
  loading: false,
  error: null,

  // ── Computed ───────────────────────────────────────────────────────────
  isLoggedIn: () => !!get().token,
  isAdmin:    () => get().user?.role === 'ADMIN',
  isKitchen:  () => get().user?.role === 'KITCHEN_STAFF' || get().user?.role === 'ADMIN',

  // ── Actions ────────────────────────────────────────────────────────────
  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const data = await authApi.login(credentials)
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data))
      set({ user: data, token: data.token, loading: false })
      return data
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      set({ error: msg, loading: false })
      throw new Error(msg)
    }
  },

  register: async (formData) => {
    set({ loading: true, error: null })
    try {
      const data = await authApi.register(formData)
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data))
      set({ user: data, token: data.token, loading: false })
      return data
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      set({ error: msg, loading: false })
      throw new Error(msg)
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    set({ user: null, token: null, error: null })
  },

  updateLoyaltyPoints: (points) => {
    const user = get().user
    if (user) {
      const updated = { ...user, loyaltyPoints: points }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      set({ user: updated })
    }
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
