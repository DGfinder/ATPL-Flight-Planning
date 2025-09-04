import { describe, it, expect } from 'vitest';
import { AviationCalculations } from './aviationCalculations';

describe('formatTime', () => {
  it('formats minutes with one decimal place', () => {
    expect(AviationCalculations.formatTime(59.64)).toBe('59.6');
  });

  it('formats zero minutes', () => {
    expect(AviationCalculations.formatTime(0)).toBe('0.0');
  });

  it('rounds values correctly', () => {
    expect(AviationCalculations.formatTime(120.05)).toBe('120.1');
  });

  it('handles negative minutes', () => {
    expect(AviationCalculations.formatTime(-3.25)).toBe('-3.3');
  });
});
