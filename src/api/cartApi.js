import api from './axiosConfig.js'

export const cartApi = {
  getCart: () =>
    api.get('/cart').then(r => r.data.data),

  addToCart: (menuItemId, quantity = 1) =>
    api.post('/cart/add', { menuItemId, quantity }).then(r => r.data.data),

  updateQuantity: (menuItemId, quantity) =>
    api.patch(`/cart/items/${menuItemId}`, null, { params: { quantity } }).then(r => r.data.data),

  removeItem: (menuItemId) =>
    api.delete(`/cart/items/${menuItemId}`).then(r => r.data.data),

  clearCart: () =>
    api.delete('/cart/clear').then(r => r.data),
}
