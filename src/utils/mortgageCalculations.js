export const calculateMonthlyPayment = (principal, annualTIN, years) => {
  if (principal <= 0 || years <= 0) return 0;
  if (annualTIN === 0) return principal / (years * 12);

  const monthlyRate = annualTIN / 100 / 12;
  const numberOfPayments = years * 12;

  const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
  return payment;
};

export const calculateTAE = (netPrincipal, monthlyOutflow, years) => {
  if (netPrincipal <= 0 || monthlyOutflow <= 0 || years <= 0) return 0;

  const numberOfPayments = years * 12;
  let guess = 0.01; // Initial guess
  const maxIterations = 50; // Safety guard
  const precision = 0.000001;

  for (let i = 0; i < maxIterations; i++) {
    // Check if guess is too close to 0
    if (Math.abs(guess) < 1e-9) {
       guess = 0.00001;
       continue;
    }

    const factor = Math.pow(1 + guess, -numberOfPayments);
    const pvOfPayments = monthlyOutflow * ((1 - factor) / guess);
    const f = netPrincipal - pvOfPayments;

    if (Math.abs(f) < precision) {
      return (Math.pow(1 + guess, 12) - 1) * 100;
    }

    const term1 = numberOfPayments * guess * Math.pow(1 + guess, -numberOfPayments - 1);
    const term2 = -1 + factor;
    const derivativeOfAnnuity = (term1 + term2) / (guess * guess);
    const df = -monthlyOutflow * derivativeOfAnnuity;

    if (Math.abs(df) < 1e-9) break; 

    const newGuess = guess - f / df;
    
    // Safety check for divergence
    if (newGuess <= -1) guess = guess / 2;
    else guess = newGuess;
  }

  return (Math.pow(1 + guess, 12) - 1) * 100;
};

export const generateAmortizationSchedule = (principal, annualTIN, years) => {
  if (principal <= 0 || years <= 0) return [];
  
  const monthlyRate = annualTIN / 100 / 12;
  const numberOfPayments = years * 12;
  const monthlyPaymentRaw = calculateMonthlyPayment(principal, annualTIN, years);
  
  // Banking standard: Payment is usually rounded to 2 decimals for the transaction, 
  // but internally the schedule might run on raw or rounded values depending on the bank.
  // We will simulate "Real Cash Flow" -> Round payment to 2 decimals.
  // NOTE: This might cause the final payment to differ slightly.
  // Alternatively, we keep raw payment for calculation and round for display.
  // Best hybrid approach for simulators: Keep raw payment for math, round interest/amortization.
  
  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= numberOfPayments; month++) {
    // 1. Calculate Interest part (Bank rounds this to 2 decimals usually)
    const interestRaw = balance * monthlyRate;
    const interest = Math.round(interestRaw * 100) / 100;
    
    // 2. Calculate Amortization part
    let amortization = monthlyPaymentRaw - interest;
    
    // 3. Last month adjustment: You pay exactly what's left
    if (month === numberOfPayments) {
        amortization = balance;
    }
    
    // 4. Update Balance
    // Important: Do not round 'balance' arbitrarily. It is a result of subtraction.
    // However, since we want to avoid 0.0000000004 issues, we can check 
    // precision, but mathematically: PrevBalance - Amortization (which is rounded-ish)
    // should stay consistent.
    
    const previousBalance = balance;
    balance -= amortization;
    
    // Safety clamp for floating point nastiness around 0
    if (balance < 0.01 && balance > -0.01) balance = 0;

    schedule.push({
      month,
      payment: interest + amortization, 
      interest,
      amortization,
      balance: balance
    });
  }
  
  return schedule;
};
