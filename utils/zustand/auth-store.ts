import { getCurrentUser } from '@/services/auth'
import { create } from 'zustand'
import { UserRow, UserStatus } from '@/lib/types'

type AuthState = {
    user: UserRow | null
    count: number
    getCurrentUser: (redirectPath?: string) => Promise<void>
}
const demoUser = {
    email: 'admin@gmail.com',
    id: 'abc123',
    role: 'admin',
    status: 'active' as UserStatus,
    created_at: '2026-08-11T11:33:44',
    display_name: 'sypv',
    updated_at: '2026-08-11T11:33:44'
}
export const useAuthStore = create<AuthState>()((set) => ({
    user: demoUser,
    count: 0,
    getCurrentUser: async (redirectPath?: string) => {
        const userData = await getCurrentUser(redirectPath)
        if (typeof userData !== 'string') {
            set({ user: userData })
        }
    },
}))