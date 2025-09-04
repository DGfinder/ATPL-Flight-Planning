import { describe, it, expect } from 'vitest';
import { AviationCalculations } from './aviationCalculations';

describe('parseWindComponent', () => {
  it('handles two-digit wind speeds without separator', () => {
    const result = AviationCalculations.parseWindComponent('27015');
    expect(result).toEqual({ direction: 270, speed: 15 });
  });

  it('handles three-digit wind speeds', () => {
    const result = AviationCalculations.parseWindComponent('180120');
    expect(result).toEqual({ direction: 180, speed: 120 });
  });

  it('handles slash-separated format', () => {
    const result = AviationCalculations.parseWindComponent('090/85');
    expect(result).toEqual({ direction: 90, speed: 85 });
  });
});
