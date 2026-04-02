import MenuCard from './MenuCard.jsx'
import LoadingSpinner from '../common/LoadingSpinner.jsx'

export default function MenuGrid({ items, loading }) {
  if (loading) return <LoadingSpinner text="Loading menu..." />

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-3">🔍</div>
        <p className="font-medium">No items found</p>
        <p className="text-sm mt-1">Try a different category or search</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => <MenuCard key={item.id} item={item} />)}
    </div>
  )
}
