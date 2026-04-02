// import { useEffect } from 'react'
// import useCartStore from '../store/cartStore.js'
// import useAuth from './useAuth.js'

// /**
//  * Hook to access and manipulate the cart.
//  * Automatically fetches cart when user is logged in.
//  */
// export default function useCart() {
//   const store = useCartStore()
//   const { isLoggedIn } = useAuth()

//   // Fetch cart from backend when user logs in
//   useEffect(() => {
//     if (isLoggedIn && !store.cart) {
//       store.fetchCart()
//     }
//   }, [isLoggedIn])

//   return {
//     cart:           store.cart,
//     items:          store.cart?.items || [],
//     itemCount:      store.itemCount(),
//     subtotal:       store.subtotal(),
//     total:          store.total(),
//     deliveryCharge: store.cart?.deliveryCharge || 0,
//     isFreeDelivery: store.isFreeDelivery(),
//     amountToFreeDelivery: store.amountToFreeDelivery(),
//     freeDeliveryMin: 300,
//     isOpen:         store.isOpen,
//     loading:        store.loading,

//     fetchCart:      store.fetchCart,
//     addItem:        store.addItem,
//     updateQuantity: store.updateQuantity,
//     removeItem:     store.removeItem,
//     clearCart:      store.clearCart,
//     clearCartLocally: store.clearCartLocally,
//     openCart:       store.openCart,
//     closeCart:      store.closeCart,
//     toggleCart:     store.toggleCart,
//   }
// }
import { useEffect } from 'react'
import useCartStore from '../store/cartStore.js'
import useAuth from './useAuth.js'

/**
 * Hook to access and manipulate the cart.
 * Automatically fetches cart when user is logged in.
 * Fails silently on auth errors (403/401) to avoid infinite retry loops.
 */
export default function useCart() {
  const store = useCartStore()
  const { isLoggedIn } = useAuth()

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (isLoggedIn && !store.cart) {
      store.fetchCart()
    }
    // Clear cart locally when user logs out
    if (!isLoggedIn && store.cart) {
      store.clearCartLocally()
    }
  }, [isLoggedIn])

  return {
    cart:           store.cart,
    items:          store.cart?.items || [],
    itemCount:      store.itemCount(),
    subtotal:       store.subtotal(),
    total:          store.total(),
    deliveryCharge: store.cart?.deliveryCharge || 0,
    isFreeDelivery: store.isFreeDelivery(),
    amountToFreeDelivery: store.amountToFreeDelivery(),
    freeDeliveryMin: 300,
    isOpen:         store.isOpen,
    loading:        store.loading,

    fetchCart:      store.fetchCart,
    addItem:        store.addItem,
    updateQuantity: store.updateQuantity,
    removeItem:     store.removeItem,
    clearCart:      store.clearCart,
    clearCartLocally: store.clearCartLocally,
    openCart:       store.openCart,
    closeCart:      store.closeCart,
    toggleCart:     store.toggleCart,
  }
}