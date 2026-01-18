import { describe, it, expect } from 'vitest';
import { calculateIRR } from '../financialCalculations';

describe('financialCalculations', () => {
  describe('calculateIRR', () => {
    it('should return 0 for empty cash flows', () => {
      expect(calculateIRR([])).toBe(0);
    });

    it('should calculate correct TAE for a simple 1-year loan', () => {
        // Loan 1000, Pay 1100 in 1 year (Month 12)
        // TAE should be exactly 10%
        const cashFlows = [
            { amount: 1000, month: 0 },
            { amount: -1100, month: 12 }
        ];
        const tae = calculateIRR(cashFlows);
        expect(tae).toBeCloseTo(10.0, 1);
    });

    it('should calculate correct TAE for a standard monthly mortgage', () => {
        // Loan 100,000 at 5% annual interest for 30 years (360 months)
        // Monthly payment is roughly 536.82
        // If we strictly pay this, the IRR should match the 5% input rate.
        
        const principal = 100000;
        const annualRate = 0.05;
        const monthlyRate = annualRate / 12;
        const months = 360;
        const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
        
        const cashFlows = [{ amount: principal, month: 0 }];
        for (let i = 1; i <= months; i++) {
            cashFlows.push({ amount: -payment, month: i });
        }

        // Note: Nominal rate is 5%, but TAE (Effective Annual Rate) is (1 + 0.05/12)^12 - 1
        // (1 + 0.0041666)^12 - 1 = ~5.116%
        const expectedTAE = (Math.pow(1 + annualRate/12, 12) - 1) * 100;
        
        const result = calculateIRR(cashFlows);
        expect(result).toBeCloseTo(expectedTAE, 2);
    });

    it('should handle uneven cash flows (extra payments)', () => {
        // Loan 10,000. Month 1: -5000. Month 2: -5100.
        // Quick payback. 
        const cashFlows = [
            { amount: 10000, month: 0 },
            { amount: -5000, month: 1 },
            { amount: -5100, month: 2 }
        ];
        const result = calculateIRR(cashFlows);
        // We expect a positive return.
        expect(result).toBeGreaterThan(0);
    });

    it('should return 0 if cash flows are all positive or all negative', () => {
        const allPositive = [{ amount: 100, month: 0 }, { amount: 200, month: 1 }];
        expect(calculateIRR(allPositive)).toBe(0);

        const allNegative = [{ amount: -100, month: 0 }, { amount: -200, month: 1 }];
        expect(calculateIRR(allNegative)).toBe(0);
    });
  });
});
