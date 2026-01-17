import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResultsSummary } from '../ResultsSummary';

describe('ResultsSummary Component', () => {
  const defaultProps = {
    monthlyPayment: 500,
    nonBonifiedPayment: 550,
    totalCost: 200000,
    interestSavings: 10000,
    totalProductCost: 5000,
    netBenefit: 5000,
    activeProductsMonthlyCost: 20,
    activeInitialExpenses: 3000,
    initialExpensesList: [{ id: '1', name: 'Test Expense', cost: 1000 }],
    capital: 150000,
    totalInterestBonified: 40000,
    totalInterestNonBonified: 50000
  };

  it('renders "OPTIMAL_FLUX" state when net benefit is positive', () => {
    render(<ResultsSummary {...defaultProps} netBenefit={5000} />);
    
    expect(screen.getByText(/AHORRO_CONFIRMADO/i)).toBeInTheDocument();
    expect(screen.getByText(/DECISIÓN: SÍ COMPENSA/i)).toBeInTheDocument();
    
    // Verify positive styling (green/accent)
    const header = screen.getByText(/AHORRO_CONFIRMADO/i);
    expect(header).toHaveClass('text-accent');
  });

  it('renders "LINK_CORRUPTED" state when net benefit is negative', () => {
    render(<ResultsSummary {...defaultProps} netBenefit={-1000} />);
    
    expect(screen.getByText(/SISTEMA_NO_RENTABLE/i)).toBeInTheDocument();
    expect(screen.getByText(/DECISIÓN: NO COMPENSA/i)).toBeInTheDocument();
    
    // Verify negative styling (red)
    const header = screen.getByText(/SISTEMA_NO_RENTABLE/i);
    expect(header).toHaveClass('text-red-500');
  });

  it('displays financial metrics correctly formatted', () => {
    render(<ResultsSummary {...defaultProps} />);
    
    // Monthly Payment (Total Mes = monthlyPayment + activeProductsMonthlyCost = 520)
    // Note: The component displays formatted currency. We match partial text or regex.
    // 520,00 €
    expect(screen.getByText(/520,00\s?€/i)).toBeInTheDocument();
  });
});
