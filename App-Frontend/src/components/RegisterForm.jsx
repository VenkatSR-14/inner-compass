import React, { useState } from 'react';
import { Mail, Lock, User, UserPlus, AlertCircle, Compass } from 'lucide-react';
import { registerUser } from '../services/api';

const INTENT_OPTIONS = [
  { id: 'Equanimity', label: 'Equanimity' },
  { id: 'Clarity', label: 'Clarity' },
  { id: 'Somatic Grounding', label: 'Somatic Grounding' },
];

export default function RegisterForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [preferredIntent, setPreferredIntent] = useState('Equanimity');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newUser = await registerUser({
        email,
        password,
        fullName,
        preferredIntent,
      });
      onSuccess(newUser);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        <label className="input-label" htmlFor="reg-fullname">Full Name</label>
        <div className="input-wrapper">
          <input
            id="reg-fullname"
            type="text"
            className="form-input"
            placeholder="Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <User className="input-icon" size={18} />
        </div>
      </div>

      <div className="input-group">
        <label className="input-label" htmlFor="reg-email">Email Address</label>
        <div className="input-wrapper">
          <input
            id="reg-email"
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
        <label className="input-label" htmlFor="reg-password">Password (min 6 characters)</label>
        <div className="input-wrapper">
          <input
            id="reg-password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <Lock className="input-icon" size={18} />
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Core Intent Focus</label>
        <div className="intent-selector">
          {INTENT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`intent-chip ${preferredIntent === opt.id ? 'selected' : ''}`}
              onClick={() => setPreferredIntent(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (
          'Creating Account...'
        ) : (
          <>
            <span>Create Account</span>
            <UserPlus size={18} />
          </>
        )}
      </button>
    </form>
  );
}
