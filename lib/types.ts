export type ProgressTone = "purple" | "orange" | "pink" | "mint"

export interface ProgressItem {
  id: string
  title: string
  learned: number
  target: number
  tone: ProgressTone
}

export interface Article {
  id: string
  title: string
  category: string
  readingTime: string
  image: string
}

export interface CourseTag {
  label: string
  tone: "purple" | "mint" | "orange" | "pink"
}

export interface UpcomingCourse {
  id: string
  title: string
  description: string
  price: string
  cents: string
  duration: string
  lessons: string
  tags: CourseTag[]
  students: string[]
}

export interface CalendarDay {
  label: string
  date: number
  active?: boolean
}

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "pronoun"
  | "conjunction"
  | "interjection"

export interface WordMeaning {
  pos: PartOfSpeech
  meaning: string
  example: string
}

export interface Word {
  id: string
  part_id: string
  word: string
  ipa: string
  audio_us: string | null
  audio_uk: string | null
  image_url: string | null
  meanings: WordMeaning[]
  phrases: string[]
  synonyms: string[]
  order_index: number
  difficulty_level: number
}
