import { useState, useCallback, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { menuApi } from '../../api/menuApi.js'
import { authApi } from '../../api/authApi.js'
import {
  ShoppingCart, Plus, Minus, Trash2, CheckCircle2,
  X, Printer, Bluetooth, BluetoothOff
} from 'lucide-react'
import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import toast from 'react-hot-toast'
import axios from 'axios'

// ─────────────────────────────────────────────────────────────────────────────
// Kiosk-dedicated Axios instance
// Uses its own header — NEVER touches the main app's localStorage token
// ─────────────────────────────────────────────────────────────────────────────
const kioskHttp = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Inject kiosk token into every kiosk request
let _kioskToken = null
kioskHttp.interceptors.request.use(config => {
  if (_kioskToken) config.headers.Authorization = `Bearer ${_kioskToken}`
  return config
})

// ─────────────────────────────────────────────────────────────────────────────
// ESC/POS byte builder — 58mm thermal receipt (Niyama BT-58)
// ─────────────────────────────────────────────────────────────────────────────
const ESC = 0x1B
const GS  = 0x1D

function buildReceipt(shopName, orderNumber, items, subtotal, total) {
  const enc    = new TextEncoder()
  const chunks = []
  const raw    = (...bytes) => chunks.push(new Uint8Array(bytes))
  const text   = (str)  => chunks.push(enc.encode(str))
  const line   = (str = '') => text(str + '\n')
  const div    = () => line('--------------------------------')

  raw(ESC, 0x40)                           // init printer

  raw(ESC, 0x61, 0x01)                     // center align
  raw(ESC, 0x45, 0x01)                     // bold on
  raw(GS,  0x21, 0x11)                     // double size
  line(shopName.substring(0, 16))
  raw(GS,  0x21, 0x00)                     // normal size
  raw(ESC, 0x45, 0x00)                     // bold off
  line('Self Order Receipt')
  raw(ESC, 0x61, 0x00)                     // left align

  div()
  line('Order : ' + orderNumber)
  line('Date  : ' + new Date().toLocaleString('en-IN'))
  div()

  raw(ESC, 0x45, 0x01)
  line('Item              Qty   Amount')
  raw(ESC, 0x45, 0x00)
  div()

  items.forEach(item => {
    const name = (item.itemName || '').substring(0, 18).padEnd(18)
    const qty  = String(item.quantity).padStart(3)
    const amt  = ('Rs' + Math.round(item.lineTotal)).padStart(9)
    line(name + qty + amt)
  })

  div()

  const tRow = (label, value, bold = false) => {
    if (bold) raw(ESC, 0x45, 0x01)
    const l = label.padEnd(20)
    const v = ('Rs' + Math.round(value)).padStart(12)
    line(l + v)
    if (bold) raw(ESC, 0x45, 0x00)
  }

  if (subtotal !== total) tRow('Subtotal:', subtotal)
  tRow('TOTAL PAID:', total, true)

  div()
  raw(ESC, 0x61, 0x01)
  line('Thank you! Come again :)')
  line('Collect at counter when ready')
  line('')
  line('')
  line('')

  raw(GS, 0x56, 0x41, 0x10)               // paper cut

  const totalLen = chunks.reduce((s, c) => s + c.length, 0)
  const out = new Uint8Array(totalLen)
  let offset = 0
  chunks.forEach(c => { out.set(c, offset); offset += c.length })
  return out
}

// ─────────────────────────────────────────────────────────────────────────────
// Bluetooth Printer Hook (Web Bluetooth API — Chrome only)
// ─────────────────────────────────────────────────────────────────────────────
function useBTPrinter() {
  const [device, setDevice] = useState(null)
  const [char, setChar]     = useState(null)
  const [status, setStatus] = useState('idle')   // idle | connecting | connected | error
  const deviceRef = useRef(null)

  const connect = async () => {
    if (!navigator.bluetooth) {
      toast.error('Web Bluetooth not supported. Please use Chrome browser.')
      setStatus('error')
      return false
    }
    try {
      setStatus('connecting')
      const dev = await navigator.bluetooth.requestDevice({
        // Accepts BT-58 and common thermal printer name prefixes
        filters: [
          { namePrefix: 'BT-58' },
          { namePrefix: 'Niyama' },
          { namePrefix: 'Printer' },
          { namePrefix: 'RPP' },
          { namePrefix: 'MTP' },
          { namePrefix: 'MPT' },
          { namePrefix: 'POS' },
        ],
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb',  // common BT printer
          '49535343-fe7d-4ae5-8fa9-9fafd205e455',  // ISSC transparent
          'e7810a71-73ae-499d-8c15-faa9aef0c3f2',  // Zonerich / generic
          '00001101-0000-1000-8000-00805f9b34fb',  // Serial Port Profile
        ]
      })

      deviceRef.current = dev
      setDevice(dev)

      dev.addEventListener('gattserverdisconnected', () => {
        setStatus('idle')
        setDevice(null)
        setChar(null)
        toast('Printer disconnected')
      })

      const server = await dev.gatt.connect()

      // Try service UUIDs in priority order
      let service = null
      const serviceUUIDs = [
        '000018f0-0000-1000-8000-00805f9b34fb',
        '49535343-fe7d-4ae5-8fa9-9fafd205e455',
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
      ]
      for (const uuid of serviceUUIDs) {
        try { service = await server.getPrimaryService(uuid); break } catch {}
      }
      if (!service) {
        // Fallback: grab first available service
        const services = await server.getPrimaryServices()
        if (!services.length) throw new Error('No GATT services found')
        service = services[0]
      }

      const characteristics = await service.getCharacteristics()
      const writableChar = characteristics.find(c =>
        c.properties.write || c.properties.writeWithoutResponse
      )
      if (!writableChar) throw new Error('No writable characteristic found on printer')

      setChar(writableChar)
      setStatus('connected')
      toast.success('Printer connected! 🖨️')
      return true
    } catch (err) {
      setStatus('idle')
      if (err.name !== 'NotFoundError') {
        toast.error('Printer connect failed: ' + err.message)
      }
      return false
    }
  }

  const disconnect = async () => {
    try { await deviceRef.current?.gatt?.disconnect() } catch {}
    setDevice(null); setChar(null); setStatus('idle')
  }

  const print = async (data) => {
    if (!char) { toast.error('Printer not connected'); return false }
    try {
      const CHUNK = 20   // safe BLE MTU chunk size
      for (let i = 0; i < data.length; i += CHUNK) {
        const chunk = data.slice(i, i + CHUNK)
        if (char.properties.writeWithoutResponse) {
          await char.writeValueWithoutResponse(chunk)
        } else {
          await char.writeValue(chunk)
        }
        await new Promise(r => setTimeout(r, 20))  // small delay between chunks
      }
      toast.success('Receipt printed! 🧾')
      return true
    } catch (err) {
      console.error('Print error:', err)
      toast.error('Print failed: ' + err.message)
      return false
    }
  }

  return { device, status, connect, disconnect, print }
}

