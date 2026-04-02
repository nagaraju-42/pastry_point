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
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50
                       flex flex-col transition-transform duration-300 ease-out
                       ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-bakery-green" />
            <h2 className="font-display font-semibold text-lg text-gray-800">Your Cart</h2>
          </div>
          <button onClick={closeCart}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
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
          <div className="border-t border-gray-100 p-4 space-y-3">
            <CartSummary />
            <button onClick={handleCheckout} className="btn-primary w-full">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}
