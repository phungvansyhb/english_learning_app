'use server';

import { getSupabaseServer } from '@/utils/supabase/server';
import type {
    BadgeRow,
    CreateBadgeInput,
    CreateDifficultyLevelInput,
    CreateExamPartInput,
    CreateSkillInput,
    CreateTopicInput,
    DifficultyLevelRow,
    ExamPartRow,
    ListMasterDataOptions,
    SkillRow,
    TopicRow,
} from '@/lib/types';

export async function createSkill(input: CreateSkillInput) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('skills').insert([input]).select().maybeSingle();
    if (error) {
        console.error('createSkill error', error);
        throw error;
    }
    return data as SkillRow;
}

export async function getSkillById(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('skills').select('*').eq('id', id).maybeSingle();
    if (error) {
        console.error('getSkillById error', error);
        throw error;
    }
    return data as SkillRow | null;
}

export async function updateSkill(id: number, updates: Partial<CreateSkillInput>) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('skills').update(updates).eq('id', id).select().maybeSingle();
    if (error) {
        console.error('updateSkill error', error);
        throw error;
    }
    return data as SkillRow;
}

export async function deleteSkill(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('skills').delete().eq('id', id).select().maybeSingle();
    if (error) {
        console.error('deleteSkill error', error);
        throw error;
    }
    return data as SkillRow;
}

export async function listSkills(opts: ListMasterDataOptions = {}) {
    const { page = 1, perPage = 10, search } = opts;
    const supabase = await getSupabaseServer();
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase.from('skills').select('*', { count: 'exact' });
    if (search) {
        const esc = search.replace(/%/g, '\\%');
        query = query.or(`code.ilike.%${esc}%,name.ilike.%${esc}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) {
        console.error('listSkills error', error);
        throw error;
    }

    return {
        data: (data ?? []) as SkillRow[],
        total: count ?? 0,
        page,
        perPage,
        totalPages: Math.ceil((count ?? 0) / perPage),
    };
}

export async function createDifficultyLevel(input: CreateDifficultyLevelInput) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('difficulty_levels').insert([input]).select().maybeSingle();
    if (error) {
        console.error('createDifficultyLevel error', error);
        throw error;
    }
    return data as DifficultyLevelRow;
}

export async function getDifficultyLevelById(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('difficulty_levels').select('*').eq('id', id).maybeSingle();
    if (error) {
        console.error('getDifficultyLevelById error', error);
        throw error;
    }
    return data as DifficultyLevelRow | null;
}

export async function updateDifficultyLevel(id: number, updates: Partial<CreateDifficultyLevelInput>) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('difficulty_levels').update(updates).eq('id', id).select().maybeSingle();
    if (error) {
        console.error('updateDifficultyLevel error', error);
        throw error;
    }
    return data as DifficultyLevelRow;
}

export async function deleteDifficultyLevel(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('difficulty_levels').delete().eq('id', id).select().maybeSingle();
    if (error) {
        console.error('deleteDifficultyLevel error', error);
        throw error;
    }
    return data as DifficultyLevelRow;
}

export async function listDifficultyLevels(opts: ListMasterDataOptions) {
    const { page = 1, perPage = 10, search } = opts;
    const supabase = await getSupabaseServer();
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase.from('difficulty_levels').select('*', { count: 'exact' });

    if (search) {
        const esc = search.replace(/%/g, '\\%');
        query = query.or(`code.ilike.%${esc}%,label.ilike.%${esc}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) {
        console.error('listDifficultyLevels error', error);
        throw error;
    }

    return {
        data: (data ?? []) as DifficultyLevelRow[],
        total: count ?? 0,
        page,
        perPage,
        totalPages: Math.ceil((count ?? 0) / perPage),
    };
}

export async function createExamPart(input: CreateExamPartInput) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('exam_parts').insert([input]).select().maybeSingle();
    if (error) {
        console.error('createExamPart error', error);
        throw error;
    }
    return data as ExamPartRow;
}

export async function getExamPartById(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('exam_parts').select('*').eq('id', id).maybeSingle();
    if (error) {
        console.error('getExamPartById error', error);
        throw error;
    }
    return data as ExamPartRow | null;
}

