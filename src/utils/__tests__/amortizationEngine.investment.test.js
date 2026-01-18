import { describe, it, expect } from 'vitest';
import { calculateInvestmentReturn } from '../amortizationEngine';

describe('calculateInvestmentReturn', () => {
  it('should return 0 if schedules are empty', () => {
    expect(calculateInvestmentReturn([], [])).toBe(0);
  });

  it('should calculate correct return for a simple scenario', () => {
    // Scenario: Invest 1000 at Month 1. Save 1100 at Month 13.
    // Base: Month 1: Pay 500. Month 13: Pay 500.
    // Scenario: Month 1: Pay 1500 (500 + 1000). Month 13: Pay 0 (Early finish? Or just lower payment?).
    // Let's assume lower payment strategy for simplicity of mental math.
    // Scenario: Month 1: Pay 1500. Month 13: Pay 0 (saved 500) + ...
    
    // Let's construct explicit schedules
    const baseSchedule = [
        { month: 1, payment: 500 },
        { month: 2, payment: 500 },
    ];
    
    // Scenario: Injection of 100 at Month 1. 
    // Result: Payment at Month 2 is reduced to 390. (Saving 110).
    const scenarioSchedule = [
        { month: 1, payment: 600 }, // 500 + 100 injection
        { month: 2, payment: 390 },
    ];

    // Cash Flows:
    // Month 1: 500 - 600 = -100
    // Month 2: 500 - 390 = +110
    // Return: 10% per month -> (1.1)^12 - 1 = ~213% Annual (Huge, but logic check)
    
    const result = calculateInvestmentReturn(baseSchedule, scenarioSchedule);
    
    // IRR of [-100, 110] is 10%. 
    // TAE = (1.1)^12 - 1 = 2.138... -> 213.84%
    expect(result).toBeCloseTo(213.84, 1);
  });

  it('should handle zero impact scenarios correctly', () => {
      const base = [{ month: 1, payment: 100 }];
      const scen = [{ month: 1, payment: 100 }];
      expect(calculateInvestmentReturn(base, scen)).toBe(0);
  });
});
