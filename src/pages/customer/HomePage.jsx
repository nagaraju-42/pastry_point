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

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative h-screen bg-gray-900 overflow-hidden"
               style={{
                 backgroundImage: 'linear-gradient(135deg, #ff7a18 0%, #ffb347 100%)'
               }}>
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white space-y-8 max-w-2xl mx-auto px-4 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-slide-up">
              Pastry Point
            </h1>
            <p className="text-xl md:text-2xl text-white/90 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Order faster. Skip the queue.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to={ROUTES.MENU} className="flex items-center justify-center gap-2 bg-white text-primary-500
                           font-bold px-8 py-4 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-200
                           text-lg">
                Explore Menu <ArrowRight size={20} />
              </Link>
              <Link to={ROUTES.KIOSK} className="flex items-center justify-center gap-2 border-2 border-white
                           text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-200 text-lg">
                Open Kiosk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks strip ────────────────────────────────────────────── */}
      <section className="border-b border-white/50" style={{ backgroundColor: '#fff8f1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-3 gap-4">
          {[
            { icon: Clock,  label: 'Ready in minutes',    sub: 'Live estimated wait time' },
            { icon: Truck,  label: 'Free delivery ₹300+', sub: 'On orders above ₹300' },
            { icon: Star,   label: 'Earn loyalty points', sub: '1 point per ₹10 spent' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur hover:bg-white/80 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <Icon size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-neutral-text">{label}</p>
                <p className="text-xs text-neutral-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────── */}
      {categories && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-3xl font-bold text-neutral-text mb-2">Browse Categories</h2>
          <p className="text-neutral-muted mb-8">Explore our delicious collection</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} to={`${ROUTES.MENU}?category=${cat.id}`}
                className="p-6 rounded-2xl bg-white/60 backdrop-blur hover:bg-white/80 shadow-card hover:shadow-card-hover
                           transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-center group">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.name === 'Breads' ? '🍞' :
                   cat.name === 'Pastries' ? '🥐' :
                   cat.name === 'Cakes' ? '🎂' :
                   cat.name === 'Beverages' ? '☕' : '🍪'}
                </div>
                <p className="text-sm font-bold text-neutral-text">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured items ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-text">Most Popular</h2>
            <p className="text-neutral-muted mt-1">Customer favourites, baked fresh daily</p>
          </div>
          <Link to={ROUTES.MENU} className="text-sm text-primary-600 font-bold hover:text-primary-700 flex items-center gap-1 transition-colors">
            See all <ArrowRight size={16} />
          </Link>
        </div>
        {isLoading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {(featured || []).map(item => <MenuCard key={item.id} item={item} />)}
          </div>
        )}
      </section>
    </>
  )
}
