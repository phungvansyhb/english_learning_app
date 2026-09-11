import type { PartOfSpeech } from "@/lib/types"

export interface DictionaryMeaning {
  meaning: string
  definition: string
  examples: { en: string; vi: string }[]
}

export interface DictionaryPos {
  pos: PartOfSpeech
  meanings: DictionaryMeaning[]
}

export interface DictionaryEntry {
  id : React.Key,
  word: string
  ipaUs: string
  ipaUk: string
  groups: DictionaryPos[]
  phrases: { text: string; meaning: string }[]
  synonyms: string[]
  family: { word: string; pos: PartOfSpeech }[]
}

export const posLabels: Record<PartOfSpeech, string> = {
  noun: "danh từ",
  verb: "động từ",
  adjective: "tính từ",
  adverb: "trạng từ",
  preposition: "giới từ",
  pronoun: "đại từ",
  conjunction: "liên từ",
  interjection: "thán từ",
}

