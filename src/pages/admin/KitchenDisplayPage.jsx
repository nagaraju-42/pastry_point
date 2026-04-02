import { useState, useCallback } from 'react'
import { useKitchenOrders, useUpdateOrderStatus } from '../../hooks/useOrders.js'
import useWebSocket from '../../hooks/useWebSocket.js'
import { useQueryClient } from '@tanstack/react-query'
import { Clock, ChefHat, Bell } from 'lucide-react'
import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import { timeAgo } from '../../utils/formatDate.js'

function KitchenOrderCard({ order, onStart, onReady }) {
  const isConfirmed = order.status === 'CONFIRMED'
  const isPreparing = order.status === 'PREPARING'

  return (
    <div className={`rounded-2xl p-5 border-2 transition-all
      ${isPreparing ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-mono font-bold text-lg text-bakery-green">{order.orderNumber}</p>
          <p className="text-xs text-gray-400">{timeAgo(order.createdAt)}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full
          ${isPreparing ? 'bg-amber-400 text-white' : 'bg-blue-100 text-blue-700'}`}>
          {order.status}
        </span>
      </div>

      <p className="text-sm font-semibold text-gray-700 mb-3">{order.orderType} · {order.userName}</p>

      <div className="space-y-1.5 mb-4">
        {order.items?.map(item => (
          <div key={item.orderItemId} className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{item.itemName}</span>
            <span className="font-bold text-gray-500">×{item.quantity}</span>
          </div>
        ))}
      </div>

      {order.specialInstructions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-800 mb-3">
          📝 {order.specialInstructions}
        </div>
      )}

      <div className="flex gap-2 mt-2">
        {isConfirmed && (
          <button onClick={() => onStart(order.orderId)}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600
                       text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
            <ChefHat size={16} /> Start Preparing
          </button>
        )}
        {isPreparing && (
          <button onClick={() => onReady(order.orderId)}
            className="flex-1 flex items-center justify-center gap-2 bg-bakery-green hover:bg-green-800
                       text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
            <Bell size={16} /> Mark Ready
          </button>
        )}
      </div>
    </div>
  )
}

export default function KitchenDisplayPage() {
  const { data: orders, isLoading } = useKitchenOrders()
  const { mutate: updateStatus } = useUpdateOrderStatus()
  const queryClient = useQueryClient()

  // Real-time updates via WebSocket
  const onWsMessage = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['orders', 'kitchen'] })
  }, [queryClient])
  useWebSocket('/topic/kitchen', onWsMessage)

  const handleStart = (orderId) => updateStatus({ orderId, status: 'PREPARING' })
  const handleReady = (orderId) => updateStatus({ orderId, status: 'READY' })

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-bakery-green rounded-xl flex items-center justify-center">
            <ChefHat size={22} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">Kitchen Display</h1>
            <p className="text-gray-400 text-xs">Live order queue · auto-refreshes</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-gray-400">Live</span>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-bakery-green rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && (!orders || orders.length === 0) && (
        <div className="flex flex-col items-center justify-center py-32 text-gray-500">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-lg font-semibold">All caught up!</p>
          <p className="text-sm mt-1">No active orders right now</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders?.map(order => (
          <KitchenOrderCard key={order.orderId} order={order} onStart={handleStart} onReady={handleReady} />
        ))}
      </div>
    </div>
  )
}
