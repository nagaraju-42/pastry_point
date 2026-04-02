import { useParams } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useOrder } from '../../hooks/useOrders.js'
import OrderTracker from '../../components/order/OrderTracker.jsx'
import OrderStatusBadge from '../../components/order/OrderStatusBadge.jsx'
import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import { formatOrderDate } from '../../utils/formatDate.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

export default function OrderTrackingPage() {
  const { orderId } = useParams()
  const { data: order, isLoading } = useOrder(orderId)

  if (isLoading) return <LoadingSpinner text="Loading order status..." />

  return (
    <div className="page-container max-w-md mx-auto">
      <h1 className="section-title">Track Order</h1>
      <p className="text-gray-400 text-sm mb-6 font-mono">{order?.orderNumber}</p>

      <div className="card mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">{formatOrderDate(order?.createdAt)}</span>
          <OrderStatusBadge status={order?.status} />
        </div>
        <OrderTracker status={order?.status} />
        {order?.estimatedWaitMinutes && !['DELIVERED','CANCELLED'].includes(order?.status) && (
          <div className="flex items-center justify-center gap-2 mt-4 text-amber-700 bg-amber-50 rounded-xl py-3 text-sm font-medium">
            <Clock size={15} />
            Estimated wait: ~{order.estimatedWaitMinutes} min
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-3">Order Items</h3>
        <div className="space-y-2">
          {order?.items?.map(item => (
            <div key={item.orderItemId} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.itemName} × {item.quantity}</span>
              <span className="font-medium">{formatCurrencyShort(item.lineTotal)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-bakery-green">{formatCurrencyShort(order?.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
