import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="app-viewport">
      {/* Background Ambient Orbs */}
      <div className="ambient-orb-1"></div>
      <div className="ambient-orb-2"></div>

      {/* Brand Header */}
      <header className="brand-header">
        <div className="brand-title-group">
          <Compass className="brand-icon" size={36} />
          <h1 className="brand-name">INNER COMPASS</h1>
        </div>
        <p className="brand-tagline">
          Rational Cognition & Somatic Yoga Platform
        </p>
      </header>

      {/* Main Content View */}
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <main className="auth-card">
          {/* Tab Navigation */}
          <div className="tab-header">
            <button
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Create Account
            </button>
          </div>

          {/* Form Content */}
          {activeTab === 'login' ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <RegisterForm onSuccess={handleAuthSuccess} />
          )}
        </main>
      )}
    </div>
  );
}
