import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../api/adminApi.js'
import { TrendingUp, ShoppingBag, Users, AlertTriangle, ChefHat, Clock, LayoutDashboard } from 'lucide-react'
import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import { Link } from 'react-router-dom'
import ROUTES from '../../constants/routes.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

function StatCard({ icon: Icon, label, value, color = 'green' }) {
  const colors = {
    green:  'bg-green-50 text-green-700',
    blue:   'bg-blue-50 text-blue-700',
    amber:  'bg-amber-50 text-amber-700',
    purple: 'bg-purple-50 text-purple-700',
  }
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold text-gray-800 font-display">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminApi.getDashboardStats,
    refetchInterval: 30000,
  })

  if (isLoading) return <LoadingSpinner text="Loading dashboard..." />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={22} className="text-bakery-green" />
          <h1 className="font-display font-bold text-lg text-gray-800">BakeryQ Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to={ROUTES.ADMIN_KITCHEN} className="btn-secondary text-sm py-2">Kitchen Display</Link>
          <Link to={ROUTES.HOME} className="btn-ghost text-sm">← Customer View</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Quick nav */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { to: ROUTES.ADMIN_ORDERS, label: '📋 Manage Orders' },
            { to: ROUTES.ADMIN_MENU,   label: '🍞 Manage Menu' },
            { to: ROUTES.ADMIN_KITCHEN, label: '👨‍🍳 Kitchen Screen' },
          ].map(nav => (
            <Link key={nav.to} to={nav.to} className="btn-secondary text-sm py-2">{nav.label}</Link>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={TrendingUp}  label="Today's Revenue"  value={formatCurrencyShort(stats?.todaysRevenue)}  color="green" />
          <StatCard icon={ShoppingBag} label="Today's Orders"   value={stats?.todaysOrderCount || 0}   color="blue" />
          <StatCard icon={Clock}       label="Pending Orders"   value={stats?.pendingOrderCount || 0}  color="amber" />
          <StatCard icon={Users}       label="Total Customers"  value={stats?.totalCustomers || 0}     color="purple" />
        </div>

        {/* Weekly revenue */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
          <p className="text-sm text-gray-500 mb-1">This Week's Revenue</p>
          <p className="text-3xl font-bold text-bakery-green">{formatCurrencyShort(stats?.weeklyRevenue)}</p>
        </div>

        {/* Low stock alerts */}
        {stats?.lowStockAlerts?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-amber-600" />
              <h3 className="font-semibold text-amber-800">Low Stock Alerts ({stats.lowStockAlerts.length})</h3>
            </div>
            <div className="space-y-2">
              {stats.lowStockAlerts.map(alert => (
                <div key={alert.menuItemId} className="flex justify-between text-sm">
                  <span className="text-amber-700">{alert.itemName}</span>
                  <span className="font-bold text-amber-800">{alert.currentStock} left</span>
                </div>
              ))}
            </div>
            <Link to={ROUTES.ADMIN_MENU} className="text-xs text-amber-700 font-semibold mt-3 block hover:underline">
              Update stock levels →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
