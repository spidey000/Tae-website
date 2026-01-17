import { describe, it, expect } from 'vitest';
import { calculateAmortizationWithInjection, mergeSchedules } from '../amortizationEngine';
import { calculateMonthlyPayment } from '../mortgageCalculations';

describe('Amortization Engine', () => {
  const BASE_LOAN = {
    principal: 100000,
    annualTIN: 3.0,
    years: 20
  };

  it('should return standard schedule if no injection is provided', () => {
    const result = calculateAmortizationWithInjection({
      ...BASE_LOAN,
      injectionAmount: 0,
      injectionMonth: 0,
      strategy: 'reduceTerm'
    });

    expect(result.schedule).toHaveLength(20 * 12);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalSavings).toBe(0);
  });

  it('should reduce term when strategy is "reduceTerm"', () => {
    const injectionAmount = 10000;
    const injectionMonth = 12;

    const result = calculateAmortizationWithInjection({
      ...BASE_LOAN,
      injectionAmount,
      injectionMonth,
      strategy: 'reduceTerm'
    });

    // Check pre-injection
    expect(result.schedule[10].balance).toBeGreaterThan(result.schedule[11].balance); // Normal amortization
    
    // Check injection point (Month 12)
    const balanceBeforeInjection = result.schedule[10].balance; // End of month 11
    
    // Check that schedule length is shorter than original 240
    expect(result.schedule.length).toBeLessThan(240);
    
    // Check that monthly payment roughly stays the same (except last)
    const initialPayment = calculateMonthlyPayment(BASE_LOAN.principal, BASE_LOAN.annualTIN, BASE_LOAN.years);
    expect(result.schedule[12].payment).toBeCloseTo(initialPayment, 1);
  });

  it('should reduce installment when strategy is "reduceInstallment"', () => {
    const injectionAmount = 10000;
    const injectionMonth = 12;

    const result = calculateAmortizationWithInjection({
      ...BASE_LOAN,
      injectionAmount,
      injectionMonth,
      strategy: 'reduceInstallment'
    });

    // Term should remain 240
    expect(result.schedule).toHaveLength(240);
    
    // Payment after month 12 should be lower
    const initialPayment = calculateMonthlyPayment(BASE_LOAN.principal, BASE_LOAN.annualTIN, BASE_LOAN.years);
    const newPayment = result.schedule[12].payment;
    
    expect(newPayment).toBeLessThan(initialPayment);
    
    // Check savings
    expect(result.totalSavings).toBeGreaterThan(0);
  });

  it('should handle recurring monthly injections and update payments correctly', () => {
    const result = calculateAmortizationWithInjection({
      ...BASE_LOAN,
      injectionAmount: 100,
      injectionMonth: 1,
      injectionFrequency: 'monthly',
      strategy: 'reduceInstallment'
    });

    // Payment should decrease every month
    expect(result.schedule[0].payment).toBeGreaterThan(result.schedule[1].payment);
    expect(result.schedule[1].payment).toBeGreaterThan(result.schedule[2].payment);
    
    // Check that totalInjected matches roughly 240 * 100
    // Actually it might be slightly less if it finishes earlier or depending on exact months
    expect(result.totalInjected).toBeGreaterThan(20000); 
    
    // finalMonthlyPayment should be significantly lower than initial
    expect(result.finalMonthlyPayment).toBeLessThan(result.initialMonthlyPayment / 2);
  });

  it('should handle yearly injections correctly', () => {
    const result = calculateAmortizationWithInjection({
      ...BASE_LOAN,
      injectionAmount: 1000,
      injectionMonth: 12,
      injectionFrequency: 'yearly',
      strategy: 'reduceTerm'
    });

    // Injections should happen at month 12, 24, 36...
    const injectedMonths = result.schedule
      .filter(item => item.didInject)
      .map(item => item.month);

    expect(injectedMonths[0]).toBe(12);
    expect(injectedMonths[1]).toBe(24);
    expect(injectedMonths[2]).toBe(36);
  });

  it('should calculate ROI correctly', () => {
     const result = calculateAmortizationWithInjection({
      ...BASE_LOAN,
      injectionAmount: 10000,
      injectionMonth: 12,
      strategy: 'reduceTerm'
    });
    
    // ROI = (Savings / Injection) * 100
    const expectedROI = (result.totalSavings / 10000) * 100;
    expect(result.roi).toBeCloseTo(expectedROI, 2);
  });
});

describe('mergeSchedules', () => {
  it('should merge schedules correctly', () => {
    const base = [{ month: 1, balance: 100 }, { month: 2, balance: 50 }, { month: 3, balance: 0 }];
    const scenA = [{ month: 1, balance: 90 }, { month: 2, balance: 0 }];
    const scenB = [{ month: 1, balance: 95 }, { month: 2, balance: 40 }, { month: 3, balance: 0 }];

    const merged = mergeSchedules(base, scenA, scenB);

    expect(merged).toHaveLength(3);
    expect(merged[0]).toEqual({ month: 1, base: 100, scenA: 90, scenB: 95 });
    expect(merged[1]).toEqual({ month: 2, base: 50, scenA: 0, scenB: 40 });
    // For scenA which ended early, balance should be 0
    expect(merged[2]).toEqual({ month: 3, base: 0, scenA: 0, scenB: 0 });
  });
});
