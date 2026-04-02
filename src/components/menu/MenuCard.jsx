import { Plus, Leaf, Flame } from 'lucide-react'
import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import useCart from '../../hooks/useCart.js'
import useAuth from '../../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../../constants/routes.js'

export default function MenuCard({ item }) {
  const { addItem } = useCart()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleAdd = () => {
    if (!isLoggedIn) { navigate(ROUTES.LOGIN); return }
    addItem(item.id, 1)
  }

  return (
    <div className="card-hover flex flex-col group">
      {/* Image */}
      <div className="relative w-full h-44 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl mb-3 overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🥐</div>
        )}
        {item.featured && (
          <span className="absolute top-2 left-2 bg-bakery-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Popular
          </span>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
            <span className="text-white font-semibold text-sm">Unavailable</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight">{item.name}</h3>
          {item.isVeg !== false ? (
            <Leaf size={14} className="text-green-600 flex-shrink-0 mt-0.5" title="Vegetarian" />
          ) : (
            <Flame size={14} className="text-red-500 flex-shrink-0 mt-0.5" title="Non-veg" />
          )}
        </div>

        {item.description && (
          <p className="text-xs text-gray-400 mb-2 line-clamp-2">{item.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-bold text-bakery-green text-base">
            {formatCurrencyShort(item.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!item.available}
            className="flex items-center gap-1 bg-bakery-green text-white text-xs font-semibold
                       px-3 py-1.5 rounded-lg hover:bg-green-800 active:scale-95 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
