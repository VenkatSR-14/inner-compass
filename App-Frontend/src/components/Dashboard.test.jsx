import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  const sampleUser = {
    id: 1,
    fullName: 'Venkat Srinivasa Raghavan',
    email: 'venkat@example.com',
    preferredIntent: 'Somatic Grounding',
    createdAt: '2026-08-24T20:00:00.000Z',
  };

  it('renders user details correctly', () => {
    render(<Dashboard user={sampleUser} onLogout={() => {}} />);

    expect(screen.getByText(/Welcome, Venkat Srinivasa Raghavan/i)).toBeInTheDocument();
    expect(screen.getByText('venkat@example.com')).toBeInTheDocument();
    expect(screen.getByText('Somatic Grounding')).toBeInTheDocument();
  });

  it('triggers onLogout callback when Sign Out button is clicked', () => {
    const handleLogout = vi.fn();
    render(<Dashboard user={sampleUser} onLogout={handleLogout} />);

    const signOutBtn = screen.getByRole('button', { name: /Sign Out/i });
    fireEvent.click(signOutBtn);

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});
