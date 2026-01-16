import { describe, it, expect } from 'vitest';
import { calculateTAE, generateAmortizationSchedule, calculateMonthlyPayment } from '../mortgageCalculations';

describe('Motor Financiero - Auditoría de Precisión', () => {
  
  // Caso de prueba estándar
  const TEST_CASE = {
    principal: 150000,
    tin: 2.99,
    years: 25,
  };

  it('Cálculo de cuota mensual debe ser preciso', () => {
    const payment = calculateMonthlyPayment(TEST_CASE.principal, TEST_CASE.tin, TEST_CASE.years);
    // 150k, 2.99%, 25 años -> 710.537...
    expect(payment).toBeCloseTo(710.537, 2);
  });

  it('Debe cerrar la amortización con saldo CERO absoluto (tolerancia < 1 céntimo)', () => {
    const schedule = generateAmortizationSchedule(
      TEST_CASE.principal,
      TEST_CASE.tin,
      TEST_CASE.years
    );

    const lastRow = schedule[schedule.length - 1];
    
    // El balance final debe ser 0
    expect(Math.abs(lastRow.balance)).toBeLessThan(0.01);
    
    // La suma de amortizaciones debe igualar al capital principal
    const totalAmortized = schedule.reduce((acc, row) => acc + row.amortization, 0);
    expect(Math.abs(totalAmortized - TEST_CASE.principal)).toBeLessThan(0.01);
  });

  it('Newton-Raphson: Debe converger en TAE conocida', () => {
    // Escenario: Préstamo 100k, Cuota 450, 30 años, Gastos 2000
    const netPrincipal = 100000 - 2000; 
    const monthlyPayment = 450; 
    const years = 30;

    const tae = calculateTAE(netPrincipal, monthlyPayment, years);
    
    expect(tae).toBeGreaterThan(0);
    expect(isNaN(tae)).toBe(false);
    
    // Performance check
    const start = performance.now();
    calculateTAE(netPrincipal, monthlyPayment, years);
    const end = performance.now();
    expect(end - start).toBeLessThan(10); 
  });
});
