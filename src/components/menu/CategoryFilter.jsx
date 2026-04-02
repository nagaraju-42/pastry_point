export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
          ${selected === null
            ? 'bg-bakery-green text-white shadow-sm'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-bakery-green hover:text-bakery-green'}`}
      >
        All
      </button>
      {(categories || []).map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
            ${selected === cat.id
              ? 'bg-bakery-green text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-bakery-green hover:text-bakery-green'}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
