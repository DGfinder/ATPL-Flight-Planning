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
  | 'flight_planning'
  | 'navigation'
  | 'performance'
  | 'meteorology'
  | 'weight_balance'
  | 'fuel_planning'
  | 'other';

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