// ─────────────────────────────────────────────────────────────────────────────
// Printer connect/disconnect button (shown in top bar)
// ─────────────────────────────────────────────────────────────────────────────
function PrinterButton({ printer }) {
  const { status, connect, disconnect, device } = printer

  if (status === 'connected') {
    return (
      <button onClick={disconnect} title="Disconnect printer"
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30
                   transition-colors px-3 py-2 rounded-2xl text-sm font-medium">
        <Printer size={15} />
        <span className="hidden sm:inline max-w-[100px] truncate">
          {device?.name || 'Printer'}
        </span>
        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse flex-shrink-0" />
      </button>
    )
  }

  if (status === 'connecting') {
    return (
      <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl text-sm">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <span className="hidden sm:inline">Connecting...</span>
      </div>
    )
  }

  return (
    <button onClick={connect} title="Connect Niyama BT-58 Thermal Printer"
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors
                 border border-white/30 px-3 py-2 rounded-2xl text-sm font-medium">
      <Bluetooth size={15} />
      <span className="hidden sm:inline">Connect Printer</span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Menu Card — large, touch-friendly
// ─────────────────────────────────────────────────────────────────────────────
function KioskMenuCard({ item, qty, onAdd, onRemove }) {
  return (
    <div className={`bg-white rounded-2xl border-2 transition-all select-none
      ${qty > 0 ? 'border-green-500 shadow-lg' : 'border-gray-100 hover:border-gray-300'}`}>

      {/* Image */}
      <div className="h-32 bg-gradient-to-br from-amber-50 to-orange-100 rounded-t-2xl overflow-hidden">
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🥐</div>}
      </div>

      {/* Info + Add button */}
      <div className="p-3">
        <p className="font-semibold text-gray-800 text-sm leading-tight mb-0.5 truncate">
          {item.name}
        </p>
        <p className="text-green-700 font-bold text-base mb-2">
          {formatCurrencyShort(item.price)}
        </p>

        {qty === 0 ? (
          <button
            onClick={() => onAdd(item.id)}
            disabled={!item.available}
            className="w-full flex items-center justify-center gap-1 bg-green-600
                       hover:bg-green-700 active:scale-95 text-white font-bold py-2
                       rounded-xl text-sm transition-all
                       disabled:bg-gray-200 disabled:text-gray-400"
          >
            <Plus size={15} />
            {item.available ? 'Add' : 'Unavailable'}
          </button>
        ) : (
          <div className="flex items-center justify-between bg-green-50 rounded-xl p-1">
            <button
              onClick={() => onRemove(item.id)}
              className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center
                         text-gray-600 hover:text-red-500 active:scale-90 transition-all"
            >
              {qty === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
            </button>
            <span className="font-bold text-green-700 text-lg">{qty}</span>
            <button
              onClick={() => onAdd(item.id)}
              className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center
                         text-white hover:bg-green-700 active:scale-90 transition-all"
            >
              <Plus size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Cart Drawer Row
// ─────────────────────────────────────────────────────────────────────────────
function CartRow({ item, onAdd, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 text-sm truncate">{item.itemName}</p>
        <p className="text-xs text-green-700 font-semibold">
          {formatCurrencyShort(item.price)} each
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onRemove(item.menuItemId)}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center
                     justify-center text-gray-500 hover:text-red-600 transition-colors"
        >
          {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
        </button>
        <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
        <button
          onClick={() => onAdd(item.menuItemId)}
          className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 flex items-center
                     justify-center text-white transition-colors"
        >
          <Plus size={13} />
        </button>
      </div>
      <p className="text-sm font-bold text-gray-700 w-16 text-right">
        {formatCurrencyShort(item.lineTotal)}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Order Success + Print Screen
// ─────────────────────────────────────────────────────────────────────────────
function OrderSuccessScreen({ order, onPrintReceipt, onReset, printerStatus }) {
  const [printed, setPrinted] = useState(false)
  const [printing, setPrinting] = useState(false)

  const handlePrint = async () => {
    setPrinting(true)
    const ok = await onPrintReceipt()
    if (ok) setPrinted(true)
    setPrinting(false)
  }

  // Auto-print countdown timer (resets kiosk after 60 seconds)
  const [countdown, setCountdown] = useState(60)
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); onReset(); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-10">
      {/* Success icon */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-5">
        <CheckCircle2 size={56} className="text-green-600" />
      </div>

      <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
        Payment Successful! 🎉
      </h2>
      <p className="text-gray-500 mb-1">Your order number is</p>

      <div className="bg-green-50 border-2 border-green-200 rounded-2xl px-8 py-3 mb-6">
        <p className="font-mono text-2xl font-bold text-green-700">
          {order.orderNumber}
        </p>
      </div>

      {/* Print receipt button */}
      {printerStatus === 'connected' ? (
        <button
          onClick={handlePrint}
          disabled={printed || printing}
          className={`flex items-center gap-3 font-bold text-lg px-10 py-4 rounded-2xl
                      transition-all mb-4 w-full max-w-xs justify-center
                      ${printed
                        ? 'bg-gray-100 text-gray-400 cursor-default'
                        : printing
                          ? 'bg-green-400 text-white cursor-wait'
                          : 'bg-green-600 hover:bg-green-700 active:scale-95 text-white'}`}
        >
          <Printer size={20} />
          {printing ? 'Printing...' : printed ? 'Receipt Printed ✓' : 'Print Receipt'}
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200
                        text-amber-700 rounded-xl px-5 py-3 mb-4 text-sm font-medium">
          <BluetoothOff size={15} />
          Printer not connected — connect from top bar to print receipt
        </div>
      )}

      {/* Order summary */}
      <div className="w-full max-w-xs bg-gray-50 rounded-xl p-4 mb-5 text-sm">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-gray-600 mb-1">
            <span>{item.itemName} × {item.quantity}</span>
            <span className="font-medium">{formatCurrencyShort(item.lineTotal)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-gray-800 pt-2 mt-1
                        border-t border-gray-200 text-base">
          <span>Total Paid</span>
          <span className="text-green-700">{formatCurrencyShort(order.total)}</span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        🏪 Please collect your order at the counter when it's ready.
      </p>

      {/* Auto-reset countdown + manual button */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <button
          onClick={onReset}
          className="w-full bg-gray-800 hover:bg-gray-900 active:scale-95 text-white
                     font-bold text-lg px-12 py-4 rounded-2xl transition-all"
        >
          New Order
        </button>
        <p className="text-xs text-gray-300">
          Auto-reset in {countdown}s
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// KIOSK PAGE — Main
// ─────────────────────────────────────────────────────────────────────────────

// Hidden service account — customer never sees or knows about this
const KIOSK_EMAIL    = 'kiosk@bakeryq.com'
const KIOSK_PASSWORD = 'kiosk@123#secure'

export default function KioskPage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [localCart, setLocalCart]     = useState([])
  const [showCart, setShowCart]       = useState(false)
  const [paying, setPaying]           = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)
  const [authReady, setAuthReady]     = useState(false)
  const printer  = useBTPrinter()
  const shopName = import.meta.env.VITE_SHOP_NAME || 'BakeryQ'

  // ── Silent auto-login on mount ────────────────────────────────────────
  useEffect(() => {
    const autoLogin = async () => {
      // Use sessionStorage so token is cleared when browser tab closes
      const cached = sessionStorage.getItem('kiosk_auto_token')
      if (cached) {
        _kioskToken = cached
        setAuthReady(true)
        return
      }
      try {
        const data = await authApi.login({
          email: KIOSK_EMAIL,
          password: KIOSK_PASSWORD,
        })
        _kioskToken = data.token
        sessionStorage.setItem('kiosk_auto_token', data.token)
      } catch (err) {
        console.error('Kiosk auto-login failed:', err?.message)
        // App still works — will retry when customer tries to pay
      } finally {
        setAuthReady(true)
      }
    }
    autoLogin()
  }, [])

  // ── Menu queries ──────────────────────────────────────────────────────
  const { data: categories } = useQuery({
    queryKey: ['kiosk-categories'],
    queryFn: menuApi.getCategories,
  })

  const { data: items } = useQuery({
    queryKey: ['kiosk-menu', selectedCategory],
    queryFn: () => selectedCategory
      ? menuApi.getByCategory(selectedCategory)
      : menuApi.getAllItems(),
  })

  // ── Local cart helpers ────────────────────────────────────────────────
  const addToCart = useCallback((menuItemId) => {
    const menuItem = items?.find(i => i.id === menuItemId)
    if (!menuItem || !menuItem.available) return
    setLocalCart(prev => {
      const existing = prev.find(c => c.menuItemId === menuItemId)
      if (existing) {
        return prev.map(c => c.menuItemId === menuItemId
          ? { ...c, quantity: c.quantity + 1, lineTotal: c.price * (c.quantity + 1) }
          : c)
      }
      return [...prev, {
        menuItemId,
        itemName:  menuItem.name,
        price:     menuItem.price,
        quantity:  1,
        lineTotal: menuItem.price,
      }]
    })
  }, [items])

  const removeFromCart = useCallback((menuItemId) => {
    setLocalCart(prev => {
      const existing = prev.find(c => c.menuItemId === menuItemId)
      if (!existing) return prev
      if (existing.quantity === 1) return prev.filter(c => c.menuItemId !== menuItemId)
      return prev.map(c => c.menuItemId === menuItemId
        ? { ...c, quantity: c.quantity - 1, lineTotal: c.price * (c.quantity - 1) }
        : c)
    })
  }, [])

  const getQty     = (id) => localCart.find(c => c.menuItemId === id)?.quantity || 0
  const subtotal   = localCart.reduce((s, c) => s + c.lineTotal, 0)
  const total      = subtotal   // kiosk = pickup only, no delivery charge
  const totalItems = localCart.reduce((s, c) => s + c.quantity, 0)

  const resetKiosk = () => {
    setCompletedOrder(null)
    setLocalCart([])
    setShowCart(false)
  }

  // ── Print receipt ─────────────────────────────────────────────────────
  const handlePrintReceipt = async () => {
    if (!completedOrder) return false
    const data = buildReceipt(
      shopName,
      completedOrder.orderNumber,
      completedOrder.items,
      completedOrder.subtotal,
      completedOrder.total
    )
    return await printer.print(data)
  }

  // ── Full payment flow (no localStorage touched) ───────────────────────
  const handlePay = async () => {
    if (localCart.length === 0) return
    setPaying(true)

    try {
      // Re-authenticate if token expired
      if (!_kioskToken) {
        const data = await authApi.login({
          email: KIOSK_EMAIL,
          password: KIOSK_PASSWORD,
        })
        _kioskToken = data.token
        sessionStorage.setItem('kiosk_auto_token', data.token)
      }

      // Step 1: Clear existing backend cart and sync local cart
      await kioskHttp.delete('/cart/clear').catch(() => {})
      for (const item of localCart) {
        await kioskHttp.post('/cart/add', {
          menuItemId: item.menuItemId,
          quantity:   item.quantity,
        })
      }

      // Step 2: Place the order
      const orderRes = await kioskHttp.post('/orders', {
        orderType:            'PICKUP',
        deliveryAddress:      null,
        specialInstructions:  'Kiosk self-order',
        redeemLoyaltyPoints:  false,
      })
      const order = orderRes.data.data

      // Step 3: Create Razorpay payment order
      const payRes = await kioskHttp.post(`/payment/create/${order.orderId}`)
      const payment = payRes.data.data

      // Step 4: Open Razorpay checkout
      const razorpay = new window.Razorpay({
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      payment.amount * 100,
        currency:    'INR',
        name:        shopName,
        description: `Order ${order.orderNumber}`,
        order_id:    payment.razorpayOrderId,

        handler: async (response) => {
          try {
            // Step 5: Verify payment
            await kioskHttp.post(`/payment/verify/${order.orderId}`, {
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            setShowCart(false)
            const finalOrder = {
              orderNumber: order.orderNumber,
              items:       [...localCart],
              subtotal,
              total,
            }
            setCompletedOrder(finalOrder)

            // Auto-print if printer is connected
            if (printer.status === 'connected') {
              const receiptData = buildReceipt(
                shopName,
                order.orderNumber,
                localCart,
                subtotal,
                total
              )
              await printer.print(receiptData)
            }
          } catch (err) {
            console.error('Verify error:', err)
            toast.error('Payment verification failed. Please contact staff.')
          } finally {
            setPaying(false)
          }
        },

        prefill: { name: 'Customer', email: '', contact: '' },
        theme:   { color: '#2d6a4f' },

        modal: {
          ondismiss: async () => {
            await kioskHttp.post(
              `/payment/failed/${order.orderId}`,
              null,
              { params: { reason: 'Customer cancelled' } }
            ).catch(() => {})
            setPaying(false)
            toast('Payment cancelled')
          }
        }
      })

      razorpay.open()

    } catch (err) {
      setPaying(false)
      console.error('Kiosk pay error:', err)
      const msg = err.response?.data?.message || 'Payment could not be processed. Please try again.'
      toast.error(msg)
    }
  }

  // ── Order success screen ──────────────────────────────────────────────
  if (completedOrder) {
    return (
      <div className="h-screen bg-bakery-cream overflow-hidden flex flex-col">
        <div className="bg-green-700 text-white px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥐</span>
            <span className="font-display font-bold text-lg">{shopName}</span>
          </div>
          <PrinterButton printer={printer} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <OrderSuccessScreen
            order={completedOrder}
            onPrintReceipt={handlePrintReceipt}
            onReset={resetKiosk}
            printerStatus={printer.status}
          />
        </div>
      </div>
    )
  }

  // ── Main kiosk browsing screen ────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-bakery-cream overflow-hidden">

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="bg-green-700 text-white px-5 py-3 flex items-center
                      justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🥐</span>
          <div>
            <p className="font-display font-bold text-xl leading-tight">{shopName}</p>
            <p className="text-green-200 text-xs">Touch to order · Pay online · No queue</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PrinterButton printer={printer} />

          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 bg-white/20 hover:bg-white/30
                       transition-colors px-4 py-2.5 rounded-2xl font-bold text-sm"
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs
                               font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Category filter tabs ──────────────────────────────────────── */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto flex-shrink-0
                      bg-white border-b border-gray-100 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 px-5 py-2 rounded-full font-semibold text-sm
                      transition-all whitespace-nowrap
                      ${!selectedCategory
                        ? 'bg-green-600 text-white shadow'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All Items
        </button>
        {categories?.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 px-5 py-2 rounded-full font-semibold text-sm
                        transition-all whitespace-nowrap
                        ${selectedCategory === cat.id
                          ? 'bg-green-600 text-white shadow'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Menu grid ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!authReady ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600
                              rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading menu...</p>
            </div>
          </div>
        ) : !items?.length ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-5xl mb-3">🥐</div>
              <p>No items available</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {items.map(item => (
              <KioskMenuCard
                key={item.id}
                item={item}
                qty={getQty(item.id)}
                onAdd={addToCart}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Sticky bottom bar — visible when cart has items ──────────── */}
      {totalItems > 0 && (
        <div className="bg-white border-t border-gray-200 px-5 py-4
                        flex items-center justify-between flex-shrink-0 shadow-lg">
          <div>
            <p className="text-xs text-gray-400">
              {totalItems} item{totalItems !== 1 ? 's' : ''} · Pickup
            </p>
            <p className="font-bold text-xl text-gray-800">
              {formatCurrencyShort(total)}
            </p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="bg-green-600 hover:bg-green-700 active:scale-95 text-white
                       font-bold px-8 py-4 rounded-2xl text-lg transition-all"
          >
            Review & Pay →
          </button>
        </div>
      )}

      {/* ── Cart Drawer ──────────────────────────────────────────────── */}
      {showCart && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCart(false)}
          />

          {/* Drawer panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50
                          flex flex-col shadow-2xl animate-slide-in-right">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-display font-bold text-xl text-gray-800">Your Order</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {localCart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full
                                text-gray-400 text-center py-16">
                  <div className="text-5xl mb-3">🛒</div>
                  <p className="font-medium">Cart is empty</p>
                  <p className="text-xs mt-1">Add items from the menu</p>
                </div>
              ) : (
                localCart.map(item => (
                  <CartRow
                    key={item.menuItemId}
                    item={item}
                    onAdd={addToCart}
                    onRemove={removeFromCart}
                  />
                ))
              )}
            </div>

            {/* Checkout footer */}
            {localCart.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-5 space-y-3">

                {/* Order totals */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    <span>{formatCurrencyShort(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    <span className="text-green-600 font-medium">Free (Pickup)</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-800
                                  pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-green-700">{formatCurrencyShort(total)}</span>
                  </div>
                </div>

                {/* Printer connected badge */}
                {printer.status === 'connected' && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200
                                  rounded-xl px-3 py-2 text-xs text-green-700 font-medium">
                    <Printer size={13} />
                    Receipt will print automatically after payment
                  </div>
                )}

                <p className="text-xs text-gray-400 text-center">
                  🏪 Pickup order — collect at counter
                </p>

                {/* Pay button */}
                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white
                             font-bold text-xl py-5 rounded-2xl transition-all disabled:opacity-60"
                >
                  {paying ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white
                                      rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : `Pay ${formatCurrencyShort(total)} →`}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}