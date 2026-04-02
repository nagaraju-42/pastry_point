import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { menuApi } from '../../api/menuApi.js'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, ArrowLeft } from 'lucide-react'
import { formatCurrencyShort } from '../../utils/formatCurrency.js'
import { Link } from 'react-router-dom'
import ROUTES from '../../constants/routes.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

function MenuItemForm({ item, categories, onSave, onCancel }) {
  const [form, setForm] = useState(item || {
    name: '', description: '', price: '', categoryId: '',
    imageUrl: '', available: true, stockQuantity: 100, featured: false, isVeg: true, preparationTimeMinutes: 10,
  })

  const handleSubmit = e => {
    e.preventDefault()
    onSave({ ...form, price: parseFloat(form.price), categoryId: parseInt(form.categoryId) })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="font-display font-bold text-lg mb-4">{item ? 'Edit Item' : 'Add New Item'}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="label">Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="input" required placeholder="Butter Croissant" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
              className="input resize-none" rows={2} placeholder="Short description..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
                className="input" required min="1" step="0.5" />
            </div>
            <div>
              <label className="label">Stock</label>
              <input type="number" value={form.stockQuantity} onChange={e => setForm(f => ({...f, stockQuantity: parseInt(e.target.value)}))}
                className="input" min="0" />
            </div>
          </div>
          <div>
            <label className="label">Category *</label>
            <select value={form.categoryId} onChange={e => setForm(f => ({...f, categoryId: e.target.value}))}
              className="input" required>
              <option value="">Select category</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Image URL</label>
            <input value={form.imageUrl} onChange={e => setForm(f => ({...f, imageUrl: e.target.value}))}
              className="input" placeholder="https://..." />
          </div>
          <div className="flex gap-4 pt-1">
            {[['featured', '⭐ Featured'], ['isVeg', '🌿 Vegetarian'], ['available', '✅ Available']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.checked}))}
                  className="accent-bakery-green" />
                {label}
              </label>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">Save</button>
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ManageMenuPage() {
  const qc = useQueryClient()
  const { data: items, isLoading } = useQuery({ queryKey: ['menu', null, null], queryFn: () => menuApi.getAllItems() })
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: menuApi.getCategories })

  const [editItem, setEditItem] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const createMutation = useMutation({ mutationFn: menuApi.createItem, onSuccess: () => { qc.invalidateQueries({queryKey:['menu']}); toast.success('Item added!'); setShowForm(false) } })
  const updateMutation = useMutation({ mutationFn: ({id,...d}) => menuApi.updateItem(id, d), onSuccess: () => { qc.invalidateQueries({queryKey:['menu']}); toast.success('Item updated!'); setEditItem(null) } })
  const deleteMutation = useMutation({ mutationFn: menuApi.deleteItem, onSuccess: () => { qc.invalidateQueries({queryKey:['menu']}); toast.success('Item deleted') } })
  const toggleMutation = useMutation({ mutationFn: menuApi.toggleAvailability, onSuccess: () => qc.invalidateQueries({queryKey:['menu']}) })

  const handleSave = (data) => {
    if (editItem) updateMutation.mutate({ id: editItem.id, ...data })
    else createMutation.mutate(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={ROUTES.ADMIN_DASHBOARD} className="btn-ghost p-2"><ArrowLeft size={18} /></Link>
          <h1 className="font-display font-bold text-lg">Manage Menu</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2 flex items-center gap-2">
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading && <LoadingSpinner />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items?.map(item => (
            <div key={item.id} className={`bg-white rounded-2xl p-4 border-2 transition-all
              ${item.available ? 'border-gray-100' : 'border-red-100 opacity-70'}`}>
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.categoryName}</p>
                </div>
                <p className="font-bold text-bakery-green">{formatCurrencyShort(item.price)}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">Stock: {item.stockQuantity}</span>
                <div className="flex gap-2">
                  <button onClick={() => toggleMutation.mutate(item.id)} title="Toggle availability"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-bakery-green hover:bg-gray-100">
                    {item.available ? <ToggleRight size={18} className="text-bakery-green" /> : <ToggleLeft size={18} />}
                  </button>
                  <button onClick={() => { setEditItem(item); setShowForm(false) }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => { if(confirm('Delete this item?')) deleteMutation.mutate(item.id) }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(showForm || editItem) && (
        <MenuItemForm
          item={editItem ? { ...editItem, categoryId: editItem.categoryId } : null}
          categories={categories}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditItem(null) }}
        />
      )}
    </div>
  )
}
