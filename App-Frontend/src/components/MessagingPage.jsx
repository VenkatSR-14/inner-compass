import React from 'react';
import { MessageSquare, Users, Send } from 'lucide-react';

export default function MessagingPage() {
  const circles = [
    { name: 'Equanimity Morning Circle', members: 34, lastMsg: 'Remember to anchor intent before seated breath.' },
    { name: 'Somatic Grounding Practitioners', members: 19, lastMsg: 'Sharing pelvic alignment logs from today.' },
  ];

  return (
    <div className="messaging-page-container">
      <div className="dashboard-card" style={{ maxWidth: '100%' }}>
        <div className="dashboard-header">
          <h2 className="welcome-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare color="#2C5E3B" size={26} /> Sangha Mindfulness Circles
          </h2>
        </div>

        <div className="user-grid">
          {circles.map((c, i) => (
            <div key={i} className="info-box" style={{ cursor: 'pointer' }}>
              <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} color="#2C5E3B" /> {c.members} Practitioners Active
              </div>
              <div className="info-value" style={{ marginTop: '6px', fontSize: '1.05rem' }}>{c.name}</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>"{c.lastMsg}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
