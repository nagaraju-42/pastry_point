import { useQuery } from '@tanstack/react-query'
import { menuApi } from '../api/menuApi.js'

export function useMenu(categoryId, search) {
  return useQuery({
    queryKey: ['menu', categoryId, search],
    queryFn: () => {
      if (search) return menuApi.searchItems(search)
      if (categoryId) return menuApi.getByCategory(categoryId)
      return menuApi.getAllItems()
    },
    staleTime: 1000 * 60 * 3, // 3 min
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: menuApi.getCategories,
    staleTime: 1000 * 60 * 10, // 10 min — categories rarely change
  })
}

export function useFeaturedItems() {
  return useQuery({
    queryKey: ['menu', 'featured'],
    queryFn: menuApi.getFeaturedItems,
    staleTime: 1000 * 60 * 5,
  })
}
