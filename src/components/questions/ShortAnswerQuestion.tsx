import React, { useState, useEffect } from 'react';
import type { Question, UserAnswer } from '../../types';
import { AviationCalculations } from '../../utils/aviationCalculations';

interface ShortAnswerQuestionProps {
  question: Question;
  onAnswerSubmit: (answer: UserAnswer) => void;
  showFeedback?: boolean;
  userAnswer?: UserAnswer;
}

interface FieldValidation {
  isCorrect: boolean;
  expected: number;
  actual: number;
  tolerance: number;
  unit: string;
}

const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  question,
  onAnswerSubmit,
  showFeedback = false,
  userAnswer
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(
    userAnswer?.shortAnswers 
      ? Object.fromEntries(
          Object.entries(userAnswer.shortAnswers).map(([k, v]) => [k, v.toString()])
        )
      : {}
  );
  const [startTime] = useState<Date>(new Date());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(userAnswer !== undefined);
  const [validationResults, setValidationResults] = useState<Record<string, FieldValidation>>({});

  useEffect(() => {
    if (showFeedback && isSubmitted && userAnswer?.shortAnswers) {
      const results: Record<string, FieldValidation> = {};
      
      question.expectedAnswers?.forEach(expected => {
        const actualValue = userAnswer.shortAnswers?.[expected.field] ?? 0;
        const isCorrect = AviationCalculations.validateAnswer(
          actualValue, 
          expected.value, 
          expected.tolerance
        );
        
        results[expected.field] = {
          isCorrect,
          expected: expected.value,
          actual: actualValue,
          tolerance: expected.tolerance,
          unit: expected.unit
        };
      });
      
      setValidationResults(results);
    }
  }, [showFeedback, isSubmitted, userAnswer, question.expectedAnswers]);

  const handleInputChange = (field: string, value: string) => {
    if (isSubmitted) return;
    
    const numericValue = value.replace(/[^\d.-]/g, '');
    setAnswers(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    
    const numericAnswers: Record<string, number> = {};
    let allFieldsCompleted = true;
    
    question.expectedAnswers?.forEach(expected => {
      const value = parseFloat(answers[expected.field] || '0');
      if (isNaN(value) || !answers[expected.field]) {
        allFieldsCompleted = false;
      }
      numericAnswers[expected.field] = value;
    });
    
    if (!allFieldsCompleted) {
      alert('Please complete all required fields before submitting.');
      return;
    }
    
    const isCorrect = question.expectedAnswers?.every(expected => {
      const actualValue = numericAnswers[expected.field];
      return AviationCalculations.validateAnswer(actualValue, expected.value, expected.tolerance);
    }) ?? false;
    
    const timeSpent = (new Date().getTime() - startTime.getTime()) / 1000;
    
    const answer: UserAnswer = {
      questionId: question.id,
      type: 'short_answer',
      shortAnswers: numericAnswers,
      isCorrect,
      timeSpent,
      timestamp: new Date()
    };

    setIsSubmitted(true);
    onAnswerSubmit(answer);
  };

  const getInputClassName = (field: string) => {
    let className = 'aviation-input w-full';
    
    if (showFeedback && isSubmitted) {
      const validation = validationResults[field];
      if (validation) {
        className += validation.isCorrect ? ' correct' : ' incorrect';
      }
    }
    
    return className;
  };

  if (!question.expectedAnswers || question.expectedAnswers.length === 0) {
    return <div className="text-red-500">Error: No expected answers defined for short answer question</div>;
  }

  return (
    <div className="space-y-4">
      {question.expectedAnswers.map((expected) => (
        <div key={expected.field} className="space-y-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1 block">
              {expected.description}
            </span>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={answers[expected.field] || ''}
                onChange={(e) => handleInputChange(expected.field, e.target.value)}
                className={getInputClassName(expected.field)}
                placeholder={`Enter value`}
                disabled={isSubmitted}
              />
              
              <span className="text-sm text-gray-500 min-w-0 flex-shrink-0">
                {expected.unit}
              </span>
            </div>
          </label>
          
          {showFeedback && isSubmitted && validationResults[expected.field] && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800">
                  Expected: {AviationCalculations.formatNumber(expected.value)} {expected.unit} 
                  <span className="text-gray-500 font-normal"> (±{expected.tolerance})</span>
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  validationResults[expected.field].isCorrect 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {validationResults[expected.field].isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              
              {!validationResults[expected.field].isCorrect && (
                <div className="text-sm text-red-700 bg-red-50 p-2 rounded border border-red-200">
                  Your answer: {AviationCalculations.formatNumber(validationResults[expected.field].actual)} {expected.unit}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      
      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <div className="text-sm text-gray-600">
          {question.expectedAnswers.length > 1 
            ? `Complete all ${question.expectedAnswers.length} fields and submit`
            : 'Enter your answer and submit'
          }
        </div>
        
        <button
          className={`aviation-button ${
            isSubmitted ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          {isSubmitted ? 'Submitted' : 'Submit Answer'}
        </button>
      </div>
      
      {showFeedback && isSubmitted && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-800">Overall Result</span>
            <span className={`px-3 py-1 rounded text-sm font-medium ${
              Object.values(validationResults).every(v => v.isCorrect) 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {Object.values(validationResults).every(v => v.isCorrect) ? '✓ Correct' : '✗ Incorrect'}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
            Fields correct: {Object.values(validationResults).filter(v => v.isCorrect).length} / {Object.values(validationResults).length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortAnswerQuestion;