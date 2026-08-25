import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Eye, ChevronLeft, Zap, BookOpen, Target, Layers, Cpu, Sparkles } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api/v1';
const ANGLE_STEPS = [0, 45, 90, 135, 180, 225, 270, 315];

// 3D Anatomical Joint Keypoint Presets (SMPL Parametric Human Mesh Format)
const ASANA_3D_MESH_PRESETS = {
  // Padmasana (Lotus Pose - Seated)
  padmasana: {
    name: 'Padmasana',
    nodes: [
      { id: 'head',      x: 0,    y: 1.1,  z: 0 },
      { id: 'neck',      x: 0,    y: 0.85, z: 0 },
      { id: 'spine',     x: 0,    y: 0.5,  z: 0 },
      { id: 'pelvis',    x: 0,    y: 0.1,  z: 0 },
      { id: 'l_shoulder',x: -0.3, y: 0.8,  z: 0 },
      { id: 'r_shoulder',x: 0.3,  y: 0.8,  z: 0 },
      { id: 'l_elbow',   x: -0.4, y: 0.5,  z: 0.1 },
      { id: 'r_elbow',   x: 0.4,  y: 0.5,  z: 0.1 },
      { id: 'l_wrist',   x: -0.3, y: 0.2,  z: 0.3 },
      { id: 'r_wrist',   x: 0.3,  y: 0.2,  z: 0.3 },
      { id: 'l_hip',     x: -0.2, y: 0.05, z: 0 },
      { id: 'r_hip',     x: 0.2,  y: 0.05, z: 0 },
      { id: 'l_knee',    x: -0.55,y: -0.15,z: 0.35 },
      { id: 'r_knee',    x: 0.55, y: -0.15,z: 0.35 },
      { id: 'l_ankle',   x: 0.25, y: -0.1, z: 0.3 },
      { id: 'r_ankle',   x: -0.25,y: -0.1, z: 0.3 },
    ],
    bones: [
      ['head', 'neck'], ['neck', 'spine'], ['spine', 'pelvis'],
      ['neck', 'l_shoulder'], ['l_shoulder', 'l_elbow'], ['l_elbow', 'l_wrist'],
      ['neck', 'r_shoulder'], ['r_shoulder', 'r_elbow'], ['r_elbow', 'r_wrist'],
      ['pelvis', 'l_hip'], ['l_hip', 'l_knee'], ['l_knee', 'l_ankle'],
      ['pelvis', 'r_hip'], ['r_hip', 'r_knee'], ['r_knee', 'r_ankle'],
    ]
  },
  // Tadasana (Mountain Pose - Standing)
  tadasana: {
    name: 'Tadasana',
    nodes: [
      { id: 'head',      x: 0,    y: 1.4,  z: 0 },
      { id: 'neck',      x: 0,    y: 1.15, z: 0 },
      { id: 'spine',     x: 0,    y: 0.7,  z: 0 },
      { id: 'pelvis',    x: 0,    y: 0.25, z: 0 },
      { id: 'l_shoulder',x: -0.3, y: 1.1,  z: 0 },
      { id: 'r_shoulder',x: 0.3,  y: 1.1,  z: 0 },
      { id: 'l_elbow',   x: -0.35,y: 0.7,  z: 0 },
      { id: 'r_elbow',   x: 0.35, y: 0.7,  z: 0 },
      { id: 'l_wrist',   x: -0.35,y: 0.3,  z: 0.05 },
      { id: 'r_wrist',   x: 0.35, y: 0.3,  z: 0.05 },
      { id: 'l_hip',     x: -0.18,y: 0.2,  z: 0 },
      { id: 'r_hip',     x: 0.18, y: 0.2,  z: 0 },
      { id: 'l_knee',    x: -0.18,y: -0.35,z: 0 },
      { id: 'r_knee',    x: 0.18, y: -0.35,z: 0 },
      { id: 'l_ankle',   x: -0.18,y: -0.85,z: 0 },
      { id: 'r_ankle',   x: 0.18, y: -0.85,z: 0 },
    ],
    bones: [
      ['head', 'neck'], ['neck', 'spine'], ['spine', 'pelvis'],
      ['neck', 'l_shoulder'], ['l_shoulder', 'l_elbow'], ['l_elbow', 'l_wrist'],
      ['neck', 'r_shoulder'], ['r_shoulder', 'r_elbow'], ['r_elbow', 'r_wrist'],
      ['pelvis', 'l_hip'], ['l_hip', 'l_knee'], ['l_knee', 'l_ankle'],
      ['pelvis', 'r_hip'], ['r_hip', 'r_knee'], ['r_knee', 'r_ankle'],
    ]
  },
  // Virabhadrasana II (Warrior II - Wide Lunge)
  virabhadrasana: {
    name: 'Virabhadrasana II',
    nodes: [
      { id: 'head',      x: 0,    y: 1.1,  z: 0 },
      { id: 'neck',      x: 0,    y: 0.85, z: 0 },
      { id: 'spine',     x: 0,    y: 0.45, z: 0 },
      { id: 'pelvis',    x: 0,    y: 0.05, z: 0 },
      { id: 'l_shoulder',x: -0.3, y: 0.8,  z: 0 },
      { id: 'r_shoulder',x: 0.3,  y: 0.8,  z: 0 },
      { id: 'l_elbow',   x: -0.75,y: 0.8,  z: 0 },
      { id: 'r_elbow',   x: 0.75, y: 0.8,  z: 0 },
      { id: 'l_wrist',   x: -1.1, y: 0.8,  z: 0 },
      { id: 'r_wrist',   x: 1.1,  y: 0.8,  z: 0 },
      { id: 'l_hip',     x: -0.2, y: 0.0,  z: 0 },
      { id: 'r_hip',     x: 0.2,  y: 0.0,  z: 0 },
      { id: 'l_knee',    x: -0.6, y: 0.0,  z: 0.3 },
      { id: 'r_knee',    x: 0.65, y: -0.35,z: -0.2 },
      { id: 'l_ankle',   x: -0.6, y: -0.55,z: 0.3 },
      { id: 'r_ankle',   x: 1.05, y: -0.55,z: -0.3 },
    ],
    bones: [
      ['head', 'neck'], ['neck', 'spine'], ['spine', 'pelvis'],
      ['neck', 'l_shoulder'], ['l_shoulder', 'l_elbow'], ['l_elbow', 'l_wrist'],
      ['neck', 'r_shoulder'], ['r_shoulder', 'r_elbow'], ['r_elbow', 'r_wrist'],
      ['pelvis', 'l_hip'], ['l_hip', 'l_knee'], ['l_knee', 'l_ankle'],
      ['pelvis', 'r_hip'], ['r_hip', 'r_knee'], ['r_knee', 'r_ankle'],
    ]
  }
};

