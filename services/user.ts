'use server';

import { getSupabaseServer } from '@/utils/supabase/server'
import { ROLE_CONSTANT, UserRow, CreateUserInput, ListUsersOptions } from '@/lib/types'

export async function createUser(input: CreateUserInput) {
    const supabase = await getSupabaseServer()
    const payload = {
        id: input.id,
        email: input.email,
        display_name: input.display_name,
        avatar_url: input.avatar_url ?? null,
        status: input.status ?? 'active',
        role: input.role ?? ROLE_CONSTANT.USER,
    }

    const { data, error } = await supabase.from('users').insert([payload]).select().maybeSingle()
    if (error) {
        console.error('createUser error', error)
        throw error
    }
    return data as UserRow
}

export async function getUserById(id: string) {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
    if (error) {
        console.error('getUserById error', error)
        throw error
    }
    return data as UserRow | null
}

export async function updateUser(id: string, updates: Partial<CreateUserInput>) {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().maybeSingle()
    if (error) {
        console.error('updateUser error', error)
        throw error
    }
    return data as UserRow
}

export async function deleteUser(id: string) {
    const supabase = await getSupabaseServer()
    // physically delete (schema has FK cascade to auth.users)
    const { data, error } = await supabase.from('users').delete().eq('id', id).select().maybeSingle()
    if (error) {
        console.error('deleteUser error', error)
        throw error
    }
    return data as UserRow
}

export async function listUsers(opts: ListUsersOptions = {}) {
    const {
        page = 1,
        perPage = 10,
        search,
        role,
        status,
        sortBy = 'created_at',
        sortOrder = 'desc',
    } = opts

    const supabase = await getSupabaseServer()
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase.from('users').select('*', { count: 'exact' })

    if (role) query = query.eq('role', role)
    if (status) query = query.eq('status', status)
    if (search) {
        const esc = search.replace(/%/g, '\\%')
        // use OR on email and display_name
        query = query.or(`email.ilike.%${esc}%,display_name.ilike.%${esc}%`)
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    const { data, error, count } = await query.range(from, to)
    if (error) {
        console.error('listUsers error', error)
        throw error
    }

    return {
        data: (data ?? []) as UserRow[],
        total: count ?? 0,
        page,
        perPage,
        totalPages: Math.ceil((count ?? 0) / perPage),
    }
}

