import { useState } from 'react'
import { useAllOrders, useUpdateOrderStatus } from '../../hooks/useOrders.js'
import OrderStatusBadge from '../../components/order/OrderStatusBadge.jsx'
import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import { formatOrderDate } from '../../utils/formatDate.js'
import { Link } from 'react-router-dom'
import ROUTES from '../../constants/routes.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { ArrowLeft } from 'lucide-react'

const STATUS_TRANSITIONS = {
  PENDING:          ['CONFIRMED', 'CANCELLED'],
  CONFIRMED:        ['PREPARING', 'CANCELLED'],
  PREPARING:        ['READY'],
  READY:            ['OUT_FOR_DELIVERY', 'DELIVERED'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED:        [],
  CANCELLED:        [],
}

export default function ManageOrdersPage() {
  const { data: orders, isLoading } = useAllOrders()
  const { mutate: updateStatus } = useUpdateOrderStatus()
  const [filter, setFilter] = useState('ALL')

  const filtered = filter === 'ALL' ? orders : orders?.filter(o => o.status === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link to={ROUTES.ADMIN_DASHBOARD} className="btn-ghost p-2"><ArrowLeft size={18} /></Link>
        <h1 className="font-display font-bold text-lg">Manage Orders</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all
                ${filter === s ? 'bg-bakery-green text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-bakery-green'}`}>
              {s}
            </button>
          ))}
        </div>

        {isLoading && <LoadingSpinner />}

        <div className="space-y-3">
          {filtered?.map(order => (
            <div key={order.orderId} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-sm font-bold text-bakery-green">{order.orderNumber}</span>
                  <span className="text-xs text-gray-400 ml-2">{formatOrderDate(order.createdAt)}</span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">{order.userName}</span> — {order.orderType}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                {order.items?.map(i => `${i.itemName} ×${i.quantity}`).join(', ')}
              </p>

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">{formatCurrencyShort(order.totalAmount)}</span>
                <div className="flex gap-2">
                  {STATUS_TRANSITIONS[order.status]?.map(next => (
                    <button key={next}
                      onClick={() => updateStatus({ orderId: order.orderId, status: next })}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
                        ${next === 'CANCELLED'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-bakery-light text-bakery-green hover:bg-green-200'}`}>
                      → {next}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
