import React, { useState, useEffect } from 'react';
import { Heart, Volume2, VolumeX, Compass, Play, Pause, Clock, AlertCircle } from 'lucide-react';

const SAMPLE_CLIPS = [
  {
    id: 1,
    title: 'Anchoring Breath in Equanimity',
    description: 'A 30-second somatic breathing calibration before your morning practice.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    durationSeconds: 30,
    intentCategory: 'Equanimity',
    authorName: 'Swami Veda',
    likesCount: 142,
    isLiked: false,
  },
  {
    id: 2,
    title: 'Cognitive Context: The Rational Mind',
    description: 'Understanding the connection between logic and breath control in classical posture.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-the-trees-1189-large.mp4',
    durationSeconds: 45,
    intentCategory: 'Clarity',
    authorName: 'Dr. Aris Thorne',
    likesCount: 98,
    isLiked: true,
  },
  {
    id: 3,
    title: 'Somatic Grounding Alignment',
    description: 'Calibrating pelvic floor alignment for seated meditation.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-forest-trees-1224-large.mp4',
    durationSeconds: 25,
    intentCategory: 'Somatic Grounding',
    authorName: 'Elena Rostova',
    likesCount: 215,
    isLiked: false,
  },
];

export default function MindfulClips() {
  const [clips, setClips] = useState(SAMPLE_CLIPS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedIntent, setSelectedIntent] = useState('All');

  useEffect(() => {
    // Fetch live clips from database API
    fetch('http://localhost:8081/api/v1/clips')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setClips(data.map(d => ({ ...d, isLiked: false })));
        }
      })
      .catch(err => console.log('Using sample clips fallback'));
  }, []);

  const filteredClips = selectedIntent === 'All'
    ? clips
    : clips.filter(c => c.intentCategory === selectedIntent);

  const activeClip = filteredClips[currentIdx] || filteredClips[0];

  const handleLike = (clipId) => {
    setClips(clips.map(c => {
      if (c.id === clipId) {
        const newLikes = c.isLiked ? (c.likesCount || 0) - 1 : (c.likesCount || 0) + 1;
        return { ...c, likesCount: newLikes, isLiked: !c.isLiked };
      }
      return c;
    }));

    // Trigger backend API like
    fetch(`http://localhost:8081/api/v1/clips/${clipId}/like`, { method: 'POST' }).catch(() => {});
  };

  const handleNext = () => {
    if (currentIdx < filteredClips.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  if (!activeClip) return null;

  return (
    <div className="clips-view-container">
      <header className="clips-header">
        <h2>Mindful Clips</h2>
        <p>Short-form philosophy & somatic context clips (10s – 60s)</p>

        <div className="feed-filter-bar" style={{ marginBottom: 0 }}>
          {['All', 'Equanimity', 'Clarity', 'Somatic Grounding'].map((cat) => (
            <button
              key={cat}
              className={`feed-filter-chip ${selectedIntent === cat ? 'active' : ''}`}
              onClick={() => { setSelectedIntent(cat); setCurrentIdx(0); }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Reel Card Container */}
      <div className="reel-card-wrapper">
        <div className="reel-video-container">
          <video
            key={activeClip.videoUrl}
            src={activeClip.videoUrl}
            className="reel-video-element"
            autoPlay
            loop
            muted={isMuted}
            onClick={() => setIsPlaying(!isPlaying)}
          />

          {/* Top Duration Constraint Tag (10s - 60s) */}
          <div className="duration-tag-pill">
            <Clock size={14} color="#D96B27" />
            <span>{activeClip.durationSeconds || 30}s (10s–60s clip)</span>
          </div>

          {/* Side Overlay Action Controls */}
          <div className="reel-overlay-actions">
            <button className="reel-action-circle" onClick={() => handleLike(activeClip.id)}>
              <Heart size={22} fill={activeClip.isLiked ? "#D96B27" : "none"} color={activeClip.isLiked ? "#D96B27" : "#FFFFFF"} />
              <span className="reel-action-count">{activeClip.likesCount || 0}</span>
            </button>

            <button className="reel-action-circle" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX size={20} color="#FFFFFF" /> : <Volume2 size={20} color="#D96B27" />}
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="reel-info-overlay">
            <div className="reel-author-badge">
              <Compass size={16} color="#2C5E3B" />
              <span>{activeClip.authorName || 'Inner Compass Guide'}</span>
              <span className="post-intent-badge" style={{ fontSize: '0.75rem' }}>{activeClip.intentCategory}</span>
            </div>
            <h3 className="reel-title">{activeClip.title}</h3>
            <p className="reel-desc">{activeClip.description}</p>
          </div>

          {/* Navigation Arrows */}
          <div className="reel-nav-buttons">
            <button className="reel-nav-btn" onClick={handlePrev} disabled={currentIdx === 0}>
              ▲ Prev
            </button>
            <button className="reel-nav-btn" onClick={handleNext}>
              ▼ Next Clip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
