import type { 
  Question, 
  ExamQuestion, 
  TrialExam, 
  ExamScenario, 
  ExamScenarioConfig, 
  MarkValue,
  ExamFilters,
  QuestionCategory
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