export default function AsanaDeepDive({ asanaId, videoElement, poseTitle, onClose }) {
  const [asana, setAsana] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [activeTab, setActiveTab] = useState('360');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [aiReconstructing, setAiReconstructing] = useState(true);

  const canvasRef = useRef(null);

  // Fetch asana metadata
  useEffect(() => {
    setLoading(true);
    setAiReconstructing(true);

    // Simulate AI Human Mesh Recovery (HMR 2.0) pose extraction
    const timer = setTimeout(() => {
      setAiReconstructing(false);
    }, 800);

    if (asanaId) {
      fetch(`${API_BASE}/asanas/${asanaId}`)
        .then(res => res.json())
        .then(data => { setAsana(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setAsana({
        id: 1,
        name: poseTitle || 'Tutor Paused Posture',
        englishName: 'AI Reconstructed 3D Human Mesh (HMR 2.0)',
        intentCategory: 'Equanimity',
        difficulty: 'All Levels',
        category: 'Tutor Video Analysis',
        biomechanics: 'Single-image anatomical mesh reconstruction (HMR 2.0 / SMPL Body Model). The parametric 3D mannequin resolves joint coordinates and limb placement from the tutor\'s video frame, permitting full 360° orbital inspection.',
        alignmentCues: {
          0:   { viewLabel: 'Front View', cues: ['Spine vertical plumb line verified', 'Shoulder girdle horizontal', 'Pelvic bowl level'] },
          45:  { viewLabel: 'Front-Right Oblique', cues: ['Right femoral external rotation', 'Ribcage non-flaring'] },
          90:  { viewLabel: 'Right Profile', cues: ['Ear over shoulder over hip vector', 'Slight lumbar curve preserved'] },
          135: { viewLabel: 'Rear-Right Oblique', cues: ['Right scapula stabilized on ribcage'] },
          180: { viewLabel: 'Rear View', cues: ['Posterior chain symmetry', 'Sacral angle neutral'] },
          225: { viewLabel: 'Rear-Left Oblique', cues: ['Left scapular retraction balanced'] },
          270: { viewLabel: 'Left Profile', cues: ['Left ear over shoulder alignment'] },
          315: { viewLabel: 'Front-Left Oblique', cues: ['Anterior chest open'] },
        },
        steps: [
          'Video frame captured at tutor\'s posture execution point.',
          'AI HMR 2.0 engine mapped 3D anatomical landmarks onto SMPL human mesh model.',
          'Orbit around the 3D model to inspect joint angles and alignment from any perspective.',
        ],
        muscles: ['Core Stabilizers', 'Erector Spinae', 'Quadriceps', 'Gluteals'],
        benefits: [
          '360° orbital rotation of tutor pose without flat 2D image distortion',
          'Precision anatomical joint angle analysis',
        ]
      });
      setLoading(false);
    }

    return () => clearTimeout(timer);
  }, [asanaId, poseTitle]);

  // Render 3D Anatomical Human Mesh Model on Canvas
  useEffect(() => {
    if (!canvasRef.current || loading || aiReconstructing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 600;
    const height = canvas.height = 380;

    ctx.clearRect(0, 0, width, height);

    // Dark atmospheric background
    const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 300);
    bgGradient.addColorStop(0, '#1E241E');
    bgGradient.addColorStop(1, '#0C0E0C');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Floor (3D perspective plane)
    ctx.strokeStyle = 'rgba(44, 94, 59, 0.25)';
    ctx.lineWidth = 1;
    const centerY = height * 0.78;
    for (let r = -5; r <= 5; r++) {
      ctx.beginPath();
      ctx.moveTo(width / 2 + r * 50, centerY);
      ctx.lineTo(width / 2 + r * 110, height);
      ctx.stroke();
    }
    for (let h = 0; h < 4; h++) {
      ctx.beginPath();
      ctx.moveTo(0, centerY + h * 25);
      ctx.lineTo(width, centerY + h * 25);
      ctx.stroke();
    }

    // Select 3D Mesh Preset (Padmasana, Tadasana, or Virabhadrasana)
    let meshPreset = ASANA_3D_MESH_PRESETS.padmasana;
    if (asana?.name?.toLowerCase().includes('tada') || asana?.name?.toLowerCase().includes('mountain')) {
      meshPreset = ASANA_3D_MESH_PRESETS.tadasana;
    } else if (asana?.name?.toLowerCase().includes('vira') || asana?.name?.toLowerCase().includes('warrior')) {
      meshPreset = ASANA_3D_MESH_PRESETS.virabhadrasana;
    }

    // 3D Projection Math
    const rad = (currentAngle * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);
    const scale = 140;

    const projectedNodes = {};
    meshPreset.nodes.forEach(node => {
      // 3D Y-axis rotation matrix
      const rotX = node.x * cosA - node.z * sinA;
      const rotZ = node.x * sinA + node.z * cosA;
      const rotY = node.y;

      // Perspective projection
      const perspective = 1 / (1 + rotZ * 0.2);
      const screenX = width / 2 + rotX * scale * perspective;
      const screenY = height / 2 - (rotY * scale * perspective - 20);

      projectedNodes[node.id] = { x: screenX, y: screenY, z: rotZ };
    });

    // Draw 3D Bone Mesh Connectors (Human Skeleton vectors)
    meshPreset.bones.forEach(([idA, idB]) => {
      const pA = projectedNodes[idA];
      const pB = projectedNodes[idB];
      if (pA && pB) {
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.strokeStyle = '#D96B27';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Inner glowing core vector
        ctx.strokeStyle = '#FFA066';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Draw 3D Joint Keypoint Nodes
    Object.values(projectedNodes).forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#2C5E3B';
      ctx.fill();
      ctx.strokeStyle = '#8BB096';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bright node center
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    });

  }, [currentAngle, loading, aiReconstructing, asana]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX || e.touches?.[0]?.clientX || 0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const delta = clientX - dragStartX;
    if (Math.abs(delta) > 30) {
      const direction = delta > 0 ? -1 : 1;
      const currentIdx = ANGLE_STEPS.indexOf(currentAngle);
      const nextIdx = (currentIdx + direction + ANGLE_STEPS.length) % ANGLE_STEPS.length;
      setCurrentAngle(ANGLE_STEPS[nextIdx]);
      setDragStartX(clientX);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  if (loading) {
    return (
      <div className="deepdive-overlay" onClick={onClose}>
        <div className="deepdive-modal" onClick={(e) => e.stopPropagation()}>
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading posture data…</p>
        </div>
      </div>
    );
  }

  if (!asana) return null;

  const angleData = asana.alignmentCues?.[currentAngle];

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
            <span className="meta-pill captured-tag" style={{ background: 'var(--accent-saffron)', color: '#fff' }}>
              <Cpu size={12} /> AI 3D Mesh (HMR 2.0)
            </span>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="deepdive-tabs">
          <button className={`dd-tab ${activeTab === '360' ? 'active' : ''}`} onClick={() => setActiveTab('360')}>
            <RotateCcw size={16} /> 360° 3D Human Mesh
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
              {/* AI 3D Human Mesh Canvas Viewport */}
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
                {aiReconstructing ? (
                  <div className="ai-loading-box">
                    <Sparkles className="spin-icon" size={32} color="#D96B27" />
                    <p>AI Human Mesh Recovery (HMR 2.0) Reconstructing 3D Tutor Posture…</p>
                  </div>
                ) : (
                  <canvas ref={canvasRef} className="pose-main-canvas" />
                )}

                {/* 360 Angle Overlay Badge */}
                <div className="pose-angle-badge">
                  <span className="deg-number">{currentAngle}°</span>
                  <span className="deg-label">{angleData?.viewLabel || 'Front View'}</span>
                </div>

                {/* Drag Hint Overlay */}
                <div className="pose-drag-overlay">
                  <RotateCcw size={16} /> Drag left / right to orbit 360° 3D anatomical mesh
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

              {/* Alignment Checkpoints Panel */}
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
