import api from './axiosConfig.js'

export const paymentApi = {
  createPaymentOrder: (orderId) =>
    api.post(`/payment/create/${orderId}`).then(r => r.data.data),

  verifyPayment: (orderId, data) =>
    api.post(`/payment/verify/${orderId}`, data).then(r => r.data),

  markFailed: (orderId, reason) =>
    api.post(`/payment/failed/${orderId}`, null, { params: { reason } }).then(r => r.data),
}
