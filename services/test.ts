'use server';

import { getSupabaseServer } from '@/utils/supabase/server'
import { TestRow, CreateTestInput, BasePaginationOptions } from '@/lib/types'

export async function getTestById(id: string) {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from('tests').select('*').eq('id', id).maybeSingle()
    if (error) {
        console.error('getTestById error', error)
        throw error
    }
    return data as TestRow | null
}

export async function updateTest(id: string, updates: Partial<CreateTestInput>) {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from('tests').update(updates).eq('id', id).select().maybeSingle()
    if (error) {
        console.error('updateTest error', error)
        throw error
    }
    return data as TestRow
}

export async function deleteTest(id: number) {
    const supabase = await getSupabaseServer()
    // physically delete (schema has FK cascade to auth.Tests)
    const { data, error } = await supabase.from('tests').delete().eq('id', id).select().maybeSingle()
    if (error) {
        console.error('deleteTest error', error)
        throw error
    }
    return data as TestRow
}

export async function listTests(opts: BasePaginationOptions = {}) {
    const {
        page = 1,
        perPage = 10,
        search,
        sortBy = 'created_at',
        sortOrder = 'desc',
    } = opts

    const supabase = await getSupabaseServer()
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabase.from('tests').select('*', { count: 'exact' })

    if (search) {
        const esc = search.replace(/%/g, '\\%')
        // use OR on email and display_name
        query = query.or(`title.ilike.%${esc}%`)
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    const { data, error, count } = await query.range(from, to)
    if (error) {
        console.error('listTests error', error)
        throw error
    }

    return {
        data: (data ?? []) as TestRow[],
        total: count ?? 0,
        page,
        perPage,
        totalPages: Math.ceil((count ?? 0) / perPage),
    }
}

