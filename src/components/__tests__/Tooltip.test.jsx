import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tooltip } from '../Tooltip';

describe('Tooltip Component', () => {
  it('renders the info icon', () => {
    render(<Tooltip content="Helper text" />);
    // The Tooltip uses the Info icon from lucide-react, which renders an svg
    // We can check for the button
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows content on mouse enter and hides on mouse leave', async () => {
    render(<Tooltip content="Helper text" />);
    
    const button = screen.getByRole('button');
    
    // Initially hidden
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    
    // Hover
    fireEvent.mouseEnter(button);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
    
    // Leave
    fireEvent.mouseLeave(button);
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('toggles visibility on click', () => {
    render(<Tooltip content="Clickable help" />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(screen.getByText('Clickable help')).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(screen.queryByText('Clickable help')).not.toBeInTheDocument();
  });
});
