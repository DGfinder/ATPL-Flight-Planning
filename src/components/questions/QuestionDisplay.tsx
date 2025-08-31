import React, { useState } from 'react';
import type { Question, UserAnswer, StudyMode } from '../../types';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';

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
      <div className="aviation-card p-4 mb-4">
        <h4 className="font-semibold text-aviation-primary mb-3">Given Data:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {Object.entries(question.givenData).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span className="text-gray-700">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWorkingSteps = () => {
    if (!showWorkingSteps && !showSteps) return null;
    
    return (
      <div className="aviation-card p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-aviation-primary">Working Steps:</h4>
          <button 
            className="text-sm text-aviation-accent hover:underline"
            onClick={() => setShowSteps(!showSteps)}
          >
            {showSteps ? 'Hide Steps' : 'Show Steps'}
          </button>
        </div>
        
        {showSteps && (
          <ol className="list-decimal list-inside space-y-2 text-sm">
            {question.workingSteps.map((step, index) => (
              <li key={index} className="text-gray-700">{step}</li>
            ))}
          </ol>
        )}
      </div>
    );
  };

  const showFeedback = studyMode === 'practice' && submittedAnswer !== undefined;
  const isAnswered = submittedAnswer !== undefined;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="aviation-card p-6 mb-4">
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