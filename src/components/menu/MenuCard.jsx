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
    <div className="bg-neutral-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover
                    transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 group flex flex-col">
      {/* Image */}
      <div className="relative w-full h-44 bg-gray-200 overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name}
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-primary-100 to-primary-50">🥐</div>
        )}
        {item.featured && (
          <span className="absolute top-3 left-3 bg-gradient-orange text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Featured
          </span>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Unavailable</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-neutral-text text-base leading-tight">{item.name}</h3>
          {item.isVeg !== false ? (
            <Leaf size={16} className="text-green-600 flex-shrink-0" title="Vegetarian" />
          ) : (
            <Flame size={16} className="text-red-500 flex-shrink-0" title="Non-veg" />
          )}
        </div>

        {item.description && (
          <p className="text-xs text-neutral-muted line-clamp-2">{item.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-bold bg-gradient-orange bg-clip-text text-transparent text-lg">
            {formatCurrencyShort(item.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!item.available}
            className="flex items-center gap-1.5 bg-gradient-orange text-white text-sm font-semibold
                       px-4 py-2 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
