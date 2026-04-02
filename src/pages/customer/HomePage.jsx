import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Truck, Star } from 'lucide-react'
import { useFeaturedItems, useCategories } from '../../hooks/useMenu.js'
import MenuCard from '../../components/menu/MenuCard.jsx'
import CartDrawer from '../../components/cart/CartDrawer.jsx'
import useAuth from '../../hooks/useAuth.js'
import ROUTES from '../../constants/routes.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

export default function HomePage() {
  const { data: featured, isLoading } = useFeaturedItems()
  const { data: categories } = useCategories()
  const { isLoggedIn, user } = useAuth()

  return (
    <>
      <CartDrawer />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-bakery-green to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #fff 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative">
          <div className="max-w-xl">
            {isLoggedIn && (
              <p className="text-green-200 font-medium mb-2 animate-fade-in">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </p>
            )}
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4 animate-slide-up">
              Fresh Baked, <br />
              <span className="text-bakery-gold">No Waiting.</span>
            </h1>
            <p className="text-green-100 text-lg mb-8 animate-fade-in">
              Order from your favourite bakery online. Skip the queue, pick up when ready — or get it delivered!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to={ROUTES.MENU} className="flex items-center gap-2 bg-white text-bakery-green
                         font-bold px-6 py-3 rounded-xl hover:bg-bakery-cream transition-colors shadow-md">
                Order Now <ArrowRight size={18} />
              </Link>
              {!isLoggedIn && (
                <Link to={ROUTES.REGISTER} className="flex items-center gap-2 border-2 border-white/50
                           text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Decorative emoji */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl opacity-30 hidden md:block
                        animate-bounce-soft select-none">🥐</div>
      </section>

      {/* ── Perks strip ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-3 gap-4">
          {[
            { icon: Clock,  label: 'Ready in minutes',    sub: 'Live estimated wait time' },
            { icon: Truck,  label: 'Free delivery ₹300+', sub: 'On orders above ₹300' },
            { icon: Star,   label: 'Earn loyalty points', sub: '1 point per ₹10 spent' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-bakery-light rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-bakery-green" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────── */}
      {categories && categories.length > 0 && (
        <section className="page-container">
          <h2 className="section-title">Browse Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
            {categories.map(cat => (
              <Link key={cat.id} to={`${ROUTES.MENU}?category=${cat.id}`}
                className="card-hover text-center py-5">
                <div className="text-3xl mb-2">
                  {cat.name === 'Breads' ? '🍞' :
                   cat.name === 'Pastries' ? '🥐' :
                   cat.name === 'Cakes' ? '🎂' :
                   cat.name === 'Beverages' ? '☕' : '🍪'}
                </div>
                <p className="text-sm font-semibold text-gray-700">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured items ──────────────────────────────────────────── */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Most Popular</h2>
            <p className="section-subtitle">Customer favourites, baked fresh daily</p>
          </div>
          <Link to={ROUTES.MENU} className="text-sm text-bakery-green font-semibold hover:underline flex items-center gap-1">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        {isLoading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(featured || []).map(item => <MenuCard key={item.id} item={item} />)}
          </div>
        )}
      </section>
    </>
  )
}
