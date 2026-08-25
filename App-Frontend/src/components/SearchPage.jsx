import React, { useState } from 'react';
import { Search, Compass, Tag, User } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const trendingTopics = [
    { title: 'Breath Control & Logic', category: 'Cognitive Framing', count: '1.2k practitioners' },
    { title: 'Equanimity in Seated Asana', category: 'Posture Context', count: '890 practitioners' },
    { title: 'Somatic Pelvic Grounding', category: 'Somatic Alignment', count: '2.4k practitioners' },
  ];

  return (
    <div className="search-page-container">
      <div className="search-input-header">
        <div className="input-wrapper" style={{ width: '100%' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search practices, philosophy modules, or practitioners..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="input-icon" size={20} />
        </div>
      </div>

      <div className="search-section">
        <h3 className="section-title">Explore Cognitive Topics</h3>
        <div className="topics-grid">
          {trendingTopics.map((topic, i) => (
            <div key={i} className="info-box" style={{ cursor: 'pointer' }}>
              <div className="info-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={14} color="#D96B27" /> {topic.category}
              </div>
              <div className="info-value" style={{ fontSize: '1rem', marginTop: '4px' }}>{topic.title}</div>
              <div className="info-label" style={{ marginTop: '8px', fontSize: '0.75rem' }}>{topic.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
