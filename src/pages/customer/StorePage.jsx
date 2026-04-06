import { Star, MapPin, Clock } from 'lucide-react'
import CartDrawer from '../../components/cart/CartDrawer.jsx'

export default function StorePage() {
  // Mock store data - would normally come from an API
  const stores = [
    {
      id: 1,
      name: 'Downtown Pastry House',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop',
      rating: 4.8,
      reviews: 324,
      tags: ['Bakery', 'Cakes', 'Artisan'],
      distance: '2.3 km',
      time: '25-30 min',
    },
    {
      id: 2,
      name: 'Heritage Bakery',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=400&fit=crop',
      rating: 4.9,
      reviews: 487,
      tags: ['Pastries', 'Breads', 'Organic'],
      distance: '1.8 km',
      time: '20-25 min',
    },
    {
      id: 3,
      name: 'Modern Cake Studio',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop',
      rating: 4.7,
      reviews: 256,
      tags: ['Cakes', 'Desserts', 'Custom'],
      distance: '3.1 km',
      time: '30-35 min',
    },
    {
      id: 4,
      name: 'Artisan Bread Co.',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=400&fit=crop',
      rating: 4.6,
      reviews: 198,
      tags: ['Breads', 'Sourdough', 'Premium'],
      distance: '2.5 km',
      time: '28-32 min',
    },
    {
      id: 5,
      name: 'Sweet Delights',
      image: 'https://images.unsplash.com/photo-1557804506-669714d2e9d8?w=500&h=400&fit=crop',
      rating: 4.9,
      reviews: 412,
      tags: ['Pastries', 'Donuts', 'Fresh'],
      distance: '1.5 km',
      time: '18-22 min',
    },
    {
      id: 6,
      name: 'Vintage Patisserie',
      image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=400&fit=crop',
      rating: 4.8,
      reviews: 345,
      tags: ['French', 'Pastries', 'Premium'],
      distance: '2.8 km',
      time: '32-37 min',
    },
  ]

  return (
    <>
      <CartDrawer />

      <div className="bg-neutral-bg min-h-screen pt-4 pb-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-text mb-2">
            Explore Stores
          </h1>
          <p className="text-lg text-neutral-muted">
            Find your favorite pastry shop and order fresh baked goods
          </p>
        </div>

        {/* Stores Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="group bg-neutral-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover
                           transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                    <Star size={14} className="text-primary-500 fill-primary-500" />
                    <span className="text-sm font-bold text-neutral-text">{store.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Name */}
                  <h3 className="font-bold text-neutral-text text-base line-clamp-2">
                    {store.name}
                  </h3>

                  {/* Info row */}
                  <div className="flex items-center gap-1 text-xs text-neutral-muted">
                    <MapPin size={12} />
                    <span>{store.distance}</span>
                    <span className="mx-1">•</span>
                    <Clock size={12} />
                    <span>{store.time}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {store.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Reviews */}
                  <p className="text-xs text-neutral-muted">
                    {store.reviews} reviews
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
