import React, { useState } from 'react';
import { Card, useDesignSystem } from '../../design-system';

const Calculator: React.FC = () => {
  const { colors, spacing } = useDesignSystem();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return firstValue / secondValue;
      default: return secondValue;
    }
  };

  const renderButton = (text: string, onClick: () => void, isOperator = false) => (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        height: '3rem',
        border: 'none',
        borderRadius: spacing.radius.md,
        fontSize: '1.125rem',
        fontWeight: 600,
        cursor: 'pointer',
        background: isOperator ? colors.aviation.primary : colors.gray[100],
        color: isOperator ? colors.white : colors.aviation.navy,
        transition: 'all 0.2s'
      }}
    >
      {text}
    </button>
  );

  return (
    <Card style={{
      width: '20rem',
      padding: spacing.scale[4],
      transform: 'scale(1)',
      animation: 'scaleIn 0.3s ease-out'
    }}>
      <input
        type="text"
        value={display}
        readOnly
        style={{
          width: '100%',
          padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
          marginBottom: spacing.scale[3],
          border: `1px solid ${colors.gray[300]}`,
          borderRadius: spacing.radius.md,
          fontSize: '1.5rem',
          textAlign: 'right',
          outline: 'none',
          background: colors.white
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.scale[2] }}>
        {renderButton('C', clear)}
        {renderButton('±', () => setDisplay(String(-parseFloat(display))))}
        {renderButton('%', () => setDisplay(String(parseFloat(display) / 100)))}
        {renderButton('÷', () => performOperation('÷'), true)}

        {renderButton('7', () => inputDigit('7'))}
        {renderButton('8', () => inputDigit('8'))}
        {renderButton('9', () => inputDigit('9'))}
        {renderButton('×', () => performOperation('×'), true)}

        {renderButton('4', () => inputDigit('4'))}
        {renderButton('5', () => inputDigit('5'))}
        {renderButton('6', () => inputDigit('6'))}
        {renderButton('-', () => performOperation('-'), true)}

        {renderButton('1', () => inputDigit('1'))}
        {renderButton('2', () => inputDigit('2'))}
        {renderButton('3', () => inputDigit('3'))}
        {renderButton('+', () => performOperation('+'), true)}

        {renderButton('0', () => inputDigit('0'))}
        {renderButton('.', inputDecimal)}
        {renderButton('=', () => {
          if (previousValue !== null && operation) {
            const inputValue = parseFloat(display);
            const newValue = calculate(previousValue, inputValue, operation);
            setDisplay(String(newValue));
            setPreviousValue(null);
            setOperation(null);
            setWaitingForOperand(true);
          }
        }, true)}
      </div>
    </Card>
  );
};

export default Calculator;


