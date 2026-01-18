import { describe, it, expect } from 'vitest';
import { calculateAmortizationWithInjection } from '../amortizationEngine';

describe('amortizationEngine - TAE Integration', () => {
  it('should include a tae property in the result', () => {
    const result = calculateAmortizationWithInjection({
      principal: 100000,
      annualTIN: 5,
      years: 30
    });
    
    expect(result).toHaveProperty('tae');
    expect(typeof result.tae).toBe('number');
  });

  it('should calculate the correct TAE for a standard loan', () => {
    // 5% TIN -> Effective ~5.116%
    const result = calculateAmortizationWithInjection({
      principal: 100000,
      annualTIN: 5,
      years: 30
    });
    
    // (1 + 0.05/12)^12 - 1 = 0.05116189...
    const expected = (Math.pow(1 + 0.05/12, 12) - 1) * 100;
    expect(result.tae).toBeCloseTo(expected, 2);
  });
});
