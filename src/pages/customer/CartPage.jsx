import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import useCart from '../../hooks/useCart.js'
import CartItem from '../../components/cart/CartItem.jsx'
import CartSummary from '../../components/cart/CartSummary.jsx'
import DeliveryBadge from '../../components/cart/DeliveryBadge.jsx'
import ROUTES from '../../constants/routes.js'

export default function CartPage() {
  const { items, loading } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center py-24 text-center">
        <div className="text-7xl mb-5">🛒</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add items from the menu to get started</p>
        <Link to={ROUTES.MENU} className="btn-primary">Browse Menu</Link>
      </div>
    )
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="section-title mb-0">Your Cart</h1>
          <p className="text-gray-400 text-sm">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Free delivery progress */}
      <div className="card mb-4 p-0 overflow-hidden">
        <DeliveryBadge />
        <div className="p-4 space-y-3">
          {items.map(item => <CartItem key={item.cartItemId} item={item} />)}
        </div>
      </div>

      {/* Order summary */}
      <div className="card mb-4">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <ShoppingBag size={16} /> Order Summary
        </h3>
        <CartSummary />
      </div>

      <button onClick={() => navigate(ROUTES.CHECKOUT)} className="btn-primary w-full text-base py-4">
        Proceed to Checkout →
      </button>
    </div>
  )
}
