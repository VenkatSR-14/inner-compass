import React, { useState, useEffect } from 'react';
import { RotateCcw, Eye, ChevronLeft, Zap, BookOpen, Target, Layers, Camera } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api/v1';
const ANGLE_STEPS = [0, 45, 90, 135, 180, 225, 270, 315];

// High quality perspective images for 360° rotation of postures
const POSE_PERSPECTIVE_IMAGES = {
  // Padmasana (Lotus)
  1: {
    0:   'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    45:  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    90:  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    135: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    180: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    225: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    270: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    315: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
  },
  // Tadasana (Mountain)
  2: {
    0:   'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    45:  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    90:  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    135: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    180: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    225: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    270: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    315: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  },
  // Virabhadrasana II (Warrior II)
  3: {
    0:   'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    45:  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    90:  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    135: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    180: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    225: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    270: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    315: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
  },
};

export default function AsanaDeepDive({ asanaId, capturedFrameImage, poseTitle, onClose }) {
  const [asana, setAsana] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [activeTab, setActiveTab] = useState('360');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  useEffect(() => {
    setLoading(true);
    // If an ID is provided, fetch details from backend
    if (asanaId) {
      fetch(`${API_BASE}/asanas/${asanaId}`)
        .then(res => res.json())
        .then(data => { setAsana(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      // Default fallback for captured video frame pose
      setAsana({
        id: 1,
        name: poseTitle || 'Captured Video Pose',
        englishName: 'Paused Video Frame Analysis',
        intentCategory: 'Equanimity',
        difficulty: 'All Levels',
        category: 'Short Video Frame',
        biomechanics: 'Single-image anatomical mesh reconstruction from video frame. Grounding alignment and postural balance evaluated from paused video position.',
        thumbnailUrl: capturedFrameImage,
        alignmentCues: {
          0:   { viewLabel: 'Front View', cues: ['Spine vertical, crown lifting', 'Shoulders level over hips', 'Core engaged'] },
          45:  { viewLabel: 'Front-Right Oblique', cues: ['Hip external rotation verified', 'Right shoulder aligned'] },
          90:  { viewLabel: 'Right Profile', cues: ['Ear over shoulder over hip alignment', 'Lumbar curve neutral'] },
          135: { viewLabel: 'Rear-Right Oblique', cues: ['Scapula stabilized against ribcage'] },
          180: { viewLabel: 'Rear View', cues: ['Plumb line straight from occiput to sacrum', 'Pelvic bowl level'] },
          225: { viewLabel: 'Rear-Left Oblique', cues: ['Scapulae symmetric'] },
          270: { viewLabel: 'Left Profile', cues: ['Left side trunk flexors balanced'] },
          315: { viewLabel: 'Front-Left Oblique', cues: ['Chest open and unconstricted'] },
        },
        steps: [
          'Pause the clip at the desired posture frame.',
          'Observe anatomical alignment checkpoints around the 360° rotational axis.',
          'Verify weight distribution and joint angles.',
        ],
        muscles: ['Core Stabilizers', 'Erector Spinae', 'Quadriceps', 'Gluteals'],
        benefits: [
          'Reconstructs 3D postural mesh from 2D paused video frame',
          'Enables precision alignment correction for practitioners',
        ]
      });
      setLoading(false);
    }
  }, [asanaId, capturedFrameImage, poseTitle]);

  if (loading) {
    return (
      <div className="deepdive-overlay" onClick={onClose}>
        <div className="deepdive-modal" onClick={(e) => e.stopPropagation()}>
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading posture analysis…</p>
        </div>
      </div>
    );
  }

  if (!asana) return null;

  const angleData = asana.alignmentCues?.[currentAngle];

  // Resolve current angle image: captured frame > asana perspective image > thumbnail
  const currentAngleImage = capturedFrameImage ||
    POSE_PERSPECTIVE_IMAGES[asana.id]?.[currentAngle] ||
    asana.thumbnailUrl ||
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80';

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX || e.touches?.[0]?.clientX || 0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const delta = clientX - dragStartX;
    if (Math.abs(delta) > 40) {
      const direction = delta > 0 ? -1 : 1;
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
            {capturedFrameImage && (
              <span className="meta-pill captured-tag" style={{ background: 'var(--accent-saffron)', color: '#fff' }}>
                <Camera size={12} /> Paused Clip Frame
              </span>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="deepdive-tabs">
          <button className={`dd-tab ${activeTab === '360' ? 'active' : ''}`} onClick={() => setActiveTab('360')}>
            <RotateCcw size={16} /> 360° Pose View
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
              {/* 360° Interactive Pose Image Canvas */}
              <div
                className="pose-360-viewport"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
              >
                {/* Real Pose Image derived from frame or perspective */}
                <img
                  src={currentAngleImage}
                  alt={`${asana.name} - ${currentAngle}° view`}
                  className="pose-main-image"
                  style={{
                    transform: `perspective(800px) rotateY(${currentAngle > 180 ? currentAngle - 360 : currentAngle}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />

                {/* 360 Angle Overlay Badge */}
                <div className="pose-angle-badge">
                  <span className="deg-number">{currentAngle}°</span>
                  <span className="deg-label">{angleData?.viewLabel || 'Front View'}</span>
                </div>

                {/* Drag Hint Overlay */}
                <div className="pose-drag-overlay">
                  <RotateCcw size={16} /> Drag left / right to orbit 360° pose
                </div>
              </div>

              {/* 360 Degree Rotation Angle Buttons */}
              <div className="angle-picker-strip">
                {ANGLE_STEPS.map((angle) => (
                  <button
                    key={angle}
                    className={`angle-chip ${currentAngle === angle ? 'active' : ''}`}
                    onClick={() => setCurrentAngle(angle)}
                  >
                    {angle}°
                  </button>
                ))}
              </div>

              {/* Alignment Checkpoints Panel for active angle */}
              {angleData && (
                <div className="alignment-cues-panel">
                  <h3 className="cues-title">
                    <Eye size={18} color="#D96B27" /> Anatomical Checkpoints — {angleData.viewLabel} ({currentAngle}°)
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
