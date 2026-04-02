// Order status values — must match backend enum exactly
export const ORDER_STATUS = {
  PENDING:           'PENDING',
  CONFIRMED:         'CONFIRMED',
  PREPARING:         'PREPARING',
  READY:             'READY',
  OUT_FOR_DELIVERY:  'OUT_FOR_DELIVERY',
  DELIVERED:         'DELIVERED',
  CANCELLED:         'CANCELLED',
}

export const PAYMENT_STATUS = {
  PENDING:  'PENDING',
  PAID:     'PAID',
  FAILED:   'FAILED',
  REFUNDED: 'REFUNDED',
}

export const ORDER_TYPE = {
  PICKUP:   'PICKUP',
  DELIVERY: 'DELIVERY',
}

// Human-readable labels
export const STATUS_LABELS = {
  PENDING:          'Order Placed',
  CONFIRMED:        'Confirmed',
  PREPARING:        'Being Prepared',
  READY:            'Ready for Pickup',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED:        'Delivered',
  CANCELLED:        'Cancelled',
}

// Badge color class per status
export const STATUS_COLORS = {
  PENDING:          'badge-yellow',
  CONFIRMED:        'badge-blue',
  PREPARING:        'badge-blue',
  READY:            'badge-green',
  OUT_FOR_DELIVERY: 'badge-blue',
  DELIVERED:        'badge-green',
  CANCELLED:        'badge-red',
}

// Progress step index for the order tracker (0-based)
export const STATUS_STEP = {
  PENDING:          0,
  CONFIRMED:        1,
  PREPARING:        2,
  READY:            3,
  OUT_FOR_DELIVERY: 3,
  DELIVERED:        4,
  CANCELLED:        -1,
}
