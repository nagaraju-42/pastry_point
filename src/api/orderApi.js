import api from './axiosConfig.js'

export const orderApi = {
  placeOrder: (data) =>
    api.post('/orders', data).then(r => r.data.data),

  getMyOrders: () =>
    api.get('/orders/my').then(r => r.data.data),

  getOrderById: (orderId) =>
    api.get(`/orders/${orderId}`).then(r => r.data.data),

  downloadReceipt: (orderId) =>
    api.get(`/orders/${orderId}/receipt`, { responseType: 'blob' }),

  // Admin
  getAllOrders: () =>
    api.get('/orders/admin/all').then(r => r.data.data),

  updateOrderStatus: (orderId, status, estimatedWaitMinutes) =>
    api.patch(`/orders/admin/${orderId}/status`, { status, estimatedWaitMinutes }).then(r => r.data.data),

  // Kitchen
  getKitchenOrders: () =>
    api.get('/orders/kitchen/active').then(r => r.data.data),
}
