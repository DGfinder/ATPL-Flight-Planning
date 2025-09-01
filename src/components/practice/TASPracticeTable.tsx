import React, { useState } from 'react';

interface PracticeRow {
  q: number;
  tas: number;
  fpt: number;
  windDir: number;
  windSpeed: number;
  answers: {
    crosswind: number;
    driftAngle: number;
    headTailwind: number;
    etas: number;
    groundSpeed: number;
    wc: number;
  };
}

const practiceData: PracticeRow[] = [
  { q: 1, tas: 410, fpt: 210, windDir: 150, windSpeed: 100, answers: { crosswind: 84, driftAngle: 12, headTailwind: -50, etas: 402, groundSpeed: 352, wc: -58 } },
  { q: 2, tas: 420, fpt: 65, windDir: 300, windSpeed: 70, answers: { crosswind: 58, driftAngle: 8, headTailwind: 40, etas: 418, groundSpeed: 458, wc: 38 } },
  { q: 3, tas: 450, fpt: 355, windDir: 80, windSpeed: 100, answers: { crosswind: 99, driftAngle: 13, headTailwind: -10, etas: 440, groundSpeed: 430, wc: -20 } },
  { q: 4, tas: 450, fpt: 255, windDir: 240, windSpeed: 60, answers: { crosswind: 16, driftAngle: 2, headTailwind: -58, etas: 450, groundSpeed: 392, wc: -58 } },
  { q: 5, tas: 350, fpt: 205, windDir: 245, windSpeed: 80, answers: { crosswind: 52, driftAngle: 8, headTailwind: -61, etas: 348, groundSpeed: 287, wc: -63 } },
  { q: 6, tas: 220, fpt: 250, windDir: 170, windSpeed: 65, answers: { crosswind: 64, driftAngle: 17, headTailwind: -10, etas: 211, groundSpeed: 201, wc: -19 } },
  { q: 7, tas: 280, fpt: 320, windDir: 280, windSpeed: 80, answers: { crosswind: 50, driftAngle: 10, headTailwind: -60, etas: 276, groundSpeed: 216, wc: -64 } },
  { q: 8, tas: 260, fpt: 40, windDir: 120, windSpeed: 50, answers: { crosswind: 49, driftAngle: 11, headTailwind: -9, etas: 255, groundSpeed: 246, wc: -14 } },
  { q: 9, tas: 400, fpt: 135, windDir: 340, windSpeed: 70, answers: { crosswind: 30, driftAngle: 4, headTailwind: 63, etas: 400, groundSpeed: 463, wc: 63 } },
  { q: 10, tas: 450, fpt: 225, windDir: 340, windSpeed: 110, answers: { crosswind: 100, driftAngle: 13, headTailwind: 43, etas: 440, groundSpeed: 483, wc: 33 } },
  { q: 11, tas: 360, fpt: 45, windDir: 355, windSpeed: 90, answers: { crosswind: 65, driftAngle: 10, headTailwind: -60, etas: 355, groundSpeed: 295, wc: -65 } },
  { q: 12, tas: 390, fpt: 165, windDir: 290, windSpeed: 100, answers: { crosswind: 81, driftAngle: 12, headTailwind: 59, etas: 382, groundSpeed: 441, wc: 51 } }
];

interface UserAnswers {
  [key: string]: {
    crosswind?: number;
    driftAngle?: number;
    headTailwind?: number;
    etas?: number;
    groundSpeed?: number;
    wc?: number;
  };
}

