import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MapPin, Store, Gift, ShoppingCart, AlertCircle } from 'lucide-react'
import { paymentApi } from '../../api/paymentApi.js'
import { usePlaceOrder } from '../../hooks/useOrders.js'
import { useQueryClient } from '@tanstack/react-query'
import useCart from '../../hooks/useCart.js'
import useAuth from '../../hooks/useAuth.js'
import ROUTES, { buildPath } from '../../constants/routes.js'
import toast from 'react-hot-toast'

// ── Formatcurrency helper (inline so no import dependency issues) ─────────────
const fmt = (n) => `₹${Number(n || 0).toFixed(0)}`

export default function CheckoutPage() {
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder()
  const { cart, items: cartItems, subtotal, total, deliveryCharge, clearCartLocally } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [orderType,            setOrderType]            = useState('PICKUP')
  const [deliveryAddress,      setDeliveryAddress]      = useState('')
  const [specialInstructions,  setSpecialInstructions]  = useState('')
  const [redeemPoints,         setRedeemPoints]         = useState(false)
  const [processingPayment,    setProcessingPayment]    = useState(false)

  const hasPoints    = (user?.loyaltyPoints || 0) >= 100
  const cartIsEmpty  = !cartItems || cartItems.length === 0
  const cartTotal    = orderType === 'PICKUP' ? subtotal : total

  // ── Validation ─────────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (cartIsEmpty) {
      toast.error('Your cart is empty. Add items before checking out.')
      return
    }
    if (orderType === 'DELIVERY' && !deliveryAddress.trim()) {
      toast.error('Please enter your delivery address')
      return
    }

    setProcessingPayment(true)

    try {
      // Step 1: Place order
      const order = await placeOrder({
        orderType,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress.trim() : null,
        specialInstructions: specialInstructions.trim() || null,
        redeemLoyaltyPoints: redeemPoints,
      })

      if (!order || !order.orderId) {
        throw new Error('Order creation failed — no order ID returned')
      }

      // Step 2: Create Razorpay payment order
      let payment
      try {
        payment = await paymentApi.createPaymentOrder(order.orderId)
      } catch (payErr) {
        const msg = payErr.response?.data?.message || 'Payment setup failed'
        toast.error(msg + ' (Order #' + order.orderNumber + ' saved)')
        setProcessingPayment(false)
        return
      }

      // Step 3: Open Razorpay modal
      if (!window.Razorpay) {
        toast.error('Razorpay not loaded. Please refresh the page.')
        setProcessingPayment(false)
        return
      }

      const razorpay = new window.Razorpay({
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      Math.round(payment.amount * 100),
        currency:    'INR',
        name:        import.meta.env.VITE_SHOP_NAME || 'BakeryQ',
        description: `Order ${order.orderNumber}`,
        order_id:    payment.razorpayOrderId,

        handler: async (response) => {
          try {
            // Step 4: Verify payment
            await paymentApi.verifyPayment(order.orderId, {
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            // Step 5: Clear cart + refresh queries
            clearCartLocally()
            queryClient.removeQueries({ queryKey: ['cart'] })
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({ queryKey: ['auth-me'] })

            toast.success('Payment successful! 🎉')
            navigate(buildPath.orderSuccess(order.orderId))

          } catch (verifyErr) {
            console.error('Verify error:', verifyErr)
            const errMsg = verifyErr.response?.data?.message || 'Verification failed'
            toast.error(
              `${errMsg} — Your order number is ${order.orderNumber}. ` +
              `Please contact us if payment was deducted.`
            )
          } finally {
            setProcessingPayment(false)
          }
        },

        prefill: {
          name:    user?.name    || '',
          email:   user?.email   || '',
          contact: user?.phone   || '',
        },

        theme: { color: '#2d6a4f' },

        modal: {
          ondismiss: async () => {
            await paymentApi.markFailed(
              order.orderId, 'User closed payment modal'
            ).catch(() => {})
            setProcessingPayment(false)
            toast('Payment cancelled')
          }
        }
      })

      razorpay.open()

    } catch (err) {
      setProcessingPayment(false)
      // usePlaceOrder onError already shows a toast for 400/validation errors
      // Only log unexpected errors here
      if (!err.response) {
        console.error('Unexpected checkout error:', err)
        toast.error('Something went wrong. Please try again.')
      }
    }
  }

  // ── Empty cart guard UI ────────────────────────────────────────────────────
  if (cartIsEmpty) {
    return (
      <div className="page-container max-w-lg mx-auto text-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart size={36} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Add items from the menu before checking out.
        </p>
        <Link to={ROUTES.MENU} className="btn-primary px-8 py-3 text-sm">
          Browse Menu
        </Link>
      </div>
    )
  }

  // ── Main checkout UI ───────────────────────────────────────────────────────
  return (
    <div className="page-container max-w-lg mx-auto">
      <h1 className="section-title mb-6">Checkout</h1>

      {/* Order type toggle */}
      <div className="card mb-4">
        <h3 className="font-semibold text-gray-700 mb-3">How would you like your order?</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'PICKUP',   label: 'Pickup',   sub: 'Collect at counter', Icon: Store  },
            { value: 'DELIVERY', label: 'Delivery', sub: 'Delivered to you',   Icon: MapPin },
          ].map(({ value, label, sub, Icon }) => (
            <button key={value} onClick={() => setOrderType(value)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left
                ${orderType === value
                  ? 'border-bakery-green bg-bakery-light'
                  : 'border-gray-200 hover:border-gray-300'}`}>
              <Icon size={20} className={orderType === value ? 'text-bakery-green' : 'text-gray-400'} />
              <div>
                <p className={`font-semibold text-sm
                  ${orderType === value ? 'text-bakery-green' : 'text-gray-700'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Delivery address */}
      {orderType === 'DELIVERY' && (
        <div className="card mb-4">
          <label className="label">Delivery Address *</label>
          <textarea
            value={deliveryAddress}
            onChange={e => setDeliveryAddress(e.target.value)}
            className="input resize-none"
            rows={3}
            placeholder="Room no, hostel/flat, college name, area..."
          />
        </div>
      )}

      {/* Special instructions */}
      <div className="card mb-4">
        <label className="label">
          Special Instructions{' '}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          value={specialInstructions}
          onChange={e => setSpecialInstructions(e.target.value)}
          className="input"
          placeholder="e.g. Less sugar, extra crispy, no onion..."
        />
      </div>

      {/* Loyalty points */}
      {hasPoints && (
        <div className="card mb-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={redeemPoints}
              onChange={e => setRedeemPoints(e.target.checked)}
              className="w-4 h-4 accent-bakery-green"
            />
            <div className="flex items-center gap-2">
              <Gift size={16} className="text-bakery-gold" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Redeem {Math.floor(user.loyaltyPoints / 100) * 100} points
                </p>
                <p className="text-xs text-gray-400">
                  Save ₹{Math.floor(user.loyaltyPoints / 100) * 10} on this order
                </p>
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Order summary */}
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between text-gray-600">
              <span>{item.itemName || item.menuItemName} × {item.quantity}</span>
              <span>₹{Math.round((item.price || item.menuItemPrice) * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            {orderType === 'DELIVERY' && (
              <div className="flex justify-between text-gray-500">
                <span>Delivery charge</span>
                <span>{deliveryCharge > 0 ? fmt(deliveryCharge) : 'Free'}</span>
              </div>
            )}
            {redeemPoints && hasPoints && (
              <div className="flex justify-between text-green-600">
                <span>Loyalty discount</span>
                <span>-₹{Math.floor(user.loyaltyPoints / 100) * 10}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base text-gray-800 pt-1">
              <span>Total</span>
              <span className="text-bakery-green">{fmt(cartTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Place order button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isPending || processingPayment || cartIsEmpty}
        className="btn-primary w-full text-base py-4 disabled:opacity-60"
      >
        {isPending
          ? 'Placing order...'
          : processingPayment
            ? 'Opening payment...'
            : `Place Order & Pay ${fmt(cartTotal)} →`}
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        🔒 Payments secured by Razorpay &nbsp;|&nbsp; No real money in test mode
      </p>
    </div>
  )
}