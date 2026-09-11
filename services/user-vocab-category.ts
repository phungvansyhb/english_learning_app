'use server';

import type { WordCard } from '@/lib/types';
import { getSupabaseServer } from '@/utils/supabase/server';

export type UserVocabCategoryRow = {
    id: number;
    created_at: string;
    user_id: string;
    name: string;
    description: string | null;
};

export type CreateUserVocabCategoryInput = {
    name: string;
    description?: string | null;
};

export type UpdateUserVocabCategoryInput = {
    name?: string;
    description?: string | null;
};

export type ListUserVocabCategoriesOptions = {
    search?: string;
};

async function getAuthenticatedUserId() {
    const supabase = await getSupabaseServer();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        console.error('getAuthenticatedUserId error', error);
    }

    if (!user) {
        throw new Error('UNAUTHORIZED');
    }

    return user.id;
}

export async function createUserVocabCategory(input: CreateUserVocabCategoryInput) {
    const supabase = await getSupabaseServer();
    const userId = await getAuthenticatedUserId();
    const payload = {
        user_id: userId,
        name: input.name,
        description: input.description ?? null,
    };

    const { data, error } = await supabase
        .from('user_custom_category_vocab')
        .insert(payload)
        .select('*')
        .single();

    if (error) {
        console.error('createUserVocabCategory error', error);
        throw error;
    }

    return data as UserVocabCategoryRow;
}

export async function listUserVocabCategories(
    options: ListUserVocabCategoriesOptions = {},
) {
    const supabase = await getSupabaseServer();
    const userId = await getAuthenticatedUserId();
    let query = supabase
        .from('user_custom_category_vocab')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (options.search) {
        const search = options.search.replace(/%/g, '\\%').replace(/_/g, '\\_');
        query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
        console.error('listUserVocabCategories error', error);
        throw error;
    }

    return (data ?? []) as UserVocabCategoryRow[];
}

export async function getUserVocabCategory(id: React.Key) {
    const supabase = await getSupabaseServer();
    const userId = await getAuthenticatedUserId();
    const { data, error } = await supabase
        .from('user_custom_category_vocab')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error('getUserVocabCategory error', error);
        throw error;
    }

    return data as UserVocabCategoryRow | null;
}

export async function updateUserVocabCategory(
    id: number,
    updates: UpdateUserVocabCategoryInput,
) {
    const supabase = await getSupabaseServer();
    const userId = await getAuthenticatedUserId();
    const { data, error } = await supabase
        .from('user_custom_category_vocab')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .maybeSingle();

    if (error) {
        console.error('updateUserVocabCategory error', error);
        throw error;
    }

    return data as UserVocabCategoryRow | null;
}

export async function deleteUserVocabCategory(id: number) {
    const supabase = await getSupabaseServer();
    const userId = await getAuthenticatedUserId();
    const { data, error } = await supabase
        .from('user_custom_category_vocab')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .maybeSingle();

    if (error) {
        console.error('deleteUserVocabCategory error', error);
        throw error;
    }

    return data as UserVocabCategoryRow | null;
}

async function assertUserVocabCategory(id: React.Key) {
    const category = await getUserVocabCategory(id);
    if (!category) {
        throw new Error('CATEGORY_NOT_FOUND');
    }
}

export async function checkWordSavedInCate(cateId: React.Key, word: string) {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from('vocab_word_user_custom_category').select('*').eq('cate_id', cateId)
        .eq('word_id', word)
    if (data && data?.length > 0) return true
    return false
}

export async function listCategoryWords(categoryId: number) {
    const supabase = await getSupabaseServer();
    await assertUserVocabCategory(categoryId);
    const { data, error } = await supabase
        .from('vocab_word_user_custom_category')
        .select('word_id')
        .eq('cate_id', categoryId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('listCategoryWords error', error);
        throw error;
    }

    const wordIds = (data ?? []).map((item) => item.word_id);
    if (wordIds.length === 0) return [] as WordCard[];

    const { data: words, error: wordsError } = await supabase
        .from('vocab_words')
        .select(
            'id, word, ipa_uk, difficulty_id, created_at, ipa_us, difficulty_levels(label), word_meaning(*), vocab_collocations(*), vocab_relations(*)',
        )
        .in('id', wordIds);

    if (wordsError) {
        console.error('listCategoryWords details error', wordsError);
        throw wordsError;
    }

    const order = new Map(wordIds.map((wordId, index) => [wordId, index]));
    return (words ?? [])
        .sort((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0))
        .map((word) => ({
            ...word,
            difficulty_label: word.difficulty_levels?.label ?? '',
            meanings: word.word_meaning ?? [],
            collocations: word.vocab_collocations ?? [],
            relations: word.vocab_relations ?? [],
        })) as WordCard[];
}

export async function addWordToCategory(categoryId: React.Key, wordId: number) {
    const supabase = await getSupabaseServer();
    await assertUserVocabCategory(categoryId);
    const { data, error } = await supabase
        .from('vocab_word_user_custom_category')
        .insert({ cate_id: categoryId, word_id: wordId })
        .select('word_id, vocab_words(*)')
        .single();

    if (error) {
        console.error('addWordToCategory error', error);
        throw error;
    }

    return data;
}

export async function removeWordFromCategory(categoryId: number, wordId: number) {
    const supabase = await getSupabaseServer();
    await assertUserVocabCategory(categoryId);
    const { data, error } = await supabase
        .from('vocab_word_user_custom_category')
        .delete()
        .eq('cate_id', categoryId)
        .eq('word_id', wordId)
        .select('word_id, vocab_words(*)')
        .maybeSingle();

    if (error) {
        console.error('removeWordFromCategory error', error);
        throw error;
    }

    return data;
}
