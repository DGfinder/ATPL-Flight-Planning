import type { SessionProgress, UserAnswer, PerformanceMetrics, StudyMode } from '../types';

const STORAGE_KEYS = {
  SESSION_PROGRESS: 'atpl_session_progress',
  USER_ANSWERS: 'atpl_user_answers', 
  PERFORMANCE_METRICS: 'atpl_performance_metrics',
  SETTINGS: 'atpl_settings'
} as const;

export interface StorageSettings {
  preferredStudyMode: StudyMode;
  showWorkingSteps: boolean;
  autoAdvanceOnCorrect: boolean;
}

class LocalStorageService {
  saveSessionProgress(progress: SessionProgress): void {
    try {
      const serializable = {
        ...progress,
        answeredQuestions: Array.from(progress.answeredQuestions),
        correctAnswers: Array.from(progress.correctAnswers),
        startTime: progress.startTime.toISOString(),
        examEndTime: progress.examEndTime ? progress.examEndTime.toISOString() : undefined
      };
      window.localStorage.setItem(STORAGE_KEYS.SESSION_PROGRESS, JSON.stringify(serializable));
    } catch (error) {
      console.error('Failed to save session progress:', error);
    }
  }

  loadSessionProgress(): SessionProgress | null {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.SESSION_PROGRESS);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        answeredQuestions: new Set(parsed.answeredQuestions),
        correctAnswers: new Set(parsed.correctAnswers),
        startTime: new Date(parsed.startTime),
        examEndTime: parsed.examEndTime ? new Date(parsed.examEndTime) : undefined
      };
    } catch (error) {
      console.error('Failed to load session progress:', error);
      return null;
    }
  }

  saveUserAnswers(answers: UserAnswer[]): void {
    try {
      const serializable = answers.map(answer => ({
        ...answer,
        timestamp: answer.timestamp.toISOString()
      }));
      window.localStorage.setItem(STORAGE_KEYS.USER_ANSWERS, JSON.stringify(serializable));
    } catch (error) {
      console.error('Failed to save user answers:', error);
    }
  }

  loadUserAnswers(): UserAnswer[] {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.USER_ANSWERS);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((answer: UserAnswer & { timestamp: string }) => ({
        ...answer,
        timestamp: new Date(answer.timestamp)
      }));
    } catch (error) {
      console.error('Failed to load user answers:', error);
      return [];
    }
  }

  savePerformanceMetrics(metrics: PerformanceMetrics): void {
    try {
      window.localStorage.setItem(STORAGE_KEYS.PERFORMANCE_METRICS, JSON.stringify(metrics));
    } catch (error) {
      console.error('Failed to save performance metrics:', error);
    }
  }

  loadPerformanceMetrics(): PerformanceMetrics | null {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.PERFORMANCE_METRICS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load performance metrics:', error);
      return null;
    }
  }

  saveSettings(settings: StorageSettings): void {
    try {
      window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  loadSettings(): StorageSettings {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!stored) {
        return {
          preferredStudyMode: 'practice',
          showWorkingSteps: true,
          autoAdvanceOnCorrect: false
        };
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {
        preferredStudyMode: 'practice',
        showWorkingSteps: true,
        autoAdvanceOnCorrect: false
      };
    }
  }

  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        window.localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  exportData(): string {
    try {
      const data = {
        sessionProgress: this.loadSessionProgress(),
        userAnswers: this.loadUserAnswers(),
        performanceMetrics: this.loadPerformanceMetrics(),
        settings: this.loadSettings(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return '{}';
    }
  }
}

export const storageService = new LocalStorageService();