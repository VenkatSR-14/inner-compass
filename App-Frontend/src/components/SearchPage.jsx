import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, BookOpen, Video, Users, RotateCcw } from 'lucide-react';
import AsanaDeepDive from './AsanaDeepDive';

const API_BASE = 'http://localhost:8081/api/v1';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [deepDiveAsanaId, setDeepDiveAsanaId] = useState(null);

  const [asanas, setAsanas] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from backend
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [asanaRes, classRes] = await Promise.all([
          fetch(`${API_BASE}/asanas`),
          fetch(`${API_BASE}/classes`),
        ]);
        const asanaData = await asanaRes.json();
        const classData = await classRes.json();
        setAsanas(asanaData);
        setClasses(classData);
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Search backend when query changes (debounced via local filter for now)
  const filteredAsanas = asanas.filter(a => {
    if (query === '') return true;
    const q = query.toLowerCase();
    return a.name?.toLowerCase().includes(q) ||
           a.englishName?.toLowerCase().includes(q) ||
           a.category?.toLowerCase().includes(q) ||
           a.intentCategory?.toLowerCase().includes(q);
  });

  const filteredClasses = classes.filter(c => {
    if (query === '') return true;
    const q = query.toLowerCase();
    return c.title?.toLowerCase().includes(q) ||
           c.description?.toLowerCase().includes(q) ||
           c.instructorName?.toLowerCase().includes(q) ||
           c.intentCategory?.toLowerCase().includes(q);
  });

  const showAsanas = activeFilter === 'All' || activeFilter === 'Asanas';
  const showClasses = activeFilter === 'All' || activeFilter === 'Online Classes';

  const FILTER_TYPES = ['All', 'Asanas', 'Online Classes'];

  return (
    <div className="search-page-container">
      {/* Search Bar */}
      <div className="search-input-header">
        <div className="input-wrapper" style={{ width: '100%' }}>
          <Search className="input-icon" size={20} />
          <input
            type="text"
            className="form-input"
            placeholder="Search asanas, online classes, philosophy modules…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="search-filter-bar">
        <Filter size={16} color="#2C5E3B" />
        {FILTER_TYPES.map((f) => (
          <button
            key={f}
            className={`search-filter-chip ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="search-empty-state">
          <p>Loading…</p>
        </div>
      )}

      {/* Results */}
      <div className="search-results-list">
        {!loading && filteredAsanas.length === 0 && filteredClasses.length === 0 && (
          <div className="search-empty-state">
            <Search size={40} color="#E4DCD0" />
            <p>No results found. Try a different search term.</p>
          </div>
        )}

        {/* Asana Results */}
        {showAsanas && filteredAsanas.map((asana) => (
          <div key={`asana-${asana.id}`} className="search-result-card">
            <div className="result-top-row">
              <div className="result-type-badge"><RotateCcw size={16} color="#D96B27" /> {asana.category}</div>
              <span className="result-intent-pill">{asana.intentCategory}</span>
            </div>
            <h3 className="result-title">{asana.name} — {asana.englishName}</h3>
            <div className="result-footer">
              <span className="result-difficulty">{asana.difficulty}</span>
              <button
                className="deepdive-trigger-btn"
                onClick={() => setDeepDiveAsanaId(asana.id)}
              >
                <Eye size={16} /> 360° Deep-Dive
              </button>
            </div>
          </div>
        ))}

        {/* Class Results */}
        {showClasses && filteredClasses.map((cls) => (
          <div key={`class-${cls.id}`} className="search-result-card">
            <div className="result-top-row">
              <div className="result-type-badge"><Video size={16} color="#2C5E3B" /> {cls.category}</div>
              <span className="result-intent-pill">{cls.intentCategory}</span>
            </div>
            <h3 className="result-title">{cls.title}</h3>
            <p className="result-desc">{cls.description}</p>
            <div className="result-class-meta">
              <span><Users size={14} /> {cls.instructorName}</span>
              <span>{cls.schedule}</span>
            </div>
            <div className="result-footer">
              <span className="result-difficulty">{cls.difficulty}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 360° Deep-Dive Modal */}
      {deepDiveAsanaId && (
        <AsanaDeepDive
          asanaId={deepDiveAsanaId}
          onClose={() => setDeepDiveAsanaId(null)}
        />
      )}
    </div>
  );
}
