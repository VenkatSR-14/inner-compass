import React, { useState, useEffect, useRef } from 'react';
import { Heart, Volume2, VolumeX, Compass, Play, Pause, Clock, RotateCcw, Camera } from 'lucide-react';
import AsanaDeepDive from './AsanaDeepDive';

const SAMPLE_CLIPS = [
  {
    id: 1,
    title: 'Anchoring Breath in Equanimity',
    description: 'A 30-second somatic breathing calibration before your morning practice.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    durationSeconds: 30,
    intentCategory: 'Equanimity',
    authorName: 'Swami Veda',
    likesCount: 142,
    isLiked: false,
    asanaId: 1,
  },
  {
    id: 2,
    title: 'Cognitive Context: The Rational Mind',
    description: 'Understanding the connection between logic and breath control in classical posture.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-the-trees-1189-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
    durationSeconds: 45,
    intentCategory: 'Clarity',
    authorName: 'Dr. Aris Thorne',
    likesCount: 98,
    isLiked: true,
    asanaId: 2,
  },
  {
    id: 3,
    title: 'Somatic Grounding Alignment',
    description: 'Calibrating pelvic floor alignment for seated meditation.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-forest-trees-1224-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
    durationSeconds: 25,
    intentCategory: 'Somatic Grounding',
    authorName: 'Elena Rostova',
    likesCount: 215,
    isLiked: false,
    asanaId: 3,
  },
];

export default function MindfulClips() {
  const [clips, setClips] = useState(SAMPLE_CLIPS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedIntent, setSelectedIntent] = useState('All');

  // Deep dive state
  const [deepDiveActive, setDeepDiveActive] = useState(false);
  const [capturedFrameData, setCapturedFrameData] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
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
    fetch(`http://localhost:8081/api/v1/clips/${clipId}/like`, { method: 'POST' }).catch(() => {});
  };

  const handleNext = () => {
    setCurrentIdx((currentIdx + 1) % filteredClips.length);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  // Pause video and capture frame screenshot for 360° pose deep dive
  const handlePauseAndSpin360 = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);

      // Attempt to capture HTML5 video frame onto canvas
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedFrameData(dataUrl);
      } catch (err) {
        // Fallback to active clip thumbnail or poster image if cross-origin canvas is blocked
        setCapturedFrameData(activeClip.thumbnailUrl || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80');
      }
    }
    setDeepDiveActive(true);
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
            ref={videoRef}
            key={activeClip.videoUrl}
            src={activeClip.videoUrl}
            className="reel-video-element"
            autoPlay={isPlaying}
            loop
            muted={isMuted}
            onClick={() => {
              if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
              } else {
                videoRef.current.play();
                setIsPlaying(true);
              }
            }}
          />

          {/* Top Duration Constraint Tag */}
          <div className="duration-tag-pill">
            <Clock size={14} color="#D96B27" />
            <span>{activeClip.durationSeconds || 30}s (10s–60s clip)</span>
          </div>

          {/* Prominent "Pause & Spin 360° Pose" Button */}
          <button className="spin-360-overlay-btn" onClick={handlePauseAndSpin360}>
            <RotateCcw size={18} />
            <span>Pause & Spin 360° Pose</span>
          </button>

          {/* Side Overlay Action Controls */}
          <div className="reel-overlay-actions">
            <button className="reel-action-circle" onClick={() => handleLike(activeClip.id)} title="Appreciate">
              <Heart size={22} fill={activeClip.isLiked ? "#D96B27" : "none"} color={activeClip.isLiked ? "#D96B27" : "#FFFFFF"} />
              <span className="reel-action-count">{activeClip.likesCount || 0}</span>
            </button>

            <button className="reel-action-circle" onClick={() => setIsMuted(!isMuted)} title="Mute/Unmute">
              {isMuted ? <VolumeX size={20} color="#FFFFFF" /> : <Volume2 size={20} color="#D96B27" />}
            </button>

            <button className="reel-action-circle" onClick={handlePauseAndSpin360} title="Deep Dive Pose">
              <Camera size={20} color="#FFFFFF" />
              <span className="reel-action-count">360°</span>
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

      {/* 360° Pose Deep Dive Modal from Paused Clip */}
      {deepDiveActive && (
        <AsanaDeepDive
          asanaId={activeClip.asanaId || 1}
          capturedFrameImage={capturedFrameData}
          poseTitle={activeClip.title}
          onClose={() => setDeepDiveActive(false)}
        />
      )}
    </div>
  );
}
