import { calculateMonthlyPayment, roundInternal } from './mortgageCalculations';
import { calculateIRR } from './financialCalculations';

/**
 * Calculates the Annualized Return (TAE) of the injection by comparing
 * the cash flows of the base scenario vs. the injection scenario.
 * 
 * @param {Array} baseSchedule - The full schedule of the base loan (no injection).
 * @param {Array} scenarioSchedule - The full schedule of the scenario (with injection).
 * @returns {number} The annualized return percentage (TAE).
 */
export const calculateInvestmentReturn = (baseSchedule, scenarioSchedule) => {
    if (!baseSchedule || !scenarioSchedule || baseSchedule.length === 0 || scenarioSchedule.length === 0) {
        return 0;
    }

    const cashFlows = [];
    const maxMonth = Math.max(baseSchedule.length, scenarioSchedule.length);

    // 1. Identify Injection Cash Flows (Negative)
    // We assume the injection is the difference in payment when payment > installment?
    // Or better: rely on the 'payment' field difference?
    // Warning: 'payment' field in scenario includes the injection amount.
    // 'payment' field in base is just the regular payment.
    // Difference = Base - Scenario.
    // If Scenario has injection of 10k: Payment is (Regular + 10k).
    // Difference = Regular - (Regular + 10k) = -10k. (Investment/Outflow).
    // Later months:
    // Base: 500. Scenario: 400.
    // Difference = 500 - 400 = +100. (Return/Inflow).
    // Base: 500. Scenario: 0 (Finished).
    // Difference = 500 - 0 = +500. (Return/Inflow).

    for (let i = 0; i < maxMonth; i++) {
        const baseItem = baseSchedule[i];
        const scenItem = scenarioSchedule[i];

        const basePayment = baseItem ? baseItem.payment : 0;
        const scenPayment = scenItem ? scenItem.payment : 0;

        const diff = basePayment - scenPayment;

        if (Math.abs(diff) > 0.01) {
            cashFlows.push({
                month: i + 1, // Month 1 is the first payment
                amount: diff
            });
        }
    }

    // If no cash flows (identical schedules), return 0
    if (cashFlows.length === 0) return 0;

    // Calculate IRR
    return calculateIRR(cashFlows);
};

