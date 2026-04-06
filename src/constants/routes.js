const ROUTES = {
  // Customer
  HOME:           '/',
  STORES:         '/stores',
  MENU:           '/menu',
  CART:           '/cart',
  CHECKOUT:       '/checkout',
  ORDER_SUCCESS:  '/order-success/:orderId',
  ORDER_HISTORY:  '/orders',
  ORDER_TRACKING: '/orders/:orderId/track',
  PROFILE:        '/profile',

  // Auth
  LOGIN:    '/login',
  REGISTER: '/register',

  // Kiosk (no auth required)
  KIOSK: '/kiosk',

  // Admin
  ADMIN_LOGIN:     '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_MENU:      '/admin/menu',
  ADMIN_ORDERS:    '/admin/orders',
  ADMIN_KITCHEN:   '/admin/kitchen',
}

export default ROUTES

// Helper to build paths with params
export const buildPath = {
  orderSuccess: (orderId) => `/order-success/${orderId}`,
  orderTracking: (orderId) => `/orders/${orderId}/track`,
}
