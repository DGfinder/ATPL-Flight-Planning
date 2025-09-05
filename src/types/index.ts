export type QuestionCategory = 
  | 'payload_uplift_capability'
  | 'mtow_brw_calculations'
  | 'sector_fuel_burn_normal_cruise'
  | 'trip_fuel_total_flight_plan'
  | 'alternate_holding_fuel'
  | 'final_reserve_variable_reserve_fuel'
  | 'total_fuel_required_ramp_fuel'
  | 'fuel_dumping_time_quantity'
  | 'rate_of_climb_roc'
  | 'climb_fuel_distance_time_altitude'
  | 'intermediate_level_change_cruise_climb'
  | 'selection_cruise_schedules_altitude'
  | 'inflight_epr_limitations'
  | 'maximum_tat_limitations'
  | 'ias_mach_number_conversion'
  | 'tas_groundspeed_calculations'
  | 'descent_point_planning'
  | 'inflight_replanning_holding'
  | 'pnr_1_inop_return_departure'
  | 'pnr_1_inop_return_alternate'
  | 'cp_1_inop_equi_time_point'
  | 'pnr_depressurised'
  | 'cp_depressurised'
  | 'engine_out_drift_down_altitude'
  | 'engine_out_fuel_flow_tas'
  | 'buffet_boundaries_margins'
  | 'maximum_altitude_capability_normal_ops'
  | 'maximum_altitude_capability_engine_out'
  | 'abnormal_configuration_gear_down_performance'
  | 'abnormal_configuration_system_failures';

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

export interface FlightPlanData {
  segments: FlightPlanSegment[];
  timestamp?: string;
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

// CASA ATPL Flight Planning Trial Exam Types
export type MarkValue = 1 | 2 | 3 | 4 | 5;
export type ExamScenario = "A" | "B" | "C";

export interface ExamQuestion extends Question {
  marks: MarkValue;
  shuffledOptions?: string[];
}

export interface ExamScenarioConfig {
  id: ExamScenario;
  label: string;
  totalMarks: number;
  distribution: Record<MarkValue, number>;
  description: string;
}

export interface TrialExam {
  id: string;
  scenario: ExamScenario;
  seed: number;
  totalQuestions: 17;
  totalMarks: number;
  distribution: Record<MarkValue, number>;
  questions: ExamQuestion[];
  createdAt: Date;
  timeLimit: number; // minutes
}

export interface ExamSession {
  id: string;
  examId: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  answers: Record<string, UserAnswer>;
  timeSpent: number; // seconds
  isCompleted: boolean;
  score?: number;
  maxScore: number;
}

export interface ExamResult {
  examSession: ExamSession;
  exam: TrialExam;
  totalScore: number;
  maxScore: number;
  percentage: number;
  markBreakdown: Record<MarkValue, { correct: number; total: number; marks: number }>;
  categoryBreakdown: Record<QuestionCategory, { correct: number; total: number; percentage: number }>;
  timeSpent: number;
  questionsCorrect: number;
  questionsTotal: number;
}

export interface ExamFilters {
  topicInclude?: QuestionCategory[];
  topicExclude?: QuestionCategory[];
  minDifficulty?: number;
  maxDifficulty?: number;
}