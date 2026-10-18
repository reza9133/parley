import { create } from 'zustand'

const useWalletStore = create((set, get) => ({
  address: null,
  isConnected: false,
  isConnecting: false,
  network: 'studionet',
  balance: null,

  connect: async () => {
    set({ isConnecting: true })
    // Simulate wallet connection (replace with real ethers.js / wagmi)
    await new Promise(r => setTimeout(r, 1200))
    const mockAddress = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    set({
      address: mockAddress,
      isConnected: true,
      isConnecting: false,
      balance: (Math.random() * 5 + 0.5).toFixed(4),
    })
  },

  disconnect: () => {
    set({ address: null, isConnected: false, balance: null })
  },

  shortAddress: () => {
    const { address } = get()
    if (!address) return null
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },
}))

export default useWalletStore
