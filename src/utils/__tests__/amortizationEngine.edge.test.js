import { describe, it, expect } from 'vitest';
import { calculateAmortizationWithInjection } from '../amortizationEngine';

describe('Amortization Engine - Edge Cases', () => {
  const baseParams = {
    principal: 100000,
    annualTIN: 3.5,
    years: 10,
  };

  it('handles infinite repetitions (null injectionCount) until loan is paid off', () => {
    // Inject 1000 every month starting from month 1
    const result = calculateAmortizationWithInjection({
      ...baseParams,
      injectionAmount: 1000,
      injectionMonth: 1,
      injectionFrequency: 'monthly',
      injectionCount: null, // Infinite
      strategy: 'reduceTerm'
    });

    // Expect loan to finish much earlier than 120 months
    expect(result.schedule.length).toBeLessThan(120);
    
    // Check if injections happened until the end
    const lastMonth = result.schedule[result.schedule.length - 1];
    expect(lastMonth.balance).toBe(0);
    
    // Check that we injected multiple times
    // (Roughly 1000/month means ~50k injected, loan is 100k, so it should be significant)
    expect(result.totalInjected).toBeGreaterThan(40000);
  });

  it('handles injection larger than remaining balance', () => {
    // Loan of 100k
    // Inject 200k at month 12
    const result = calculateAmortizationWithInjection({
      ...baseParams,
      injectionAmount: 200000,
      injectionMonth: 12,
      injectionFrequency: 'once',
      injectionCount: null,
      strategy: 'reduceTerm'
    });

    // Should finish exactly at month 12
    expect(result.schedule.length).toBe(12);
    expect(result.schedule[11].balance).toBe(0);
    
    // Total injected should be capped roughly around the balance at that time (~90k-ish)
    // Not 200k.
    expect(result.totalInjected).toBeLessThan(100000); // Balance after 1 year is < 100k
    expect(result.totalInjected).toBeGreaterThan(90000);
  });
  
  it('handles "Reduce Installment" with infinite injections correctly (decreasing payment)', () => {
     // Inject small amount monthly, reduce installment
     const result = calculateAmortizationWithInjection({
      ...baseParams,
      injectionAmount: 500,
      injectionMonth: 1,
      injectionFrequency: 'monthly',
      injectionCount: null,
      strategy: 'reduceInstallment'
    });
    
    // The term should remain roughly 10 years (120 months) because we are reducing installment
    // However, if installment drops to 0 or we pay off everything, it might shorten slightly
    // But primarily it should keep the term.
    
    // Actually, if we inject 500/month on top of regular payment, we are paying Principal + Interest + 500.
    // If strategy is reduceInstallment, we recalculate payment to fit the REMAINING term.
    // So the NEW payment + 500 will equal the required amount to pay off in remaining time?
    // No, we pay 500 EXTRA.
    // Balance drops -> New Payment calculated for remaining term is LOWER.
    // So next month payment is lower.
    // But we add 500 again.
    
    // Check that payment decreases over time
    const firstPayment = result.schedule[0].installment;
    const midPayment = result.schedule[50].installment;
    const lastPayment = result.schedule[result.schedule.length - 1].installment;
    
    expect(midPayment).toBeLessThan(firstPayment);
    expect(lastPayment).toBeLessThan(midPayment);
    
    // Compare with reduceTerm for the same scenario
    const resultTerm = calculateAmortizationWithInjection({
      ...baseParams,
      injectionAmount: 500,
      injectionMonth: 1,
      injectionFrequency: 'monthly',
      injectionCount: null,
      strategy: 'reduceTerm'
    });

    // Reduce Installment should keep the loan open much longer than Reduce Term
    expect(result.schedule.length).toBeGreaterThan(resultTerm.schedule.length);
    
    // It should be close to the original 120 months (e.g. > 100)
    expect(result.schedule.length).toBeGreaterThan(100);
  });
});
