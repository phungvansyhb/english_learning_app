'use server';

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

export async function getVocabWord(){
	const supabase = await getSupabaseServer();
	
}
