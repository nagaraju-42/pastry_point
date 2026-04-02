import { Truck } from 'lucide-react'
import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import useCart from '../../hooks/useCart.js'

export default function DeliveryBadge() {
  const { subtotal, isFreeDelivery, amountToFreeDelivery, freeDeliveryMin } = useCart()
  const progress = Math.min(100, (subtotal / freeDeliveryMin) * 100)

  return (
    <div className="px-4 py-3 bg-green-50 border-b border-green-100">
      <div className="flex items-center gap-2 mb-1.5">
        <Truck size={15} className="text-bakery-green" />
        {isFreeDelivery ? (
          <p className="text-xs font-semibold text-bakery-green">🎉 You've unlocked FREE delivery!</p>
        ) : (
          <p className="text-xs text-gray-600">
            Add <span className="font-bold text-bakery-green">{formatCurrencyShort(amountToFreeDelivery)}</span> more for free delivery
          </p>
        )}
      </div>
      <div className="h-1.5 bg-green-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-bakery-green rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
