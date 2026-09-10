import { supabase } from '../lib/supabase';

const TABLE_NAME = 'vocab_word_user_custom_category';

export interface UserVocabCategory {
    id: number;
    created_at: string;
    word_id: number | null;
    cate_id: number | null;
}

export type CreateUserVocabCategory = {
    word_id?: number | null;
    cate_id?: number | null;
};

export type UpdateUserVocabCategory = Partial<CreateUserVocabCategory>;

export const userVocabCategoryService = {
    async getAll(): Promise<UserVocabCategory[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data ?? []) as UserVocabCategory[];
    },

    async getById(id: number): Promise<UserVocabCategory | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data as UserVocabCategory | null;
    },

    async create(
        values: CreateUserVocabCategory,
    ): Promise<UserVocabCategory> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(values)
            .select()
            .single();

        if (error) throw error;
        return data as UserVocabCategory;
    },

    async update(
        id: number,
        values: UpdateUserVocabCategory,
    ): Promise<UserVocabCategory> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(values)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as UserVocabCategory;
    },

    async delete(id: number): Promise<void> {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};

export default userVocabCategoryService;
