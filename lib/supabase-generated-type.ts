export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      attempt_answers: {
        Row: {
          answered_at: string
          attempt_id: string
          attempt_started_at: string
          id: number
          is_correct: boolean
          question_id: number
          selected_choice_id: number | null
          time_spent_seconds: number | null
        }
        Insert: {
          answered_at?: string
          attempt_id: string
          attempt_started_at: string
          id?: number
          is_correct: boolean
          question_id: number
          selected_choice_id?: number | null
          time_spent_seconds?: number | null
        }
        Update: {
          answered_at?: string
          attempt_id?: string
          attempt_started_at?: string
          id?: number
          is_correct?: boolean
          question_id?: number
          selected_choice_id?: number | null
          time_spent_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attempt_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempt_answers_selected_choice_id_fkey"
            columns: ["selected_choice_id"]
            isOneToOne: false
            referencedRelation: "question_choices"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          code: string
          criteria_type: string
          criteria_value: number
          description: string | null
          icon_url: string | null
          id: number
          name: string
        }
        Insert: {
          code: string
          criteria_type: string
          criteria_value: number
          description?: string | null
          icon_url?: string | null
          id?: number
          name: string
        }
        Update: {
          code?: string
          criteria_type?: string
          criteria_value?: number
          description?: string | null
          icon_url?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      challenge_results: {
        Row: {
          challenge_id: number
          completed_at: string
          score: number
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          challenge_id: number
          completed_at?: string
          score: number
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: number
          completed_at?: string
          score?: number
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_results_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_type: string
          challenger_id: string
          created_at: string
          expires_at: string | null
          id: number
          opponent_id: string
          ref_test_id: number | null
          status: string
        }
        Insert: {
          challenge_type: string
          challenger_id: string
          created_at?: string
          expires_at?: string | null
          id?: number
          opponent_id: string
          ref_test_id?: number | null
          status?: string
        }
        Update: {
          challenge_type?: string
          challenger_id?: string
          created_at?: string
          expires_at?: string | null
          id?: number
          opponent_id?: string
          ref_test_id?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      difficulty_levels: {
        Row: {
          code: string
          id: number
          label: string
        }
        Insert: {
          code: string
          id?: number
          label: string
        }
        Update: {
          code?: string
          id?: number
          label?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: number
          requester_id: string
          responded_at: string | null
          status: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: number
          requester_id: string
          responded_at?: string | null
          status?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: number
          requester_id?: string
          responded_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      grammar_points: {
        Row: {
          content: string | null
          description: string | null
          difficulty_id: number
          id: number
          name: string
        }
        Insert: {
          content?: string | null
          description?: string | null
          difficulty_id: number
          id?: number
          name: string
        }
        Update: {
          content?: string | null
          description?: string | null
          difficulty_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "grammar_points_difficulty_id_fkey"
            columns: ["difficulty_id"]
            isOneToOne: false
            referencedRelation: "difficulty_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: number
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: number
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: number
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_snapshots: {
        Row: {
          computed_at: string
          id: number
          period_start: string
          period_type: string
          rank: number
          scope: string
          scope_ref_id: number | null
          user_id: string
          xp_earned: number
        }
        Insert: {
          computed_at?: string
          id?: number
          period_start: string
          period_type: string
          rank: number
          scope: string
          scope_ref_id?: number | null
          user_id: string
          xp_earned: number
        }
        Update: {
          computed_at?: string
          id?: number
          period_start?: string
          period_type?: string
          rank?: number
          scope?: string
          scope_ref_id?: number | null
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          is_read: boolean
          payload: Json
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_read?: boolean
          payload?: Json
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_read?: boolean
          payload?: Json
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          plan: string | null
          update_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id: string
          name: string
          phone?: string | null
          plan?: string | null
          update_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          plan?: string | null
          update_at?: string | null
        }
        Relationships: []
      }
      question_choices: {
        Row: {
          content: string
          id: number
          is_correct: boolean
          label: string
          question_id: number
          transcript: string | null
        }
        Insert: {
          content: string
          id?: number
          is_correct?: boolean
          label: string
          question_id: number
          transcript?: string | null
        }
        Update: {
          content?: string
          id?: number
          is_correct?: boolean
          label?: string
          question_id?: number
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_choices_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_grammar_points: {
        Row: {
          grammar_point_id: number
          question_id: number
        }
        Insert: {
          grammar_point_id: number
          question_id: number
        }
        Update: {
          grammar_point_id?: number
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_grammar_points_grammar_point_id_fkey"
            columns: ["grammar_point_id"]
            isOneToOne: false
            referencedRelation: "grammar_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_grammar_points_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string
          difficulty_id: number
          id: number
          sentence_en: string | null
          topic_id: number | null
          transcript: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty_id: number
          id?: number
          sentence_en?: string | null
          topic_id?: number | null
          transcript?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty_id?: number
          id?: number
          sentence_en?: string | null
          topic_id?: number | null
          transcript?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_difficulty_id_fkey"
            columns: ["difficulty_id"]
            isOneToOne: false
            referencedRelation: "difficulty_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      score_conversion_table: {
        Row: {
          raw_correct: number
          scaled_score: number
          skill_id: number
        }
        Insert: {
          raw_correct: number
          scaled_score: number
          skill_id: number
        }
        Update: {
          raw_correct?: number
          scaled_score?: number
          skill_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "score_conversion_table_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          code: string
          id: number
          name: string
        }
        Insert: {
          code: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      study_groups: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_public: boolean
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_public?: boolean
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_public?: boolean
          name?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_groups_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean | null
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          activity_date: string | null
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          activity_date?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          activity_date?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: number
          earned_at: string
          user_id: string
        }
        Insert: {
          badge_id: number
          earned_at?: string
          user_id: string
        }
        Update: {
          badge_id?: number
          earned_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_custom_category_vocab: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_custom_category_vocab_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_grammar_progress: {
        Row: {
          correct_count: number
          grammar_point_id: number
          last_practiced_at: string | null
          user_id: string
          wrong_count: number
        }
        Insert: {
          correct_count?: number
          grammar_point_id: number
          last_practiced_at?: string | null
          user_id: string
          wrong_count?: number
        }
        Update: {
          correct_count?: number
          grammar_point_id?: number
          last_practiced_at?: string | null
          user_id?: string
          wrong_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_grammar_progress_grammar_point_id_fkey"
            columns: ["grammar_point_id"]
            isOneToOne: false
            referencedRelation: "grammar_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_grammar_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_learning_profiles: {
        Row: {
          current_estimated_score: number | null
          daily_goal_minutes: number | null
          daily_vocab_goal: number | null
          exam_date: string | null
          target_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          current_estimated_score?: number | null
          daily_goal_minutes?: number | null
          daily_vocab_goal?: number | null
          exam_date?: string | null
          target_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          current_estimated_score?: number | null
          daily_goal_minutes?: number | null
          daily_vocab_goal?: number | null
          exam_date?: string | null
          target_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_learning_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress_stats: {
        Row: {
          current_streak_days: number
          last_active_date: string | null
          level: number
          longest_streak_days: number
          updated_at: string
          user_id: string
          xp_total: number
        }
        Insert: {
          current_streak_days?: number
          last_active_date?: string | null
          level?: number
          longest_streak_days?: number
          updated_at?: string
          user_id?: string
          xp_total?: number
        }
        Update: {
          current_streak_days?: number
          last_active_date?: string | null
          level?: number
          longest_streak_days?: number
          updated_at?: string
          user_id?: string
          xp_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_vocab_progress: {
        Row: {
          correct_count: number
          ease_factor: number
          interval_days: number
          last_reviewed_at: string | null
          next_review_at: string
          source: string
          srs_stage: number
          status: string
          user_id: string
          word_id: number
          wrong_count: number
        }
        Insert: {
          correct_count?: number
          ease_factor?: number
          interval_days?: number
          last_reviewed_at?: string | null
          next_review_at?: string
          source?: string
          srs_stage?: number
          status?: string
          user_id: string
          word_id: number
          wrong_count?: number
        }
        Update: {
          correct_count?: number
          ease_factor?: number
          interval_days?: number
          last_reviewed_at?: string | null
          next_review_at?: string
          source?: string
          srs_stage?: number
          status?: string
          user_id?: string
          word_id?: number
          wrong_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_vocab_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_vocab_progress_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocab_words"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          role: Database["public"]["Enums"]["enum_role"]
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          email: string
          id?: string
          role?: Database["public"]["Enums"]["enum_role"]
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["enum_role"]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      vocab_collocations: {
        Row: {
          id: number
          meaning_vi: string | null
          phrase: string
          word_id: number
        }
        Insert: {
          id?: number
          meaning_vi?: string | null
          phrase: string
          word_id: number
        }
        Update: {
          id?: number
          meaning_vi?: string | null
          phrase?: string
          word_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vocab_collocations_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocab_words"
            referencedColumns: ["id"]
          },
        ]
      }
      vocab_quiz_attempts: {
        Row: {
          answered_at: string
          id: number
          is_correct: boolean
          quiz_type: string
          user_id: string
          word_id: number
        }
        Insert: {
          answered_at?: string
          id?: number
          is_correct: boolean
          quiz_type: string
          user_id: string
          word_id: number
        }
        Update: {
          answered_at?: string
          id?: number
          is_correct?: boolean
          quiz_type?: string
          user_id?: string
          word_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vocab_quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vocab_quiz_attempts_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocab_words"
            referencedColumns: ["id"]
          },
        ]
      }
      vocab_relations: {
        Row: {
          meaning: string | null
          relation_type: Database["public"]["Enums"]["word_relation_type"]
          word: string | null
          word_id: number
        }
        Insert: {
          meaning?: string | null
          relation_type: Database["public"]["Enums"]["word_relation_type"]
          word?: string | null
          word_id: number
        }
        Update: {
          meaning?: string | null
          relation_type?: Database["public"]["Enums"]["word_relation_type"]
          word?: string | null
          word_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vocab_relations_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocab_words"
            referencedColumns: ["id"]
          },
        ]
      }
      vocab_word_topics: {
        Row: {
          topic_id: number
          word_id: number
        }
        Insert: {
          topic_id: number
          word_id: number
        }
        Update: {
          topic_id?: number
          word_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vocab_word_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vocab_word_topics_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocab_words"
            referencedColumns: ["id"]
          },
        ]
      }
      vocab_word_user_custom_category: {
        Row: {
          cate_id: number | null
          created_at: string
          id: number
          word_id: number | null
        }
        Insert: {
          cate_id?: number | null
          created_at?: string
          id?: number
          word_id?: number | null
        }
        Update: {
          cate_id?: number | null
          created_at?: string
          id?: number
          word_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vocab_word_user_custom_category_cate_id_fkey"
            columns: ["cate_id"]
            isOneToOne: false
            referencedRelation: "user_custom_category_vocab"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vocab_word_user_custom_category_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocab_words"
            referencedColumns: ["id"]
          },
        ]
      }
      vocab_words: {
        Row: {
          created_at: string
          difficulty_id: number
          id: number
          ipa_uk: string | null
          ipa_us: string | null
          word: string | null
        }
        Insert: {
          created_at?: string
          difficulty_id: number
          id?: number
          ipa_uk?: string | null
          ipa_us?: string | null
          word?: string | null
        }
        Update: {
          created_at?: string
          difficulty_id?: number
          id?: number
          ipa_uk?: string | null
          ipa_us?: string | null
          word?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vocab_words_difficulty_id_fkey"
            columns: ["difficulty_id"]
            isOneToOne: false
            referencedRelation: "difficulty_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      word_meaning: {
        Row: {
          created_at: string
          example: string | null
          example_meaning: string | null
          id: number
          is_primary_use: boolean | null
          meaning: string | null
          part_of_speech: string | null
          word_id: number | null
        }
        Insert: {
          created_at?: string
          example?: string | null
          example_meaning?: string | null
          id?: number
          is_primary_use?: boolean | null
          meaning?: string | null
          part_of_speech?: string | null
          word_id?: number | null
        }
        Update: {
          created_at?: string
          example?: string | null
          example_meaning?: string | null
          id?: number
          is_primary_use?: boolean | null
          meaning?: string | null
          part_of_speech?: string | null
          word_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "word_meaning_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocab_words"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_ledger: {
        Row: {
          created_at: string
          id: number
          reason: string
          ref_id: string | null
          user_id: string
          xp_change: number
        }
        Insert: {
          created_at?: string
          id?: number
          reason: string
          ref_id?: string | null
          user_id: string
          xp_change: number
        }
        Update: {
          created_at?: string
          id?: number
          reason?: string
          ref_id?: string | null
          user_id?: string
          xp_change?: number
        }
        Relationships: [
          {
            foreignKeyName: "xp_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_mastered_word_count: { Args: { p_topic_id: number }; Returns: number }
      get_mastered_word_counts_by_topic: {
        Args: never
        Returns: {
          mastered_word_count: number
          topic_id: number
        }[]
      }
      get_vocab_word_by_name: { Args: { p_word: string }; Returns: Json }
      get_vocab_words_by_topic: {
        Args: { p_topic_id: number }
        Returns: {
          collocations: Json
          correct_count: number
          created_at: string
          difficulty_id: number
          difficulty_label: string
          id: number
          ipa_uk: string
          ipa_us: string
          meanings: Json
          relations: Json
          srs_stage: number
          status: string
          word: string
          wrong_count: number
        }[]
      }
      insert_question_to_test: { Args: { p_data: Json }; Returns: number }
      insert_vocab_data: { Args: { p_data: Json }; Returns: number }
      insert_vocab_data_v2: { Args: { p_data: Json }; Returns: number }
      is_system_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      answer_type_enum: "ONE" | "MULTIPLE" | "OPEN"
      enum_role: "USER" | "SYSTEM_ADMIN" | "CONTENT_ADMIN"
      part_of_speech:
        | "NOUN"
        | "VERB"
        | "ADJECTIVE"
        | "PREPOSITION"
        | "ADVERD"
        | "CONJUNCTION"
        | "INTERJECTION"
      status: "ACTIVE" | "PROCESSING" | "DELETED" | "BANNED"
      test_status_enum: "ACTIVE" | "INACTIVE"
      test_type_enum: "FULL" | "SHORT"
      vocab_source_enum: "APP_DEFAULT" | "EXERCISE" | "TEST" | "DICTIONARY"
      vocab_status_enum: "LEARNING" | "REVIEWING" | "MASTERED" | "IGNORED"
      word_relation_type: "SYNONYMS" | "ANTONYMS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      answer_type_enum: ["ONE", "MULTIPLE", "OPEN"],
      enum_role: ["USER", "SYSTEM_ADMIN", "CONTENT_ADMIN"],
      part_of_speech: [
        "NOUN",
        "VERB",
        "ADJECTIVE",
        "PREPOSITION",
        "ADVERD",
        "CONJUNCTION",
        "INTERJECTION",
      ],
      status: ["ACTIVE", "PROCESSING", "DELETED", "BANNED"],
      test_status_enum: ["ACTIVE", "INACTIVE"],
      test_type_enum: ["FULL", "SHORT"],
      vocab_source_enum: ["APP_DEFAULT", "EXERCISE", "TEST", "DICTIONARY"],
      vocab_status_enum: ["LEARNING", "REVIEWING", "MASTERED", "IGNORED"],
      word_relation_type: ["SYNONYMS", "ANTONYMS"],
    },
  },
} as const
