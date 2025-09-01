import { supabase, type DatabaseQuestion, type UserProgress, type StudySession } from '../lib/supabase';
import type { Question, UserAnswer, PerformanceMetrics, QuestionType, QuestionCategory, AltitudeCapability } from '../types';

class DatabaseService {
  // Auth methods
  async signUp(email: string, password: string, metadata?: { full_name?: string; student_id?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Questions methods
  async getAllQuestions(): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at');

    if (error) throw error;
    
    return (data as DatabaseQuestion[]).map(this.convertDatabaseQuestionToQuestion);
  }

  async getQuestionsByCategory(category: string): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category', category)
      .order('created_at');

    if (error) throw error;
    
    return (data as DatabaseQuestion[]).map(this.convertDatabaseQuestionToQuestion);
  }

  // User Progress methods
  async saveUserAnswer(answer: UserAnswer): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const progressData = {
      user_id: user.id,
      question_id: answer.questionId,
      is_correct: answer.isCorrect,
      user_answer: {
        type: answer.type,
        multipleChoiceAnswer: answer.multipleChoiceAnswer,
        shortAnswers: answer.shortAnswers,
        timeSpent: answer.timeSpent
      },
      selected_option: answer.multipleChoiceAnswer,
      time_spent: answer.timeSpent
    };

    const { error } = await supabase
      .from('user_progress')
      .upsert(progressData);