export async function updateExamPart(id: number, updates: Partial<CreateExamPartInput>) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('exam_parts').update(updates).eq('id', id).select().maybeSingle();
    if (error) {
        console.error('updateExamPart error', error);
        throw error;
    }
    return data as ExamPartRow;
}

export async function deleteExamPart(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('exam_parts').delete().eq('id', id).select().maybeSingle();
    if (error) {
        console.error('deleteExamPart error', error);
        throw error;
    }
    return data as ExamPartRow;
}

export async function listExamParts(opts: ListMasterDataOptions = {}) {
    const { page = 1, perPage = 10, search, skill_id, part_number } = opts;
    const supabase = await getSupabaseServer();
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase.from('exam_parts').select('*', { count: 'exact' });
    if (skill_id !== undefined) query = query.eq('skill_id', skill_id);
    if (part_number !== undefined) query = query.eq('part_number', part_number);
    if (search) {
        const esc = search.replace(/%/g, '\\%');
        query = query.ilike('name', `%${esc}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) {
        console.error('listExamParts error', error);
        throw error;
    }

    return {
        data: (data ?? []) as ExamPartRow[],
        total: count ?? 0,
        page,
        perPage,
        totalPages: Math.ceil((count ?? 0) / perPage),
    };
}

export async function createTopic(input: CreateTopicInput) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('topics').insert([input]).select().maybeSingle();
    if (error) {
        console.error('createTopic error', error);
        throw error;
    }
    return data as TopicRow;
}

export async function getTopicById(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('topics').select('*').eq('id', id).maybeSingle();
    if (error) {
        console.error('getTopicById error', error);
        throw error;
    }
    return data as TopicRow | null;
}

export async function updateTopic(id: number, updates: Partial<CreateTopicInput>) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('topics').update(updates).eq('id', id).select().maybeSingle();
    if (error) {
        console.error('updateTopic error', error);
        throw error;
    }
    return data as TopicRow;
}

export async function deleteTopic(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('topics').delete().eq('id', id).select().maybeSingle();
    if (error) {
        console.error('deleteTopic error', error);
        throw error;
    }
    return data as TopicRow;
}

export async function listTopics(opts: ListMasterDataOptions = {}) {
    const { page = 1, perPage = 10, search } = opts;
    const supabase = await getSupabaseServer();
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase.from('topics').select('*', { count: 'exact' });
    if (search) {
        const esc = search.replace(/%/g, '\\%');
        query = query.ilike('name', `%${esc}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) {
        console.error('listTopics error', error);
        throw error;
    }

    return {
        data: (data ?? []) as TopicRow[],
        total: count ?? 0,
        page,
        perPage,
        totalPages: Math.ceil((count ?? 0) / perPage),
    };
}

export async function createBadge(input: CreateBadgeInput) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('badges').insert([input]).select().maybeSingle();
    if (error) {
        console.error('createBadge error', error);
        throw error;
    }
    return data as BadgeRow;
}

export async function getBadgeById(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('badges').select('*').eq('id', id).maybeSingle();
    if (error) {
        console.error('getBadgeById error', error);
        throw error;
    }
    return data as BadgeRow | null;
}

export async function updateBadge(id: number, updates: Partial<CreateBadgeInput>) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('badges').update(updates).eq('id', id).select().maybeSingle();
    if (error) {
        console.error('updateBadge error', error);
        throw error;
    }
    return data as BadgeRow;
}

export async function deleteBadge(id: number) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('badges').delete().eq('id', id).select().maybeSingle();
    if (error) {
        console.error('deleteBadge error', error);
        throw error;
    }
    return data as BadgeRow;
}

export async function listBadges(opts: ListMasterDataOptions = {}) {
    const { page = 1, perPage = 10, search } = opts;
    const supabase = await getSupabaseServer();
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase.from('badges').select('*', { count: 'exact' });
    if (search) {
        const esc = search.replace(/%/g, '\\%');
        query = query.or(`code.ilike.%${esc}%,name.ilike.%${esc}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) {
        console.error('listBadges error', error);
        throw error;
    }

    return {
        data: (data ?? []) as BadgeRow[],
        total: count ?? 0,
        page,
        perPage,
        totalPages: Math.ceil((count ?? 0) / perPage),
    };
}