const TASPracticeTable: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [showAnswers, setShowAnswers] = useState(false);

  const updateAnswer = (rowIndex: number, field: string, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setUserAnswers(prev => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [field]: numValue
      }
    }));
  };

  const isCorrect = (rowIndex: number, field: keyof PracticeRow['answers']): boolean | null => {
    const userValue = userAnswers[rowIndex]?.[field];
    const correctValue = practiceData[rowIndex].answers[field];
    
    if (userValue === undefined) return null;
    
    // Allow ±1 tolerance for calculations
    return Math.abs(userValue - correctValue) <= 1;
  };

  const getFieldClass = (rowIndex: number, field: keyof PracticeRow['answers']): string => {
    if (showAnswers) return 'bg-blue-50';
    
    const correct = isCorrect(rowIndex, field);
    if (correct === null) return '';
    return correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">TAS Practice Calculations</h4>
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="aviation-button-secondary text-sm"
        >
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </button>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <strong>Remember:</strong> If drift angle ≤ 5°, no ETAS correction needed (ETAS = TAS)
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Q</th>
              <th className="border border-gray-300 p-2">TAS</th>
              <th className="border border-gray-300 p-2">FPT°</th>
              <th className="border border-gray-300 p-2">W/V</th>
              <th className="border border-gray-300 p-2">Crosswind<br/>(knots)</th>
              <th className="border border-gray-300 p-2">Drift<br/>Angle</th>
              <th className="border border-gray-300 p-2">Head/Tailwind</th>
              <th className="border border-gray-300 p-2">ETAS</th>
              <th className="border border-gray-300 p-2">Ground-speed</th>
              <th className="border border-gray-300 p-2">WC</th>
            </tr>
          </thead>
          <tbody>
            {practiceData.map((row, i) => (
              <tr key={row.q}>
                <td className="border border-gray-300 p-2 bg-gray-50 text-center font-medium">{row.q}</td>
                <td className="border border-gray-300 p-2 bg-gray-50 text-center">{row.tas}</td>
                <td className="border border-gray-300 p-2 bg-gray-50 text-center">{row.fpt}</td>
                <td className="border border-gray-300 p-2 bg-gray-50 text-center">{row.windDir}/{row.windSpeed}</td>
                
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    className={`w-full p-1 text-center text-xs border rounded ${getFieldClass(i, 'crosswind')}`}
                    value={showAnswers ? row.answers.crosswind : (userAnswers[i]?.crosswind || '')}
                    onChange={(e) => updateAnswer(i, 'crosswind', e.target.value)}
                    readOnly={showAnswers}
                  />
                </td>
                
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    className={`w-full p-1 text-center text-xs border rounded ${getFieldClass(i, 'driftAngle')}`}
                    value={showAnswers ? row.answers.driftAngle : (userAnswers[i]?.driftAngle || '')}
                    onChange={(e) => updateAnswer(i, 'driftAngle', e.target.value)}
                    readOnly={showAnswers}
                  />
                </td>
                
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    className={`w-full p-1 text-center text-xs border rounded ${getFieldClass(i, 'headTailwind')}`}
                    value={showAnswers ? row.answers.headTailwind : (userAnswers[i]?.headTailwind || '')}
                    onChange={(e) => updateAnswer(i, 'headTailwind', e.target.value)}
                    readOnly={showAnswers}
                  />
                </td>
                
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    className={`w-full p-1 text-center text-xs border rounded ${getFieldClass(i, 'etas')}`}
                    value={showAnswers ? row.answers.etas : (userAnswers[i]?.etas || '')}
                    onChange={(e) => updateAnswer(i, 'etas', e.target.value)}
                    readOnly={showAnswers}
                  />
                </td>
                
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    className={`w-full p-1 text-center text-xs border rounded ${getFieldClass(i, 'groundSpeed')}`}
                    value={showAnswers ? row.answers.groundSpeed : (userAnswers[i]?.groundSpeed || '')}
                    onChange={(e) => updateAnswer(i, 'groundSpeed', e.target.value)}
                    readOnly={showAnswers}
                  />
                </td>
                
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    className={`w-full p-1 text-center text-xs border rounded ${getFieldClass(i, 'wc')}`}
                    value={showAnswers ? row.answers.wc : (userAnswers[i]?.wc || '')}
                    onChange={(e) => updateAnswer(i, 'wc', e.target.value)}
                    readOnly={showAnswers}
                  />
                </td>
              </tr>
            ))}\n          </tbody>
        </table>
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <div><strong>Legend:</strong> Green = Correct (±1), Red = Incorrect, Blue = Answer shown</div>
        <div><strong>Tip:</strong> Use your flight computer (whiz wheel) to work through each calculation step by step</div>
      </div>
    </div>
  );
};

export default TASPracticeTable;