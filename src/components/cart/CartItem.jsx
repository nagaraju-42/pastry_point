import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import useCart from '../../hooks/useCart.js'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
      {/* Item image placeholder */}
      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover rounded-lg" />
        ) : '🥐'}
      </div>

      {/* Name + price */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{item.itemName}</p>
        <p className="text-xs text-bakery-green font-semibold mt-0.5">{formatCurrencyShort(item.price)}</p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center
                     text-gray-600 hover:border-bakery-green hover:text-bakery-green transition-colors"
        >
          {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
        </button>
        <span className="w-6 text-center text-sm font-semibold text-gray-800">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
          className="w-7 h-7 rounded-lg bg-bakery-green text-white flex items-center justify-center
                     hover:bg-green-800 transition-colors"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Line total */}
      <p className="text-sm font-bold text-gray-700 w-14 text-right">
        {formatCurrencyShort(item.lineTotal)}
      </p>
    </div>
  )
}
