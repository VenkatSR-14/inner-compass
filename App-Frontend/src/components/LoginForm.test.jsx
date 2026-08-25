import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from './LoginForm';
import * as api from '../services/api';

vi.mock('../services/api');

describe('LoginForm Component', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input fields and submit button', () => {
    render(<LoginForm onSuccess={mockOnSuccess} />);

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('allows user input typing', () => {
    render(<LoginForm onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('secret123');
  });

  it('calls loginUser API and triggers onSuccess on submit', async () => {
    const mockUser = { id: 1, email: 'user@example.com', fullName: 'Jane Doe' };
    api.loginUser.mockResolvedValueOnce(mockUser);

    render(<LoginForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(api.loginUser).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'secret123',
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  it('displays error banner when login fails', async () => {
    api.loginUser.mockRejectedValueOnce(new Error('Invalid email or password'));

    render(<LoginForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});
