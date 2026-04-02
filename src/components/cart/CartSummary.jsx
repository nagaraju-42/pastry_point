import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import useCart from '../../hooks/useCart.js'

export default function CartSummary() {
  const { subtotal, deliveryCharge, total, isFreeDelivery } = useCart()

  return (
    <div className="space-y-1.5 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{formatCurrencyShort(subtotal)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Delivery</span>
        <span className={isFreeDelivery ? 'text-green-600 font-medium' : ''}>
          {isFreeDelivery ? 'FREE' : formatCurrencyShort(deliveryCharge)}
        </span>
      </div>
      <div className="flex justify-between font-bold text-base text-gray-800 pt-1.5 border-t border-gray-100">
        <span>Total</span>
        <span className="text-bakery-green">{formatCurrencyShort(total)}</span>
      </div>
    </div>
  )
}
