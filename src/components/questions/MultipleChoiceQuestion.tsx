import React, { useState } from 'react';
import type { Question, UserAnswer } from '../../types';

interface MultipleChoiceQuestionProps {
  question: Question;
  onAnswerSubmit: (answer: UserAnswer) => void;
  showFeedback?: boolean;
  userAnswer?: UserAnswer;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  onAnswerSubmit,
  showFeedback = false,
  userAnswer
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(
    userAnswer?.multipleChoiceAnswer ?? null
  );
  const [startTime] = useState<Date>(new Date());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(userAnswer !== undefined);

  const handleOptionSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    
    const isCorrect = selectedOption === question.correctAnswer;
    const timeSpent = (new Date().getTime() - startTime.getTime()) / 1000;
    
    const answer: UserAnswer = {
      questionId: question.id,
      type: 'multiple_choice',
      multipleChoiceAnswer: selectedOption,
      isCorrect,
      timeSpent,
      timestamp: new Date()
    };

    setIsSubmitted(true);
    onAnswerSubmit(answer);
  };

  const getOptionClassName = (optionIndex: number) => {
    let className = 'question-option';
    
    if (selectedOption === optionIndex) {
      className += ' selected';
    }
    
    if (showFeedback && isSubmitted) {
      if (optionIndex === question.correctAnswer) {
        className += ' correct';
      } else if (selectedOption === optionIndex && optionIndex !== question.correctAnswer) {
        className += ' incorrect';
      }
    }
    
    return className;
  };

  if (!question.options) {
    return <div className="text-red-500">Error: No options provided for multiple choice question</div>;
  }

  return (
    <div className="space-y-3">
      {question.options.map((option, index) => (
        <div
          key={index}
          className={getOptionClassName(index)}
          onClick={() => handleOptionSelect(index)}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3 mt-0.5">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedOption === index 
                  ? 'border-aviation-primary bg-aviation-primary' 
                  : 'border-gray-300'
              }`}>
                {selectedOption === index && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
            <div className="flex-grow">
              <span className="font-medium text-sm text-gray-600 mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="text-gray-900">{option}</span>
              
              {showFeedback && isSubmitted && (
                <div className="mt-2">
                  {index === question.correctAnswer && (
                    <div className="flex items-center text-green-700 text-sm">
                      <span className="mr-1">✓</span>
                      <span className="font-medium">Correct Answer</span>
                    </div>
                  )}
                  {selectedOption === index && index !== question.correctAnswer && (
                    <div className="flex items-center text-red-700 text-sm">
                      <span className="mr-1">✗</span>
                      <span className="font-medium">Your Answer</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Select your answer and click submit
        </div>
        
        <button
          className={`aviation-button ${
            selectedOption === null || isSubmitted 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
          onClick={handleSubmit}
          disabled={selectedOption === null || isSubmitted}
        >
          {isSubmitted ? 'Submitted' : 'Submit Answer'}
        </button>
      </div>
      
      {showFeedback && isSubmitted && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm">
            <div className="flex items-center mb-2">
              <span className="font-medium">Result:</span>
              <span className={`ml-2 ${
                userAnswer?.isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {userAnswer?.isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            
            {!userAnswer?.isCorrect && (
              <div className="text-gray-700">
                The correct answer is <strong>{String.fromCharCode(65 + (question.correctAnswer ?? 0))}</strong>: {question.options?.[question.correctAnswer ?? 0]}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;