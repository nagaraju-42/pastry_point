import { X, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useCart from '../../hooks/useCart.js'
import CartItem from './CartItem.jsx'
import CartSummary from './CartSummary.jsx'
import DeliveryBadge from './DeliveryBadge.jsx'
import ROUTES from '../../constants/routes.js'

export default function CartDrawer() {
  const { items, isOpen, closeCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    closeCart()
    navigate(ROUTES.CHECKOUT)
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl z-50
                       flex flex-col transition-transform duration-300 ease-out
                       ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/20 bg-white/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-orange rounded-xl">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <h2 className="font-bold text-xl text-neutral-text">Your Cart</h2>
          </div>
          <button onClick={closeCart}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-colors duration-200">
            <X size={20} />
          </button>
        </div>

        {/* Free delivery progress bar */}
        <DeliveryBadge />

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-semibold text-gray-600">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some delicious items from the menu</p>
              <button onClick={() => { closeCart(); navigate(ROUTES.MENU) }}
                className="btn-secondary mt-5 text-sm py-2 px-5">
                Browse Menu
              </button>
            </div>
          ) : (
            items.map(item => <CartItem key={item.cartItemId} item={item} />)
          )}
        </div>

        {/* Summary + checkout button */}
        {items.length > 0 && (
          <div className="border-t border-white/20 p-5 space-y-4 bg-white/50 backdrop-blur">
            <CartSummary />
            <button onClick={handleCheckout} className="w-full py-3 px-4 bg-gradient-orange text-white font-bold rounded-xl 
                                                       hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}
