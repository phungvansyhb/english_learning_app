import type {
  Article,
  CalendarDay,
  ProgressItem,
  UpcomingCourse,
} from "@/lib/types"

export const progresses: ProgressItem[] = [
  {
    id: "1",
    title: "Vocabulary mastered",
    learned: 8,
    target: 16,
    tone: "mint",
  },
  {
    id: "2",
    title: "Reading topic",
    learned: 5,
    target: 10,
    tone: "orange",
  },
  {
    id: "3",
    title: "Listening skill",
    learned: 5,
    target: 30,
    tone: "pink",
  },
  {
    id: "4",
    title: "Mocke test average",
    learned: 1,
    target: 3,
    tone: "purple",
  },
]

export const articles: Article[] = [
  {
    id: "mastering-vocabulary",
    title:
      "Mastering Vocabulary: Proven Strategies for Efficient English Word Learning",
    category: "Technique",
    readingTime: "5 min",
    image: "/illustrations/article-vocabulary.png",
  },
  {
    id: "embarking-english",
    title:
      "Embarking on English: A Beginner's Guide to Kickstart Your Language Learning",
    category: "Technique",
    readingTime: "5 min",
    image: "/illustrations/article-beginner.png",
  },
]

export const calendarDays: CalendarDay[] = [
  { label: "Mon", date: 23 },
  { label: "Tue", date: 24 },
  { label: "Wed", date: 25 },
  { label: "Thu", date: 26, active: true },
  { label: "Fri", date: 27 },
  { label: "Sat", date: 28 },
  { label: "Sun", date: 29 },
]

export const upcomingCourses: UpcomingCourse[] = [
  {
    id: "english-grammar",
    title: "English Grammar",
    description:
      "Basic English grammar includes learning verbs, nouns, and simple sentence structure for effective communication.",
    price: "$50",
    cents: ".99",
    duration: "3 month",
    lessons: "56 lessons",
    tags: [
      { label: "Beginner", tone: "purple" },
      { label: "Grammar", tone: "mint" },
    ],
    students: [
      "/avatars/student-1.png",
      "/avatars/student-2.png",
      "/avatars/student-3.png",
      "/avatars/student-4.png",
    ],
  },
  {
    id: "idioms-friendship",
    title: "Idioms about friendship",
    description:
      "Friendship idioms add colorful expressions to language, like 'to be on the same page' or 'to have someone's back', enhancing communication.",
    price: "$25",
    cents: ".99",
    duration: "2 weeks",
    lessons: "10 lessons",
    tags: [
      { label: "Intermidiate", tone: "orange" },
      { label: "Vocabulary", tone: "pink" },
    ],
    students: [
      "/avatars/student-4.png",
      "/avatars/student-1.png",
      "/avatars/student-2.png",
    ],
  },
]


export const vocabCategories = [
  {
    id: 1,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 15,
    learnedword: 8,
    categoryName: 'Contracts',
    vocabGroup: '600 essential words',
    description: 'Learn legal and contract-related terminology used in business agreements and negotiations.',
  },
  {
    id: 2,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 18,
    learnedword: 10,
    categoryName: 'Marketing',
    vocabGroup: '600 essential words',
    description: 'Master marketing strategies, advertising terms, and promotional vocabulary.',
  },
  {
    id: 3,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 20,
    learnedword: 12,
    categoryName: 'Business',
    vocabGroup: '600 essential words',
    description: 'Essential business vocabulary for corporate communication and professional settings.',
  },
  {
    id: 4,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 22,
    learnedword: 9,
    categoryName: 'Technology',
    vocabGroup: '600 essential words',
    description: 'Explore IT terminology, software concepts, and digital innovation vocabulary.',
  },
  {
    id: 5,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 16,
    learnedword: 7,
    categoryName: 'Healthcare',
    vocabGroup: '600 essential words',
    description: 'Learn medical terminology, health conditions, and healthcare system vocabulary.',
  },
  {
    id: 6,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 19,
    learnedword: 11,
    categoryName: 'Travel',
    vocabGroup: '600 essential words',
    description: 'Essential phrases and vocabulary for travel, tourism, and exploring new destinations.',
  },
  {
    id: 7,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 21,
    learnedword: 13,
    categoryName: 'Academic',
    vocabGroup: '600 essential words',
    description: 'Academic and scholarly vocabulary for education, research, and intellectual discourse.',
  },
  {
    id: 8,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 17,
    learnedword: 10,
    categoryName: 'Everyday Life',
    vocabGroup: '600 essential words',
    description: 'Common daily vocabulary for household items, activities, and regular conversations.',
  },
  {
    id: 9,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 14,
    learnedword: 6,
    categoryName: 'Sports',
    vocabGroup: '600 essential words',
    description: 'Sports terminology, fitness vocabulary, and athletic activity words.',
  },
  {
    id: 10,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 18,
    learnedword: 9,
    categoryName: 'Food & Cooking',
    vocabGroup: '600 essential words',
    description: 'Culinary vocabulary, cooking techniques, and food-related expressions.',
  },
  {
    id: 11,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 20,
    learnedword: 14,
    categoryName: 'Entertainment',
    vocabGroup: '600 essential words',
    description: 'Entertainment vocabulary including movies, music, arts, and leisure activities.',
  },
  {
    id: 12,
    imageUrl: '/illustrations/article-vocabulary.png',
    wordCount: 16,
    learnedword: 8,
    categoryName: 'Finance',
    vocabGroup: '600 essential words',
    description: 'Financial and economic vocabulary for banking, investments, and money management.',
  },
]