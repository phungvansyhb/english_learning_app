'use server';

import {
	BasePaginationOptions,
	InsertVocabDataPayload,
	ListVocabWordsOptions,
	TopicRow,
	UpdateVocabWordInput,
	Word,
	WordCard,
} from '@/lib/types';
import { calculateNextSrsState, SrsProgressState, SrsRating } from '@/lib/srs';
import { getSupabaseServer } from '@/utils/supabase/server';

const REVIEW_LIMIT = 20;

type VocabWordQueryRow = {
	id: number;
	word: string | null;
	ipa_uk: string | null;
	ipa_us: string | null;
	difficulty_id: number;
	created_at: string;
	word_meaning: Array<{
		part_of_speech: string | null;
		meaning: string | null;
		example: string | null;
	}>;
	vocab_collocations: Array<{ phrase: string; meaning_vi: string | null }>;
	vocab_relations: Array<{ relation_type: string; word: string | null }>;
	vocab_word_topics: Array<{ topic_id: number; topics: { name: string } | null }>;
};

function mapVocabWord(row: VocabWordQueryRow): Word {
	const topic = row.vocab_word_topics[0];
	return {
		id: String(row.id),
		part_id: '',
		word: row.word ?? '',
		ipa: row.ipa_us ?? row.ipa_uk ?? '',
		audio_us: null,
		audio_uk: null,
		image_url: null,
		meanings: row.word_meaning.map((meaning) => ({
			pos: (meaning.part_of_speech ?? 'noun').toLowerCase() as Word['meanings'][number]['pos'],
			meaning: meaning.meaning ?? '',
			example: meaning.example ?? '',
		})),
		phrases: row.vocab_collocations.map((collocation) => collocation.phrase),
		synonyms: row.vocab_relations
			.filter((relation) => relation.relation_type === 'SYNONYMS')
			.map((relation) => relation.word ?? ''),
		order_index: 0,
		difficulty_level: row.difficulty_id,
		topic: {
			topic_id: topic ? String(topic.topic_id) : '',
			topic_name: topic?.topics?.name ?? '',
		},
	};
}

const vocabWordSelect =
	'id, word, ipa_uk, ipa_us, difficulty_id, created_at, word_meaning(part_of_speech, meaning, example), vocab_collocations(phrase, meaning_vi), vocab_relations(relation_type, word), vocab_word_topics!inner(topic_id, topics(name))';

export async function listWords(opts: ListVocabWordsOptions = {}) {
	const { page = 1, perPage = 10, search, sortBy = 'word', sortOrder = 'asc' } = opts;
	const supabase = await getSupabaseServer();
	let wordIds: number[] | undefined;

	if (search) {
		const escapedSearch = search.replace(/%/g, '\\%');
		const [{ data: matchingWords, error: wordError }, { data: matchingTopics, error: topicError }] =
			await Promise.all([
				supabase.from('vocab_words').select('id').ilike('word', `%${escapedSearch}%`),
				supabase.from('topics').select('id').ilike('name', `%${escapedSearch}%`),
			]);
		if (wordError) throw new Error(wordError.message);
		if (topicError) throw new Error(topicError.message);

		const topicIds = (matchingTopics ?? []).map((topic) => topic.id);
		const { data: topicLinks, error: topicLinkError } = topicIds.length
			? await supabase.from('vocab_word_topics').select('word_id').in('topic_id', topicIds)
			: { data: [], error: null };
		if (topicLinkError) throw new Error(topicLinkError.message);
		wordIds = [
			...new Set([
				...(matchingWords ?? []).map((word) => word.id),
				...(topicLinks ?? []).map((link) => link.word_id),
			]),
		];
		if (wordIds.length === 0) {
			return { data: [], total: 0, page, perPage, totalPages: 0 };
		}
	}

	let query = supabase.from('vocab_words').select(vocabWordSelect, { count: 'exact' });
	if (wordIds) query = query.in('id', wordIds);
	if (sortBy === 'word') query = query.order('word', { ascending: sortOrder === 'asc' });
	if (sortBy === 'created_at') query = query.order('created_at', { ascending: sortOrder === 'asc' });

	const { data, error, count } = await query;
	if (error) {
		console.error('listWords error', error);
		throw error;
	}

	const rows = ((data ?? []) as unknown as VocabWordQueryRow[]).map(mapVocabWord);
	if (sortBy === 'topic') {
		rows.sort((left, right) => {
			const comparison = left.topic.topic_name.localeCompare(right.topic.topic_name);
			return sortOrder === 'asc' ? comparison : -comparison;
		});
	}
	const from = (page - 1) * perPage;
	return {
		data: rows.slice(from, from + perPage),
		total: count ?? rows.length,
		page,
		perPage,
		totalPages: Math.ceil((count ?? rows.length) / perPage),
	};
}

