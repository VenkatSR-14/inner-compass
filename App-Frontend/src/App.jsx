import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Sidebar from './components/Sidebar';
import HomeFeed from './components/HomeFeed';
import MindfulClips from './components/MindfulClips';
import SearchPage from './components/SearchPage';
import LikesPage from './components/LikesPage';
import MessagingPage from './components/MessagingPage';
import Dashboard from './components/Dashboard';
import StartPracticeModal from './components/StartPracticeModal';

export default function App() {
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [user, setUser] = useState(null);
  const [activeNavTab, setActiveNavTab] = useState('home'); // Default post-login landing: 'home'
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setActiveNavTab('home'); // Ensure landing on Home Feed after authentication
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className={user ? "app-authenticated-shell" : "app-viewport"}>
      {!user ? (
        <>
          {/* Background Ambient Orbs */}
          <div className="ambient-orb-1"></div>
          <div className="ambient-orb-2"></div>

          {/* Unauthenticated Brand Header */}
          <header className="brand-header">
            <div className="brand-title-group">
              <Compass className="brand-icon" size={36} />
              <h1 className="brand-name">INNER COMPASS</h1>
            </div>
            <p className="brand-tagline">
              Rational Cognition & Somatic Yoga Platform
            </p>
          </header>

          {/* Unauthenticated Auth Card */}
          <main className="auth-card">
            <div className="tab-header">
              <button
                className={`tab-btn ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => setAuthTab('login')}
              >
                Sign In
              </button>
              <button
                className={`tab-btn ${authTab === 'register' ? 'active' : ''}`}
                onClick={() => setAuthTab('register')}
              >
                Create Account
              </button>
            </div>

            {authTab === 'login' ? (
              <LoginForm onSuccess={handleAuthSuccess} />
            ) : (
              <RegisterForm onSuccess={handleAuthSuccess} />
            )}
          </main>
        </>
      ) : (
        /* Authenticated Instagram-Style Two-Column Layout */
        <div className="app-main-layout">
          <Sidebar
            activeTab={activeNavTab}
            onSelectTab={setActiveNavTab}
            user={user}
            onLogout={handleLogout}
            onStartPractice={() => setIsPracticeOpen(true)}
          />

          <main className="main-content-viewport">
            {activeNavTab === 'home' && <HomeFeed user={user} />}
            {activeNavTab === 'clips' && <MindfulClips />}
            {activeNavTab === 'search' && <SearchPage />}
            {activeNavTab === 'likes' && <LikesPage />}
            {activeNavTab === 'messages' && <MessagingPage />}
            {activeNavTab === 'profile' && <Dashboard user={user} onLogout={handleLogout} />}
          </main>

          {/* Practice Engine Modal */}
          <StartPracticeModal
            isOpen={isPracticeOpen}
            onClose={() => setIsPracticeOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
