export type ProgressTone = 'purple' | 'orange' | 'pink' | 'mint';

export type BasePaginationOptions = {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: 'created_at';
  sortOrder?: 'asc' | 'desc';
};
export interface Option {
  label: string;
  value: string | number;
}

export type ServerPageProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};



// END COMMON TYPE

export interface ProgressItem {
  id: string;
  title: string;
  learned: number;
  target: number;
  tone: ProgressTone;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readingTime: string;
  image: string;
}

export interface CourseTag {
  label: string;
  tone: 'purple' | 'mint' | 'orange' | 'pink';
}

export interface UpcomingCourse {
  id: string;
  title: string;
  description: string;
  price: string;
  cents: string;
  duration: string;
  lessons: string;
  tags: CourseTag[];
  students: string[];
}

export interface CalendarDay {
  label: string;
  date: number;
  active?: boolean;
}
export const PARTS_OF_SPEECH = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
  'pronoun',
  'conjunction',
  'interjection',
] as const;

export type PartOfSpeech = (typeof PARTS_OF_SPEECH)[number];

export interface WordMeaning {
  pos: PartOfSpeech;
  meaning: string;
  example: string;
}

export interface Word {
  id: string;
  part_id: string;
  word: string;
  ipa: string;
  audio_us: string | null;
  audio_uk: string | null;
  image_url: string | null;
  meanings: WordMeaning[];
  phrases: string[];
  synonyms: string[];
  order_index: number;
  difficulty_level: number;
}

export const ROLE_CONSTANT = {
  USER: 'USER',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  CONTENT_ADMIN: 'CONTENT_ADMIN',
};
Object.freeze(ROLE_CONSTANT);

// User types
export type UserStatus = 'active' | 'suspended' | 'deleted';

export type UserRow = {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  role: string;
};

export type CreateUserInput = {
  id?: string;
  email: string;
  display_name: string;
  avatar_url?: string | null;
  status?: UserStatus;
  role?: string;
};

export type ListUsersOptions = {
  page?: number;
  perPage?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: 'created_at' | 'email' | 'display_name';
  sortOrder?: 'asc' | 'desc';
};
export type SkillRow = {
  id: number;
  code: string;
  name: string;
};

export type CreateSkillInput = {
  id?: number;
  code: string;
  name: string;
};

export type DifficultyLevelRow = {
  id: number;
  code: string;
  label: string;
};

export type CreateDifficultyLevelInput = {
  id?: number;
  code: string;
  label: string;
};

export type ExamPartRow = {
  id: number;
  skill_id: number;
  part_number: number;
  name: string;
};

export type CreateExamPartInput = {
  id?: number;
  skill_id: number;
  part_number?: number;
  name: string;
};

export type GrammarPointRow = {
  id: number;
  name: string;
  description?: string | null;
  difficulty_id: number;
  content?: string | null;
};

export type CreateGrammarPointInput = {
  id?: number;
  name: string;
  description?: string | null;
  difficulty_id: string;
  content?: string | null;
};

export type ListGrammarPointsOptions = {
  page?: number;
  perPage?: number;
  search?: string;
  difficulty_id?: string;
};

export type TopicRow = {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  total_word?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CreateTopicInput = {
  id?: number;
  name: string;
};

export type BadgeRow = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  icon_url?: string | null;
  criteria_type: string;
  criteria_value: number;
};

export type CreateBadgeInput = {
  id?: number;
  code: string;
  name: string;
  description?: string | null;
  icon_url?: string | null;
  criteria_type: string;
  criteria_value: number;
};

export type ListMasterDataOptions = {
  page?: number;
  perPage?: number;
  search?: string;
  skill_id?: number;
  part_number?: number;
};

export type TestRow = {
  id: number;
  title: string;
  test_type: 'FULL' | 'SHORT';
  status: 'ACTIVE' | 'INACTIVE';
  duration_minutes: number;
  created_at: string;
};
export type CreateTestInput = Partial<TestRow>;

export type QuestionRow = {
  id: number;
  answer_type: 'ONE' | 'MULTIPLE' | 'OPEN';
  content: string;
  audio_url?: string | null;
  image_url?: string | null;
  explanation?: string | null;
  transcript?: string | null;
  created_at: string;
  updated_at?: string;
  paraphrasing?: string | null;
  group_data?: number[];
  skill?: {
    id: number;
    code: string;
    name: string;
  };
  exam_part?: {
    id: number;
    part_number: number;
    name: string;
  };
  difficulty?: {
    id: number;
    code: string;
    label: string;
  };
  test?: {
    id: number;
    title: string;
  };
};

export type CreateQuestionInput = {
  id?: number;
  answer_type?: 'ONE' | 'MULTIPLE' | 'OPEN';
  content?: string;
  audio_url?: string | null;
  image_url?: string | null;
  explanation?: string | null;
  transcript?: string | null;
  created_at?: string;
  updated_at?: string;
  paraphrasing?: string | null;
  group_data?: number[];
  skill_id?: number;
  exam_part_id?: number;
  difficulty_id?: number;
  topic_id?: number;
  grammar_point_id?: number | null;
  test_id?: number | null;
  choices?: {
    id?: number;
    label: string;
    content: string;
    is_correct: boolean;
    transcript?: string | null;
  }[];
};


export type WordCard = {
  id: number,
  word: string,
  ipa_uk: string,
  difficulty_id: number,
  created_at: string,
  ipa_us: string,
  difficulty_label: string,
}