import { describe, it, expect } from 'vitest';
import { AviationCalculations } from './aviationCalculations';

describe('AviationCalculations.validateEMZW', () => {
  it('computes EMZW as mean of start and end zone weights', () => {
    const startZoneWeight = 70000;
    const result = AviationCalculations.validateEMZW(startZoneWeight, 100, 0.8, 0, 30);

    expect(result.endZoneWeight).toBeCloseTo(startZoneWeight - result.zoneFuel, 5);
    expect(result.emzw).toBeCloseTo((startZoneWeight + result.endZoneWeight) / 2, 5);
  });

  it('handles different time intervals and weights', () => {
    const startZoneWeight = 65000;
    const result = AviationCalculations.validateEMZW(startZoneWeight, 150, 0.79, 5, 45);

    expect(result.endZoneWeight).toBeCloseTo(startZoneWeight - result.zoneFuel, 5);
    expect(result.emzw).toBeCloseTo((startZoneWeight + result.endZoneWeight) / 2, 5);
  });

  it('uses fallback calculation for weights above table', () => {
    const startZoneWeight = 90000; // above highest bracket
    const result = AviationCalculations.validateEMZW(startZoneWeight, 500, 0.8, 0, 60);

    expect(result.emzw).toBeGreaterThan(80000);
    expect(result.endZoneWeight).toBeCloseTo(result.emzw - result.zoneFuel / 2, 5);
  });
});
