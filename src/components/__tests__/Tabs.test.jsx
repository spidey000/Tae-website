import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '../Tabs';
import { describe, it, expect, vi } from 'vitest';

describe('Tabs Component', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
  ];

  it('renders all tabs', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" onTabChange={() => {}} />);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('highlights the active tab', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" onTabChange={() => {}} />);
    
    const activeTab = screen.getByText('Tab 1');
    const inactiveTab = screen.getByText('Tab 2');

    // Using class checking as a proxy for style, but usually computed style is better. 
    // Given the component uses conditional classes:
    expect(activeTab.className).toContain('text-accent');
    expect(inactiveTab.className).toContain('text-gray-500');
  });

  it('calls onTabChange when a tab is clicked', () => {
    const handleTabChange = vi.fn();
    render(<Tabs tabs={mockTabs} activeTab="tab1" onTabChange={handleTabChange} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    expect(handleTabChange).toHaveBeenCalledWith('tab2');
  });
});
