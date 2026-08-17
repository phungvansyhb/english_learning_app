'use server';

import { getSupabaseServer } from '@/utils/supabase/server';
import type {
    CreateGrammarPointInput,
    GrammarPointRow,
    ListGrammarPointsOptions,
} from '@/lib/types';

export type GrammarPointWithDifficultyLabel = GrammarPointRow & {
    difficulty_label: string;
};

type GrammarPointQueryRow = GrammarPointRow & {
    difficulty_label: { label: string } | null;
};

export async function createGrammarPoint(input: CreateGrammarPointInput) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
        .from('grammar_points')
        .insert([input])
        .select()
        .maybeSingle();

    if (error) {
        console.error('createGrammarPoint error', error);
        throw error.message;
    }

    return data as GrammarPointRow;
}

export async function getGrammarPointById(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
        .from('grammar_points')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('getGrammarPointById error', error);
        throw error;
    }

    return data as GrammarPointRow | null;
}

export async function updateGrammarPoint(id: number, updates: Partial<CreateGrammarPointInput>) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
        .from('grammar_points')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) {
        console.error('updateGrammarPoint error', error);
        throw error;
    }

    return data as GrammarPointRow;
}

export async function deleteGrammarPoint(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
        .from('grammar_points')
        .delete()
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) {
        console.error('deleteGrammarPoint error', error);
        throw error;
    }

    return data as GrammarPointRow;
}

export async function listGrammarPoints(opts: ListGrammarPointsOptions = {}) {
    const { page = 1, perPage = 10, search, difficulty_id } = opts;
    const supabase = await getSupabaseServer();
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
        .from('grammar_points')
        .select('*, difficulty_label:difficulty_levels(label)', { count: 'exact' });

    if (difficulty_id !== undefined) {
        query = query.eq('difficulty_id', difficulty_id);
    }

    if (search) {
        const esc = search.replace(/%/g, '\\%');
        query = query.or(`name.ilike.%${esc}%,description.ilike.%${esc}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) {
        console.error('listGrammarPoints error', error);
        throw error;
    }

    return {
        data: (data ?? []).map((item) => {
            const row = item as GrammarPointQueryRow;
            return {
                ...row,
                difficulty_label: row.difficulty_label?.label ?? '',
            } satisfies GrammarPointWithDifficultyLabel;
        }),
        total: count ?? 0,
        page,
        perPage,
        totalPages: Math.ceil((count ?? 0) / perPage),
    };
}
