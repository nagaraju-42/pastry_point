import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../api/orderApi.js'
import toast from 'react-hot-toast'

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: orderApi.getMyOrders,
  })
}

export function useOrder(orderId) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
    refetchInterval: (data) => {
      // Auto-refresh every 15s if order not yet delivered/cancelled
      const done = ['DELIVERED', 'CANCELLED']
      return done.includes(data?.status) ? false : 15000
    },
  })
}

export function useAllOrders() {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: orderApi.getAllOrders,
    refetchInterval: 20000, // refresh admin orders every 20s
  })
}

export function useKitchenOrders() {
  return useQuery({
    queryKey: ['orders', 'kitchen'],
    queryFn: orderApi.getKitchenOrders,
    refetchInterval: 10000, // refresh kitchen every 10s
  })
}

export function usePlaceOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: orderApi.placeOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to place order')
    },
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, status, estimatedWaitMinutes }) =>
      orderApi.updateOrderStatus(orderId, status, estimatedWaitMinutes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order status updated')
    },
    onError: () => toast.error('Failed to update status'),
  })
}
