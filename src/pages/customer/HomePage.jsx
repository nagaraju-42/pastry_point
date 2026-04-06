import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Truck, Star } from 'lucide-react'
import ROUTES from '../../constants/routes.js'

export default function HomePage() {
  return (
    <div className="w-full"  >

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative h-screen bg-cover bg-center overflow-hidden"
               style={{
                 backgroundImage: 'linear-gradient(135deg, #ff7a18 0%, #ffb347 100%)'
               }}>
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white space-y-8 max-w-2xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Pastry Point
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Order faster. Skip the queue.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to={ROUTES.MENU} className="flex items-center justify-center gap-2 bg-white text-orange-600
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
                <p className="text-sm font-bold text-gray-800">{label}</p>
                <p className="text-xs text-gray-600">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Actions ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Get Started</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link to={ROUTES.MENU} className="p-8 rounded-2xl bg-white shadow-card hover:shadow-card-hover 
                                            transform transition-all hover:scale-105 group">
            <div className="text-5xl mb-4">🥐</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Browse Menu</h3>
            <p className="text-gray-600">Explore our delicious selection of fresh pastries and baked goods</p>
          </Link>
          <Link to={ROUTES.KIOSK} className="p-8 rounded-2xl bg-white shadow-card hover:shadow-card-hover 
                                            transform transition-all hover:scale-105 group">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Try Our Kiosk</h3>
            <p className="text-gray-600">Use our self-service kiosk for quick and easy ordering</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
