import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { loginUser } from '../services/api';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await loginUser({ email, password });
      onSuccess(user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="input-group">
        <label className="input-label" htmlFor="login-email">Email Address</label>
        <div className="input-wrapper">
          <input
            id="login-email"
            type="email"
            className="form-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Mail className="input-icon" size={18} />
        </div>
      </div>

      <div className="input-group">
        <label className="input-label" htmlFor="login-password">Password</label>
        <div className="input-wrapper">
          <input
            id="login-password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Lock className="input-icon" size={18} />
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (
          'Authenticating...'
        ) : (
          <>
            <span>Sign In</span>
            <LogIn size={18} />
          </>
        )}
      </button>
    </form>
  );
}
