import { Groq } from 'groq-sdk';
import { z } from "zod";
import { createVocabWord, getWordByName } from './vocab-word';
import { InsertVocabDataPayload, WordCard } from '@/lib/types';


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, logLevel: 'debug' });
const WordTranslatedScheam = z.object({
    word: z.string(),
    phonetic_uk: z.string(),
    phonetic_us: z.string(),
    examples: z.array(
        z.object({
            en: z.string(),
            vi: z.string(),
        })
    ),
    difficulty_id: z.number().int().min(1).max(3),
    synonyms: z.array(
        z.object({
            word: z.string(),
            mean_vi: z.string(),
        })
    ),
    word_family: z.array(
        z.object({
            word: z.string(),
            partOfSpeech: z.string(),
        })
    ),
    collocations: z.array(
        z.object({
            phrase: z.string(),
            meaning_vi: z.string(),
        })
    ),
    translations: z.array(
        z.object({
            partOfSpeech: z.string(),
            meanings: z.array(
                z.object({
                    mean_vi: z.string(),
                    example_en: z.string(),
                    example_vi: z.string(),
                    is_primary_use: z.boolean()
                })
            ),
        })
    ),
});
export type VocabularyEntry = z.infer<typeof WordTranslatedScheam>;

function mappingData(payload: VocabularyEntry) {
    const rs: InsertVocabDataPayload = {
        word: payload.word,
        ipa_uk: payload.phonetic_uk,
        ipa_us: payload.phonetic_us,
        difficulty_id: payload.difficulty_id,
        meanings: payload.translations.flatMap(gr => {
            return gr.meanings.map(mean => ({
                part_of_speech: gr.partOfSpeech,
                meaning: mean.mean_vi,
                example: mean.example_en,
                example_meaning: mean.example_vi,
                is_primary_use: mean.is_primary_use
            }))
        }),
        collocations: payload.collocations,
        relations: payload.synonyms.map(item => ({
            relation_type: 'SYNONYMS',
            word: item.word,
            meaning: item.mean_vi
        }))
    }
    return rs
}

export async function translate(word: string): Promise<InsertVocabDataPayload> {
    const data = await getWordByName(word)
    if (data) return data;
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'Bạn là một từ điển Anh-Việt. Nhiệm vụ của bạn là dịch từ tiếng Anh sang tiếng Việt và trả về định dạng JSON chính xác theo schema được cung cấp. Không giải thích thêm.',
            },
            {
                role: 'user',
                content: `Từ cần dịch: ${word}`,
            },
        ],
        model: 'openai/gpt-oss-120b',
        temperature: 0.1,
        stream: false,
        reasoning_effort: 'low',
        reasoning_format: 'hidden',
        response_format: {
            type: 'json_schema', json_schema: {
                name: "word_translate_schema",
                schema: z.toJSONSchema(WordTranslatedScheam)
            }
        },
    });
    const rawContent = chatCompletion.choices[0]?.message?.content;
    if (!rawContent) throw new Error('Groq returned an empty response');

    const translatedData = WordTranslatedScheam.parse(JSON.parse(rawContent));
    const rs = mappingData(translatedData)
    const id = await createVocabWord(rs);
    return {...rs , id};
}
