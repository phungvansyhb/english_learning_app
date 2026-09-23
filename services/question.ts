import { getSupabaseServer } from "@/utils/supabase/server"
import type { Tables } from "@/lib/supabase-generated-type"
import { createClient } from "@/utils/supabase/client"

export type PracticeQuestion = Pick<
  Tables<'questions'>,
  'id' | 'sentence_en' | 'transcript' | 'difficulty_id' | 'topic_id'
> & {
  question_choices: Pick<
    Tables<'question_choices'>,
    'id' | 'content' | 'label' | 'transcript' | 'is_correct'
  >[]
}

export async function getListQuestionByTopic(topicId: string, page: number): Promise<PracticeQuestion[]> {
  const perPage = 10
  const from = Math.max(page - 1, 0) * perPage
  const to = from + perPage - 1
  const supabase = createClient()
  let query = supabase
    .from('questions')
    .select('id, sentence_en, transcript, difficulty_id, topic_id, question_choices(id, content, label, transcript, is_correct)')
    .order('id', { ascending: false })
    .range(from, to)

  const parsedTopicId = Number(topicId)
  if (topicId !== 'all' && Number.isInteger(parsedTopicId)) {
    query = query.eq('topic_id', parsedTopicId)
  }

  const { data, error } = await query
  if (error) {
    console.error('Get list question error', error)
    throw error
  }

  return data as PracticeQuestion[]
}