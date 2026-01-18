export const roundInternal = (value) => {
  if (typeof value !== 'number') return 0;
  return Math.round(value * 1e12) / 1e12;
};

export const roundToMoney = (value) => {
  return Math.sign(value) * Math.round(Math.abs(value) * 100) / 100;
};

export const calculateMonthlyPayment = (principal, annualTIN, years) => {
  if (isNaN(principal) || isNaN(annualTIN) || isNaN(years)) return 0;
  if (principal <= 0 || years <= 0) return 0;
  if (annualTIN === 0) return roundInternal(principal / (years * 12));

  const monthlyRate = annualTIN / 100 / 12;
  const numberOfPayments = years * 12;

  const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
  return roundInternal(payment);
};

export const calculateTAE = (netPrincipal, monthlyOutflow, years) => {
  if (isNaN(netPrincipal) || isNaN(monthlyOutflow) || isNaN(years)) return 0;
  if (netPrincipal <= 0 || monthlyOutflow <= 0 || years <= 0) return 0;
  
  const totalPaid = monthlyOutflow * years * 12;
  if (Math.abs(totalPaid - netPrincipal) < 1e-10) return 0;

  const numberOfPayments = years * 12;
  let guess = 0.01;
  const maxIterations = 100; 
  const precision = 1e-12;

  for (let i = 0; i < maxIterations; i++) {
    if (Math.abs(guess) < 1e-12) {
       guess = 1e-12;
       continue;
    }

    const factor = Math.pow(1 + guess, -numberOfPayments);
    const pvOfPayments = monthlyOutflow * ((1 - factor) / guess);
    const f = netPrincipal - pvOfPayments;

    if (Math.abs(f) < precision) {
      return roundInternal((Math.pow(1 + guess, 12) - 1) * 100);
    }

    const term1 = numberOfPayments * guess * Math.pow(1 + guess, -numberOfPayments - 1);
    const term2 = -1 + factor;
    const derivativeOfAnnuity = (term1 + term2) / (guess * guess);
    const df = -monthlyOutflow * derivativeOfAnnuity;

    if (Math.abs(df) < 1e-15) break; 

    const newGuess = guess - f / df;
    
    if (newGuess <= -1) guess = guess / 2;
    else guess = newGuess;
  }

  return roundInternal((Math.pow(1 + guess, 12) - 1) * 100);
};

export const generateAmortizationSchedule = (principal, annualTIN, years) => {
  if (isNaN(principal) || isNaN(annualTIN) || isNaN(years)) return [];
  if (principal <= 0 || years <= 0) return [];
  
  const monthlyRate = annualTIN / 100 / 12;
  const numberOfPayments = years * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualTIN, years);
  
  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= numberOfPayments; month++) {
    const interest = roundInternal(balance * monthlyRate);
    let amortization = roundInternal(monthlyPayment - interest);
    
    if (month === numberOfPayments) {
        amortization = balance;
    }
    
    balance = roundInternal(balance - amortization);
    
    if (Math.abs(balance) < 1e-10) balance = 0;

    schedule.push({
      month,
      payment: roundInternal(interest + amortization), 
      interest,
      amortization,
      balance: balance
    });
  }
  
  return schedule;
};
