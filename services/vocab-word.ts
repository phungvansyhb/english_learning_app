'use server';

import { BasePaginationOptions, TopicRow, WordCard } from '@/lib/types';
import { getSupabaseServer } from '@/utils/supabase/server';

export async function createVocabWord(input: {
	word: string;
	ipa_uk: string;
	ipa_us: string;
	topic_id: string;
	difficulty_id: string;
	meanings: Array<{
		part_of_speech: string;
		meaning: string;
		example?: string;
		example_meaning?: string;
		is_primary_use: boolean;
	}>;
	collocations: Array<{
		phrase: string;
		meaning_vi: string;
	}>;
	relations: Array<{
		relation_type: 'SYNONYMS' | 'ANTONYMS';
		word: string;
		meaning: string;
	}>;
}) {
	const supabase = await getSupabaseServer();
	const { data: wordId, error: wordError } = await supabase.rpc('insert_vocab_data_v2', { p_data: input })
	if (wordError) {
		console.error('createVocabWord (vocab_words) error', wordError);
		throw new Error(wordError.message);
	}
	if (!wordId) {
		throw new Error('Failed to create word record');
	}
	return wordId;
}

// for client
export async function getVocabWordCategories(opts: BasePaginationOptions) {
	const { page = 1, perPage = 10, search, sortBy = 'name', sortOrder } = opts;
	const supabase = await getSupabaseServer();
	let query = supabase.from('topics').select('id , name , description, image_url:image_url, is_active , vocab_word_topics(count)', { count: 'exact' }).eq('is_active', true);
	const from = (page - 1) * perPage
	const to = from + perPage - 1
	if (search) {
		const esc = search.replace(/%/g, '\\%')
		query = query.or(`name.ilike.%${esc}%`)
	}
	query = query.order(sortBy, { ascending: sortOrder === 'asc' })
	let { data, error, count } = await query.range(from, to)
	if (error) {
		console.error('listUsers error', error)
		throw error
	}
	data = data?.map((item) => ({
		...item,
		total_word: item.vocab_word_topics?.[0].count ?? 0,
	})) ?? []
	return {
		data: (data ?? []) as TopicRow[],
		total: count ?? 0,
		page,
		perPage,
		totalPages: Math.ceil((count ?? 0) / perPage),
	}
}

export async function getCategoryById(id: string) {
	const supabase = await getSupabaseServer();
	const { data, error } = await supabase.from('topics').select('*').eq('id', id).maybeSingle();
	if (error) {
		console.error('getCategoryById error', error);
		throw error;
	}
	if (!data) {
		throw new Error(`Category with id ${id} not found`);
	}
	return data as TopicRow;
}

export async function getWordsByTopicId(topicId: string) {
	const supabase = await getSupabaseServer();
	const { data, error } = await supabase.rpc('get_vocab_words_by_topic', { p_topic_id: topicId });
	if (error) {
		console.error('getWordsByTopicId error', error);
		throw error;
	}
	if (!data) {
		throw new Error(`Words for topic with id ${topicId} not found`);
	}
	return data as WordCard[];
}
