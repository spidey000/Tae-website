import { calculateAmortizationWithInjection, calculateInvestmentReturn } from './src/utils/amortizationEngine.js';

const baseData = {
  principal: 200000,
  years: 25,
  annualTIN: 3.5
};

const baseResult = calculateAmortizationWithInjection({ ...baseData, injectionAmount: 0 });

const scenTerm = calculateAmortizationWithInjection({
  ...baseData,
  injectionAmount: 10000,
  injectionMonth: 12,
  strategy: 'reduceTerm'
});

const scenInstallment = calculateAmortizationWithInjection({
  ...baseData,
  injectionAmount: 10000,
  injectionMonth: 12,
  strategy: 'reduceInstallment'
});

const returnTerm = calculateInvestmentReturn(baseResult.schedule, scenTerm.schedule);
const returnInstallment = calculateInvestmentReturn(baseResult.schedule, scenInstallment.schedule);

console.log('--- Verification ---');
console.log('Base Total Interest:', baseResult.totalInterest);
console.log('Term Strategy Savings:', scenTerm.totalSavings);
console.log('Installment Strategy Savings:', scenInstallment.totalSavings);
console.log('Return (Term) TAE:', returnTerm);
console.log('Return (Installment) TAE:', returnInstallment);