export const calculateAmortizationWithInjection = ({
  principal,
  annualTIN,
  years,
  injectionAmount = 0,
  injectionMonth = 0,
  injectionFrequency = 'once', // 'once', 'monthly', 'yearly'
  injectionCount = null, // number or null
  strategy = 'reduceTerm',
  investReturnRate = 0,
  investMode = false
}) => {
  const scenario = { injectionAmount, injectionMonth, injectionFrequency, injectionCount, strategy };
  // 1. Initial Setup
  const monthlyRate = annualTIN / 100 / 12;
  const investmentMonthlyRate = investMode ? (investReturnRate / 100 / 12) : 0;
  const totalMonths = years * 12;
  let currentBalance = principal;
  let currentPayment = calculateMonthlyPayment(principal, annualTIN, years);
  
  const schedule = [];
  let totalInterest = 0;
  let totalInjected = 0;
  let totalInvestmentFV = 0;
  
  const baseMonthlyPayment = calculateMonthlyPayment(principal, annualTIN, years);
  const baseTotalInterest = roundInternal((baseMonthlyPayment * totalMonths) - principal);

  // 2. Simulation Loop
  const MAX_MONTHS = 1200; 
  let month = 1;

  while (currentBalance > 0 && month <= MAX_MONTHS) {
    // A. Interest for this month
    const interest = roundInternal(currentBalance * monthlyRate);
    
    // B. Handle Injection Logic
    let extraPrincipal = 0;
    let didInject = false;
    let shouldInject = false;

    if (month >= injectionMonth) {
      if (scenario.injectionFrequency === 'monthly') {
        shouldInject = true;
      } else if (scenario.injectionFrequency === 'yearly') {
        if ((month - injectionMonth) % 12 === 0) {
          shouldInject = true;
        }
      } else {
        if (month === injectionMonth) {
          shouldInject = true;
        }
      }

      if (shouldInject && scenario.injectionCount && scenario.injectionCount > 0) {
        let injectionsSoFar = 0;
        if (scenario.injectionFrequency === 'monthly') {
            injectionsSoFar = (month - injectionMonth) + 1;
        } else if (scenario.injectionFrequency === 'yearly') {
            injectionsSoFar = ((month - injectionMonth) / 12) + 1;
        } else {
            injectionsSoFar = 1;
        }

        if (injectionsSoFar > scenario.injectionCount) {
            shouldInject = false;
        }
      }
    }

    if (shouldInject && injectionAmount > 0) {
      extraPrincipal = injectionAmount;
      didInject = true;
    }

    let paymentForThisMonth = currentPayment;
    let amortization = roundInternal(paymentForThisMonth - interest);

    if (currentBalance + interest < currentPayment) {
       paymentForThisMonth = roundInternal(currentBalance + interest);
       amortization = currentBalance;
    }

    currentBalance = roundInternal(currentBalance - amortization);
    totalInterest = roundInternal(totalInterest + interest);
    
    if (extraPrincipal > 0) {
      if (extraPrincipal > currentBalance) {
        extraPrincipal = currentBalance;
      }
      currentBalance = roundInternal(currentBalance - extraPrincipal);
      totalInjected = roundInternal(totalInjected + extraPrincipal);

      // Investment Calculation (Opportunity Cost)
      // We calculate what this extraPrincipal would have earned if invested
      // until the end of the original loan term.
      if (investMode) {
         const monthsToGrow = Math.max(0, totalMonths - month);
         const fv = extraPrincipal * Math.pow(1 + investmentMonthlyRate, monthsToGrow);
         totalInvestmentFV += fv;
      }

      if (currentBalance > 0) {
        if (strategy === 'reduceInstallment') {
           const remainingMonths = totalMonths - month;
           if (remainingMonths > 0) {
             currentPayment = calculateMonthlyPayment(
               currentBalance, 
               annualTIN, 
               remainingMonths / 12
             );
           }
        }
      }
    }
    
    if (currentBalance < 1e-10) currentBalance = 0;

    schedule.push({
      month,
      payment: roundInternal(paymentForThisMonth + extraPrincipal),
      installment: paymentForThisMonth,
      interest,
      amortization: roundInternal(amortization + extraPrincipal),
      balance: currentBalance,
      didInject
    });

    if (currentBalance <= 0) break;

    month++;
  }

  const totalSavings = totalInjected > 0 ? Math.max(0, roundInternal(baseTotalInterest - totalInterest)) : 0;
  const roi = totalInjected > 0 ? roundInternal((totalSavings / totalInjected) * 100) : 0;
  const investmentProfit = investMode ? Math.max(0, roundInternal(totalInvestmentFV - totalInjected)) : 0;

  const finalMonths = schedule.length;
  const initialMonthlyPayment = calculateMonthlyPayment(principal, annualTIN, years);

  // Calculate TAE (IRR)
  const cashFlows = [{ amount: principal, month: 0 }];
  schedule.forEach(item => {
    cashFlows.push({ amount: -item.payment, month: item.month });
  });
  const tae = calculateIRR(cashFlows);

  return {
    schedule,
    totalInterest,
    totalSavings,
    totalInjected,
    roi,
    tae,
    newTerm: `${Math.floor(finalMonths / 12)}y ${finalMonths % 12}m`,
    initialMonthlyPayment,
    finalMonthlyPayment: currentPayment,
    finalMonths,
    investmentProfit,
    investMode
  };
};

export const mergeSchedules = (baseSchedule, scenariosSchedules = []) => {
  const maxLength = Math.max(
    baseSchedule?.length || 0,
    ...scenariosSchedules.map(s => s?.length || 0)
  );

  const merged = [];
  
  for (let i = 0; i < maxLength; i++) {
    const baseItem = baseSchedule?.[i];
    
    const entry = {
      month: i + 1,
      base: baseItem ? baseItem.balance : 0
    };

    scenariosSchedules.forEach((sched, idx) => {
      const item = sched?.[i];
      entry[`scen${idx}`] = item ? item.balance : 0;
      // Also include payment if we want to chart it
      entry[`scen${idx}Payment`] = item ? item.payment : 0;
      entry[`scen${idx}Installment`] = item ? item.installment : 0;
    });

    // Also include base payment
    entry.basePayment = baseItem ? baseItem.payment : 0;
    entry.baseInstallment = baseItem ? baseItem.installment : 0;

    merged.push(entry);
  }

  return merged;
};