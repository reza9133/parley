import { create } from 'zustand'
import { mockDeals, mockStats } from '@data/mockData'

const useDealsStore = create((set, get) => ({
  deals: mockDeals,
  stats: mockStats,
  isLoading: false,
  filter: 'all',
  search: '',

  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),

  filteredDeals: () => {
    const { deals, filter, search } = get()
    let result = deals
    if (filter !== 'all') {
      result = result.filter(d => d.stateName.toLowerCase() === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.scope.toLowerCase().includes(q) ||
        d.client.toLowerCase().includes(q) ||
        d.provider?.toLowerCase().includes(q)
      )
    }
    return result
  },

  getDeal: (id) => get().deals.find(d => d.id === id),

  refreshDeals: async () => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 800))
    set({ isLoading: false })
  },
}))

export default useDealsStore
