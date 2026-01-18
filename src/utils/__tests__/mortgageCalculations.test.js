import { describe, it, expect } from 'vitest';
import { calculateTAE, generateAmortizationSchedule, calculateMonthlyPayment, roundToMoney } from '../mortgageCalculations';

describe('Motor Financiero - Auditoría de Precisión', () => {
  
  it('Helper: roundToMoney debe redondear correctamente', () => {
    expect(roundToMoney(10.555)).toBe(10.56);
    expect(roundToMoney(10.554)).toBe(10.55);
    expect(roundToMoney(0)).toBe(0);
    expect(roundToMoney(-10.555)).toBe(-10.56);
  });

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

  it('Debe manejar entradas inválidas (NaN) de forma segura', () => {
    expect(calculateMonthlyPayment(NaN, 2.5, 20)).toBe(0);
    expect(calculateMonthlyPayment(100000, NaN, 20)).toBe(0);
    expect(calculateTAE(NaN, 500, 20)).toBe(0);
    expect(generateAmortizationSchedule(100000, NaN, 20)).toEqual([]);
  });

  it('Debe manejar el caso de TAE 0% exacto', () => {
    // Si devuelvo exactamente lo que me prestaron en total
    const principal = 120000;
    const monthlyPayment = 1000; // 1000 * 12 * 10 = 120000
    const years = 10;
    
    // TAE debería ser 0
    const tae = calculateTAE(principal, monthlyPayment, years);
    expect(tae).toBeCloseTo(0, 5);
  });

  it('Debe usar cuotas mensuales redondeadas a 12 decimales en la tabla de amortización', () => {
    // Escenario: 150k, 2.99%, 25 años.
    const schedule = generateAmortizationSchedule(150000, 2.99, 25);
    
    for (let i = 0; i < schedule.length - 1; i++) {
        const payment = schedule[i].payment;
        // Comprobamos que payment * 1e12 sea entero (o muy cercano)
        const isRounded = Math.abs((payment * 1e12) - Math.round(payment * 1e12)) < 0.0001;
        expect(isRounded, `El pago del mes ${i+1} (${payment}) no está redondeado a 12`).toBe(true);
    }
  });
});
