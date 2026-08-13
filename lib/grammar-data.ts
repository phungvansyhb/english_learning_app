export type GrammarDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export type GrammarSection = {
  id: string
  title: string
  paragraphs: string[]
  examples?: { english: string; vietnamese: string; note?: string }[]
  callout?: string
}

export type GrammarLesson = {
  id: number
  slug: string
  name: string
  description: string
  difficulty: GrammarDifficulty
  duration: string
  progress: number
  sections: GrammarSection[]
}

export const grammarLessons: GrammarLesson[] = [
  {
    id: 1,
    slug: 'present-perfect',
    name: 'Present Perfect',
    description: 'Talk about experiences and actions that connect the past with the present.',
    difficulty: 'Intermediate',
    duration: '12 min read',
    progress: 72,
    sections: [
      { id: 'overview', title: 'Overview', paragraphs: ['The present perfect connects a past action to now. We use it when the exact time is not important, or when a past action has a result in the present.'], callout: 'Good to know: Do not use the present perfect with a finished time such as yesterday, last year, or in 2022.' },
      { id: 'form', title: 'Form', paragraphs: ['Use have or has followed by the past participle.'], examples: [{ english: 'I have finished my homework.', vietnamese: 'Tôi đã làm xong bài tập.', note: 'I / you / we / they + have' }, { english: 'She has visited London.', vietnamese: 'Cô ấy đã từng đến London.', note: 'he / she / it + has' }] },
      { id: 'use-cases', title: 'Use cases', paragraphs: ['Use the present perfect for life experiences, recent actions, and situations that started in the past and continue now.'], examples: [{ english: 'Have you ever tried sushi?', vietnamese: 'Bạn đã từng thử sushi chưa?' }, { english: 'We have lived here for five years.', vietnamese: 'Chúng tôi đã sống ở đây được năm năm.' }] },
      { id: 'common-mistakes', title: 'Common mistakes', paragraphs: ['Remember that for refers to a period of time, while since refers to the starting point.'], examples: [{ english: 'I have worked here since 2021.', vietnamese: 'Tôi đã làm việc ở đây từ năm 2021.' }, { english: 'I have worked here for three years.', vietnamese: 'Tôi đã làm việc ở đây được ba năm.' }] },
    ],
  },
  {
    id: 2,
    slug: 'first-conditional',
    name: 'First Conditional',
    description: 'Describe real or likely future situations and their possible results.',
    difficulty: 'Intermediate',
    duration: '8 min read',
    progress: 35,
    sections: [
      { id: 'overview', title: 'Overview', paragraphs: ['The first conditional describes a possible condition in the future and its likely result.'], callout: 'Think of it as a real possibility: if one thing happens, another thing will probably happen.' },
      { id: 'form', title: 'Form', paragraphs: ['If + present simple, will + base verb. The order can change without changing the meaning.'], examples: [{ english: 'If you study, you will improve.', vietnamese: 'Nếu bạn học, bạn sẽ tiến bộ.' }, { english: 'You will improve if you study.', vietnamese: 'Bạn sẽ tiến bộ nếu bạn học.' }] },
      { id: 'use-cases', title: 'Use cases', paragraphs: ['Use it for plans, warnings, promises, and predictions that depend on a condition.'], examples: [{ english: 'If it rains, we will stay home.', vietnamese: 'Nếu trời mưa, chúng tôi sẽ ở nhà.' }] },
    ],
  },
  {
    id: 3,
    slug: 'articles-a-an-the',
    name: 'Articles: a, an, the',
    description: 'Choose the right article when referring to people, places, and things.',
    difficulty: 'Beginner',
    duration: '6 min read',
    progress: 100,
    sections: [
      { id: 'overview', title: 'Overview', paragraphs: ['Articles tell us whether a noun is general or specific. Use a or an for one non-specific thing, and the for something specific.'] },
      { id: 'form', title: 'Form', paragraphs: ['Use an before a vowel sound and a before a consonant sound.'], examples: [{ english: 'She is a teacher.', vietnamese: 'Cô ấy là giáo viên.' }, { english: 'He ate an apple.', vietnamese: 'Anh ấy đã ăn một quả táo.' }, { english: 'Open the window.', vietnamese: 'Hãy mở cửa sổ.' }] },
    ],
  },
  {
    id: 4,
    slug: 'reported-speech',
    name: 'Reported Speech',
    description: 'Report what someone said without repeating their exact words.',
    difficulty: 'Advanced',
    duration: '10 min read',
    progress: 0,
    sections: [{ id: 'overview', title: 'Overview', paragraphs: ['Reported speech tells us what another person said. The verb tense often moves one step back when we report past speech.'] }, { id: 'form', title: 'Form', paragraphs: ['Direct: “I am tired.” Reported: She said that she was tired.'], examples: [{ english: 'He said he would call later.', vietnamese: 'Anh ấy nói rằng anh ấy sẽ gọi sau.' }] }] },
]

export const difficultyClasses: Record<GrammarDifficulty, string> = { Beginner: 'bg-brand-mint text-brand-mint-foreground', Intermediate: 'bg-brand-purple-soft text-foreground', Advanced: 'bg-brand-pink/15 text-foreground' }

export function getGrammarLesson(slug: string) { return grammarLessons.find((lesson) => lesson.slug === slug) }

export function getRelatedLessons(current: GrammarLesson) { return grammarLessons.filter((lesson) => lesson.id !== current.id).slice(0, 2) }
