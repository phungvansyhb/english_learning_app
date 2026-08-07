-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying NOT NULL UNIQUE,
  display_name character varying NOT NULL,
  avatar_url text,
  status character varying NOT NULL DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'suspended'::character varying, 'deleted'::character varying]::text[])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  role USER-DEFINED NOT NULL DEFAULT 'USER'::enum_role,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.auth_providers (
  id bigint NOT NULL DEFAULT nextval('auth_providers_id_seq'::regclass),
  user_id uuid NOT NULL,
  provider character varying NOT NULL CHECK (provider::text = ANY (ARRAY['google'::character varying, 'facebook'::character varying, 'apple'::character varying]::text[])),
  provider_user_id character varying NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT auth_providers_pkey PRIMARY KEY (id),
  CONSTRAINT auth_providers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_learning_profiles (
  user_id uuid NOT NULL,
  target_score smallint CHECK (target_score >= 10 AND target_score <= 990),
  current_estimated_score smallint CHECK (current_estimated_score >= 10 AND current_estimated_score <= 990),
  exam_date date,
  daily_goal_minutes smallint DEFAULT 20,
  daily_vocab_goal smallint DEFAULT 10,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_learning_profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_learning_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_progress_stats (
  user_id uuid NOT NULL,
  level integer NOT NULL DEFAULT 1,
  xp_total bigint NOT NULL DEFAULT 0,
  current_streak_days integer NOT NULL DEFAULT 0,
  longest_streak_days integer NOT NULL DEFAULT 0,
  last_active_date date,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_progress_stats_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_progress_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.badges (
  id smallint NOT NULL DEFAULT nextval('badges_id_seq'::regclass),
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description text,
  icon_url text,
  criteria_type character varying NOT NULL,
  criteria_value integer NOT NULL,
  CONSTRAINT badges_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_badges (
  user_id uuid NOT NULL,
  badge_id smallint NOT NULL,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_badges_pkey PRIMARY KEY (user_id, badge_id),
  CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id)
);
CREATE TABLE public.xp_ledger (
  id bigint NOT NULL DEFAULT nextval('xp_ledger_id_seq'::regclass),
  user_id uuid NOT NULL,
  xp_change integer NOT NULL,
  reason character varying NOT NULL,
  ref_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT xp_ledger_pkey PRIMARY KEY (id, created_at),
  CONSTRAINT xp_ledger_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.skills (
  id smallint NOT NULL DEFAULT nextval('skills_id_seq'::regclass),
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  CONSTRAINT skills_pkey PRIMARY KEY (id)
);
CREATE TABLE public.exam_parts (
  id smallint NOT NULL DEFAULT nextval('exam_parts_id_seq'::regclass),
  skill_id smallint NOT NULL,
  part_number smallint NOT NULL CHECK (part_number >= 1 AND part_number <= 7),
  name character varying NOT NULL,
  CONSTRAINT exam_parts_pkey PRIMARY KEY (id),
  CONSTRAINT exam_parts_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.topics (
  id integer NOT NULL DEFAULT nextval('topics_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  CONSTRAINT topics_pkey PRIMARY KEY (id)
);
CREATE TABLE public.difficulty_levels (
  id smallint NOT NULL DEFAULT nextval('difficulty_levels_id_seq'::regclass),
  code character varying NOT NULL UNIQUE,
  label character varying NOT NULL,
  CONSTRAINT difficulty_levels_pkey PRIMARY KEY (id)
);
CREATE TABLE public.grammar_points (
  id integer NOT NULL DEFAULT nextval('grammar_points_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  description text,
  difficulty_id smallint NOT NULL,
  content text,
  CONSTRAINT grammar_points_pkey PRIMARY KEY (id),
  CONSTRAINT grammar_points_difficulty_id_fkey FOREIGN KEY (difficulty_id) REFERENCES public.difficulty_levels(id)
);
CREATE TABLE public.questions (
  id bigint NOT NULL DEFAULT nextval('questions_id_seq'::regclass),
  skill_id smallint NOT NULL,
  exam_part_id smallint,
  content_category character varying NOT NULL DEFAULT 'exam_part'::character varying CHECK (content_category::text = ANY (ARRAY['exam_part'::character varying, 'skill_drill'::character varying, 'grammar_point'::character varying]::text[])),
  difficulty_id smallint NOT NULL,
  content text NOT NULL,
  audio_url text,
  image_url text,
  transcript text,
  explanation text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT questions_pkey PRIMARY KEY (id),
  CONSTRAINT questions_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id),
  CONSTRAINT questions_exam_part_id_fkey FOREIGN KEY (exam_part_id) REFERENCES public.exam_parts(id),
  CONSTRAINT questions_difficulty_id_fkey FOREIGN KEY (difficulty_id) REFERENCES public.difficulty_levels(id)
);
CREATE TABLE public.question_grammar_points (
  question_id bigint NOT NULL,
  grammar_point_id integer NOT NULL,
  CONSTRAINT question_grammar_points_pkey PRIMARY KEY (question_id, grammar_point_id),
  CONSTRAINT question_grammar_points_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id),
  CONSTRAINT question_grammar_points_grammar_point_id_fkey FOREIGN KEY (grammar_point_id) REFERENCES public.grammar_points(id)
);
CREATE TABLE public.user_grammar_progress (
  user_id uuid NOT NULL,
  grammar_point_id integer NOT NULL,
  correct_count integer NOT NULL DEFAULT 0,
  wrong_count integer NOT NULL DEFAULT 0,
  last_practiced_at timestamp with time zone,
  CONSTRAINT user_grammar_progress_pkey PRIMARY KEY (user_id, grammar_point_id),
  CONSTRAINT user_grammar_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_grammar_progress_grammar_point_id_fkey FOREIGN KEY (grammar_point_id) REFERENCES public.grammar_points(id)
);
CREATE TABLE public.question_topics (
  question_id bigint NOT NULL,
  topic_id integer NOT NULL,
  CONSTRAINT question_topics_pkey PRIMARY KEY (question_id, topic_id),
  CONSTRAINT question_topics_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id),
  CONSTRAINT question_topics_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id)
);
CREATE TABLE public.question_choices (
  id bigint NOT NULL DEFAULT nextval('question_choices_id_seq'::regclass),
  question_id bigint NOT NULL,
  label character NOT NULL CHECK (label = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar, 'D'::bpchar])),
  content text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  CONSTRAINT question_choices_pkey PRIMARY KEY (id),
  CONSTRAINT question_choices_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id)
);
CREATE TABLE public.tests (
  id bigint NOT NULL DEFAULT nextval('tests_id_seq'::regclass),
  title character varying NOT NULL,
  test_type character varying NOT NULL CHECK (test_type::text = ANY (ARRAY['full_mock'::character varying, 'part_practice'::character varying, 'custom'::character varying]::text[])),
  duration_minutes smallint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tests_pkey PRIMARY KEY (id)
);
CREATE TABLE public.test_questions (
  test_id bigint NOT NULL,
  question_id bigint NOT NULL,
  order_index smallint NOT NULL,
  CONSTRAINT test_questions_pkey PRIMARY KEY (test_id, question_id),
  CONSTRAINT test_questions_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id),
  CONSTRAINT test_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id)
);
CREATE TABLE public.score_conversion_table (
  skill_id smallint NOT NULL,
  raw_correct smallint NOT NULL,
  scaled_score smallint NOT NULL,
  CONSTRAINT score_conversion_table_pkey PRIMARY KEY (skill_id, raw_correct),
  CONSTRAINT score_conversion_table_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.test_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  test_id bigint,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  status character varying NOT NULL DEFAULT 'in_progress'::character varying CHECK (status::text = ANY (ARRAY['in_progress'::character varying, 'completed'::character varying, 'abandoned'::character varying]::text[])),
  listening_scaled_score smallint,
  reading_scaled_score smallint,
  CONSTRAINT test_attempts_pkey PRIMARY KEY (id, started_at),
  CONSTRAINT test_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT test_attempts_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id)
);
CREATE TABLE public.attempt_answers (
  id bigint NOT NULL DEFAULT nextval('attempt_answers_id_seq'::regclass),
  attempt_id uuid NOT NULL,
  attempt_started_at timestamp with time zone NOT NULL,
  question_id bigint NOT NULL,
  selected_choice_id bigint,
  is_correct boolean NOT NULL,
  time_spent_seconds smallint,
  answered_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT attempt_answers_pkey PRIMARY KEY (id, answered_at),
  CONSTRAINT attempt_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id),
  CONSTRAINT attempt_answers_selected_choice_id_fkey FOREIGN KEY (selected_choice_id) REFERENCES public.question_choices(id)
);
CREATE TABLE public.speaking_prompts (
  id bigint NOT NULL DEFAULT nextval('speaking_prompts_id_seq'::regclass),
  prompt_type character varying NOT NULL CHECK (prompt_type::text = ANY (ARRAY['read_aloud'::character varying, 'describe_picture'::character varying, 'respond_questions'::character varying, 'propose_solution'::character varying, 'express_opinion'::character varying]::text[])),
  prompt_text text NOT NULL,
  image_url text,
  sample_audio_url text,
  difficulty_id smallint NOT NULL,
  prep_time_seconds smallint NOT NULL,
  response_time_seconds smallint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT speaking_prompts_pkey PRIMARY KEY (id),
  CONSTRAINT speaking_prompts_difficulty_id_fkey FOREIGN KEY (difficulty_id) REFERENCES public.difficulty_levels(id)
);
CREATE TABLE public.user_speaking_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  prompt_id bigint NOT NULL,
  audio_url text NOT NULL,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  status character varying NOT NULL DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'scored'::character varying, 'failed'::character varying]::text[])),
  band_score smallint,
  feedback text,
  scored_at timestamp with time zone,
  CONSTRAINT user_speaking_submissions_pkey PRIMARY KEY (id, submitted_at),
  CONSTRAINT user_speaking_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_speaking_submissions_prompt_id_fkey FOREIGN KEY (prompt_id) REFERENCES public.speaking_prompts(id)
);
CREATE TABLE public.writing_prompts (
  id bigint NOT NULL DEFAULT nextval('writing_prompts_id_seq'::regclass),
  prompt_type character varying NOT NULL CHECK (prompt_type::text = ANY (ARRAY['picture_description'::character varying, 'respond_email'::character varying, 'opinion_essay'::character varying]::text[])),
  prompt_text text NOT NULL,
  image_url text,
  difficulty_id smallint NOT NULL,
  time_limit_seconds smallint NOT NULL,
  min_word_count smallint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT writing_prompts_pkey PRIMARY KEY (id),
  CONSTRAINT writing_prompts_difficulty_id_fkey FOREIGN KEY (difficulty_id) REFERENCES public.difficulty_levels(id)
);
CREATE TABLE public.user_writing_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  prompt_id bigint NOT NULL,
  submitted_text text NOT NULL,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  status character varying NOT NULL DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'scored'::character varying, 'failed'::character varying]::text[])),
  band_score smallint,
  feedback text,
  scored_at timestamp with time zone,
  CONSTRAINT user_writing_submissions_pkey PRIMARY KEY (id, submitted_at),
  CONSTRAINT user_writing_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_writing_submissions_prompt_id_fkey FOREIGN KEY (prompt_id) REFERENCES public.writing_prompts(id)
);
CREATE TABLE public.vocab_words (
  id bigint NOT NULL DEFAULT nextval('vocab_words_id_seq'::regclass),
  word character varying NOT NULL,
  ipa character varying,
  difficulty_id smallint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT vocab_words_pkey PRIMARY KEY (id),
  CONSTRAINT vocab_words_difficulty_id_fkey FOREIGN KEY (difficulty_id) REFERENCES public.difficulty_levels(id)
);
CREATE TABLE public.vocab_word_topics (
  word_id bigint NOT NULL,
  topic_id integer NOT NULL,
  CONSTRAINT vocab_word_topics_pkey PRIMARY KEY (word_id, topic_id),
  CONSTRAINT vocab_word_topics_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.vocab_words(id),
  CONSTRAINT vocab_word_topics_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id)
);
CREATE TABLE public.vocab_examples (
  id bigint NOT NULL DEFAULT nextval('vocab_examples_id_seq'::regclass),
  word_id bigint NOT NULL,
  sentence_en text NOT NULL,
  sentence_vi text,
  CONSTRAINT vocab_examples_pkey PRIMARY KEY (id),
  CONSTRAINT vocab_examples_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.vocab_words(id)
);
CREATE TABLE public.vocab_relations (
  word_id bigint NOT NULL,
  related_word_id bigint NOT NULL,
  relation_type character varying NOT NULL CHECK (relation_type::text = ANY (ARRAY['synonym'::character varying, 'antonym'::character varying]::text[])),
  CONSTRAINT vocab_relations_pkey PRIMARY KEY (word_id, related_word_id, relation_type),
  CONSTRAINT vocab_relations_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.vocab_words(id),
  CONSTRAINT vocab_relations_related_word_id_fkey FOREIGN KEY (related_word_id) REFERENCES public.vocab_words(id)
);
CREATE TABLE public.vocab_collocations (
  id bigint NOT NULL DEFAULT nextval('vocab_collocations_id_seq'::regclass),
  word_id bigint NOT NULL,
  phrase character varying NOT NULL,
  meaning_vi text,
  CONSTRAINT vocab_collocations_pkey PRIMARY KEY (id),
  CONSTRAINT vocab_collocations_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.vocab_words(id)
);
CREATE TABLE public.user_vocab_progress (
  user_id uuid NOT NULL,
  word_id bigint NOT NULL,
  srs_stage smallint NOT NULL DEFAULT 0,
  ease_factor numeric NOT NULL DEFAULT 2.5,
  interval_days integer NOT NULL DEFAULT 0,
  next_review_at timestamp with time zone NOT NULL DEFAULT now(),
  last_reviewed_at timestamp with time zone,
  correct_count integer NOT NULL DEFAULT 0,
  wrong_count integer NOT NULL DEFAULT 0,
  source character varying NOT NULL DEFAULT 'manual'::character varying CHECK (source::text = ANY (ARRAY['manual'::character varying, 'lookup'::character varying, 'wrong_answer'::character varying, 'recommended'::character varying]::text[])),
  status character varying NOT NULL DEFAULT 'learning'::character varying CHECK (status::text = ANY (ARRAY['learning'::character varying, 'mastered'::character varying]::text[])),
  CONSTRAINT user_vocab_progress_pkey PRIMARY KEY (user_id, word_id),
  CONSTRAINT user_vocab_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_vocab_progress_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.vocab_words(id)
);
CREATE TABLE public.vocab_quiz_attempts (
  id bigint NOT NULL DEFAULT nextval('vocab_quiz_attempts_id_seq'::regclass),
  user_id uuid NOT NULL,
  word_id bigint NOT NULL,
  quiz_type character varying NOT NULL,
  is_correct boolean NOT NULL,
  answered_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT vocab_quiz_attempts_pkey PRIMARY KEY (id, answered_at),
  CONSTRAINT vocab_quiz_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT vocab_quiz_attempts_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.vocab_words(id)
);
CREATE TABLE public.friendships (
  id bigint NOT NULL DEFAULT nextval('friendships_id_seq'::regclass),
  requester_id uuid NOT NULL,
  addressee_id uuid NOT NULL,
  status character varying NOT NULL DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'accepted'::character varying, 'blocked'::character varying]::text[])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  responded_at timestamp with time zone,
  CONSTRAINT friendships_pkey PRIMARY KEY (id),
  CONSTRAINT friendships_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id),
  CONSTRAINT friendships_addressee_id_fkey FOREIGN KEY (addressee_id) REFERENCES public.users(id)
);
CREATE TABLE public.study_groups (
  id bigint NOT NULL DEFAULT nextval('study_groups_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  owner_id uuid NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT study_groups_pkey PRIMARY KEY (id),
  CONSTRAINT study_groups_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id)
);
CREATE TABLE public.group_members (
  group_id bigint NOT NULL,
  user_id uuid NOT NULL,
  role character varying NOT NULL DEFAULT 'member'::character varying CHECK (role::text = ANY (ARRAY['owner'::character varying, 'admin'::character varying, 'member'::character varying]::text[])),
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT group_members_pkey PRIMARY KEY (group_id, user_id),
  CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.study_groups(id),
  CONSTRAINT group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.challenges (
  id bigint NOT NULL DEFAULT nextval('challenges_id_seq'::regclass),
  challenger_id uuid NOT NULL,
  opponent_id uuid NOT NULL,
  challenge_type character varying NOT NULL CHECK (challenge_type::text = ANY (ARRAY['test'::character varying, 'vocab_quiz'::character varying]::text[])),
  ref_test_id bigint,
  status character varying NOT NULL DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'active'::character varying, 'completed'::character varying, 'expired'::character varying]::text[])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  CONSTRAINT challenges_pkey PRIMARY KEY (id),
  CONSTRAINT challenges_challenger_id_fkey FOREIGN KEY (challenger_id) REFERENCES public.users(id),
  CONSTRAINT challenges_opponent_id_fkey FOREIGN KEY (opponent_id) REFERENCES public.users(id),
  CONSTRAINT challenges_ref_test_id_fkey FOREIGN KEY (ref_test_id) REFERENCES public.tests(id)
);
CREATE TABLE public.challenge_results (
  challenge_id bigint NOT NULL,
  user_id uuid NOT NULL,
  score integer NOT NULL,
  time_spent_seconds integer,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT challenge_results_pkey PRIMARY KEY (challenge_id, user_id),
  CONSTRAINT challenge_results_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id),
  CONSTRAINT challenge_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.leaderboard_snapshots (
  id bigint NOT NULL DEFAULT nextval('leaderboard_snapshots_id_seq'::regclass),
  scope character varying NOT NULL CHECK (scope::text = ANY (ARRAY['global'::character varying, 'friends'::character varying, 'group'::character varying]::text[])),
  scope_ref_id bigint,
  period_type character varying NOT NULL CHECK (period_type::text = ANY (ARRAY['weekly'::character varying, 'monthly'::character varying]::text[])),
  period_start date NOT NULL,
  user_id uuid NOT NULL,
  xp_earned bigint NOT NULL,
  rank integer NOT NULL,
  computed_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT leaderboard_snapshots_pkey PRIMARY KEY (id),
  CONSTRAINT leaderboard_snapshots_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.notifications (
  id bigint NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
  user_id uuid NOT NULL,
  type character varying NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id, created_at),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.recommended_activities (
  id bigint NOT NULL DEFAULT nextval('recommended_activities_id_seq'::regclass),
  user_id uuid NOT NULL,
  activity_type character varying NOT NULL CHECK (activity_type::text = ANY (ARRAY['practice_set'::character varying, 'vocab_review'::character varying, 'mock_test'::character varying, 'grammar_review'::character varying, 'speaking_prompt'::character varying, 'writing_prompt'::character varying]::text[])),
  ref_id bigint,
  priority smallint NOT NULL DEFAULT 0,
  reason character varying,
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT recommended_activities_pkey PRIMARY KEY (id),
  CONSTRAINT recommended_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  avatar_url text,
  update_at timestamp with time zone DEFAULT now(),
  phone text,
  company text,
  plan text DEFAULT 'free'::text,
  email text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.word_meaning (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  part_of_speech USER-DEFINED,
  meaning text,
  example text,
  example meaning text,
  word_id bigint,
  is_primary_use boolean,
  CONSTRAINT word_meaning_pkey PRIMARY KEY (id),
  CONSTRAINT word_meaning_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.vocab_words(id)
);