import type { User } from '@supabase/supabase-js'
import { getCurrentUser } from '@/services/auth'
import { create } from 'zustand'

type AuthState = {
    user: User | null
    count: number
    getCurrentUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    count: 0,
    getCurrentUser: async () => {
        const userData = await getCurrentUser()
        set({ user: userData })
    },
}))