// import { create } from 'zustand'
// import { cartApi } from '../api/cartApi.js'
// import toast from 'react-hot-toast'

// const FREE_DELIVERY_MIN = 300

// const useCartStore = create((set, get) => ({
//   // ── State ──────────────────────────────────────────────────────────────
//   cart: null,          // Full cart object from backend
//   isOpen: false,       // Cart drawer open/close
//   loading: false,

//   // ── Computed ───────────────────────────────────────────────────────────
//   itemCount: () => get().cart?.totalItems || 0,
//   subtotal:  () => get().cart?.subtotal   || 0,
//   total:     () => get().cart?.totalAmount || 0,
//   isFreeDelivery: () => (get().cart?.subtotal || 0) >= FREE_DELIVERY_MIN,
//   amountToFreeDelivery: () => {
//     const sub = get().cart?.subtotal || 0
//     return Math.max(0, FREE_DELIVERY_MIN - sub)
//   },

//   // ── Actions ────────────────────────────────────────────────────────────
//   fetchCart: async () => {
//     set({ loading: true })
//     try {
//       const cart = await cartApi.getCart()
//       set({ cart, loading: false })
//     } catch {
//       set({ loading: false })
//     }
//   },

//   addItem: async (menuItemId, quantity = 1) => {
//     try {
//       const cart = await cartApi.addToCart(menuItemId, quantity)
//       set({ cart })
//       toast.success('Added to cart! 🛒')
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Could not add item')
//     }
//   },

//   updateQuantity: async (menuItemId, quantity) => {
//     try {
//       const cart = await cartApi.updateQuantity(menuItemId, quantity)
//       set({ cart })
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Update failed')
//     }
//   },

//   removeItem: async (menuItemId) => {
//     try {
//       const cart = await cartApi.removeItem(menuItemId)
//       set({ cart })
//       toast.success('Item removed')
//     } catch (err) {
//       toast.error('Could not remove item')
//     }
//   },

//   clearCart: async () => {
//     try {
//       await cartApi.clearCart()
//       set({ cart: null })
//     } catch { /* silent */ }
//   },

//   // Clear cart locally after order placed (no API call needed)
//   clearCartLocally: () => set({ cart: null }),

//   openCart:  () => set({ isOpen: true }),
//   closeCart: () => set({ isOpen: false }),
//   toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
// }))

// export default useCartStore
import { create } from 'zustand'
import { cartApi } from '../api/cartApi.js'
import toast from 'react-hot-toast'

const FREE_DELIVERY_MIN = 300

const useCartStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────
  cart: null,
  isOpen: false,
  loading: false,

  // ── Computed ───────────────────────────────────────────────────────────
  itemCount: () => get().cart?.totalItems || 0,
  subtotal:  () => get().cart?.subtotal   || 0,
  total:     () => get().cart?.totalAmount || 0,
  isFreeDelivery: () => (get().cart?.subtotal || 0) >= FREE_DELIVERY_MIN,
  amountToFreeDelivery: () => {
    const sub = get().cart?.subtotal || 0
    return Math.max(0, FREE_DELIVERY_MIN - sub)
  },

  // ── Actions ────────────────────────────────────────────────────────────
  fetchCart: async () => {
    set({ loading: true })
    try {
      const cart = await cartApi.getCart()
      set({ cart, loading: false })
    } catch (err) {
      set({ loading: false })
      // Silently clear on auth errors — prevents infinite retry spam
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        set({ cart: null })
        return  // Don't show error toast for auth issues
      }
      // Only show error for unexpected failures
      console.error('Cart fetch failed:', err?.message)
    }
  },

  addItem: async (menuItemId, quantity = 1) => {
    try {
      const cart = await cartApi.addToCart(menuItemId, quantity)
      set({ cart })
      toast.success('Added to cart! 🛒')
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not add item'
      toast.error(msg)
    }
  },

  updateQuantity: async (menuItemId, quantity) => {
    try {
      const cart = await cartApi.updateQuantity(menuItemId, quantity)
      set({ cart })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  },

  removeItem: async (menuItemId) => {
    try {
      const cart = await cartApi.removeItem(menuItemId)
      set({ cart })
      toast.success('Item removed')
    } catch {
      toast.error('Could not remove item')
    }
  },

  clearCart: async () => {
    try {
      await cartApi.clearCart()
      set({ cart: null })
    } catch { /* silent */ }
  },

  // Clear cart locally without API call (after order placed, or on logout)
  clearCartLocally: () => set({ cart: null }),

  openCart:   () => set({ isOpen: true }),
  closeCart:  () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
}))

export default useCartStore