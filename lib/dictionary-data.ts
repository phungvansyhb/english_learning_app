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

const dictionary: Record<string, DictionaryEntry> = {
  switch: {
    word: "Switch",
    ipaUs: "/swɪtʃ/",
    ipaUk: "/swɪtʃ/",
    groups: [
      {
        pos: "verb",
        meanings: [
          {
            meaning: "chuyển đổi, thay đổi",
            definition: "change from one thing to another",
            examples: [
              {
                en: "We need to switch to a more sustainable approach.",
                vi: "Chúng ta cần chuyển sang một phương pháp bền vững hơn.",
              },
            ],
          },
          {
            meaning: "bật/tắt (công tắc)",
            definition: "activate or deactivate a device with a switch",
            examples: [
              {
                en: "Please switch off the lights when you leave.",
                vi: "Vui lòng tắt đèn khi bạn rời đi.",
              },
            ],
          },
        ],
      },
      {
        pos: "noun",
        meanings: [
          {
            meaning: "công tắc",
            definition: "a small device for controlling an electric current",
            examples: [
              {
                en: "The light switch is next to the door.",
                vi: "Công tắc đèn nằm cạnh cửa ra vào.",
              },
            ],
          },
        ],
      },
    ],
    phrases: [
      { text: "switch off", meaning: "tắt" },
      { text: "switch on", meaning: "bật" },
      { text: "switch over", meaning: "chuyển sang" },
    ],
    synonyms: ["change", "shift", "swap", "toggle"],
    family: [
      { word: "switch", pos: "noun" },
      { word: "switchable", pos: "adjective" },
    ],
  },
  approach: {
    word: "Approach",
    ipaUs: "/əˈproʊtʃ/",
    ipaUk: "/əˈprəʊtʃ/",
    groups: [
      {
        pos: "noun",
        meanings: [
          {
            meaning: "phương pháp, cách tiếp cận",
            definition: "a way of dealing with a problem or task",
            examples: [
              {
                en: "They took a creative approach to the project.",
                vi: "Họ đã áp dụng một cách tiếp cận sáng tạo cho dự án.",
              },
            ],
          },
        ],
      },
      {
        pos: "verb",
        meanings: [
          {
            meaning: "tiến đến gần",
            definition: "come near to someone or something",
            examples: [
              {
                en: "Winter is fast approaching.",
                vi: "Mùa đông đang đến rất nhanh.",
              },
            ],
          },
        ],
      },
    ],
    phrases: [{ text: "a new approach", meaning: "một hướng đi mới" }],
    synonyms: ["method", "strategy", "technique"],
    family: [
      { word: "approachable", pos: "adjective" },
      { word: "approaching", pos: "adjective" },
    ],
  },
  sustainable: {
    word: "Sustainable",
    ipaUs: "/səˈsteɪnəbl/",
    ipaUk: "/səˈsteɪnəbl/",
    groups: [
      {
        pos: "adjective",
        meanings: [
          {
            meaning: "bền vững",
            definition: "able to continue over a period of time",
            examples: [
              {
                en: "We are committed to sustainable growth.",
                vi: "Chúng tôi cam kết với sự phát triển bền vững.",
              },
            ],
          },
        ],
      },
    ],
    phrases: [{ text: "sustainable development", meaning: "phát triển bền vững" }],
    synonyms: ["viable", "renewable", "maintainable"],
    family: [
      { word: "sustain", pos: "verb" },
      { word: "sustainability", pos: "noun" },
    ],
  },
}

/**
 * Look up a selected word. Falls back to a generated entry so any selected
 * text still surfaces a usable dictionary card.
 */
export function lookupWord(raw: string): DictionaryEntry {
  const cleaned = raw.trim().toLowerCase().replace(/[^a-z\s'-]/g, "")
  const firstWord = cleaned.split(/\s+/)[0] ?? ""

  const entry = dictionary[cleaned] ?? dictionary[firstWord]
  if (entry) return entry

  const display = (firstWord || raw.trim() || "word").replace(/^\w/, (c) => c.toUpperCase())
  return {
    word: display,
    ipaUs: "/…/",
    ipaUk: "/…/",
    groups: [
      {
        pos: "noun",
        meanings: [
          {
            meaning: "Đang tra cứu…",
            definition: `AI-generated meaning for "${firstWord || raw.trim()}"`,
            examples: [
              {
                en: `This is an example sentence using "${firstWord || raw.trim()}".`,
                vi: "Đây là câu ví dụ được tạo tự động.",
              },
            ],
          },
        ],
      },
    ],
    phrases: [],
    synonyms: [],
    family: [],
  }
}
