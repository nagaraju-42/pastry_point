import api from './axiosConfig.js'

export const adminApi = {
  getDashboardStats: () =>
    api.get('/admin/dashboard').then(r => r.data.data),

  getTodaysOrders: () =>
    api.get('/admin/orders/today').then(r => r.data.data),

  getRevenueReport: () =>
    api.get('/admin/reports/revenue').then(r => r.data.data),
}
