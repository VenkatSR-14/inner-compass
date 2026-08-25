import React, { useState, useEffect } from 'react';
import { RotateCcw, Eye, ChevronLeft, Zap, BookOpen, Target, Layers } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api/v1';
const ANGLE_STEPS = [0, 45, 90, 135, 180, 225, 270, 315];

export default function AsanaDeepDive({ asanaId, onClose }) {
  const [asana, setAsana] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [activeTab, setActiveTab] = useState('360'); // '360' | 'science' | 'steps'
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  // Fetch asana detail from backend
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/asanas/${asanaId}`)
      .then(res => res.json())
      .then(data => { setAsana(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [asanaId]);

  if (loading) {
    return (
      <div className="deepdive-overlay" onClick={onClose}>
        <div className="deepdive-modal" onClick={(e) => e.stopPropagation()}>
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading asana data…</p>
        </div>
      </div>
    );
  }

  if (!asana) return null;

  const angleData = asana.alignmentCues?.[currentAngle];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX || e.touches?.[0]?.clientX || 0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const delta = clientX - dragStartX;
    if (Math.abs(delta) > 50) {
      const direction = delta > 0 ? 1 : -1;
      const currentIdx = ANGLE_STEPS.indexOf(currentAngle);
      const nextIdx = (currentIdx + direction + ANGLE_STEPS.length) % ANGLE_STEPS.length;
      setCurrentAngle(ANGLE_STEPS[nextIdx]);
      setDragStartX(clientX);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const rotateLeft = () => {
    const idx = ANGLE_STEPS.indexOf(currentAngle);
    setCurrentAngle(ANGLE_STEPS[(idx - 1 + ANGLE_STEPS.length) % ANGLE_STEPS.length]);
  };

  const rotateRight = () => {
    const idx = ANGLE_STEPS.indexOf(currentAngle);
    setCurrentAngle(ANGLE_STEPS[(idx + 1) % ANGLE_STEPS.length]);
  };

  return (
    <div className="deepdive-overlay" onClick={onClose}>
      <div className="deepdive-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="deepdive-header">
          <button className="deepdive-back-btn" onClick={onClose}>
            <ChevronLeft size={20} /> Back
          </button>
          <div className="deepdive-title-block">
            <h2 className="deepdive-asana-name">{asana.name}</h2>
            <span className="deepdive-english-name">{asana.englishName}</span>
          </div>
          <div className="deepdive-meta-pills">
            <span className="meta-pill intent">{asana.intentCategory}</span>
            <span className="meta-pill difficulty">{asana.difficulty}</span>
            {asana.holdTime && <span className="meta-pill hold">{asana.holdTime}</span>}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="deepdive-tabs">
          <button className={`dd-tab ${activeTab === '360' ? 'active' : ''}`} onClick={() => setActiveTab('360')}>
            <RotateCcw size={16} /> 360° View
          </button>
          <button className={`dd-tab ${activeTab === 'science' ? 'active' : ''}`} onClick={() => setActiveTab('science')}>
            <Zap size={16} /> Science
          </button>
          <button className={`dd-tab ${activeTab === 'steps' ? 'active' : ''}`} onClick={() => setActiveTab('steps')}>
            <BookOpen size={16} /> Steps
          </button>
        </div>

        {/* Content */}
        <div className="deepdive-content">

          {activeTab === '360' && (
            <div className="rotation-viewer">
              {/* 3D Model Viewer — renders .glb when available, otherwise compass fallback */}
              {asana.model3dUrl ? (
                <div className="model-viewer-container">
                  <model-viewer
                    src={asana.model3dUrl}
                    alt={`3D model of ${asana.name}`}
                    auto-rotate
                    camera-controls
                    touch-action="pan-y"
                    style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)' }}
                  />
                </div>
              ) : (
                <div
                  className="rotation-canvas"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchMove={handleMouseMove}
                  onTouchEnd={handleMouseUp}
                >
                  <div className="compass-ring">
                    <div
                      className="compass-needle"
                      style={{ transform: `rotate(${currentAngle}deg)` }}
                    />
                    {ANGLE_STEPS.map((angle) => (
                      <button
                        key={angle}
                        className={`compass-dot ${currentAngle === angle ? 'active' : ''}`}
                        style={{ transform: `rotate(${angle}deg) translateY(-110px)` }}
                        onClick={() => setCurrentAngle(angle)}
                        title={asana.alignmentCues?.[angle]?.viewLabel || `${angle}°`}
                      />
                    ))}
                    <div className="compass-center-label">
                      <span className="angle-degree">{currentAngle}°</span>
                      <span className="angle-view-name">{angleData?.viewLabel || 'View'}</span>
                    </div>
                  </div>
                  <p className="drag-hint">
                    <RotateCcw size={14} /> Drag to rotate • Click dots to jump
                  </p>
                  <div className="rotation-controls">
                    <button className="rotate-btn" onClick={rotateLeft}>◀ −45°</button>
                    <button className="rotate-btn" onClick={rotateRight}>+45° ▶</button>
                  </div>
                </div>
              )}

              {/* Alignment Cues for Current Angle */}
              {angleData && (
                <div className="alignment-cues-panel">
                  <h3 className="cues-title">
                    <Eye size={18} color="#D96B27" /> Alignment Checkpoints — {angleData.viewLabel}
                  </h3>
                  <ul className="cues-list">
                    {angleData.cues.map((cue, i) => (
                      <li key={i} className="cue-item">
                        <Target size={14} className="cue-icon" />
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'science' && (
            <div className="science-panel">
              {asana.biomechanics && (
                <div className="science-section">
                  <h3 className="science-heading"><Zap size={18} color="#D96B27" /> Biomechanics</h3>
                  <p className="science-body">{asana.biomechanics}</p>
                </div>
              )}

              {asana.muscles?.length > 0 && (
                <div className="science-section">
                  <h3 className="science-heading"><Layers size={18} color="#2C5E3B" /> Muscles Activated</h3>
                  <div className="muscle-tags">
                    {asana.muscles.map((m, i) => (
                      <span key={i} className="muscle-tag">{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {asana.benefits?.length > 0 && (
                <div className="science-section">
                  <h3 className="science-heading"><Target size={18} color="#D96B27" /> Health & Cognitive Benefits</h3>
                  <ul className="benefits-list">
                    {asana.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {asana.contraindications?.length > 0 && (
                <div className="science-section contraindications-section">
                  <h3 className="science-heading">⚠️ Contraindications</h3>
                  <ul className="benefits-list">
                    {asana.contraindications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="steps-panel">
              <h3 className="steps-heading">
                <BookOpen size={18} color="#2C5E3B" /> Execution Steps — {asana.name}
              </h3>
              <ol className="steps-list">
                {asana.steps?.map((step, i) => (
                  <li key={i} className="step-item">
                    <span className="step-number">{i + 1}</span>
                    <span className="step-text">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
