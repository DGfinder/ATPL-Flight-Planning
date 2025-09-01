export type QuestionCategory = 
  | 'performance'
  | 'navigation' 
  | 'fuel_planning'
  | 'weight_balance'
  | 'weather'
  | 'emergency_procedures';

export type QuestionType = 'multiple_choice' | 'short_answer';

export type StudyMode = 'practice' | 'exam';

export interface ExpectedAnswer {
  field: string;
  value: number;
  tolerance: number;
  unit: string;
  description: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  category: QuestionCategory;
  marks: number;
  reference: string;
  givenData: Record<string, string>;
  options?: string[];
  correctAnswer?: number;
  expectedAnswers?: ExpectedAnswer[];
  workingSteps: string[];
}

export interface UserAnswer {
  questionId: string;
  type: QuestionType;
  multipleChoiceAnswer?: number;
  shortAnswers?: Record<string, number>;
  isCorrect: boolean;
  timeSpent: number;
  timestamp: Date;
}

export interface SessionProgress {
  currentQuestionIndex: number;
  answeredQuestions: Set<string>;
  correctAnswers: Set<string>;
  userAnswers: UserAnswer[];
  startTime: Date;
  categoryFilter?: QuestionCategory;
  studyMode: StudyMode;
  examEndTime?: Date;
}

export interface QuestionValidationResult {
  isCorrect: boolean;
  fieldResults?: Record<string, {
    isCorrect: boolean;
    expected: number;
    actual: number;
    tolerance: number;
    unit: string;
  }>;
}

export interface FlightPlanSegment {
  id: string;
  segment: string;
  flightLevel: number;
  altitudeTrend?: 'climb' | 'descent' | 'level';
  tempDeviation: number;
  machNo: number;
  tas: number;
  track: number;
  wind: string;
  windComponent: number;
  groundSpeed: number;
  distance: number;
  estimatedTimeInterval: number;
  airDistance: number;
  fuelFlow: number;
  zoneFuel: number;
  startZoneWeight: number;
  emzw: number;
  endZoneWeight: number;
  planFuelRemaining: number;
  actualFuelRemaining: number;
  planEstimate: string;
  actualTimeArrival: string;
}

export interface FlightPlan {
  id: string;
  aircraft: string;
  route: string;
  segments: FlightPlanSegment[];
  totalDistance: number;
  totalTime: number;
  totalFuel: number;
}

export interface PerformanceMetrics {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTimePerQuestion: number;
  categoryPerformance: Record<QuestionCategory, {
    attempted: number;
    correct: number;
    accuracy: number;
  }>;
}

// Notes / Theory Types
export type NoteTopicId =
  | 'tas_heading_ground_speed'
  | 'speed_sound_mach_tat'
  | 'route_sector_winds_temp'
  | 'magnetic_variation'
  | 'ins_data'
  | 'climb_tables'
  | 'descent_tables'
  | 'altitude_capability'
  | 'cruise_data'
  | 'buffet_boundary_charts'
  | 'flight_planning_basics'
  | 'real_flight_plans'
  | 'step_climbs'
  | 'backwards_flight_plans'
  | 'max_payload_min_fuel_abnormal'
  | 'depressurised_flight'
  | 'yaw_damper_inoperative'
  | 'tailskid_extended'
  | 'landing_gear_extended'
  | 'one_engine_inoperative'
  | 'fuel_dumping'
  | 'holding_fuel'
  | 'company_fuel_policy'
  | 'minimum_fuel_requirements'
  | 'minimum_aerodrome_standards'
  | 'inflight_replanning'
  | 'boeing_727_weight_limits'
  | 'destination_alternate_fuel'
  | 'equi_time_point'
  | 'point_no_return';

