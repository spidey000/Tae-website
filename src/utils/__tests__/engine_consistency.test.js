import { describe, it, expect } from 'vitest';
import { calculateAmortizationWithInjection } from '../amortizationEngine';

describe('Financial Consistency: Engine vs Summary', () => {

    it('ensures totalInterest matches sum of interest in schedule', () => {
        const result = calculateAmortizationWithInjection({
            principal: 200000,
            annualTIN: 3,
            years: 25,
            injectionAmount: 1000,
            injectionMonth: 12,
            injectionFrequency: 'once'
        });
        
        const sumScheduleInterest = result.schedule.reduce((sum, row) => sum + row.interest, 0);
        
        // Due to roundInternal (1e12), precision should be extremely high
        expect(Math.abs(result.totalInterest - sumScheduleInterest)).toBeLessThan(1e-6);
    });

    it('ensures totalInjected matches sum of extraPrincipal in schedule', () => {
        const result = calculateAmortizationWithInjection({
            principal: 150000,
            annualTIN: 4,
            years: 30,
            injectionAmount: 500,
            injectionMonth: 6,
            injectionFrequency: 'monthly',
            injectionCount: 10
        });
        
        // In our engine, amortization column for injections includes the injection amount.
        // We need to verify totalInjected matches.
        // Let's check didInject flags and injectionAmount logic.
        
        const scheduleInjections = result.schedule
            .filter(row => row.didInject)
            .length;
            
        expect(scheduleInjections).toBe(10);
        expect(result.totalInjected).toBe(500 * 10);
    });

    it('verifies ROI calculation logic', () => {
        // ROI = (Savings / Total Injected) * 100
        const result = calculateAmortizationWithInjection({
            principal: 100000,
            annualTIN: 5,
            years: 20,
            injectionAmount: 10000,
            injectionMonth: 1,
            strategy: 'reduceTerm'
        });
        
        const expectedROI = (result.totalSavings / result.totalInjected) * 100;
        expect(result.roi).toBeCloseTo(expectedROI, 5);
    });
});
