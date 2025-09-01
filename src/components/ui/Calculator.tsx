import React, { useMemo, useRef, useState } from 'react';

interface CalculatorProps {
  onClose: () => void;
}

type Op = '+' | '-' | '×' | '÷' | '';

const buttons: Array<string[]> = [
  ['MC', 'MR', 'M+', 'M−', 'C'],
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+']
];

const sanitize = (val: string): string => (val.replace(/[^0-9.-]/g, ''));

const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState<string>('0');
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<Op>('');
  const [memory, setMemory] = useState<number>(0);
  const hasPending = useMemo(() => pendingOp !== '' && accumulator !== null, [pendingOp, accumulator]);
  const justEvaluatedRef = useRef<boolean>(false);

  const toNumber = (s: string): number => {
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };

  const inputDigit = (d: string) => {
    setDisplay(prev => {
      if (justEvaluatedRef.current) {
        justEvaluatedRef.current = false;
        return d === '.' ? '0.' : d;
      }
      if (prev === '0' && d !== '.') return d;
      if (d === '.' && prev.includes('.')) return prev;
      return prev + d;
    });
  };

  const clearAll = () => {
    setDisplay('0');
    setAccumulator(null);
    setPendingOp('');
    justEvaluatedRef.current = false;
  };

  const perform = (op: Op, a: number, b: number): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const setOperation = (op: Op) => {
    const current = toNumber(display);
    if (!hasPending) {
      setAccumulator(current);
      setPendingOp(op);
      justEvaluatedRef.current = true;
      return;
    }
    const result = perform(pendingOp, accumulator as number, current);
    setAccumulator(result);
    setDisplay(Number.isNaN(result) ? 'Error' : String(result));
    setPendingOp(op);
    justEvaluatedRef.current = true;
  };

  const evaluate = () => {
    if (!hasPending) return;
    const result = perform(pendingOp, accumulator as number, toNumber(display));
    setDisplay(Number.isNaN(result) ? 'Error' : String(result));
    setAccumulator(null);
    setPendingOp('');
    justEvaluatedRef.current = true;
  };

  const handleMemory = (action: string) => {
    const cur = toNumber(display);
    if (action === 'MC') setMemory(0);
    if (action === 'MR') setDisplay(String(memory));
    if (action === 'M+') setMemory(m => m + cur);
    if (action === 'M−') setMemory(m => m - cur);
  };

  const onButton = (label: string) => {
    if (/^[0-9]$/.test(label) || label === '.') return inputDigit(label);
    if (label === 'C') return clearAll();
    if (label === '=') return evaluate();
    if (['+', '-', '×', '÷'].includes(label)) return setOperation(label as Op);
    return handleMemory(label);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in" role="dialog" aria-modal="true" aria-label="Calculator">
      <div className="aviation-card w-80 p-4 scale-in">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">Memory: {memory}</div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <input
          className="w-full aviation-input text-right text-2xl px-3 py-2 mb-3"
          value={display}
          onChange={(e) => setDisplay(sanitize(e.target.value))}
          aria-label="Calculator display"
        />

        <div className="grid grid-cols-4 gap-2 select-none">
          {buttons.flat().map((b, idx) => (
            <button
              key={idx}
              className={`py-2 rounded text-sm font-medium transition-all ${
                b.match(/^MC|MR|M[+]|M−|C$/) ? 'aviation-button-secondary' :
                b.match(/^[÷×\-\+=]$/) ? 'aviation-button' : 'aviation-button-secondary'
              }`}
              onClick={() => onButton(b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;


