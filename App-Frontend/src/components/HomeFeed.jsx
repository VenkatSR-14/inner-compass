import React, { useState } from 'react';
import { Compass, Flame, Heart, MessageCircle, Share2, Filter, Award } from 'lucide-react';

const INITIAL_FEED_POSTS = [
  {
    id: 1,
    author: 'Dr. Aris Thorne',
    authorRole: 'Cognitive Philosophy Guide',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    intent: 'Clarity',
    timeAgo: '2 hours ago',
    content: 'Equanimity is not the suppression of emotion, but the capacity to observe sensation without cognitive distortion. Today we anchor our breath before entering seated meditation.',
    duration: '20 mins',
    likes: 48,
    comments: 12,
    isLiked: false,
  },
  {
    id: 2,
    author: 'Elena Rostova',
    authorRole: 'Somatic Posture Specialist',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    intent: 'Somatic Grounding',
    timeAgo: '5 hours ago',
    content: 'Completed 30-minute Pelvic Floor Alignment & Breath Synchrony practice. Noticed a 40% reduction in subjective tension after the second cycle.',
    duration: '30 mins',
    likes: 76,
    comments: 19,
    isLiked: true,
  },
  {
    id: 3,
    author: 'Swami Veda',
    authorRole: 'Classical Mind Guide',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    intent: 'Equanimity',
    timeAgo: '8 hours ago',
    content: 'The 60-second "Why" context before practice uncovers the underlying purpose of movement. Remember: posture follows cognition.',
    duration: '15 mins',
    likes: 112,
    comments: 24,
    isLiked: false,
  },
];

export default function HomeFeed({ user }) {
  const [posts, setPosts] = useState(INITIAL_FEED_POSTS);
  const [selectedIntent, setSelectedIntent] = useState('All');

  const toggleLike = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked,
        };
      }
      return p;
    }));
  };

  const filteredPosts = selectedIntent === 'All'
    ? posts
    : posts.filter(p => p.intent === selectedIntent);

  return (
    <div className="home-feed-container">
      {/* Top Welcome Banner */}
      <header className="feed-header-banner">
        <div className="banner-text">
          <h2>Welcome to your Feed, {user.fullName || 'Practitioner'}</h2>
          <p>Community check-ins, subjective state logs, and daily practice streaks.</p>
        </div>
        <div className="streak-card">
          <Flame size={24} color="#D96B27" />
          <div>
            <div className="streak-count">7 Days</div>
            <div className="streak-label">Practice Streak</div>
          </div>
        </div>
      </header>

      {/* Intent Filter Chips */}
      <div className="feed-filter-bar">
        <div className="filter-label">
          <Filter size={16} color="#2C5E3B" /> Filter Intent:
        </div>
        {['All', 'Equanimity', 'Clarity', 'Somatic Grounding'].map((category) => (
          <button
            key={category}
            className={`feed-filter-chip ${selectedIntent === category ? 'active' : ''}`}
            onClick={() => setSelectedIntent(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="feed-posts-list">
        {filteredPosts.map((post) => (
          <article key={post.id} className="feed-post-card">
            <div className="post-header">
              <img src={post.avatar} alt={post.author} className="post-author-avatar" />
              <div className="post-author-meta">
                <h4 className="post-author-name">{post.author}</h4>
                <span className="post-author-role">{post.authorRole} • {post.timeAgo}</span>
              </div>
              <span className="post-intent-badge">{post.intent}</span>
            </div>

            <p className="post-content-text">{post.content}</p>

            <div className="post-practice-pill">
              <Compass size={16} color="#2C5E3B" />
              <span>Completed Practice: <strong>{post.duration}</strong></span>
            </div>

            <div className="post-actions-bar">
              <button
                className={`post-action-btn ${post.isLiked ? 'liked' : ''}`}
                onClick={() => toggleLike(post.id)}
              >
                <Heart size={18} fill={post.isLiked ? "#D96B27" : "none"} color={post.isLiked ? "#D96B27" : "currentColor"} />
                <span>{post.likes}</span>
              </button>
              <button className="post-action-btn">
                <MessageCircle size={18} />
                <span>{post.comments}</span>
              </button>
              <button className="post-action-btn">
                <Share2 size={18} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