export async function getVocabWordById(id: number) {
	const supabase = await getSupabaseServer();
	const { data, error } = await supabase
		.from('vocab_words')
		.select(vocabWordSelect)
		.eq('id', id)
		.maybeSingle();
	if (error) throw new Error(error.message);
	return data ? mapVocabWord(data as unknown as VocabWordQueryRow) : null;
}

export async function updateVocabWord(id: number, input: UpdateVocabWordInput) {
	const supabase = await getSupabaseServer();
	const { topic_id, meanings: _meanings, collocations: _collocations, relations: _relations, ...wordUpdates } = input;
	const { data, error } = await supabase
		.from('vocab_words')
		.update(wordUpdates)
		.eq('id', id)
		.select('id')
		.single();
	if (error) throw new Error(error.message);

	if (topic_id !== undefined) {
		const { error: deleteTopicError } = await supabase
			.from('vocab_word_topics')
			.delete()
			.eq('word_id', id);
		if (deleteTopicError) throw new Error(deleteTopicError.message);
		const { error: insertTopicError } = await supabase.from('vocab_word_topics').insert({
			word_id: id,
			topic_id: Number(topic_id),
		});
		if (insertTopicError) throw new Error(insertTopicError.message);
	}

	return getVocabWordById(data.id);
}

async function getAuthenticatedUserId() {
	const supabase = await getSupabaseServer();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (error) throw new Error(error.message);
	if (!user) throw new Error('UNAUTHORIZED');
	return { supabase, userId: user.id };
}

export async function createVocabWord(input: InsertVocabDataPayload) {
	const supabase = await getSupabaseServer();
	const { data: wordId, error: wordError } = await supabase.rpc('insert_vocab_data_v2', {
		p_data: input,
	});
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
	let query = supabase
		.from('topics')
		.select(
			'id , name , description, image_url:image_url, is_active , vocab_word_topics(count)',
			{ count: 'exact' },
		)
		.eq('is_active', true);
	const from = (page - 1) * perPage;
	const to = from + perPage - 1;
	if (search) {
		const esc = search.replace(/%/g, '\\%');
		query = query.or(`name.ilike.%${esc}%`);
	}
	query = query.order(sortBy, { ascending: sortOrder === 'asc' });
	let { data, error, count } = await query.range(from, to);
	if (error) {
		console.error('listUsers error', error);
		throw error;
	}
	data =
		data?.map((item) => ({
			...item,
			total_word: item.vocab_word_topics?.[0].count ?? 0,
		})) ?? [];
	return {
		data: (data ?? []) as TopicRow[],
		total: count ?? 0,
		page,
		perPage,
		totalPages: Math.ceil((count ?? 0) / perPage),
	};
}

