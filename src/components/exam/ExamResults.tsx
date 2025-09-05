import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  PrimaryButton, 
  SecondaryButton,
  useDesignSystem 
} from '../../design-system';
import type { 
  ExamResult, 
  MarkValue
} from '../../types';
import { 
  Award, 
  TrendingUp, 
  FileText, 
  Download,
  ChevronDown,
  ChevronRight,
  Eye
} from 'lucide-react';

interface ExamResultsProps {
  result: ExamResult;
  onNewExam: () => void;
  onReviewQuestions?: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  result,
  onNewExam,
  onReviewQuestions
}) => {
  const { colors, spacing, styles } = useDesignSystem();
  const [expandedSections, setExpandedSections] = useState<{
    marks: boolean;
    categories: boolean;
    questions: boolean;
  }>({
    marks: true,
    categories: false,
    questions: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getPassStatus = (percentage: number): { status: string; color: string } => {
    if (percentage >= 70) {
      return { status: 'PASS', color: colors.semantic.success };
    }
    return { status: 'FAIL', color: colors.semantic.error };
  };

  const downloadResults = (format: 'json' | 'text') => {
    const timestamp = new Date().toISOString().split('T')[0];
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(result, null, 2);
      filename = `exam-results-${result.exam.seed}-${timestamp}.json`;
      mimeType = 'application/json';
    } else {
      content = generateTextReport();
      filename = `exam-results-${result.exam.seed}-${timestamp}.txt`;
      mimeType = 'text/plain';
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

  const generateTextReport = (): string => {
    const lines: string[] = [];
    const passStatus = getPassStatus(result.percentage);
    
    lines.push('CASA ATPL Flight Planning Trial Exam - Results Report');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push(`Exam Scenario: ${result.exam.scenario}`);
    lines.push(`Exam Seed: ${result.exam.seed}`);
    lines.push(`Date: ${new Date().toLocaleDateString()}`);
    lines.push('');
    lines.push('OVERALL PERFORMANCE');
    lines.push('-'.repeat(30));
    lines.push(`Score: ${result.totalScore}/${result.maxScore} (${result.percentage.toFixed(1)}%)`);
    lines.push(`Result: ${passStatus.status} (Pass mark: 70%)`);
    lines.push(`Questions Correct: ${result.questionsCorrect}/${result.questionsTotal}`);
    lines.push(`Time Spent: ${formatTime(result.timeSpent)}`);
    lines.push('');
    lines.push('MARK BREAKDOWN');
    lines.push('-'.repeat(30));
    
    ([5, 4, 3, 2, 1] as MarkValue[]).forEach(mark => {
      const breakdown = result.markBreakdown[mark];
      if (breakdown.total > 0) {
        const percentage = (breakdown.correct / breakdown.total) * 100;
        lines.push(`${mark}-mark questions: ${breakdown.correct}/${breakdown.total} (${percentage.toFixed(0)}%) - ${breakdown.marks} marks earned`);
      }
    });
    
    lines.push('');
    lines.push('CATEGORY PERFORMANCE');
    lines.push('-'.repeat(30));
    
    Object.entries(result.categoryBreakdown)
      .sort(([,a], [,b]) => b.percentage - a.percentage)
      .forEach(([category, breakdown]) => {
        const categoryName = category.replace(/_/g, ' ').toUpperCase();
        const status = breakdown.percentage === 100 ? 'MASTERED' : 'NEEDS STUDY';
        lines.push(`${categoryName}: ${breakdown.correct}/${breakdown.total} (${breakdown.percentage.toFixed(0)}%) - ${status}`);
      });
    
    
    lines.push('');
    lines.push('DETAILED ANALYTICS');
    lines.push('-'.repeat(30));
    
    // Calculate topic strengths and weaknesses
    const sortedCategories = Object.entries(result.categoryBreakdown)
      .sort(([,a], [,b]) => b.percentage - a.percentage);
    
    if (sortedCategories.length > 0) {
      const strongest = sortedCategories[0];
      const weakest = sortedCategories[sortedCategories.length - 1];
      
      lines.push(`Strongest Topic: ${strongest[0].replace(/_/g, ' ').toUpperCase()} (${strongest[1].percentage.toFixed(0)}%)`);
      lines.push(`Weakest Topic: ${weakest[0].replace(/_/g, ' ').toUpperCase()} (${weakest[1].percentage.toFixed(0)}%)`);
      
      // Study recommendations for 100% mastery
      const needsMastery = sortedCategories.filter(([,breakdown]) => breakdown.percentage < 100);
      if (needsMastery.length > 0) {
        lines.push('');
        lines.push('STUDY RECOMMENDATIONS FOR 100% MASTERY:');
        needsMastery.forEach(([category, breakdown]) => {
          const categoryName = category.replace(/_/g, ' ').toUpperCase();
          const missed = breakdown.total - breakdown.correct;
          lines.push(`• ${categoryName} (missed ${missed} question${missed > 1 ? 's' : ''})`);
        });
      } else {
        lines.push('');
        lines.push('🎯 PERFECT SCORE - 100% MASTERY ACHIEVED!');
      }
    }
    
    return lines.join('\n');
  };

  const passStatus = getPassStatus(result.percentage);
  const passThreshold = 70; // CASA pass mark
  const passed = result.percentage >= passThreshold;

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.gray[50],
      padding: spacing.scale[4]
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header Card */}
        <Card variant="elevated" padding="xl" style={{ 
          marginBottom: spacing.scale[6],
          textAlign: 'center',
          background: passed ? 
            `linear-gradient(135deg, ${colors.withOpacity(colors.semantic.success, 0.05)} 0%, ${colors.white} 100%)` :
            `linear-gradient(135deg, ${colors.withOpacity(colors.semantic.warning, 0.05)} 0%, ${colors.white} 100%)`
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: passed ? colors.semantic.success : colors.semantic.warning,
            marginBottom: spacing.scale[4]
          }}>
            <Award style={{ 
              width: '40px', 
              height: '40px', 
              color: colors.white 
            }} />
          </div>
          
          <h1 style={{
            ...styles.heading,
            fontSize: '2rem',
            color: colors.aviation.navy,
            marginBottom: spacing.scale[2]
          }}>
            Exam Complete!
          </h1>
          
          <div style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: passStatus.color,
            marginBottom: spacing.scale[2]
          }}>
            {result.percentage.toFixed(1)}%
          </div>
          
          <div style={{
            display: 'inline-block',
            padding: `${spacing.scale[3]} ${spacing.scale[5]}`,
            background: passStatus.color,
            color: colors.white,
            borderRadius: spacing.radius.lg,
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: spacing.scale[4],
            letterSpacing: '0.05em'
          }}>
            {passStatus.status}
          </div>
          
          <p style={{
            ...styles.body,
            fontSize: '1rem',
            color: passed ? colors.semantic.success : colors.semantic.error,
            fontWeight: 500,
            marginBottom: spacing.scale[2]
          }}>
            {passed ? 'Congratulations! You passed the exam.' : `Need ${passThreshold}% to pass`}
          </p>
          
          <p style={{
            ...styles.body,
            fontSize: '0.875rem',
            color: colors.aviation.muted,
            marginBottom: spacing.scale[4]
          }}>
            {(() => {
              const perfectCategories = Object.values(result.categoryBreakdown).filter(b => b.percentage === 100).length;
              const totalCategories = Object.keys(result.categoryBreakdown).length;
              if (perfectCategories === totalCategories) {
                return '🎯 Perfect mastery achieved in all topics!';
              }
              return `Mastery: ${perfectCategories}/${totalCategories} topics at 100%`;
            })()}
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: spacing.scale[4],
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.aviation.primary }}>
                {result.totalScore}/{result.maxScore}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.aviation.muted }}>Total Score</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.aviation.primary }}>
                {result.questionsCorrect}/{result.questionsTotal}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.aviation.muted }}>Questions</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.aviation.primary }}>
                {formatTime(result.timeSpent)}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.aviation.muted }}>Time Used</div>
            </div>
          </div>
        </Card>

        {/* Mark Breakdown */}
        <Card variant="default" padding="lg" style={{ marginBottom: spacing.scale[4] }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.scale[4],
            paddingBottom: spacing.scale[3],
            borderBottom: `1px solid ${colors.gray[200]}`
          }}>
            <h3 style={{
              ...styles.heading,
              fontSize: '1.25rem',
              color: colors.aviation.navy,
              margin: 0
            }}>
              Mark Breakdown
            </h3>
            <button
              onClick={() => toggleSection('marks')}
              style={{
                background: 'none',
                border: 'none',
                color: colors.aviation.primary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[1],
                fontSize: '0.875rem'
              }}
            >
              {expandedSections.marks ? 
                <ChevronDown style={{ width: '1rem', height: '1rem' }} /> :
                <ChevronRight style={{ width: '1rem', height: '1rem' }} />
              }
              {expandedSections.marks ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {expandedSections.marks && (
            <CardContent>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: spacing.scale[4]
              }}>
                {([5, 4, 3, 2, 1] as MarkValue[]).map(mark => {
                  const breakdown = result.markBreakdown[mark];
                  if (breakdown.total === 0) return null;
                  
                  const percentage = (breakdown.correct / breakdown.total) * 100;
                  const isGood = percentage >= 70;
                  
                  return (
                    <div key={mark} style={{
                      padding: spacing.scale[4],
                      background: isGood ? 
                        colors.withOpacity(colors.semantic.success, 0.05) :
                        colors.withOpacity(colors.semantic.warning, 0.05),
                      borderRadius: spacing.radius.md,
                      border: `1px solid ${isGood ? 
                        colors.withOpacity(colors.semantic.success, 0.2) :
                        colors.withOpacity(colors.semantic.warning, 0.2)}`
                    }}>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: colors.aviation.navy,
                        marginBottom: spacing.scale[1]
                      }}>
                        {mark}-mark Questions
                      </div>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: isGood ? colors.semantic.success : colors.semantic.warning,
                        marginBottom: spacing.scale[2]
                      }}>
                        {percentage.toFixed(0)}%
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: colors.aviation.muted,
                        marginBottom: spacing.scale[1]
                      }}>
                        {breakdown.correct}/{breakdown.total} correct
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: colors.aviation.primary
                      }}>
                        {breakdown.marks} marks earned
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Category Performance */}
        <Card variant="default" padding="lg" style={{ marginBottom: spacing.scale[4] }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.scale[4],
            paddingBottom: spacing.scale[3],
            borderBottom: `1px solid ${colors.gray[200]}`
          }}>
            <h3 style={{
              ...styles.heading,
              fontSize: '1.25rem',
              color: colors.aviation.navy,
              margin: 0
            }}>
              Performance by Topic
            </h3>
            <button
              onClick={() => toggleSection('categories')}
              style={{
                background: 'none',
                border: 'none',
                color: colors.aviation.primary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[1],
                fontSize: '0.875rem'
              }}
            >
              {expandedSections.categories ? 
                <ChevronDown style={{ width: '1rem', height: '1rem' }} /> :
                <ChevronRight style={{ width: '1rem', height: '1rem' }} />
              }
              {expandedSections.categories ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {expandedSections.categories && (
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[3] }}>
                {Object.entries(result.categoryBreakdown)
                  .sort(([,a], [,b]) => b.percentage - a.percentage)
                  .map(([category, breakdown]) => {
                    const categoryName = category.replace(/_/g, ' ').toUpperCase();
                    const isMastered = breakdown.percentage === 100;
                    
                    return (
                      <div key={category} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: spacing.scale[3],
                        background: isMastered ? 
                          colors.withOpacity(colors.semantic.success, 0.05) :
                          colors.withOpacity(colors.semantic.warning, 0.05),
                        borderRadius: spacing.radius.md,
                        border: `1px solid ${isMastered ? 
                          colors.withOpacity(colors.semantic.success, 0.2) :
                          colors.withOpacity(colors.semantic.warning, 0.2)}`
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: colors.aviation.navy,
                            marginBottom: spacing.scale[1]
                          }}>
                            {categoryName}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: colors.aviation.muted
                          }}>
                            {breakdown.correct}/{breakdown.total} correct
                            {!isMastered && (
                              <span style={{
                                marginLeft: spacing.scale[2],
                                color: colors.semantic.warning,
                                fontWeight: 500
                              }}>
                                • {breakdown.total - breakdown.correct} to review
                              </span>
                            )}
                            {isMastered && (
                              <span style={{
                                marginLeft: spacing.scale[2],
                                color: colors.semantic.success,
                                fontWeight: 500
                              }}>
                                • Mastered ✓
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.scale[2]
                        }}>
                          <div style={{
                            width: '100px',
                            height: '6px',
                            background: colors.gray[200],
                            borderRadius: spacing.radius.sm,
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${breakdown.percentage}%`,
                              height: '100%',
                              background: isMastered ? colors.semantic.success : colors.semantic.warning,
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                          
                          <div style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: isMastered ? colors.semantic.success : colors.semantic.warning,
                            minWidth: '50px',
                            textAlign: 'right'
                          }}>
                            {breakdown.percentage.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
                
                {/* Mastery Analytics Summary */}
                <div style={{
                  marginTop: spacing.scale[4],
                  padding: spacing.scale[4],
                  background: colors.withOpacity(colors.aviation.secondary, 0.05),
                  borderRadius: spacing.radius.md,
                  border: `1px solid ${colors.withOpacity(colors.aviation.secondary, 0.2)}`
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: colors.aviation.navy,
                    marginBottom: spacing.scale[3]
                  }}>
                    Mastery Analytics
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.scale[4] }}>
                    {(() => {
                      const sortedCategories = Object.entries(result.categoryBreakdown)
                        .sort(([,a], [,b]) => b.percentage - a.percentage);
                      const strongest = sortedCategories[0];
                      const needsWork = sortedCategories.filter(([,breakdown]) => breakdown.percentage < 100);
                      
                      return (
                        <>
                          <div>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: colors.semantic.success,
                              marginBottom: spacing.scale[1]
                            }}>
                              🎯 Best Performance
                            </div>
                            <div style={{
                              fontSize: '0.875rem',
                              color: colors.aviation.text
                            }}>
                              {strongest[0].replace(/_/g, ' ').toUpperCase()} ({strongest[1].percentage.toFixed(0)}%)
                            </div>
                          </div>
                          
                          <div>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: colors.semantic.warning,
                              marginBottom: spacing.scale[1]
                            }}>
                              📚 Topics to Master
                            </div>
                            <div style={{
                              fontSize: '0.875rem',
                              color: colors.aviation.text
                            }}>
                              {needsWork.length === 0 ? 'All topics mastered!' : `${needsWork.length} topics need review`}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  
                  {(() => {
                    const needsWork = Object.entries(result.categoryBreakdown)
                      .filter(([,breakdown]) => breakdown.percentage < 100);
                    
                    if (needsWork.length > 0) {
                      return (
                        <div style={{ marginTop: spacing.scale[3] }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: colors.semantic.info,
                            marginBottom: spacing.scale[2]
                          }}>
                            🎓 Study Plan for 100% Mastery
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: colors.aviation.text,
                            lineHeight: '1.5'
                          }}>
                            Review: {needsWork.map(([cat, breakdown]) => {
                              const missed = breakdown.total - breakdown.correct;
                              const name = cat.replace(/_/g, ' ');
                              return `${name} (${missed} question${missed > 1 ? 's' : ''})`;
                            }).join(', ')}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div style={{ marginTop: spacing.scale[3] }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: colors.semantic.success,
                          marginBottom: spacing.scale[2]
                        }}>
                          🏆 Perfect Performance!
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: colors.aviation.text,
                          lineHeight: '1.5'
                        }}>
                          You have achieved 100% mastery in all ATPL Flight Planning topics.
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: spacing.scale[3],
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: spacing.scale[8]
        }}>
          <PrimaryButton
            onClick={onNewExam}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[2],
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            <TrendingUp style={{ width: '1rem', height: '1rem' }} />
            Generate New Exam
          </PrimaryButton>
          
          {onReviewQuestions && (
            <SecondaryButton
              onClick={onReviewQuestions}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.scale[2]
              }}
            >
              <Eye style={{ width: '1rem', height: '1rem' }} />
              Review Questions
            </SecondaryButton>
          )}
          
          <SecondaryButton
            onClick={() => downloadResults('text')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[2]
            }}
          >
            <Download style={{ width: '1rem', height: '1rem' }} />
            Download Report
          </SecondaryButton>
          
          <SecondaryButton
            onClick={() => downloadResults('json')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.scale[2]
            }}
          >
            <FileText style={{ width: '1rem', height: '1rem' }} />
            Export Data
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;