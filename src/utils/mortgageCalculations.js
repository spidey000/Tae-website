export const calculateMonthlyPayment = (principal, annualTIN, years) => {
  if (principal <= 0 || years <= 0) return 0;
  if (annualTIN === 0) return principal / (years * 12);

  const monthlyRate = annualTIN / 100 / 12;
  const numberOfPayments = years * 12;

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

export const calculateTAE = (netPrincipal, monthlyOutflow, years) => {
  if (netPrincipal <= 0 || monthlyOutflow <= 0 || years <= 0) return 0;

  const numberOfPayments = years * 12;
  let guess = 0.01; // Initial guess for monthly rate
  const maxIterations = 100;
  const precision = 0.000001;

  for (let i = 0; i < maxIterations; i++) {
    // f(r) = NetPrincipal - MonthlyOutflow * ((1 - (1+r)^-n) / r)
    // Using annuity formula: PV = PMT * ((1 - (1+i)^-n) / i)
    
    // Check if guess is too close to 0 to avoid division by zero
    if (Math.abs(guess) < 1e-9) {
        // If rate is effectively 0, PV = PMT * n
        const diff = netPrincipal - (monthlyOutflow * numberOfPayments);
        if (Math.abs(diff) < precision) return 0;
        guess = 0.00001; // bump it
        continue;
    }

    const factor = Math.pow(1 + guess, -numberOfPayments);
    const pvOfPayments = monthlyOutflow * ((1 - factor) / guess);
    const f = netPrincipal - pvOfPayments;

    if (Math.abs(f) < precision) {
      // Annualize the monthly rate to get TAE
      return (Math.pow(1 + guess, 12) - 1) * 100;
    }

    // Derivative f'(r)
    // f(r) = K - M * ( (1 - (1+r)^-n)/r )
    // Let A(r) = (1 - (1+r)^-n)/r
    // A'(r) = (r * ( -(-n)(1+r)^(-n-1) ) - (1 - (1+r)^-n) * 1) / r^2
    //       = ( n*r*(1+r)^(-n-1) - 1 + (1+r)^-n ) / r^2
    
    const term1 = numberOfPayments * guess * Math.pow(1 + guess, -numberOfPayments - 1);
    const term2 = -1 + factor;
    const derivativeOfAnnuity = (term1 + term2) / (guess * guess);
    
    const df = -monthlyOutflow * derivativeOfAnnuity;

    if (Math.abs(df) < 1e-9) break; // Avoid zero division

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
  const monthlyPayment = calculateMonthlyPayment(principal, annualTIN, years);
  
  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= numberOfPayments; month++) {
    const interest = balance * monthlyRate;
    const amortization = monthlyPayment - interest;
    balance -= amortization;
    
    // Handle precision issues at the very end
    if (month === numberOfPayments && Math.abs(balance) < 1) {
        balance = 0;
    }

    schedule.push({
      month,
      payment: monthlyPayment,
      interest,
      amortization,
      balance: balance < 0 ? 0 : balance
    });
  }
  
  return schedule;
};
