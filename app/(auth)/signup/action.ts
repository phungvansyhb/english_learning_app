"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function signUp({ email, password }: { email: string, password: string }) {
    "use server"
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const callBackHostUrl = process.env.NODE_ENV === 'development' ? 'http ://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${callBackHostUrl}/api/auth/callback`,
        },
    })

    if (error) {
        return Promise.reject(error)
    }
    return redirect('/signup/check-email')
}

export async function signUpWithOAuth(provider: 'google' | 'github' | 'facebook') {
    "use server"
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${window.location.origin}/api/auth/callback`,
        },
    })
}