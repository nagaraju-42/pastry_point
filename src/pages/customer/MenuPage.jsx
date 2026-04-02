import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMenu, useCategories } from '../../hooks/useMenu.js'
import MenuGrid from '../../components/menu/MenuGrid.jsx'
import CategoryFilter from '../../components/menu/CategoryFilter.jsx'
import SearchBar from '../../components/menu/SearchBar.jsx'
import CartDrawer from '../../components/cart/CartDrawer.jsx'
import useCart from '../../hooks/useCart.js'
import { ShoppingCart } from 'lucide-react'

export default function MenuPage() {
  const [searchParams] = useSearchParams()
  const defaultCategory = searchParams.get('category')
    ? Number(searchParams.get('category')) : null

  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
  const [search, setSearch] = useState('')

  const { data: items, isLoading } = useMenu(selectedCategory, search)
  const { data: categories } = useCategories()
  const { itemCount, toggleCart } = useCart()

  const handleSearch = (val) => {
    setSearch(val)
    if (val) setSelectedCategory(null) // clear category when searching
  }

  return (
    <>
      <CartDrawer />

      <div className="page-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="section-title">Our Menu</h1>
            <p className="section-subtitle">Fresh baked every morning 🥐</p>
          </div>
          {itemCount > 0 && (
            <button onClick={toggleCart}
              className="flex items-center gap-2 btn-primary py-2.5 px-4 text-sm">
              <ShoppingCart size={16} />
              Cart ({itemCount})
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar value={search} onChange={handleSearch} placeholder="Search breads, pastries..." />
        </div>

        {/* Category filter */}
        {!search && (
          <div className="mb-6">
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        )}

        {/* Menu grid */}
        <MenuGrid items={items} loading={isLoading} />
      </div>
    </>
  )
}