// Flight Planning Textbook Topics
export type AtplSubjectId =
  | 'tas_heading_ground_speed'
  | 'speed_sound_mach_tat'
  | 'route_sector_winds_temp'
  | 'magnetic_variation'
  | 'ins_data'
  | 'climb_tables'
  | 'descent_tables'
  | 'altitude_capability'
  | 'cruise_data'
  | 'buffet_boundary_charts'
  | 'flight_planning_basics'
  | 'real_flight_plans'
  | 'step_climbs'
  | 'backwards_flight_plans'
  | 'max_payload_min_fuel_abnormal'
  | 'depressurised_flight'
  | 'yaw_damper_inoperative'
  | 'tailskid_extended'
  | 'landing_gear_extended'
  | 'one_engine_inoperative'
  | 'fuel_dumping'
  | 'holding_fuel'
  | 'company_fuel_policy'
  | 'minimum_fuel_requirements'
  | 'minimum_aerodrome_standards'
  | 'inflight_replanning'
  | 'boeing_727_weight_limits'
  | 'destination_alternate_fuel'
  | 'equi_time_point'
  | 'point_no_return';

export type AtplSubjectCategory =
  | 'flight_performance';

export type AtplContentType = 'notes' | 'videos' | 'practice' | 'questions';

// ATPL Video content
export interface AtplVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: number; // in seconds
  thumbnail?: string;
  subtopics?: string[];
  order: number;
}

// ATPL PDF/Notes content
export interface AtplDocument {
  id: string;
  title: string;
  description: string;
  pdfUrl?: string;
  pdfPath?: string;
  pageCount?: number;
  subtopics?: string[];
  order: number;
}

// Enhanced ATPL Subject structure
export interface AtplSubject {
  id: AtplSubjectId;
  title: string;
  description: string;
  category: AtplSubjectCategory;
  code?: string; // e.g., "LAW", "AGK-A", etc.
  documents: AtplDocument[];
  videos: AtplVideo[];
  questionCategories: QuestionCategory[]; // Maps to existing question system
  estimatedStudyHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: AtplSubjectId[];
  order: number;
}

// ATPL Curriculum structure
export interface AtplCurriculum {
  subjects: AtplSubject[];
  categories: Record<AtplSubjectCategory, {
    title: string;
    description: string;
    color: string;
    icon: string;
  }>;
}

// User progress tracking
export interface AtplProgress {
  subjectId: AtplSubjectId;
  documentsViewed: string[];
  videosWatched: string[];
  questionsAttempted: number;
  questionsCorrect: number;
  lastAccessedAt: string;
  completionPercentage: number;
  studyTimeMinutes: number;
}

export interface AtplUserProgress {
  progress: Record<AtplSubjectId, AtplProgress>;
  bookmarks: {
    subjectId: AtplSubjectId;
    contentType: AtplContentType;
    contentId: string;
    note?: string;
    createdAt: string;
  }[];
  studyPlan: {
    subjectId: AtplSubjectId;
    targetCompletionDate: string;
    dailyStudyMinutes: number;
    priority: 'low' | 'medium' | 'high';
  }[];
}

export interface NoteSection {
  id: string;
  topicId: NoteTopicId;
  title: string;
  content: string;
  source?: string; // pdf filename or URL
  createdAt: string; // ISO date
}

export interface NotesData {
  sections: NoteSection[];
}

export interface TopicContent {
  topicId: NoteTopicId;
  theory: string;
  videos: VideoContent[];
  practice: PracticeContent[];
  lastUpdated: string;
}

export interface VideoContent {
  id: string;
  title: string;
  youtubeId: string;
  description?: string;
  duration?: number;
}

export interface PracticeContent {
  id: string;
  title: string;
  content: string;
  type: 'example' | 'exercise' | 'quiz';
}

export interface TopicData {
  topics: TopicContent[];
}

export interface AltitudeCapability {
  id: number;
  flight_level: number;
  cruise_schedule: string;
  tat_for_isa: number | null;
  optimum_weight_for_flight_level_kg: number | null;
  cruise_thrust_limit_isa_minus_5: number | null;
  cruise_thrust_limit_isa: number | null;
  cruise_thrust_limit_isa_plus_5: number | null;
  cruise_thrust_limit_isa_plus_10: number | null;
  cruise_thrust_limit_isa_plus_15: number | null;
  cruise_thrust_limit_isa_plus_20: number | null;
  created_at: string;
  updated_at: string;
}