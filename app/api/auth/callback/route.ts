import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // Route to redirect after successful confirmation
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore)
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Redirect to an error page if code exchange fails
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}