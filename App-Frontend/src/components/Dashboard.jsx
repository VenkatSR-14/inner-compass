import React from 'react';
import { LogOut, User, Mail, Compass, Calendar, CheckCircle } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2C5E3B', fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>
            <CheckCircle size={16} color="#2C5E3B" /> Authenticated Session Active
          </div>
          <h2 className="welcome-title">Welcome, {user.fullName || 'Practitioner'}</h2>
        </div>
        <button className="btn-secondary" onClick={onLogout}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="user-grid">
        <div className="info-box">
          <div className="info-label">Full Name</div>
          <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#D96B27" />
            {user.fullName || 'N/A'}
          </div>
        </div>

        <div className="info-box">
          <div className="info-label">Email Address</div>
          <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={18} color="#D96B27" />
            {user.email}
          </div>
        </div>

        <div className="info-box">
          <div className="info-label">Current Intent Focus</div>
          <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2C5E3B' }}>
            <Compass size={18} color="#2C5E3B" />
            {user.preferredIntent || 'Equanimity'}
          </div>
        </div>

        <div className="info-box">
          <div className="info-label">Member Since</div>
          <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#D96B27" />
            {formattedDate}
          </div>
        </div>
      </div>

      <div className="info-box" style={{ background: 'rgba(44, 94, 59, 0.08)', borderColor: 'rgba(44, 94, 59, 0.2)', textAlign: 'center', padding: '1.5rem' }}>
        <p style={{ color: '#2C5E3B', fontSize: '0.98rem', fontWeight: 500, fontStyle: 'italic' }}>
          "Your cognitive practice engine is ready. Return to your daily grounding, intent anchoring, and subjective state check-ins."
        </p>
      </div>
    </div>
  );
}
