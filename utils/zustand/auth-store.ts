import { getCurrentUser } from '@/services/auth'
import { create } from 'zustand'
import { UserRow } from '@/lib/types'

type AuthState = {
    user: UserRow | null
    count: number
    getCurrentUser: (redirectPath?: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    count: 0,
    getCurrentUser: async (redirectPath?: string) => {
        const userData = await getCurrentUser(redirectPath)
        if (typeof userData !== 'string') {
            set({ user: userData })
        }
    },
}))