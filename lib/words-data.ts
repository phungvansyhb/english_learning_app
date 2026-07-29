import type { PartOfSpeech, Word } from "@/lib/types"

export const PART_OF_SPEECH_OPTIONS: PartOfSpeech[] = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "pronoun",
  "conjunction",
  "interjection",
]

export const DEFAULT_PART_ID = "ddad3187-5cea-4ef1-b849-742eb036c5f4"

export const seedWords: Word[] = [
  {
    id: "3c5624a9-8231-440b-b0ad-d35eb6048df9",
    part_id: DEFAULT_PART_ID,
    word: "access",
    ipa: "UK: /ˈækses/ | US: /ˈækses/",
    audio_us:
      "https://qfhmnlvgweznzcsoijyr.supabase.co/storage/v1/object/public/pronunciation/words/access-us-v2.mp3",
    audio_uk:
      "https://qfhmnlvgweznzcsoijyr.supabase.co/storage/v1/object/public/pronunciation/words/access-uk-v2.mp3",
    image_url: null,
    meanings: [
      {
        pos: "verb",
        meaning: "truy cập",
        example:
          "Authorized users can access the company database from anywhere. (Những người dùng được phép có thể truy cập cơ sở dữ liệu công ty từ bất kỳ đâu.)",
      },
    ],
    phrases: ["access the system: truy cập hệ thống", "access files: truy cập tệp"],
    synonyms: ["reach: tiếp cận"],
    order_index: 1,
    difficulty_level: 1,
  },
  {
    id: "a1f2c3d4-1111-2222-3333-444455556666",
    part_id: DEFAULT_PART_ID,
    word: "benefit",
    ipa: "UK: /ˈbenɪfɪt/ | US: /ˈbenɪfɪt/",
    audio_us: null,
    audio_uk: null,
    image_url: null,
    meanings: [
      {
        pos: "noun",
        meaning: "lợi ích",
        example:
          "Regular exercise has many health benefits. (Tập thể dục thường xuyên mang lại nhiều lợi ích cho sức khỏe.)",
      },
      {
        pos: "verb",
        meaning: "có lợi cho",
        example:
          "The new policy will benefit small businesses. (Chính sách mới sẽ có lợi cho các doanh nghiệp nhỏ.)",
      },
    ],
    phrases: ["health benefits: lợi ích sức khỏe"],
    synonyms: ["advantage: lợi thế", "gain: thu được"],
    order_index: 2,
    difficulty_level: 2,
  },
  {
    id: "b2c3d4e5-7777-8888-9999-000011112222",
    part_id: DEFAULT_PART_ID,
    word: "consequence",
    ipa: "UK: /ˈkɒnsɪkwəns/ | US: /ˈkɑːnsəkwens/",
    audio_us: null,
    audio_uk: null,
    image_url: null,
    meanings: [
      {
        pos: "noun",
        meaning: "hậu quả",
        example:
          "He is now facing the consequences of his actions. (Anh ấy giờ đang phải đối mặt với hậu quả từ hành động của mình.)",
      },
    ],
    phrases: ["face the consequences: đối mặt hậu quả"],
    synonyms: ["result: kết quả", "outcome: kết cục"],
    order_index: 3,
    difficulty_level: 3,
  },
]
