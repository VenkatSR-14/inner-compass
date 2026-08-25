import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterForm from './RegisterForm';
import * as api from '../services/api';

vi.mock('../services/api');

describe('RegisterForm Component', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration fields and intent chips', () => {
    render(<RegisterForm onSuccess={mockOnSuccess} />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText('Equanimity')).toBeInTheDocument();
    expect(screen.getByText('Clarity')).toBeInTheDocument();
    expect(screen.getByText('Somatic Grounding')).toBeInTheDocument();
  });

  it('allows intent selection', () => {
    render(<RegisterForm onSuccess={mockOnSuccess} />);

    const clarityChip = screen.getByText('Clarity');
    fireEvent.click(clarityChip);

    expect(clarityChip).toHaveClass('selected');
  });

  it('submits registration form successfully', async () => {
    const mockCreatedUser = { id: 2, email: 'new@example.com', fullName: 'John Smith', preferredIntent: 'Clarity' };
    api.registerUser.mockResolvedValueOnce(mockCreatedUser);

    render(<RegisterForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Smith' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Clarity'));

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(api.registerUser).toHaveBeenCalledWith({
        fullName: 'John Smith',
        email: 'new@example.com',
        password: 'password123',
        preferredIntent: 'Clarity',
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockCreatedUser);
    });
  });
});
