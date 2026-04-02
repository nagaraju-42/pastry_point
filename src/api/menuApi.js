import api from './axiosConfig.js'

export const menuApi = {
  getAllItems: (params) =>
    api.get('/menu', { params }).then(r => r.data.data),

  getItemById: (id) =>
    api.get(`/menu/${id}`).then(r => r.data.data),

  getFeaturedItems: () =>
    api.get('/menu/featured').then(r => r.data.data),

  getCategories: () =>
    api.get('/categories').then(r => r.data.data),

  searchItems: (query) =>
    api.get('/menu', { params: { search: query } }).then(r => r.data.data),

  getByCategory: (categoryId) =>
    api.get('/menu', { params: { categoryId } }).then(r => r.data.data),

  // Admin
  createItem: (data) =>
    api.post('/admin/menu', data).then(r => r.data.data),

  updateItem: (id, data) =>
    api.put(`/admin/menu/${id}`, data).then(r => r.data.data),

  deleteItem: (id) =>
    api.delete(`/admin/menu/${id}`).then(r => r.data),

  toggleAvailability: (id) =>
    api.patch(`/admin/menu/${id}/availability`).then(r => r.data),

  updateStock: (id, quantity) =>
    api.patch(`/admin/menu/${id}/stock`, null, { params: { quantity } }).then(r => r.data.data),
}
