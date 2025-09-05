import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  PrimaryButton, 
  SecondaryButton,
  useDesignSystem 
} from '../../design-system';
import { 
  getExamScenarios, 
  generateTrialExam, 
  generateRandomSeed,
  validateQuestionAvailability 
} from '../../services/examService';
import { databaseService } from '../../services/database';
import type { 
  ExamScenario, 
  ExamScenarioConfig, 
  TrialExam, 
  ExamFilters, 
  MarkValue 
} from '../../types';
import { Download, Shuffle, Settings, AlertCircle, CheckCircle } from 'lucide-react';

interface TrialExamGeneratorProps {
  onExamGenerated?: (exam: TrialExam) => void;
  onStartExam?: (exam: TrialExam) => void;
}

export const TrialExamGenerator: React.FC<TrialExamGeneratorProps> = ({
  onExamGenerated,
  onStartExam
}) => {
  const { colors, spacing } = useDesignSystem();
  const [scenario, setScenario] = useState<ExamScenario>('B');
  const [seed, setSeed] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedExam, setGeneratedExam] = useState<TrialExam | null>(null);
  const [scenarios] = useState<ExamScenarioConfig[]>(getExamScenarios());
  const [questionStats, setQuestionStats] = useState<{
    totalQuestions: number;
    markDistribution: Record<MarkValue, number>;
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters] = useState<ExamFilters>({});

  // Load question statistics on mount
  useEffect(() => {
    const loadQuestionStats = async () => {
      try {
        const stats = await databaseService.getQuestionStats();
        setQuestionStats(stats);
      } catch (err) {
        console.error('Failed to load question stats:', err);
      }
    };
    
    loadQuestionStats();
  }, []);

  const generateExam = async () => {
    if (!questionStats) {
      setError('Question statistics not loaded yet. Please wait and try again.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Use provided seed or generate random one
      const examSeed = seed ? parseInt(seed) : generateRandomSeed();
      
      // Get all questions from database
      const questions = await databaseService.getQuestionsForExam(filters);
      
      if (questions.length === 0) {
        throw new Error('No questions found in database. Please ensure questions are populated.');
      }

      // Validate question availability
      const scenarioConfig = scenarios.find(s => s.id === scenario);
      if (!scenarioConfig) {
        throw new Error('Invalid scenario selected');
      }

      const validation = validateQuestionAvailability(questions, scenarioConfig);
      if (!validation.valid) {
        throw new Error(`Insufficient questions: ${validation.missing.join(', ')}`);
      }

      // Generate the exam
      const exam = generateTrialExam(questions, scenario, examSeed, filters);
      
      setGeneratedExam(exam);
      setSeed(exam.seed.toString());
      onExamGenerated?.(exam);
    } catch (err: any) {
      setError(err.message || 'Failed to generate exam');
      setGeneratedExam(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadExam = (format: 'json' | 'markdown') => {
    if (!generatedExam) return;
    
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(generatedExam, null, 2);
      filename = `trial-exam-${generatedExam.seed}.json`;
      mimeType = 'application/json';
    } else {
      // Generate markdown format
      content = generateMarkdownExam(generatedExam);
      filename = `trial-exam-${generatedExam.seed}.md`;
      mimeType = 'text/markdown';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMarkdownExam = (exam: TrialExam): string => {
    const lines: string[] = [];
    
    lines.push(`# CASA ATPL Flight Planning Trial Exam`);
    lines.push(`**Scenario:** ${exam.scenario} (${exam.totalMarks} marks)`);
    lines.push(`**Seed:** ${exam.seed}`);
    lines.push(`**Questions:** ${exam.totalQuestions}`);
    lines.push(`**Time Limit:** ${exam.timeLimit} minutes`);
    lines.push('');
    
    // Add distribution summary
    lines.push(`## Mark Distribution`);
    Object.entries(exam.distribution)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .forEach(([mark, count]) => {
        lines.push(`- ${count} × ${mark}-mark questions = ${parseInt(mark) * count} marks`);
      });
    lines.push('');
    
    // Add questions
    exam.questions.forEach((question, index) => {
      lines.push(`---`);
      lines.push(`### Question ${index + 1} (${question.marks} mark${question.marks > 1 ? 's' : ''})`);
      lines.push(question.description);
      
      if (question.givenData && Object.keys(question.givenData).length > 0) {
        lines.push('');
        lines.push('**Given:**');
        Object.entries(question.givenData).forEach(([key, value]) => {
          lines.push(`- ${key}: ${value}`);
        });
      }
      
      if (question.shuffledOptions?.length) {
        lines.push('');
        lines.push('**Options:**');
        question.shuffledOptions.forEach((option, idx) => {
          lines.push(`${String.fromCharCode(65 + idx)}. ${option}`);
        });
      }
      
      if (question.reference) {
        lines.push('');
        lines.push(`*Reference: ${question.reference}*`);
      }
      
      lines.push('');
    });
    
    return lines.join('\n');
  };

  const selectedScenario = scenarios.find(s => s.id === scenario);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Exam Generator */}
      <Card variant="elevated" padding="lg" style={{ marginBottom: spacing.scale[6] }}>
        <CardHeader title="CASA ATPL Flight Planning Trial Exam Generator" />
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.scale[4] }}>
            {/* Scenario Selection */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: colors.aviation.navy,
                marginBottom: spacing.scale[2] 
              }}>
                Exam Scenario
              </label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value as ExamScenario)}
                style={{
                  width: '100%',
                  padding: spacing.scale[3],
                  border: `1px solid ${colors.gray[300]}`,
                  borderRadius: spacing.radius.md,
                  fontSize: '0.875rem',
                  outline: 'none',
                  background: colors.white
                }}
              >
                {scenarios.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label} - {s.totalMarks} marks
                  </option>
                ))}
              </select>
            </div>

            {/* Seed Input */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: colors.aviation.navy,
                marginBottom: spacing.scale[2] 
              }}>
                Seed (optional)
              </label>
              <div style={{ display: 'flex', gap: spacing.scale[2] }}>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="Random if empty"
                  style={{
                    flex: 1,
                    padding: spacing.scale[3],
                    border: `1px solid ${colors.gray[300]}`,
                    borderRadius: spacing.radius.md,
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <SecondaryButton
                  onClick={() => setSeed(generateRandomSeed().toString())}
                  style={{ padding: spacing.scale[3] }}
                >
                  <Shuffle style={{ width: '1rem', height: '1rem' }} />
                </SecondaryButton>
              </div>
            </div>
          </div>

          {/* Scenario Details */}
          {selectedScenario && (
            <div style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              background: colors.withOpacity(colors.aviation.secondary, 0.05),
              borderRadius: spacing.radius.md,
              border: `1px solid ${colors.withOpacity(colors.aviation.secondary, 0.1)}`
            }}>
              <h4 style={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: colors.aviation.navy,
                marginBottom: spacing.scale[2] 
              }}>
                {selectedScenario.label}
              </h4>
              <p style={{ 
                fontSize: '0.875rem', 
                color: colors.aviation.text,
                marginBottom: spacing.scale[3] 
              }}>
                {selectedScenario.description}
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(5, 1fr)', 
                gap: spacing.scale[2],
                fontSize: '0.75rem' 
              }}>
                {Object.entries(selectedScenario.distribution)
                  .sort(([a], [b]) => parseInt(b) - parseInt(a))
                  .map(([mark, count]) => (
                    <div key={mark} style={{
                      textAlign: 'center',
                      padding: spacing.scale[2],
                      background: colors.withOpacity(colors.aviation.primary, 0.1),
                      borderRadius: spacing.radius.sm,
                      border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.2)}`
                    }}>
                      <div style={{ fontWeight: 600, color: colors.aviation.navy }}>
                        {count}×{mark}m
                      </div>
                      <div style={{ color: colors.aviation.text, fontSize: '0.6875rem' }}>
                        {parseInt(mark) * count} marks
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Question Statistics */}
          {questionStats && (
            <div style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              background: colors.withOpacity(colors.gray[100], 0.5),
              borderRadius: spacing.radius.md,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <h4 style={{ 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: colors.aviation.navy,
                marginBottom: spacing.scale[3] 
              }}>
                Available Questions ({questionStats.totalQuestions} total)
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(5, 1fr)', 
                gap: spacing.scale[2],
                fontSize: '0.75rem' 
              }}>
                {([5, 4, 3, 2, 1] as MarkValue[]).map(mark => {
                  const available = questionStats.markDistribution[mark] || 0;
                  const needed = selectedScenario?.distribution[mark] || 0;
                  const sufficient = available >= needed;
                  
                  return (
                    <div key={mark} style={{
                      textAlign: 'center',
                      padding: spacing.scale[2],
                      background: sufficient ? 
                        colors.withOpacity(colors.semantic.success, 0.1) : 
                        colors.withOpacity(colors.semantic.error, 0.1),
                      borderRadius: spacing.radius.sm,
                      border: `1px solid ${sufficient ? 
                        colors.withOpacity(colors.semantic.success, 0.3) : 
                        colors.withOpacity(colors.semantic.error, 0.3)}`
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: spacing.scale[1],
                        fontWeight: 600, 
                        color: sufficient ? colors.semantic.success : colors.semantic.error 
                      }}>
                        {sufficient ? <CheckCircle style={{ width: '0.75rem', height: '0.75rem' }} /> : 
                                    <AlertCircle style={{ width: '0.75rem', height: '0.75rem' }} />}
                        {mark}m
                      </div>
                      <div style={{ color: colors.aviation.text, fontSize: '0.6875rem' }}>
                        {available} / {needed}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Advanced Filters Toggle */}
          <div style={{ marginTop: spacing.scale[4] }}>
            <SecondaryButton
              onClick={() => setShowFilters(!showFilters)}
              style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}
            >
              <Settings style={{ width: '1rem', height: '1rem' }} />
              {showFilters ? 'Hide' : 'Show'} Advanced Filters
            </SecondaryButton>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              background: colors.withOpacity(colors.gray[50], 0.5),
              borderRadius: spacing.radius.md,
              border: `1px solid ${colors.gray[200]}`
            }}>
              <h4 style={{ 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: colors.aviation.navy,
                marginBottom: spacing.scale[3] 
              }}>
                Question Filters (Optional)
              </h4>
              <p style={{ 
                fontSize: '0.75rem', 
                color: colors.aviation.muted,
                marginBottom: spacing.scale[4] 
              }}>
                Leave empty to include all available questions
              </p>
              {/* Add filter controls here in a future enhancement */}
              <div style={{ 
                fontSize: '0.75rem', 
                color: colors.aviation.muted,
                fontStyle: 'italic' 
              }}>
                Advanced filtering options will be available in a future update
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              background: colors.withOpacity(colors.semantic.error, 0.1),
              borderRadius: spacing.radius.md,
              border: `1px solid ${colors.withOpacity(colors.semantic.error, 0.3)}`,
              color: colors.semantic.error
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}>
                <AlertCircle style={{ width: '1rem', height: '1rem' }} />
                <strong>Generation Failed</strong>
              </div>
              <p style={{ marginTop: spacing.scale[2], fontSize: '0.875rem' }}>
                {error}
              </p>
            </div>
          )}

          {/* Generate Button */}
          <div style={{ marginTop: spacing.scale[6] }}>
            <PrimaryButton
              onClick={generateExam}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.scale[2],
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {loading ? 'Generating...' : 'Generate Trial Exam'}
            </PrimaryButton>
          </div>
        </CardContent>
      </Card>

      {/* Generated Exam Summary */}
      {generatedExam && (
        <Card variant="elevated" padding="lg">
          <CardHeader title="Generated Exam" />
          <CardContent>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: spacing.scale[3],
              marginBottom: spacing.scale[4]
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.aviation.primary }}>
                  {generatedExam.totalQuestions}
                </div>
                <div style={{ fontSize: '0.75rem', color: colors.aviation.muted }}>Questions</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.aviation.primary }}>
                  {generatedExam.totalMarks}
                </div>
                <div style={{ fontSize: '0.75rem', color: colors.aviation.muted }}>Total Marks</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.aviation.primary }}>
                  {generatedExam.timeLimit}
                </div>
                <div style={{ fontSize: '0.75rem', color: colors.aviation.muted }}>Minutes</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.aviation.primary }}>
                  {generatedExam.seed}
                </div>
                <div style={{ fontSize: '0.75rem', color: colors.aviation.muted }}>Seed</div>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: spacing.scale[2], 
              flexWrap: 'wrap',
              justifyContent: 'center' 
            }}>
              {onStartExam && (
                <PrimaryButton
                  onClick={() => onStartExam(generatedExam)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.scale[2],
                    fontWeight: 600
                  }}
                >
                  Start Exam
                </PrimaryButton>
              )}
              
              <SecondaryButton
                onClick={() => downloadExam('json')}
                style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}
              >
                <Download style={{ width: '1rem', height: '1rem' }} />
                Download JSON
              </SecondaryButton>
              
              <SecondaryButton
                onClick={() => downloadExam('markdown')}
                style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}
              >
                <Download style={{ width: '1rem', height: '1rem' }} />
                Download Markdown
              </SecondaryButton>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrialExamGenerator;