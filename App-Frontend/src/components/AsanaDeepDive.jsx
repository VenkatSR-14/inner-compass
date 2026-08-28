import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Eye, ChevronLeft, Zap, BookOpen, Target, Layers, Sparkles, CheckCircle2, Cpu, RefreshCw } from 'lucide-react';

const PYTHON_AI_SERVICE = 'http://localhost:5001/api/v1/ai/synthesize-view';
const API_BASE = 'http://localhost:8081/api/v1';
const ANGLE_STEPS = [0, 45, 90, 135, 180, 225, 270, 315];

const ANGLE_LABELS = {
  0:   'Front View',
  45:  'Front-Right Oblique',
  90:  'Right Profile',
  135: 'Rear-Right Oblique',
  180: 'Rear View',
  225: 'Rear-Left Oblique',
  270: 'Left Profile',
  315: 'Front-Left Oblique',
};

export default function AsanaDeepDive({ asanaId, videoElement, poseTitle, onClose }) {
  const [asana, setAsana] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [activeTab, setActiveTab] = useState('360');
  const [frameDataUrl, setFrameDataUrl] = useState(null);
  const [isAiSynthesizing, setIsAiSynthesizing] = useState(false);
  const [generatedViews, setGeneratedViews] = useState({});
  const [generationStatus, setGenerationStatus] = useState('');

  // Cache to avoid re-generating the same angle
  const viewCacheRef = useRef({});

  // Capture exact paused video frame at highest resolution
  useEffect(() => {
    if (videoElement) {
      try {
        const width = videoElement.videoWidth || 1280;
        const height = videoElement.videoHeight || 720;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setFrameDataUrl(dataUrl);
      } catch (e) {
        console.log('Video frame snapshot fallback:', e);
      }
    }
  }, [videoElement]);

  // Generate AI view for a single angle on-demand
  const generateViewForAngle = useCallback(async (angle) => {
    // Check cache first
    if (viewCacheRef.current[angle]) {
      setGeneratedViews(prev => ({ ...prev, [angle]: viewCacheRef.current[angle] }));
      return;
    }

    setIsAiSynthesizing(true);
    setGenerationStatus(`AI generating ${angle}° ${ANGLE_LABELS[angle]} view...`);

    try {
      // Call Python AI service directly (faster, no Spring Boot proxy overhead)
      const response = await fetch(PYTHON_AI_SERVICE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pose_title: poseTitle || 'Yoga Posture',
          provider: 'huggingface',
          angles: [angle],  // Generate only the requested angle
        })
      });

      if (!response.ok) {
        throw new Error(`AI service returned ${response.status}`);
      }

      const data = await response.json();
      const angleImage = data?.synthesizedAngles?.[String(angle)];

      if (angleImage) {
        viewCacheRef.current[angle] = angleImage;
        setGeneratedViews(prev => ({ ...prev, [angle]: angleImage }));
        setGenerationStatus(`✓ ${angle}° ${ANGLE_LABELS[angle]} — AI Generated`);
      } else {
        setGenerationStatus(`⚠ ${angle}° generation returned empty`);
      }
    } catch (err) {
      console.error('AI generation error:', err);
      setGenerationStatus(`⚠ AI generation failed: ${err.message}`);
    } finally {
      setIsAiSynthesizing(false);
    }
  }, [poseTitle]);

  // Auto-generate front view (0°) on mount
  useEffect(() => {
    if (poseTitle) {
      generateViewForAngle(0);
    }
  }, [poseTitle, generateViewForAngle]);

  // Fetch asana details from backend
  useEffect(() => {
    setLoading(true);
    if (asanaId) {
      fetch(`${API_BASE}/asanas/${asanaId}`)
        .then(res => res.json())
        .then(data => { setAsana(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setAsana({
        id: 1,
        name: poseTitle || 'Paused Video Frame',
        englishName: 'AI Novel View Synthesis (FLUX.1)',
        intentCategory: 'Equanimity',
        difficulty: 'All Levels',
        category: 'AI 3D Novel View',
        biomechanics: 'Uses HuggingFace FLUX.1-schnell diffusion model to generate photorealistic novel perspective views of the yoga pose from 8 camera angles (0° to 315°). Each view is a unique AI-generated image.',
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
          'Video clip paused at exact tutor posture execution frame.',
          'Pose title extracted from the clip metadata.',
          'HuggingFace FLUX.1-schnell AI model generates photorealistic images of the pose from each camera angle.',
          'Click any angle button to generate that specific view on-demand.',
        ],
        muscles: ['Core Stabilizers', 'Erector Spinae', 'Quadriceps', 'Gluteals'],
        benefits: [
          'AI-generated photorealistic views from 8 camera angles',
          'Understand anatomical alignment from every perspective',
        ]
      });
      setLoading(false);
    }
  }, [asanaId, poseTitle]);

  // Handle angle selection — trigger AI generation on-demand
  const handleSelectAngle = (angle) => {
    setCurrentAngle(angle);
    if (!viewCacheRef.current[angle]) {
      generateViewForAngle(angle);
    }
  };

  if (loading) {
    return (
      <div className="deepdive-overlay" onClick={onClose}>
        <div className="deepdive-modal" onClick={(e) => e.stopPropagation()}>
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Capturing video frame…</p>
        </div>
      </div>
    );
  }

  if (!asana) return null;

  const angleData = asana.alignmentCues?.[currentAngle];
  const currentLabel = ANGLE_LABELS[currentAngle] || 'Front View';

  // Resolve the active display image: AI generated view → paused video frame fallback
  const aiGeneratedImage = generatedViews[currentAngle];
  const activeDisplayImage = aiGeneratedImage || frameDataUrl;

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
              <Cpu size={12} /> FLUX AI Novel View
            </span>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="deepdive-tabs">
          <button className={`dd-tab ${activeTab === '360' ? 'active' : ''}`} onClick={() => setActiveTab('360')}>
            <Sparkles size={16} /> AI 360° View ({currentAngle}°)
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

              {/* AI Generated Image Viewport */}
              <div className="exact-frame-viewport" style={{ overflow: 'hidden', position: 'relative', minHeight: '400px' }}>

                {/* AI Generation Loading Overlay */}
                {isAiSynthesizing && (
                  <div className="ai-loading-box" style={{
                    position: 'absolute', zIndex: 12, 
                    background: 'rgba(0, 0, 0, 0.75)', 
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '1rem',
                  }}>
                    <RefreshCw className="spin-icon" size={36} color="#D96B27" style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem', textAlign: 'center', padding: '0 1rem' }}>
                      {generationStatus || `AI Generating ${currentAngle}° View...`}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                      FLUX.1-schnell is generating a new image (~5s)
                    </p>
                  </div>
                )}

                {/* Display the AI-generated image (flat, no CSS rotation) */}
                {activeDisplayImage ? (
                  <img
                    src={activeDisplayImage}
                    alt={`AI Generated ${currentAngle}° ${currentLabel}`}
                    className="exact-frame-img"
                    style={{
                      width: '100%',
                      maxHeight: '480px',
                      objectFit: 'contain',
                      transition: 'opacity 0.3s ease',
                      opacity: isAiSynthesizing ? 0.3 : 1.0,
                      borderRadius: '8px',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '400px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)', borderRadius: '8px',
                    color: 'var(--text-muted)', fontSize: '0.9rem',
                  }}>
                    Click an angle to generate the AI view
                  </div>
                )}

                {/* Angle & Provider Badge */}
                <div className="pose-angle-badge">
                  <Sparkles size={14} color="#D96B27" />
                  <span className="deg-number">{currentAngle}°</span>
                  <span className="deg-label">{currentLabel}</span>
                </div>

                <div className="ai-metrics-overlay">
                  <div className="metric-pill">
                    <CheckCircle2 size={12} color="#2C5E3B" />
                    {aiGeneratedImage ? 'AI Generated (FLUX.1-schnell)' : 'Paused Video Frame'}
                  </div>
                  <div className="metric-pill">
                    <Sparkles size={12} color="#D96B27" />
                    {generationStatus || 'Click an angle to generate'}
                  </div>
                </div>
              </div>

              {/* Angle Selector Buttons */}
              <div className="angle-picker-strip">
                {ANGLE_STEPS.map((angle) => {
                  const isGenerated = !!viewCacheRef.current[angle] || !!generatedViews[angle];
                  return (
                    <button
                      key={angle}
                      className={`angle-chip ${currentAngle === angle ? 'active' : ''} ${isGenerated ? 'generated' : ''}`}
                      onClick={() => handleSelectAngle(angle)}
                      disabled={isAiSynthesizing && currentAngle !== angle}
                      style={{
                        opacity: (isAiSynthesizing && currentAngle !== angle) ? 0.5 : 1,
                        position: 'relative',
                      }}
                    >
                      {isGenerated && <CheckCircle2 size={10} style={{ marginRight: '4px', color: '#2C5E3B' }} />}
                      {angle}° {ANGLE_LABELS[angle]}
                    </button>
                  );
                })}
              </div>

              {/* Alignment Cues */}
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
                  <h3 className="science-heading"><Target size={18} color="#D96B27" /> Health Benefits</h3>
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
                <BookOpen size={18} color="#2C5E3B" /> How It Works — {asana.name}
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
