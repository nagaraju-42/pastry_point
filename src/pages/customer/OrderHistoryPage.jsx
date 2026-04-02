import { Link } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import { useMyOrders } from '../../hooks/useOrders.js'
import { orderApi } from '../../api/orderApi.js'
import OrderStatusBadge from '../../components/order/OrderStatusBadge.jsx'
import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import { formatOrderDate } from '../../utils/formatDate.js'
import { buildPath } from '../../constants/routes.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

export default function OrderHistoryPage() {
  const { data: orders, isLoading } = useMyOrders()

  const handleDownload = async (order) => {
    const res = await orderApi.downloadReceipt(order.orderId)
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a'); a.href = url
    a.download = `Receipt-${order.orderNumber}.pdf`; a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <h1 className="section-title">My Orders</h1>
      <p className="section-subtitle">Your order history</p>

      {isLoading && <LoadingSpinner />}

      {!isLoading && orders?.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-medium">No orders yet</p>
          <Link to="/menu" className="btn-primary mt-4 inline-block">Order Now</Link>
        </div>
      )}

      <div className="space-y-4">
        {orders?.map(order => (
          <div key={order.orderId} className="card">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-mono text-sm font-bold text-bakery-green">{order.orderNumber}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatOrderDate(order.createdAt)}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {order.items?.slice(0, 2).map(i => (
                <span key={i.orderItemId}>{i.itemName} ×{i.quantity}{order.items.indexOf(i) < order.items.length - 1 ? ', ' : ''}</span>
              ))}
              {order.items?.length > 2 && <span className="text-gray-400"> +{order.items.length - 2} more</span>}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-800">{formatCurrencyShort(order.totalAmount)}</span>
              <div className="flex gap-2">
                <button onClick={() => handleDownload(order)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-bakery-green transition-colors">
                  <Receipt size={13} /> Receipt
                </button>
                <Link to={buildPath.orderTracking(order.orderId)}
                  className="text-xs text-bakery-green font-semibold hover:underline">
                  Track Order →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
