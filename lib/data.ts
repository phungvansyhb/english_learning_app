import type {
  Article,
  CalendarDay,
  ProgressCourse,
  UpcomingCourse,
} from "@/lib/types"

export const progressCourses: ProgressCourse[] = [
  {
    id: "beginner-mastery",
    title: "Beginner's Language Mastery",
    progress: 86,
    tone: "purple",
  },
  {
    id: "english-essentials",
    title: "English Essentials Course",
    progress: 32,
    tone: "orange",
  },
  {
    id: "novice-proficient",
    title: "Novice to Proficient English",
    progress: 5,
    tone: "pink",
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
