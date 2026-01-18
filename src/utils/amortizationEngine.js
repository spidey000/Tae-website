import { calculateMonthlyPayment, roundInternal } from './mortgageCalculations';
import { calculateIRR } from './financialCalculations';

export const calculateAmortizationWithInjection = ({
  principal,
  annualTIN,
  years,
  injectionAmount = 0,
  injectionMonth = 0,
  injectionFrequency = 'once', // 'once', 'monthly', 'yearly'
  injectionCount = null, // number or null
  strategy = 'reduceTerm'
}) => {
  const scenario = { injectionAmount, injectionMonth, injectionFrequency, injectionCount, strategy };
  // 1. Initial Setup
  const monthlyRate = annualTIN / 100 / 12;
  const totalMonths = years * 12;
  let currentBalance = principal;
  let currentPayment = calculateMonthlyPayment(principal, annualTIN, years);
  
  const schedule = [];
  let totalInterest = 0;
  let totalInjected = 0;
  
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
    finalMonths 
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
