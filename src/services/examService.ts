import type { 
  Question, 
  ExamQuestion, 
  TrialExam, 
  ExamScenario, 
  ExamScenarioConfig, 
  MarkValue,
  ExamFilters,
  QuestionCategory,
  ExamSession,
  UserAnswer,
  ExamResult
} from '../types';

// Seeded Random Number Generator (Mulberry32)
export function createSeededRNG(seed: number) {
  return function() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Shuffle array using seeded RNG
export function shuffleArray<T>(array: T[], rng: () => number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Pick N random items from array using seeded RNG
export function pickRandomItems<T>(array: T[], count: number, rng: () => number): T[] {
  if (count <= 0) return [];
  if (array.length < count) {
    throw new Error(`Insufficient items: need ${count}, but only have ${array.length}`);
  }
  
  const shuffled = shuffleArray(array, rng);
  return shuffled.slice(0, count);
}

// CASA ATPL Flight Planning Exam Scenarios
export const EXAM_SCENARIOS: Record<ExamScenario, ExamScenarioConfig> = {
  A: {
    id: "A",
    label: "Scenario A (44 marks)",
    totalMarks: 44,
    distribution: {
      5: 3, // 3 × 5 = 15 marks
      4: 2, // 2 × 4 = 8 marks
      3: 2, // 2 × 3 = 6 marks
      2: 5, // 5 × 2 = 10 marks
      1: 5  // 5 × 1 = 5 marks
    },
    description: "Lower complexity exam with more 1-2 mark questions"
  },
  B: {
    id: "B",
    label: "Scenario B (46 marks)",
    totalMarks: 46,
    distribution: {
      5: 3, // 3 × 5 = 15 marks
      4: 3, // 3 × 4 = 12 marks
      3: 2, // 2 × 3 = 6 marks
      2: 4, // 4 × 2 = 8 marks
      1: 5  // 5 × 1 = 5 marks
    },
    description: "Balanced exam with typical mark distribution"
  },
  C: {
    id: "C",
    label: "Scenario C (51 marks)",
    totalMarks: 51,
    distribution: {
      5: 3, // 3 × 5 = 15 marks
      4: 3, // 3 × 4 = 12 marks
      3: 4, // 4 × 3 = 12 marks
      2: 5, // 5 × 2 = 10 marks
      1: 2  // 2 × 1 = 2 marks
    },
    description: "Higher complexity exam with more 3-4 mark questions"
  }
};

// Validate exam scenario totals (should always equal 17 questions)
function validateScenario(scenario: ExamScenarioConfig): boolean {
  const totalQuestions = Object.values(scenario.distribution).reduce((sum, count) => sum + count, 0);
  const calculatedMarks = Object.entries(scenario.distribution)
    .reduce((sum, [mark, count]) => sum + (parseInt(mark) * count), 0);
  
  return totalQuestions === 17 && calculatedMarks === scenario.totalMarks;
}

// Validate all scenarios on module load
Object.values(EXAM_SCENARIOS).forEach(scenario => {
  if (!validateScenario(scenario)) {
    console.error(`Invalid exam scenario ${scenario.id}:`, scenario);
  }
});

// Group questions by mark value for selection
export function groupQuestionsByMarks(questions: Question[]): Record<MarkValue, Question[]> {
  const grouped: Record<MarkValue, Question[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  };

  questions.forEach(question => {
    const marks = question.marks as MarkValue;
    if (marks >= 1 && marks <= 5) {
      grouped[marks].push(question);
    }
  });

  return grouped;
}

// Check if there are sufficient questions for a scenario
export function validateQuestionAvailability(
  questions: Question[], 
  scenario: ExamScenarioConfig
): { valid: boolean; missing: string[] } {
  const grouped = groupQuestionsByMarks(questions);
  const missing: string[] = [];

  Object.entries(scenario.distribution).forEach(([mark, needed]) => {
    const markValue = parseInt(mark) as MarkValue;
    const available = grouped[markValue].length;
    
    if (available < needed) {
      missing.push(`${needed - available} more ${mark}-mark questions (have ${available}, need ${needed})`);
    }
  });

  return {
    valid: missing.length === 0,
    missing
  };
}

// Generate a trial exam with seeded randomization
export function generateTrialExam(
  questions: Question[],
  scenario: ExamScenario,
  seed: number,
  filters?: ExamFilters
): TrialExam {
  // Filter questions if filters provided
  let filteredQuestions = questions;
  
  if (filters) {
    filteredQuestions = questions.filter(question => {
      // Topic inclusion filter
      if (filters.topicInclude?.length) {
        if (!filters.topicInclude.includes(question.category)) {
          return false;
        }
      }
      
      // Topic exclusion filter
      if (filters.topicExclude?.length) {
        if (filters.topicExclude.includes(question.category)) {
          return false;
        }
      }
      
      return true;
    });
  }

  const scenarioConfig = EXAM_SCENARIOS[scenario];
  
  // Validate question availability
  const validation = validateQuestionAvailability(filteredQuestions, scenarioConfig);
  if (!validation.valid) {
    throw new Error(`Insufficient questions for Scenario ${scenario}: ${validation.missing.join(', ')}`);
  }

  // Group questions by mark value
  const questionGroups = groupQuestionsByMarks(filteredQuestions);
  
  // Create seeded RNG
  const rng = createSeededRNG(seed);
  
  // Select questions according to distribution
  const selectedQuestions: ExamQuestion[] = [];
  
  Object.entries(scenarioConfig.distribution).forEach(([mark, count]) => {
    const markValue = parseInt(mark) as MarkValue;
    const availableQuestions = questionGroups[markValue];
    
    const selected = pickRandomItems(availableQuestions, count, rng);
    
    // Convert to ExamQuestion and shuffle multiple choice options if applicable
    const examQuestions: ExamQuestion[] = selected.map(question => ({
      ...question,
      marks: markValue,
      shuffledOptions: question.options ? shuffleArray(question.options, rng) : undefined
    }));
    
    selectedQuestions.push(...examQuestions);
  });

  // Final shuffle of all questions
  const shuffledQuestions = shuffleArray(selectedQuestions, rng);

  // Generate exam ID
  const examId = `exam-${scenario}-${seed}`;

  return {
    id: examId,
    scenario,
    seed,
    totalQuestions: 17,
    totalMarks: scenarioConfig.totalMarks,
    distribution: scenarioConfig.distribution,
    questions: shuffledQuestions,
    createdAt: new Date(),
    timeLimit: 180 // 3 hours as per CASA regulations
  };
}

// Get all available scenarios
export function getExamScenarios(): ExamScenarioConfig[] {
  return Object.values(EXAM_SCENARIOS);
}

// Get scenario by ID
export function getScenarioById(id: ExamScenario): ExamScenarioConfig {
  return EXAM_SCENARIOS[id];
}

// Generate a random seed
export function generateRandomSeed(): number {
  return Math.floor(Math.random() * 1000000000);
}

// Calculate exam statistics
export function calculateExamStats(questions: Question[]): {
  totalQuestions: number;
  markDistribution: Record<MarkValue, number>;
  categoryDistribution: Record<QuestionCategory, number>;
} {
  const markDistribution: Record<MarkValue, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const categoryDistribution: Record<QuestionCategory, number> = {} as Record<QuestionCategory, number>;

  questions.forEach(question => {
    const marks = question.marks as MarkValue;
    if (marks >= 1 && marks <= 5) {
      markDistribution[marks]++;
    }
    
    categoryDistribution[question.category] = (categoryDistribution[question.category] || 0) + 1;
  });

  return {
    totalQuestions: questions.length,
    markDistribution,
    categoryDistribution
  };
}

// Exam Session Management
export class ExamSessionManager {
  private static STORAGE_KEY = 'currentExamSession';

  // Create new exam session
  static createSession(exam: TrialExam, userId?: string): ExamSession {
    const sessionId = `session-${exam.id}-${Date.now()}`;
    const session: ExamSession = {
      id: sessionId,
      examId: exam.id,
      userId,
      startTime: new Date(),
      currentQuestionIndex: 0,
      answers: {},
      timeSpent: 0,
      isCompleted: false,
      maxScore: exam.totalMarks
    };

    this.saveSession(session);
    return session;
  }

  // Save session to localStorage
  static saveSession(session: ExamSession): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        ...session,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime?.toISOString()
      }));
    } catch (error) {
      console.error('Failed to save exam session:', error);
    }
  }

  // Load session from localStorage
  static loadSession(): ExamSession | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        startTime: new Date(parsed.startTime),
        endTime: parsed.endTime ? new Date(parsed.endTime) : undefined
      };
    } catch (error) {
      console.error('Failed to load exam session:', error);
      return null;
    }
  }

  // Clear session from localStorage
  static clearSession(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear exam session:', error);
    }
  }

  // Update current question index
  static updateCurrentQuestion(session: ExamSession, questionIndex: number): ExamSession {
    const updated = {
      ...session,
      currentQuestionIndex: questionIndex
    };
    this.saveSession(updated);
    return updated;
  }

  // Submit answer for current question
  static submitAnswer(session: ExamSession, questionId: string, answer: UserAnswer): ExamSession {
    const updated = {
      ...session,
      answers: {
        ...session.answers,
        [questionId]: answer
      }
    };
    this.saveSession(updated);
    return updated;
  }

  // Calculate time spent and update session
  static updateTimeSpent(session: ExamSession): ExamSession {
    const now = new Date();
    const timeSpentSeconds = Math.floor((now.getTime() - session.startTime.getTime()) / 1000);
    
    const updated = {
      ...session,
      timeSpent: timeSpentSeconds
    };
    this.saveSession(updated);
    return updated;
  }

  // Complete exam session
  static completeSession(session: ExamSession, finalScore?: number): ExamSession {
    const updated = {
      ...session,
      isCompleted: true,
      endTime: new Date(),
      score: finalScore
    };
    this.saveSession(updated);
    return updated;
  }

  // Check if exam has timed out
  static isSessionExpired(session: ExamSession, exam: TrialExam): boolean {
    const timeLimit = exam.timeLimit * 60 * 1000; // Convert minutes to milliseconds
    const elapsed = Date.now() - session.startTime.getTime();
    return elapsed > timeLimit;
  }

  // Get remaining time in seconds
  static getRemainingTime(session: ExamSession, exam: TrialExam): number {
    const timeLimit = exam.timeLimit * 60; // Convert to seconds
    const elapsed = Math.floor((Date.now() - session.startTime.getTime()) / 1000);
    return Math.max(0, timeLimit - elapsed);
  }

  // Validate answer against question
  static validateAnswer(question: ExamQuestion, userAnswer: UserAnswer): boolean {
    if (question.type === 'multiple_choice') {
      return question.correctAnswer !== undefined && 
             userAnswer.multipleChoiceAnswer === (typeof question.correctAnswer === 'string' ? parseInt(question.correctAnswer) : question.correctAnswer);
    }
    
    if (question.type === 'short_answer' && question.expectedAnswers) {
      if (!userAnswer.shortAnswers) return false;
      
      // Check all expected answers
      return question.expectedAnswers.every(expected => {
        const userValue = userAnswer.shortAnswers?.[expected.field];
        if (userValue === undefined) return false;
        
        const tolerance = expected.tolerance || 0;
        const diff = Math.abs(userValue - expected.value);
        return diff <= tolerance;
      });
    }
    
    return false;
  }

  // Calculate exam results
  static calculateResults(exam: TrialExam, session: ExamSession): ExamResult {
    let totalScore = 0;
    let questionsCorrect = 0;
    
    const markBreakdown: Record<MarkValue, { correct: number; total: number; marks: number }> = {
      1: { correct: 0, total: 0, marks: 0 },
      2: { correct: 0, total: 0, marks: 0 },
      3: { correct: 0, total: 0, marks: 0 },
      4: { correct: 0, total: 0, marks: 0 },
      5: { correct: 0, total: 0, marks: 0 }
    };

    const categoryBreakdown: Record<QuestionCategory, { correct: number; total: number; percentage: number }> = {} as Record<QuestionCategory, { correct: number; total: number; percentage: number }>;

    exam.questions.forEach(question => {
      const userAnswer = session.answers[question.id];
      const marks = question.marks as MarkValue;
      
      // Update totals
      markBreakdown[marks].total++;
      
      if (!categoryBreakdown[question.category]) {
        categoryBreakdown[question.category] = { correct: 0, total: 0, percentage: 0 };
      }
      categoryBreakdown[question.category].total++;

      if (userAnswer && this.validateAnswer(question, userAnswer)) {
        // Question is correct
        totalScore += marks;
        questionsCorrect++;
        markBreakdown[marks].correct++;
        markBreakdown[marks].marks += marks;
        categoryBreakdown[question.category].correct++;
      }
    });

    // Calculate category percentages
    Object.keys(categoryBreakdown).forEach(category => {
      const cat = category as QuestionCategory;
      const breakdown = categoryBreakdown[cat];
      breakdown.percentage = breakdown.total > 0 ? (breakdown.correct / breakdown.total) * 100 : 0;
    });

    const percentage = (totalScore / exam.totalMarks) * 100;

    return {
      examSession: session,
      exam,
      totalScore,
      maxScore: exam.totalMarks,
      percentage,
      markBreakdown,
      categoryBreakdown,
      timeSpent: session.timeSpent,
      questionsCorrect,
      questionsTotal: exam.totalQuestions
    };
  }
}