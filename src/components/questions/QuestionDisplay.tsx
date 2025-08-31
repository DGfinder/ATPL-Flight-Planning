import React, { useState } from 'react';
import type { Question, UserAnswer, StudyMode } from '../../types';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';
import FlightPlanTable from '../flight-plan/FlightPlanTable';

interface QuestionDisplayProps {
  question: Question;
  studyMode: StudyMode;
  userAnswer?: UserAnswer;
  onAnswerSubmit: (answer: UserAnswer) => void;
  showWorkingSteps?: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  studyMode, 
  userAnswer,
  onAnswerSubmit,
  showWorkingSteps = false
}) => {
  const [showSteps, setShowSteps] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState<UserAnswer | undefined>(userAnswer);

  const handleAnswerSubmit = (answer: UserAnswer) => {
    setSubmittedAnswer(answer);
    onAnswerSubmit(answer);
  };

  const renderGivenData = () => {
    if (!question.givenData || Object.keys(question.givenData).length === 0) {
      return null;
    }

    return (
      <div className="aviation-card p-6 mb-6">
        <h4 className="font-semibold text-aviation-primary mb-4 text-lg">Given Data</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {Object.entries(question.givenData).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-medium text-gray-800">{key}</span>
              <span className="text-gray-700 font-mono bg-white px-3 py-1 rounded border">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWorkingSteps = () => {
    if (!showWorkingSteps && !showSteps) return null;
    
    return (
      <div className="aviation-card p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-aviation-primary text-lg">Working Steps</h4>
          <button 
            className="text-sm text-aviation-accent hover:underline px-3 py-1 rounded hover:bg-gray-50"
            onClick={() => setShowSteps(!showSteps)}
          >
            {showSteps ? 'Hide Steps' : 'Show Steps'}
          </button>
        </div>
        
        {showSteps && (
          <div className="space-y-3">
            {question.workingSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="flex-shrink-0 w-6 h-6 bg-aviation-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700 text-sm leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const showFeedback = studyMode === 'practice' && submittedAnswer !== undefined;
  const isAnswered = submittedAnswer !== undefined;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="aviation-card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {question.id}: {question.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="bg-aviation-light px-2 py-1 rounded">
                {question.category.replace('_', ' ').toUpperCase()}
              </span>
              <span>{question.marks} marks</span>
              <span className="italic">{question.reference}</span>
            </div>
          </div>
          {isAnswered && (
            <div className={`px-3 py-1 rounded text-sm font-medium ${
              submittedAnswer.isCorrect 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {submittedAnswer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
            </div>
          )}
        </div>
        
        <p className="text-gray-800 mb-6 leading-relaxed">
          {question.description}
        </p>
        
        {renderGivenData()}

        <div className="mt-6">
          <FlightPlanTable />
        </div>

        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer</h3>
          {question.type === 'multiple_choice' ? (
            <MultipleChoiceQuestion
              question={question}
              onAnswerSubmit={handleAnswerSubmit}
              showFeedback={showFeedback}
              userAnswer={submittedAnswer}
            />
          ) : (
            <ShortAnswerQuestion
              question={question}
              onAnswerSubmit={handleAnswerSubmit}
              showFeedback={showFeedback}
              userAnswer={submittedAnswer}
            />
          )}
        </div>
        
        {renderWorkingSteps()}
      </div>
    </div>
  );
};

export default QuestionDisplay;