    if (error) throw error;
  }

  async getUserProgress(): Promise<UserAnswer[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('attempted_at', { ascending: false });

    if (error) throw error;

    return (data as UserProgress[]).map(progress => ({
      questionId: progress.question_id,
      type: progress.user_answer.type as QuestionType,
      multipleChoiceAnswer: progress.user_answer.multipleChoiceAnswer,
      shortAnswers: progress.user_answer.shortAnswers,
      isCorrect: progress.is_correct,
      timeSpent: progress.time_spent,
      timestamp: new Date(progress.attempted_at)
    }));
  }

  // Study Sessions methods
  async createStudySession(sessionType: 'practice' | 'exam' | 'category_drill', sessionName?: string): Promise<string> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: user.id,
        session_name: sessionName,
        session_type: sessionType
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async updateStudySession(sessionId: string, totalQuestions: number, correctAnswers: number): Promise<void> {
    const { error } = await supabase
      .from('study_sessions')
      .update({
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        ended_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  async getUserStudySessions(): Promise<StudySession[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data as StudySession[];
  }

  // Profile methods
  async createOrUpdateProfile(profile: { username?: string; full_name?: string; student_id?: string; institution?: string }): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profile
      });

    if (error) throw error;
  }

  async getUserProfile() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  }

  // Utility methods
  private convertDatabaseQuestionToQuestion(dbQuestion: DatabaseQuestion): Question {
    return {
      id: dbQuestion.id,
      title: dbQuestion.title,
      description: dbQuestion.description,
      type: dbQuestion.type as 'multiple_choice' | 'short_answer',
      category: dbQuestion.category as QuestionCategory,
      marks: dbQuestion.marks,
      reference: dbQuestion.reference || '',
      givenData: dbQuestion.given_data,
      options: dbQuestion.options,
      correctAnswer: dbQuestion.correct_answer,
      expectedAnswers: dbQuestion.expected_answers,
      workingSteps: dbQuestion.working_steps
    };
  }

  // Altitude Capability methods
  async getAltitudeCapability(flightLevel: number, cruiseSchedule: string, isaDeviation: number = 0): Promise<AltitudeCapability | null> {
    // Find closest ISA deviation column
    let isaColumn = 'cruise_thrust_limit_isa';
    if (isaDeviation <= -2.5) isaColumn = 'cruise_thrust_limit_isa_minus_5';
    else if (isaDeviation >= 2.5 && isaDeviation < 7.5) isaColumn = 'cruise_thrust_limit_isa_plus_5';
    else if (isaDeviation >= 7.5 && isaDeviation < 12.5) isaColumn = 'cruise_thrust_limit_isa_plus_10';
    else if (isaDeviation >= 12.5 && isaDeviation < 17.5) isaColumn = 'cruise_thrust_limit_isa_plus_15';
    else if (isaDeviation >= 17.5) isaColumn = 'cruise_thrust_limit_isa_plus_20';

    const { data, error } = await supabase
      .from('altitude_capability')
      .select(`flight_level, cruise_schedule, optimum_weight_for_flight_level_kg, ${isaColumn}`)
      .eq('flight_level', flightLevel)
      .eq('cruise_schedule', cruiseSchedule)
      .single();

    if (error) {
      console.warn('Altitude capability query failed:', error);
      return null;
    }
    return data as unknown as AltitudeCapability;
  }

  async getMaxAltitudeForWeight(weight: number, cruiseSchedule: string, isaDeviation: number = 0): Promise<number> {
    // Convert weight to 1000kg units for comparison
    const weightIn1000kg = weight / 1000;
    
    let isaColumn = 'cruise_thrust_limit_isa';
    if (isaDeviation <= -2.5) isaColumn = 'cruise_thrust_limit_isa_minus_5';
    else if (isaDeviation >= 2.5 && isaDeviation < 7.5) isaColumn = 'cruise_thrust_limit_isa_plus_5';
    else if (isaDeviation >= 7.5 && isaDeviation < 12.5) isaColumn = 'cruise_thrust_limit_isa_plus_10';
    else if (isaDeviation >= 12.5 && isaDeviation < 17.5) isaColumn = 'cruise_thrust_limit_isa_plus_15';
    else if (isaDeviation >= 17.5) isaColumn = 'cruise_thrust_limit_isa_plus_20';

    const { data, error } = await supabase
      .from('altitude_capability')
      .select(`flight_level, ${isaColumn}`)
      .eq('cruise_schedule', cruiseSchedule)
      .not(isaColumn, 'is', null)
      .gte(isaColumn, weightIn1000kg)
      .order('flight_level', { ascending: false })
      .limit(1);

    if (error) {
      console.warn('Max altitude query failed:', error);
      return 250;
    }
    return (data as unknown as { flight_level: number }[])?.[0]?.flight_level || 250; // Default to FL250 if no suitable altitude found
  }

  async getOptimumAltitudeForWeight(weight: number, track: number, isaDeviation: number = 0): Promise<{flightLevel: number, cruiseSchedule: string}> {
    // Determine hemisphere (EAST: 000-179°, WEST: 180-359°)
    const isEastbound = track >= 0 && track < 180;
    
    // Get available flight levels for hemisphere
    const availableLevels = isEastbound 
      ? [410, 370, 330, 290, 250] // Odd thousands + FL410
      : [390, 350, 310, 270]; // Even thousands
    
    const weightIn1000kg = weight / 1000;
    
    // Find highest available flight level for this weight
    for (const level of availableLevels) {
      const capability = await this.getAltitudeCapability(level, 'LRC', isaDeviation);
      if (capability && capability.cruise_thrust_limit_isa && capability.cruise_thrust_limit_isa >= weightIn1000kg) {
        return { flightLevel: level, cruiseSchedule: 'LRC' };
      }
    }
    
    return { flightLevel: 250, cruiseSchedule: 'LRC' }; // Conservative fallback
  }

  // Performance metrics calculation (client-side for now)
  async calculatePerformanceMetrics(): Promise<PerformanceMetrics> {
    const progress = await this.getUserProgress();
    const questions = await this.getAllQuestions();

    const totalQuestions = questions.length;
    const answeredQuestions = progress.length;
    const correctAnswers = progress.filter(a => a.isCorrect).length;
    const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
    const totalTime = progress.reduce((sum, a) => sum + a.timeSpent, 0);
    const averageTimePerQuestion = answeredQuestions > 0 ? totalTime / answeredQuestions : 0;

    // Calculate category performance
    const categoryPerformance: Record<string, { attempted: number; correct: number; accuracy: number }> = {};
    
    const categories = ['performance', 'navigation', 'fuel_planning', 'weight_balance', 'meteorology', 'flight_planning'];
    categories.forEach(cat => {
      const categoryAnswers = progress.filter(a => {
        const question = questions.find(q => q.id === a.questionId);
        return question?.category === cat;
      });
      
      const attempted = categoryAnswers.length;
      const correct = categoryAnswers.filter(a => a.isCorrect).length;
      const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
      
      categoryPerformance[cat] = { attempted, correct, accuracy };
    });

    return {
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      accuracy,
      averageTimePerQuestion,
      categoryPerformance
    };
  }
}

export const databaseService = new DatabaseService();