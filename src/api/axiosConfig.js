import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor — attach JWT token to every request ─────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bakeryq_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — handle 401 globally ──────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Token expired — clear storage and redirect to login
      localStorage.removeItem('bakeryq_token')
      localStorage.removeItem('bakeryq_user')
      toast.error('Session expired. Please log in again.')
      window.location.href = '/login'
    } else if (status === 403) {
      toast.error('You do not have permission to do that.')
    } else if (status === 500) {
      toast.error('Something went wrong on the server. Please try again.')
    }

    return Promise.reject(error)
  }
)

export default api
