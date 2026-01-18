/**
 * Calculates the Internal Rate of Return (TAE) for a series of cash flows.
 * Uses the Newton-Raphson method to find the monthly rate, then converts to Annual Effective Rate.
 * 
 * @param {Array<{amount: number, month: number}>} cashFlows - Array of cash flow objects.
 * @param {number} guess - Initial guess for the monthly rate (default 0.005, which is ~6% annual).
 * @returns {number} The TAE as a percentage (e.g., 5.12 for 5.12%). Returns 0 if calculation fails or inputs are invalid.
 */
export const calculateIRR = (cashFlows, guess = 0.005) => {
    if (!cashFlows || cashFlows.length === 0) return 0;

    // Check if we have both positive and negative cash flows
    const hasPositive = cashFlows.some(cf => cf.amount > 0);
    const hasNegative = cashFlows.some(cf => cf.amount < 0);
    if (!hasPositive || !hasNegative) return 0;

    let rate = guess;
    const maxIterations = 100;
    const tolerance = 1e-7;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dNpv = 0;

        for (const cf of cashFlows) {
            const { amount, month } = cf;
            const discountFactor = Math.pow(1 + rate, -month);
            
            // NPV += C / (1+r)^m
            npv += amount * discountFactor;
            
            // Derivative dNPV/dr
            // d/dr [ C * (1+r)^-m ] = C * -m * (1+r)^(-m-1)
            // = -m * C * (1+r)^-m / (1+r)
            // = -m * Term / (1+r)
            if (month !== 0) { // Optimization: month 0 derivative is 0 if we consider it constant, but strictly d/dr(C) = 0
               dNpv += -month * amount * Math.pow(1 + rate, -month - 1);
            }
        }

        if (Math.abs(dNpv) < 1e-10) break; // Avoid division by zero (slope too flat)

        const newRate = rate - npv / dNpv;

        if (Math.abs(newRate - rate) < tolerance) {
            rate = newRate;
            break;
        }

        rate = newRate;
    }

    // Convert monthly rate to annual effective rate (TAE)
    // TAE = (1 + monthlyRate)^12 - 1
    const tae = (Math.pow(1 + rate, 12) - 1) * 100;
    
    // Return 0 if result is NaN or infinite (failed convergence)
    if (!isFinite(tae) || isNaN(tae)) return 0;

    return tae;
};
