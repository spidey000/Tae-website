import { describe, it, expect } from 'vitest';
import { 
  calculateMonthlyPayment, 
  generateAmortizationSchedule, 
  calculateTAE,
  roundInternal 
} from '../mortgageCalculations';
import { calculateAmortizationWithInjection } from '../amortizationEngine';

/**
 * MATH AUDIT - REFERENCE FORMULAS
 * These are "Golden Source" implementations using standard financial formulas
 * to verify the application's logic.
 */

// Standard French Amortization Formula
// P = Principal, r = monthly rate, n = total months
const referencePMT = (P, r, n) => {
    if (r === 0) return P / n;
    return P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

describe('Math Audit: Theoretical Formulas vs Implementation', () => {

    describe('Monthly Payment Calculation (PMT)', () => {
        it('matches standard formula for standard cases', () => {
            const principal = 200000;
            const annualTIN = 3.5; // 3.5%
            const years = 25;
            
            const r = annualTIN / 100 / 12;
            const n = years * 12;
            
            const expected = referencePMT(principal, r, n);
            const actual = calculateMonthlyPayment(principal, annualTIN, years);
            
            // Allow precision difference of 1e-10
            expect(Math.abs(actual - expected)).toBeLessThan(1e-10);
        });

        it('handles zero interest correctly', () => {
             const principal = 120000;
             const annualTIN = 0;
             const years = 10;
             
             const expected = 120000 / (10 * 12); // 1000
             const actual = calculateMonthlyPayment(principal, annualTIN, years);
             
             expect(actual).toBe(expected);
        });
    });

    describe('Amortization Schedule Integrity', () => {
        it('ensures balance reaches exactly zero at end of term', () => {
            const principal = 150000;
            const annualTIN = 2.85;
            const years = 30;
            
            const schedule = generateAmortizationSchedule(principal, annualTIN, years);
            const lastRow = schedule[schedule.length - 1];
            
            // The logic forces balance to 0 in the last step, but let's check the step before.
            // Actually, we want to ensure the cumulative calculation is correct.
            // Sum of Principal parts should equal Initial Principal.
            
            const totalPrincipalPaid = schedule.reduce((sum, row) => sum + row.amortization, 0);
            
            // roundInternal used in app is 1e12
            expect(Math.abs(totalPrincipalPaid - principal)).toBeLessThan(0.01);
            expect(lastRow.balance).toBe(0);
        });

        it('checks for Drift (Accumulated Error) vs Bank Style (2 decimals)', () => {
            // This test highlights the difference between "Theoretical" (App) and "Bank" (2 decimals)
            // It is not necessarily a "fail" if they differ, but an observation.
            
            const principal = 100000;
            const annualTIN = 5;
            const years = 20;
            
            // App Calculation
            const appPayment = calculateMonthlyPayment(principal, annualTIN, years);
            // Expected: 659.9557...
            
            // Bank Calculation (Standard practice: round PMT to 2 decimals)
            const bankPayment = Math.round(appPayment * 100) / 100;
            // Expected: 660.00 or 659.96
            
            // Calculate discrepancy over 20 years (240 months)
            const totalDiff = (appPayment - bankPayment) * 240;
            
            console.log(`[Audit] Payment Precision Drift:
            App Payment (12 dec): ${appPayment}
            Bank Payment (2 dec): ${bankPayment}
            Total Difference over Term: ${totalDiff.toFixed(4)} EUR`);
            
            // If the app is using high precision, the schedule is "more correct" mathematically
            // but might differ from a user's bank receipt. 
            // We just verify the App is consistent with ITSELF.
            
            const schedule = generateAmortizationSchedule(principal, annualTIN, years);
            const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
            const totalAmortization = schedule.reduce((sum, row) => sum + row.amortization, 0);
            const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0);
            
            // Accounting Identity: Total Paid = Principal + Interest
            const diff = totalPaid - (totalAmortization + totalInterest);
            expect(Math.abs(diff)).toBeLessThan(0.01);
        });
    });

    describe('TAE Calculation', () => {
        it('matches standard TAE formula for simple mortgage (No commissions)', () => {
            // For a loan with 0 costs, TAE should roughly equal (1 + r_monthly)^12 - 1
            const annualTIN = 4; // 4%
            const r = annualTIN / 100 / 12;
            const expectedTAE = (Math.pow(1 + r, 12) - 1) * 100;
            
            // We simulate a loan to get the cashflows implicitly
            // calculateTAE(netPrincipal, monthlyOutflow, years)
            
            // Note: calculateTAE in the app takes "netPrincipal". 
            // If no fees, netPrincipal = Principal.
            const principal = 100000;
            const years = 20;
            const monthlyPayment = calculateMonthlyPayment(principal, annualTIN, years);
            
            const actualTAE = calculateTAE(principal, monthlyPayment, years);
            
            // Precision might vary due to Newton-Raphson vs Analytical
            expect(Math.abs(actualTAE - expectedTAE)).toBeLessThan(1e-4);
        });
    });

    describe('Amortization Engine (Injections)', () => {
        it('correctly handles simple capital reduction (Strategy: Reduce Term)', () => {
            // Scenario: 100k, 10 years, 5%. 
            // Month 12: Inject 10k. 
            // Expectation: Balance drops by 10k immediately. Interest next month decreases.
            
            const principal = 100000;
            const annualTIN = 5;
            const years = 10;
            
            const result = calculateAmortizationWithInjection({
                principal,
                annualTIN,
                years,
                injectionAmount: 10000,
                injectionMonth: 12,
                injectionFrequency: 'once',
                strategy: 'reduceTerm'
            });
            
            const month11 = result.schedule[10]; // Index 10 is Month 11
            const month12 = result.schedule[11]; // Index 11 is Month 12
            
            // Check balance drop
            // Month 12 Balance = (Month 11 Balance - Amortization12 - Injection)
            // But the logic in engine might apply injection differently.
            // Let's verify the logic:
            // "if (shouldInject) extraPrincipal = injectionAmount"
            // "currentBalance = roundInternal(currentBalance - extraPrincipal)"
            
            const expectedBalanceApprox = month11.balance - month12.amortization - 10000; // Rough check (amortization includes regular)
            // Wait, month12.amortization in the object INCLUDES the extraPrincipal?
            // Code: amortization = roundInternal(amortization + extraPrincipal)
            
            // So Month 12 Balance should be Month 11 Balance - Month 12 Amortization (total)
            // Let's verify the accounting identity for Month 12
            
            const calculatedBalance = roundInternal(month11.balance - month12.amortization);
            // Note: month12.amortization = regularAmort + 10000
            
            // Because floating point, allow tiny epsilon
            expect(Math.abs(month12.balance - calculatedBalance)).toBeLessThan(0.01);
            
            // Check that injection is recorded
            expect(month12.didInject).toBe(true);
            expect(result.totalInjected).toBe(10000);
        });
    });
});
