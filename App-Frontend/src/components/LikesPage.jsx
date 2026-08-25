import React from 'react';
import { Heart, Compass, Bookmark } from 'lucide-react';

export default function LikesPage() {
  const savedClips = [
    { title: 'Anchoring Breath in Equanimity', duration: '30s', category: 'Equanimity' },
    { title: 'Cognitive Context: The Rational Mind', duration: '45s', category: 'Clarity' },
  ];

  return (
    <div className="likes-page-container">
      <div className="dashboard-card" style={{ maxWidth: '100%' }}>
        <div className="dashboard-header">
          <div>
            <h2 className="welcome-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart color="#D96B27" fill="#D96B27" size={26} /> Saved Practices & Appreciations
            </h2>
          </div>
        </div>

        <div className="user-grid">
          {savedClips.map((item, idx) => (
            <div key={idx} className="info-box">
              <div className="info-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.category}</span>
                <Bookmark size={16} color="#2C5E3B" />
              </div>
              <div className="info-value" style={{ marginTop: '6px', fontSize: '1.05rem' }}>{item.title}</div>
              <div className="info-label" style={{ marginTop: '8px' }}>Duration: {item.duration}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
