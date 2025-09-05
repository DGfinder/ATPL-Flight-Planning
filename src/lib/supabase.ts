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

// Weather Data Types - Complete RSWT Structure
export interface RSWTLevelData {
  isa_temp: number; // ISA temperature in Celsius
  ypdn_ybas: string; // Wind direction/speed for YPDN/YBAS segment (e.g., "300/40")
  ybas_lec: string; // Wind direction/speed for YBAS/LEC segment (e.g., "210/20")
  lec_ymml: string; // Wind direction/speed for LEC/YMML segment (e.g., "270/45")
}

export interface RSWTData {
  "185": RSWTLevelData;
  "235": RSWTLevelData;
  "300": RSWTLevelData;
  "340": RSWTLevelData;
  "385": RSWTLevelData;
  "445": RSWTLevelData;
}

export interface WeatherData {
  id: number;
  weather_id: string;
  scenario_name: string;
  route_from?: string;
  route_to?: string;
  rswt_data: RSWTData; // Complete RSWT extract with all flight levels
  total_distance_nm?: number;
  segment_distances?: Record<string, number>;
  pressure_altitude?: number;
  visibility_nm?: number;
  cloud_base_ft?: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface WeatherDataFormatted {
  weather_id: string;
  scenario_name: string;
  route_from?: string;
  route_to?: string;
  rswt_data: RSWTData;
  total_distance_nm?: number;
  segment_distances?: Record<string, number>;
  created_at: string;
  updated_at: string;
}