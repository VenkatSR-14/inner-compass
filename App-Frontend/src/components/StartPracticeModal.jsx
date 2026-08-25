import React, { useState, useEffect, useRef } from 'react';
import { Compass, BookOpen, Zap, Target, Timer, Wind, ChevronRight, X, Layers, Play } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api/v1';

const PRACTICE_DURATIONS = [
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
];

export default function StartPracticeModal({ isOpen, onClose }) {
  const [stage, setStage] = useState(1);
  const [configs, setConfigs] = useState([]);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);
  const breathRef = useRef(null);

  // Fetch practice configs from backend
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`${API_BASE}/practice/configs`)
      .then(res => res.json())
      .then(data => { setConfigs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathRef.current) clearInterval(breathRef.current);
    };
  }, []);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStage(1);
      setSelectedIntent(null);
      setIsTimerRunning(false);
      setTimeRemaining(0);
      setBreathCount(0);
    }
  }, [isOpen]);

  const handleSelectIntent = (intentKey) => {
    setSelectedIntent(intentKey);
    const config = configs.find(c => c.intentKey === intentKey);
    if (config) setSelectedDuration(config.defaultDurationSecs);
  };

  const ctx = selectedIntent ? configs.find(c => c.intentKey === selectedIntent) : null;

  const proceedToScience = () => {
    if (selectedIntent) setStage(2);
  };

  const startSilentPractice = () => {
    setStage(3);
    setTimeRemaining(selectedDuration);
    setIsTimerRunning(true);
    setBreathCount(0);

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(breathRef.current);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    if (ctx) {
      const pattern = { inhale: ctx.breathInhaleSecs, hold: ctx.breathHoldSecs, exhale: ctx.breathExhaleSecs };
      const totalCycle = (pattern.inhale + pattern.hold + pattern.exhale) * 1000;

      const cycleBreath = () => {
        setBreathPhase('inhale');
        setTimeout(() => {
          setBreathPhase('hold');
          setTimeout(() => {
            setBreathPhase('exhale');
            setTimeout(() => {
              setBreathCount(prev => prev + 1);
            }, pattern.exhale * 1000);
          }, pattern.hold * 1000);
        }, pattern.inhale * 1000);
      };

      cycleBreath();
      breathRef.current = setInterval(cycleBreath, totalCycle);
    }
  };

  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathRef.current) clearInterval(breathRef.current);
    setIsTimerRunning(false);
    onClose();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const progressPct = ctx ? ((selectedDuration - timeRemaining) / selectedDuration) * 100 : 0;
  const postureName = ctx ? `${ctx.asanaName} (${ctx.asanaEnglishName})` : '';

  return (
    <div className="practice-overlay" onClick={handleClose}>
      <div className="practice-modal" onClick={(e) => e.stopPropagation()}>

        <button className="practice-close-btn" onClick={handleClose}><X size={22} /></button>

        {/* Stage Indicator */}
        <div className="practice-stage-indicator">
          <div className={`stage-dot ${stage >= 1 ? 'active' : ''}`}><span>1</span></div>
          <div className={`stage-connector ${stage >= 2 ? 'active' : ''}`} />
          <div className={`stage-dot ${stage >= 2 ? 'active' : ''}`}><span>2</span></div>
          <div className={`stage-connector ${stage >= 3 ? 'active' : ''}`} />
          <div className={`stage-dot ${stage >= 3 ? 'active' : ''}`}><span>3</span></div>
        </div>

        {/* STAGE 1: Intent & Mindset */}
        {stage === 1 && (
          <div className="practice-stage-content">
            <div className="stage-header">
              <Compass size={28} color="#2C5E3B" />
              <h2 className="stage-title">Set Your Intent</h2>
              <p className="stage-subtitle">
                Anchor your cognitive frame before entering practice. Your intent shapes the neural pathways activated during the session.
              </p>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading practice configurations…</p>
            ) : (
              <div className="intent-selection-grid">
                {configs.map((config) => (
                  <button
                    key={config.intentKey}
                    className={`intent-card ${selectedIntent === config.intentKey ? 'selected' : ''}`}
                    onClick={() => handleSelectIntent(config.intentKey)}
                  >
                    <div className="intent-card-title">{config.title}</div>
                    <div className="intent-card-posture">{config.asanaName} ({config.asanaEnglishName})</div>
                    <div className="intent-card-breath">{config.breathName}</div>
                  </button>
                ))}
              </div>
            )}

            {ctx && (
              <div className="mindset-framing-box">
                <h3 className="framing-label">Cognitive Framing</h3>
                <p className="framing-text">{ctx.cognitiveFraming}</p>
              </div>
            )}

            {ctx && (
              <div className="duration-selector">
                <label className="duration-label"><Timer size={16} /> Practice Duration</label>
                <div className="duration-options">
                  {PRACTICE_DURATIONS.map((d) => (
                    <button
                      key={d.seconds}
                      className={`duration-chip ${selectedDuration === d.seconds ? 'selected' : ''}`}
                      onClick={() => setSelectedDuration(d.seconds)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="practice-proceed-btn" disabled={!selectedIntent} onClick={proceedToScience}>
              Continue to Science & Steps <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* STAGE 2: Written Science & Steps */}
        {stage === 2 && ctx && (
          <div className="practice-stage-content">
            <div className="stage-header">
              <BookOpen size={28} color="#D96B27" />
              <h2 className="stage-title">Read Before Practice</h2>
              <p className="stage-subtitle">
                Understand the biomechanics and cognitive purpose. Absorb the steps. Then enter silent practice.
              </p>
            </div>

            <div className="science-read-block">
              <h3><Zap size={18} color="#D96B27" /> Biomechanical Science — {postureName}</h3>
              <p>{ctx.biomechanics}</p>
            </div>

            <div className="steps-read-block">
              <h3><Layers size={18} color="#2C5E3B" /> Execution Steps</h3>
              <ol className="practice-steps-ol">
                {ctx.steps?.map((step, i) => (
                  <li key={i}>
                    <span className="practice-step-num">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="breath-pattern-block">
              <h3><Wind size={18} color="#2C5E3B" /> Breath Pattern — {ctx.breathName}</h3>
              <div className="breath-phases-display">
                <div className="bp-phase"><span className="bp-label">Inhale</span><span className="bp-val">{ctx.breathInhaleSecs}s</span></div>
                <div className="bp-phase"><span className="bp-label">Hold</span><span className="bp-val">{ctx.breathHoldSecs}s</span></div>
                <div className="bp-phase"><span className="bp-label">Exhale</span><span className="bp-val">{ctx.breathExhaleSecs}s</span></div>
              </div>
            </div>

            <button className="practice-proceed-btn" onClick={startSilentPractice}>
              <Play size={18} /> Begin Silent Practice
            </button>
          </div>
        )}

        {/* STAGE 3: Silent Timer */}
        {stage === 3 && ctx && (
          <div className="practice-stage-content silent-stage">
            <div className={`breath-ring breath-${breathPhase}`}>
              <svg viewBox="0 0 200 200" className="breath-svg">
                <circle cx="100" cy="100" r="90" className="ring-track" />
                <circle
                  cx="100" cy="100" r="90"
                  className="ring-progress"
                  style={{ strokeDashoffset: `${565 - (565 * progressPct) / 100}` }}
                />
              </svg>
              <div className="breath-center">
                <span className="breath-phase-label">
                  {breathPhase === 'inhale' && 'Inhale'}
                  {breathPhase === 'hold' && 'Hold'}
                  {breathPhase === 'exhale' && 'Exhale'}
                </span>
                <span className="breath-timer-display">{formatTime(timeRemaining)}</span>
              </div>
            </div>

            <div className="silent-info">
              <p className="silent-posture">{postureName}</p>
              <p className="silent-intent">{ctx.title}</p>
              <p className="silent-breath-count">{breathCount} breath cycles completed</p>
            </div>

            {timeRemaining === 0 && !isTimerRunning && (
              <div className="practice-complete-card">
                <h3>Practice Complete 🙏</h3>
                <p>{breathCount} breath cycles in {formatTime(selectedDuration)}</p>
                <button className="practice-proceed-btn" onClick={handleClose}>
                  Return to Inner Compass
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
