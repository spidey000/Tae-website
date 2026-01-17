import { calculateMonthlyPayment, roundToMoney } from './mortgageCalculations';

export const calculateAmortizationWithInjection = ({
  principal,
  annualTIN,
  years,
  injectionAmount = 0,
  injectionMonth = 0, // 1-based index, e.g., Month 12
  strategy = 'reduceTerm' // 'reduceTerm' or 'reduceInstallment'
}) => {
  // 1. Initial Setup
  const monthlyRate = annualTIN / 100 / 12;
  const totalMonths = years * 12;
  let currentBalance = principal;
  let currentPayment = calculateMonthlyPayment(principal, annualTIN, years);
  
  const schedule = [];
  let totalInterest = 0;
  
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
    
    // B. Handle Injection BEFORE amortization? Or AFTER?
    // Usually "Capital Injection" is an extra payment. 
    // Logic: 
    // 1. Pay normal monthly installment (Interest + Principal).
    // 2. IF injection month, pay EXTRA principal.
    // 3. Recalculate future if needed.
    
    // However, some prefer: "At month X, I put 10k".
    // Does that replace the monthly payment? No, it's usually on top.
    
    let extraPrincipal = 0;
    let didInject = false;

    if (month === injectionMonth && injectionAmount > 0) {
      extraPrincipal = injectionAmount;
      didInject = true;
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

  const totalSavings = injectionAmount > 0 ? Math.max(0, baseTotalInterest - totalInterest) : 0;
  const roi = injectionAmount > 0 ? (totalSavings / injectionAmount) * 100 : 0;
  
  // Format new term
  const finalMonths = schedule.length;
  const yearsSaved = Math.floor((totalMonths - finalMonths) / 12);
  const monthsSaved = (totalMonths - finalMonths) % 12;

  return {
    schedule,
    totalInterest,
    totalSavings,
    roi,
    newTerm: `${Math.floor(finalMonths / 12)}y ${finalMonths % 12}m`
  };
};

export const mergeSchedules = (baseSchedule, scenASchedule, scenBSchedule) => {
  const maxLength = Math.max(
    baseSchedule?.length || 0,
    scenASchedule?.length || 0,
    scenBSchedule?.length || 0
  );

  const merged = [];
  
  for (let i = 0; i < maxLength; i++) {
    // Schedules are 0-indexed arrays, but represent Month 1, 2, 3...
    // If schedule[i] exists, use its balance. Else 0.
    
    // Safety check: sometimes schedules might start at month 0? 
    // My engine starts at month 1, so index 0 is month 1. Correct.
    
    const baseItem = baseSchedule?.[i];
    const scenAItem = scenASchedule?.[i];
    const scenBItem = scenBSchedule?.[i];

    merged.push({
      month: i + 1,
      base: baseItem ? baseItem.balance : 0,
      scenA: scenAItem ? scenAItem.balance : 0,
      scenB: scenBItem ? scenBItem.balance : 0
    });
  }

  return merged;
};
