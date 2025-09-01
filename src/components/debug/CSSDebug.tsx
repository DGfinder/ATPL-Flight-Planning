import React, { useState } from 'react';

interface CSSDebugProps {
  isVisible?: boolean;
}

export const CSSDebug: React.FC<CSSDebugProps> = ({ isVisible = true }) => {
  const [testClass, setTestClass] = useState('bg-blue-500 text-white');
  
  if (!isVisible || process.env.NODE_ENV === 'production') {
    return null;
  }

  const testClasses = [
    'bg-red-500 text-white',
    'bg-green-500 text-white', 
    'bg-blue-500 text-white',
    'bg-aviation-primary text-white',
    'bg-aviation-secondary text-aviation-accent',
    'text-aviation-navy',
    'shadow-aviation',
    'aviation-card',
    'aviation-button',
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-sm">
      <h3 className="text-sm font-bold mb-2 text-gray-800">🎨 CSS Debug Panel</h3>
      
      {/* Test if basic Tailwind is working */}
      <div className="mb-3">
        <div className="w-4 h-4 bg-red-500 inline-block mr-2"></div>
        <span className="text-xs">Red square = Basic Tailwind ✓</span>
      </div>
      
      {/* Test if custom Aviation colors are working */}
      <div className="mb-3">
        <div className="w-4 h-4 bg-aviation-primary inline-block mr-2"></div>
        <span className="text-xs">Blue square = Custom colors ✓</span>
      </div>
      
      {/* Interactive test area */}
      <div className="mb-3">
        <label className="block text-xs font-medium mb-1">Test Class:</label>
        <select 
          value={testClass}
          onChange={(e) => setTestClass(e.target.value)}
          className="w-full text-xs p-1 border rounded"
        >
          {testClasses.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>
      
      {/* Live test area */}
      <div className={`p-3 rounded text-center text-xs transition-all duration-300 ${testClass}`}>
        Live Test: {testClass}
      </div>
      
      {/* CSS Status indicators */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>CSS Debug Active</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          <span>Tailwind Processing: {document.querySelector('[data-tailwind]') ? '✓' : '?'}</span>
        </div>
      </div>
    </div>
  );
};

export default CSSDebug;