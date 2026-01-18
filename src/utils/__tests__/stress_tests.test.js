import { describe, it, expect } from 'vitest';
import { generateAmortizationSchedule, calculateMonthlyPayment, roundToMoney } from '../mortgageCalculations';
import { calculateAmortizationWithInjection } from '../amortizationEngine';

describe('Financial Stress Tests', () => {

    describe('Long Term Loans (Max practical terms)', () => {
        it('handles a 40-year mortgage (480 months) without failing', () => {
            const principal = 500000;
            const annualTIN = 4.5;
            const years = 40;
            
            const schedule = generateAmortizationSchedule(principal, annualTIN, years);
            
            expect(schedule.length).toBe(480);
            expect(schedule[479].balance).toBe(0);
            
            const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0);
            expect(totalPaid).toBeGreaterThan(principal);
        });

        it('handles an extreme 100-year term in injection engine', () => {
            const result = calculateAmortizationWithInjection({
                principal: 100000,
                annualTIN: 2,
                years: 100, // 1200 months (MAX_MONTHS in code)
                injectionAmount: 0
            });
            
            expect(result.schedule.length).toBeLessThanOrEqual(1200);
            expect(result.schedule[result.schedule.length - 1].balance).toBeLessThan(0.01);
        });
    });

    describe('Extreme Interest Rates', () => {
        it('handles 0.01% interest rate (near zero)', () => {
            const principal = 100000;
            const annualTIN = 0.01;
            const years = 20;
            
            const payment = calculateMonthlyPayment(principal, annualTIN, years);
            expect(payment).toBeGreaterThan(principal / (20 * 12));
            
            const schedule = generateAmortizationSchedule(principal, annualTIN, years);
            expect(schedule[239].balance).toBe(0);
        });

        it('handles 25% interest rate (credit card level)', () => {
            const principal = 5000;
            const annualTIN = 25;
            const years = 2;
            
            const schedule = generateAmortizationSchedule(principal, annualTIN, years);
            expect(schedule.length).toBe(24);
            expect(schedule[23].balance).toBe(0);
        });
    });

    describe('Boundary Rounding Cases', () => {
        it('handles the .005 rounding edge case (Financial Rounding)', () => {
            const value = 1.005;
            const rounded = roundToMoney(value);
            expect(rounded).toBe(1.01);
            
            const value2 = 1.0049;
            const rounded2 = roundToMoney(value2);
            expect(rounded2).toBe(1.00);
        });
    });
});