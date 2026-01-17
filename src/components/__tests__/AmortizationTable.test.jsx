import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AmortizationTable } from '../AmortizationTable';

describe('AmortizationTable Component', () => {
  const mockSchedule = [
    { month: 1, payment: 700.00, interest: 300.00, amortization: 400.00, balance: 149600.00 },
    { month: 2, payment: 700.00, interest: 299.00, amortization: 401.00, balance: 149199.00 }
  ];

  it('renders table headers', () => {
    render(<AmortizationTable schedule={mockSchedule} />);
    expect(screen.getByText(/Mes/i)).toBeInTheDocument();
    expect(screen.getByText(/Cuota/i)).toBeInTheDocument();
    expect(screen.getByText(/Intereses/i)).toBeInTheDocument();
    expect(screen.getByText(/Capital/i)).toBeInTheDocument();
    expect(screen.getByText(/Pendiente/i)).toBeInTheDocument();
  });

  it('renders all rows', () => {
    render(<AmortizationTable schedule={mockSchedule} />);
    // We expect 2 rows in tbody
    // Note: getByText finds by content. We can check for specific month numbers.
    expect(screen.getByText('001')).toBeInTheDocument();
    expect(screen.getByText('002')).toBeInTheDocument();
  });

  it('formats numbers correctly (Euro format)', () => {
    render(<AmortizationTable schedule={mockSchedule} />);
    // 149.600,00 or 149600,00 depending on locale impl in Node.
    // Node usually uses narrow space for thousands or dot depending on locale 'es-ES'.
    // We should rely on a partial match or regex for the decimals.
    // "149.600,00"
    expect(screen.getByText(/149\.?600,00/)).toBeInTheDocument();
  });

  it('renders empty state message when schedule is null or empty', () => {
    const { rerender } = render(<AmortizationTable schedule={[]} />);
    expect(screen.getByText(/NO_DATA_STREAM/i)).toBeInTheDocument();

    rerender(<AmortizationTable schedule={null} />);
    expect(screen.getByText(/NO_DATA_STREAM/i)).toBeInTheDocument();
  });
});
