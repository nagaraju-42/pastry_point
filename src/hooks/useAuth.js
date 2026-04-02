import useAuthStore from '../store/authStore.js'

/**
 * Convenience hook — gives components easy access to auth state.
 * Usage:  const { user, isLoggedIn, logout } = useAuth()
 */
export default function useAuth() {
  const store = useAuthStore()
  return {
    user:      store.user,
    token:     store.token,
    loading:   store.loading,
    error:     store.error,
    isLoggedIn: store.isLoggedIn(),
    isAdmin:    store.isAdmin(),
    isKitchen:  store.isKitchen(),
    login:      store.login,
    register:   store.register,
    logout:     store.logout,
    clearError: store.clearError,
  }
}
