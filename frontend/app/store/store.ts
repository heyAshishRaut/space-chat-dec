import { create } from "zustand"

interface Store {
    isUser: boolean
    login: () => void
    logout: () => void
}

const useStore = create<Store>((set) => ({
    isUser: false,
    login: () => set({ isUser: true }),
    logout: () => set({ isUser: false }),
}))

export default useStore

