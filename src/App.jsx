import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Pages - Customer
import HomePage        from './pages/customer/HomePage.jsx'
import MenuPage        from './pages/customer/MenuPage.jsx'
import CartPage        from './pages/customer/CartPage.jsx'
import CheckoutPage    from './pages/customer/CheckoutPage.jsx'
import OrderSuccessPage from './pages/customer/OrderSuccessPage.jsx'
import OrderHistoryPage from './pages/customer/OrderHistoryPage.jsx'
import OrderTrackingPage from './pages/customer/OrderTrackingPage.jsx'
import ProfilePage     from './pages/customer/ProfilePage.jsx'

// Pages - Auth
import LoginPage       from './pages/auth/LoginPage.jsx'
import RegisterPage    from './pages/auth/RegisterPage.jsx'

// Pages - Admin
import AdminLoginPage     from './pages/admin/AdminLoginPage.jsx'
import DashboardPage      from './pages/admin/DashboardPage.jsx'
import ManageMenuPage     from './pages/admin/ManageMenuPage.jsx'
import ManageOrdersPage   from './pages/admin/ManageOrdersPage.jsx'
import KitchenDisplayPage from './pages/admin/KitchenDisplayPage.jsx'

// Pages - Kiosk
import KioskPage from './pages/kiosk/KioskPage.jsx'

// Layout & Guards
import Navbar          from './components/common/Navbar.jsx'
import ProtectedRoute  from './components/common/ProtectedRoute.jsx'
import AdminRoute      from './components/common/AdminRoute.jsx'

import ROUTES from './constants/routes.js'

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bakery-cream pt-16">
        {children}
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
          success: { style: { background: '#d8f3dc', color: '#1b4332', border: '1px solid #95d5b2' } },
          error:   { style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' } },
        }}
      />

      <Routes>
        {/* ── Public customer routes ─────────────────── */}
        <Route path={ROUTES.HOME} element={<CustomerLayout><HomePage /></CustomerLayout>} />
        <Route path={ROUTES.MENU} element={<CustomerLayout><MenuPage /></CustomerLayout>} />

        {/* ── Auth routes ────────────────────────────── */}
        <Route path={ROUTES.LOGIN}    element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* ── Protected customer routes ─────────────── */}
        <Route path={ROUTES.CART} element={
          <ProtectedRoute>
            <CustomerLayout><CartPage /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.CHECKOUT} element={
          <ProtectedRoute>
            <CustomerLayout><CheckoutPage /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ORDER_SUCCESS} element={
          <ProtectedRoute>
            <CustomerLayout><OrderSuccessPage /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ORDER_HISTORY} element={
          <ProtectedRoute>
            <CustomerLayout><OrderHistoryPage /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ORDER_TRACKING} element={
          <ProtectedRoute>
            <CustomerLayout><OrderTrackingPage /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.PROFILE} element={
          <ProtectedRoute>
            <CustomerLayout><ProfilePage /></CustomerLayout>
          </ProtectedRoute>
        } />

        {/* ── Kiosk (no login needed) ───────────────── */}
        <Route path={ROUTES.KIOSK} element={<KioskPage />} />

        {/* ── Admin routes ──────────────────────────── */}
        <Route path={ROUTES.ADMIN_LOGIN}   element={<AdminLoginPage />} />
        <Route path={ROUTES.ADMIN_DASHBOARD} element={
          <AdminRoute><DashboardPage /></AdminRoute>
        } />
        <Route path={ROUTES.ADMIN_MENU} element={
          <AdminRoute><ManageMenuPage /></AdminRoute>
        } />
        <Route path={ROUTES.ADMIN_ORDERS} element={
          <AdminRoute><ManageOrdersPage /></AdminRoute>
        } />
        <Route path={ROUTES.ADMIN_KITCHEN} element={
          <AdminRoute><KitchenDisplayPage /></AdminRoute>
        } />

        {/* ── Fallback ──────────────────────────────── */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
