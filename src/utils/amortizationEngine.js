import { calculateMonthlyPayment, roundToMoney } from './mortgageCalculations';

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
  
  // Base Scenario Calculation (to compare savings)
  // We can approximate this or run a shadow simulation.
  // For simplicity/performance, let's run a quick calculation of total interest for base case
  // Or better, let the caller handle the comparison by calling this function twice (once with 0 injection).
  // BUT the requirements say this function returns "Total Savings".
  // So we SHOULD calculate base interest internally or derive it.
  // Let's calculate base total interest quickly.
  const baseMonthlyPayment = calculateMonthlyPayment(principal, annualTIN, years);
  const baseTotalInterest = (baseMonthlyPayment * totalMonths) - principal;

  // 2. Simulation Loop
  // We loop until balance is 0 or we hit a safety limit (e.g. 100 years)
  const MAX_MONTHS = 1200; 
  let month = 1;

  while (currentBalance > 0 && month <= MAX_MONTHS) {
    // A. Interest for this month
    const interestRaw = currentBalance * monthlyRate;
    const interest = roundToMoney(interestRaw);
    
    // B. Handle Injection Logic
    let extraPrincipal = 0;
    let didInject = false;
    let shouldInject = false;

    // Check if within start period
    if (month >= injectionMonth) {
      // Logic based on frequency
      if (scenario.injectionFrequency === 'monthly') {
        shouldInject = true;
      } else if (scenario.injectionFrequency === 'yearly') {
        // Inject if it's the start month OR exactly N years after
        if ((month - injectionMonth) % 12 === 0) {
          shouldInject = true;
        }
      } else {
        // Default: 'once' (Puntual)
        if (month === injectionMonth) {
          shouldInject = true;
        }
      }

      // Check max occurrences (count) if specified
      if (shouldInject && scenario.injectionCount && scenario.injectionCount > 0) {
        // Calculate how many times we have injected so far
        // For monthly: (month - start) + 1
        // For yearly: ((month - start) / 12) + 1
        // For once: 1
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
      totalInjected += extraPrincipal;
    }

    // C. Standard Payment Logic
    // If reduceTerm: payment stays same (unless balance is low)
    // If reduceInstallment: payment might have changed in previous step
    
    // Cap payment to balance + interest
    let paymentForThisMonth = currentPayment;
    let amortization = paymentForThisMonth - interest;

    // Check if we are overpaying
    if (currentBalance + interest < currentPayment) {
       paymentForThisMonth = currentBalance + interest;
       amortization = currentBalance;
    }

    // D. Apply Monthly Payment
    currentBalance -= amortization;
    totalInterest += interest;
    
    // E. Apply Extra Injection (if any)
    if (extraPrincipal > 0) {
      // If injection > balance, we just pay off the rest
      if (extraPrincipal > currentBalance) {
        extraPrincipal = currentBalance;
      }
      currentBalance -= extraPrincipal;
      
      // F. Recalculation Trigger
      if (currentBalance > 0) {
        if (strategy === 'reduceInstallment') {
           // Keep term constant (totalMonths), so remaining is totalMonths - month
           const remainingMonths = totalMonths - month;
           if (remainingMonths > 0) {
             // We use the NEW balance to calculate NEW payment for REMAINING time
             // Note: calculateMonthlyPayment expects "Years".
             currentPayment = calculateMonthlyPayment(
               currentBalance, 
               annualTIN, 
               remainingMonths / 12
             );
           }
        }
        // If strategy === 'reduceTerm', we simply do nothing. 
        // We keep paying 'currentPayment' (which was set at start).
        // The loop will just end earlier naturally because balance drops faster.
      }
    }
    
    // Safety clamp
    if (currentBalance < 0.01) currentBalance = 0;

    schedule.push({
      month,
      payment: paymentForThisMonth + extraPrincipal,
      interest,
      amortization: amortization + extraPrincipal,
      balance: currentBalance,
      didInject
    });

    // Stop if finished
    if (currentBalance <= 0) break;

    month++;
  }

  const totalSavings = totalInjected > 0 ? Math.max(0, baseTotalInterest - totalInterest) : 0;
  const roi = totalInjected > 0 ? (totalSavings / totalInjected) * 100 : 0;
  
  // Format new term
  const finalMonths = schedule.length;
  const yearsSaved = Math.floor((totalMonths - finalMonths) / 12);
  const monthsSaved = (totalMonths - finalMonths) % 12;

  // Initial Monthly Payment (calculated at start)
  const initialMonthlyPayment = calculateMonthlyPayment(principal, annualTIN, years);

  return {
    schedule,
    totalInterest,
    totalSavings,
    totalInjected,
    roi,
    newTerm: `${Math.floor(finalMonths / 12)}y ${finalMonths % 12}m`,
    initialMonthlyPayment,
    finalMonthlyPayment: currentPayment,
    finalMonths // Return raw number for diff calculations
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
    });

    // Also include base payment
    entry.basePayment = baseItem ? baseItem.payment : 0;

    merged.push(entry);
  }

  return merged;
};
