import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Download, Clock } from 'lucide-react'
import { useOrder } from '../../hooks/useOrders.js'
import { orderApi } from '../../api/orderApi.js'
import OrderTracker from '../../components/order/OrderTracker.jsx'
import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import ROUTES from '../../constants/routes.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

export default function OrderSuccessPage() {
  const { orderId } = useParams()
  const { data: order, isLoading } = useOrder(orderId)

  const handleDownloadReceipt = async () => {
    const res = await orderApi.downloadReceipt(orderId)
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a'); a.href = url
    a.download = `Receipt-${order?.orderNumber}.pdf`; a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) return <LoadingSpinner text="Loading order..." />

  return (
    <div className="page-container max-w-md mx-auto text-center">
      <div className="card mt-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-bakery-green" />
        </div>
        <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">Order Placed! 🎉</h1>
        <p className="text-gray-500 text-sm mb-1">Order <span className="font-mono font-semibold text-bakery-green">{order?.orderNumber}</span></p>
        <p className="text-gray-400 text-xs mb-6">Receipt sent to your email</p>

        {/* Tracker */}
        <div className="mb-6">
          <OrderTracker status={order?.status} />
        </div>

        {/* Wait time */}
        {order?.estimatedWaitMinutes && (
          <div className="flex items-center justify-center gap-2 bg-amber-50 text-amber-700 rounded-xl py-3 mb-5 text-sm font-medium">
            <Clock size={16} />
            Ready in approx. {order.estimatedWaitMinutes} minutes
          </div>
        )}

        {/* Items */}
        <div className="text-left space-y-2 mb-4">
          {order?.items?.map(item => (
            <div key={item.orderItemId} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.itemName} × {item.quantity}</span>
              <span className="font-medium">{formatCurrencyShort(item.lineTotal)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
            <span>Total Paid</span>
            <span className="text-bakery-green">{formatCurrencyShort(order?.totalAmount)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button onClick={handleDownloadReceipt} className="btn-secondary flex items-center justify-center gap-2">
            <Download size={16} /> Download Receipt
          </button>
          <Link to={ROUTES.ORDER_HISTORY} className="btn-ghost text-sm">View All Orders</Link>
          <Link to={ROUTES.MENU} className="btn-primary">Order More</Link>
        </div>
      </div>
    </div>
  )
}
