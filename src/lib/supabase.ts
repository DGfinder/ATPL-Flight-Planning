import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database Types (matching your Supabase schema)
export type QuestionType = 'multiple_choice' | 'short_answer' | 'flight_plan';
export type QuestionCategory = 'performance' | 'navigation' | 'fuel_planning' | 'weight_balance' | 'weather' | 'emergency_procedures';

export interface DatabaseQuestion {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  category: QuestionCategory;
  marks: number;
  reference?: string;
  given_data: Record<string, string>;
  options?: string[];
  correct_answer?: number;
  expected_answers?: Array<{
    field: string;
    value: number;
    tolerance: number;
    unit: string;
    description: string;
  }>;
  working_steps: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  is_correct: boolean;
  user_answer: {
    type: string;
    multipleChoiceAnswer?: number;
    shortAnswers?: Record<string, number>;
    timeSpent: number;
  };
  selected_option?: number;
  time_spent: number;
  attempted_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  session_name?: string;
  started_at: string;
  ended_at?: string;
  total_questions: number;
  correct_answers: number;
  session_type: 'practice' | 'exam' | 'category_drill';
}

export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  student_id?: string;
  institution?: string;
  created_at: string;
  updated_at: string;
}