export async function getMasteredWordCountsByTopic() {
	const supabase = await getSupabaseServer();
	const { data, error } = await supabase.rpc('get_mastered_word_counts_by_topic');
	if (error) {
		console.error('getMasteredWordCountsByTopic error', error);
		throw error;
	}
	return data as { topic_id: number, mastered_word_count: number }[];
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

export async function getNumMasteredWordInCate(cateId: number) {
	const supabase = await getSupabaseServer();
	const { data, error } = await supabase.rpc('get_mastered_word_count', { p_topic_id: cateId });
	if (error) {
		console.error('getNumMasteredWordInCate error', error);
		throw error;
	}
	return data as number;
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

export async function getWordByName(word: string) {
	const supabase = await getSupabaseServer();
	const { data, error } = await supabase.rpc('get_vocab_word_by_name', { p_word: word });
	if (error) {
		console.error('getWordsByTopicId error', error);
		throw error;
	}
	if (!data) {
		return null;
	}
	return data as InsertVocabDataPayload;
}

export type SrsReviewCard = WordCard & {
	progress: SrsProgressState | null;
};

export type VocabLearningState = 'new' | 'known';

export async function markWordLearningState(wordId: number, state: VocabLearningState) {
	const { supabase, userId } = await getAuthenticatedUserId();
	const now = new Date();
	const isKnown = state === 'known';
	const intervalDays = isKnown ? 30 : 1;
	const { data, error } = await supabase
		.from('user_vocab_progress')
		.upsert(
			{
				user_id: userId,
				word_id: wordId,
				srs_stage: isKnown ? 5 : 0,
				ease_factor: isKnown ? 2.8 : 2.5,
				interval_days: intervalDays,
				next_review_at: new Date(
					now.getTime() + intervalDays * 24 * 60 * 60 * 1000,
				).toISOString(),
				last_reviewed_at: now.toISOString(),
				correct_count: isKnown ? 1 : 0,
				wrong_count: isKnown ? 0 : 1,
				source: 'manual',
				status: isKnown ? 'mastered' : 'learning',
			},
			{ onConflict: 'user_id,word_id' },
		)
		.select('*')
		.single();

	if (error) throw new Error(error.message);
	return data as SrsProgressState;
}

export async function getDueVocabWords(limit = REVIEW_LIMIT) {
	const { supabase, userId } = await getAuthenticatedUserId();
	const safeLimit = Math.max(1, Math.min(limit, REVIEW_LIMIT));
	const { data: savedWords, error: savedWordsError } = await supabase
		.from('vocab_word_user_custom_category')
		.select('word_id, user_custom_category_vocab!inner(user_id)')
		.eq('user_custom_category_vocab.user_id', userId);
	if (savedWordsError) throw new Error(savedWordsError.message);

	const { data: progressRows, error: progressError } = await supabase
		.from('user_vocab_progress')
		.select('*')
		.eq('user_id', userId)
		.order('next_review_at', { ascending: true });
	if (progressError) throw new Error(progressError.message);

	const wordIds = [
		...new Set([
			...(savedWords ?? []).map((item) => item.word_id),
			...(progressRows ?? []).map((item) => item.word_id),
		]),
	];
	if (wordIds.length === 0) return { cards: [], dueCount: 0 };

	const progressByWord = new Map((progressRows ?? []).map((row) => [row.word_id, row]));
	const now = new Date().toISOString();
	const dueWordIds = wordIds.filter((wordId) => {
		const progress = progressByWord.get(wordId);
		return !progress || progress.next_review_at <= now;
	});
	const selectedWordIds = dueWordIds.slice(0, safeLimit);
	if (selectedWordIds.length === 0) {
		return { cards: [], dueCount: dueWordIds.length };
	}

	const { data: words, error: wordsError } = await supabase
		.from('vocab_words')
		.select(
			'id, word, ipa_uk, difficulty_id, created_at, ipa_us, difficulty_levels(label), word_meaning(*), vocab_collocations(*), vocab_relations(*)',
		)
		.in('id', selectedWordIds);
	if (wordsError) throw new Error(wordsError.message);

	const cards = (words ?? []).map((word) => ({
		...word,
		difficulty_label: word.difficulty_levels?.[0]?.label ?? '',
		meanings: word.word_meaning ?? [],
		collocations: word.vocab_collocations ?? [],
		relations: word.vocab_relations ?? [],
		progress: progressByWord.get(word.id) ?? null,
	})) as SrsReviewCard[];
	const order = new Map(selectedWordIds.map((wordId, index) => [wordId, index]));
	cards.sort((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0));
	return { cards, dueCount: dueWordIds.length };
}

export async function submitVocabReview(wordId: number, rating: SrsRating) {
	const { supabase, userId } = await getAuthenticatedUserId();
	const { data: savedWord, error: savedWordError } = await supabase
		.from('vocab_word_user_custom_category')
		.select('word_id, user_custom_category_vocab!inner(user_id)')
		.eq('word_id', wordId)
		.eq('user_custom_category_vocab.user_id', userId)
		.limit(1)
		.maybeSingle();
	if (savedWordError) throw new Error(savedWordError.message);

	const { data: current, error: currentError } = await supabase
		.from('user_vocab_progress')
		.select('*')
		.eq('user_id', userId)
		.eq('word_id', wordId)
		.maybeSingle();
	if (currentError) throw new Error(currentError.message);
	if (!savedWord && !current) throw new Error('WORD_NOT_SAVED');

	const nextState = calculateNextSrsState(current, rating);
	const { error: progressError } = await supabase
		.from('user_vocab_progress')
		.upsert({ user_id: userId, word_id: wordId, ...nextState });
	if (progressError) throw new Error(progressError.message);

	const { error: attemptError } = await supabase.from('vocab_quiz_attempts').insert({
		user_id: userId,
		word_id: wordId,
		quiz_type: 'srs_review',
		is_correct: rating === 'correct',
	});
	if (attemptError) throw new Error(attemptError.message);
	return nextState;
}
