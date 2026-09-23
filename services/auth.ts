'use server';
import { ROLE_CONSTANT, UserRow } from '@/lib/types';
import { createClient } from '@/utils/supabase/client';
import { getSupabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const callBackHostUrl =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_SITE_URL;

export async function signUp({ email, password }: { email: string; password: string }) {
    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${callBackHostUrl}/api/auth/callback`,
        },
    });

    if (error) {
        return Promise.reject(error);
    }
    return redirect('/signup/check-email');
}

export async function signUpWithOAuth(provider: 'google' | 'github' | 'facebook') {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${callBackHostUrl}/api/auth/callback`,
        },
    });

    if (error) {
        console.error('OAuth error:', error);
        return Promise.reject(error);
    }

    if (data?.url) {
        return redirect(data.url);
    }
}

export async function signInWithPassword({ email, password }: { email: string; password: string }) {
    if (email && password) {
        const supabase = await getSupabaseServer();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Sign in error', error);
            return error.message;
        } else {
            redirect('/');
        }
    }
}
export async function signInOAuth(provider: 'google' | 'facebook' | 'github') {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {},
    });
    if (error) {
        console.error('Sign in with ', provider, ' error: ', error);
    } else {
        console.log(data);
        redirect('/');
    }
}

export async function signOut(redirectPath?: string) {
    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.signOut({
        scope: 'local',
    });
    if (error) {
        console.error('Sign out error ', error);
    } else {
        redirect(redirectPath ?? '/login');
    }
}

export async function forgotPassword(email: string) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${callBackHostUrl}/forgot-password`,
    });
    if (error) {
        console.error('Sign out error ', error);
    }
}

export async function adminSignIn({ email, password }: { email: string; password: string }) {
    if (email && password) {
        const supabase = await getSupabaseServer();
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            return error.message;
        } else {
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('id', authData?.user?.id)
                .limit(1)
                .maybeSingle();
            if (userData) {
                if (userData?.role === ROLE_CONSTANT.USER) {
                    await supabase.auth.signOut();
                    return 'Acess denied';
                } else {
                    redirect('/admin');
                }
            } else {
                if (userError) {
                    return userError.message;
                } else {
                    return 'server error';
                }
            }
        }
    }
}

export async function getCurrentUser(redirectPath?: string) {
    const supabase = await getSupabaseServer();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (!user) {
        redirect(redirectPath ?? '/login');
    } else {
        const { data: profile, error } = await supabase
            .from('users')
            .select('*, user_progress_stats (*) ')
            .eq('id', user.id)
            .maybeSingle();
        if (profile) return profile as UserRow;
        else {
            if (error) return error.message;
            else return 'server error';
        }
    }
}

export async function saveActivity() {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
        .from('user_activity_log')
        .insert({
            activity_date: new Date(),
        })
        .select()
        .maybeSingle();
    if (error) {
        console.error('write log error ', error.message)
        return
    }
    if (data) {
        const { data: progressData, error: progressError } = await supabase
            .from('user_progress_stats')
            .select('*')
            .eq('user_id', data.user_id)
            .single()
        if (progressError) {
            console.error('write log error ', progressError.message)
            return
        }
        if (progressData) {
            const { data: updateData, error: updateError } = await supabase.from('user_progress_stats').update({
                current_streak_days: progressData.current_streak_days + 1,
                longest_streak_days: Math.max(progressData.current_streak_days + 1, progressData.longest_streak_days),
                last_active_date: data.activity_date
            }).eq('user_id', data.user_id);
            if (updateError) {
                console.error('update error', updateError.message)
            }
        }
    }
}
export async function getUserActivities() {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('user_activity_log').select('activity_date')
    if (error) {
        console.log('get log error', error.message)
        throw error
    }
    return data as { activity_date: string }[]
}
