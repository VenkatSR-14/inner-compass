import React from 'react';
import { Home, Film, Search, Heart, MessageSquare, User, Compass, LogOut, Play } from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, user, onLogout, onStartPractice }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'clips', label: 'Mindful Clips', icon: Film },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'likes', label: 'Likes', icon: Heart },
    { id: 'messages', label: 'Messaging', icon: MessageSquare },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside className="instagram-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand" onClick={() => onSelectTab('home')}>
        <Compass className="brand-icon" size={32} />
        <span className="sidebar-brand-name">INNER COMPASS</span>
      </div>

      {/* Start Practice CTA */}
      <button className="sidebar-practice-btn" onClick={onStartPractice}>
        <Play size={20} />
        <span>Start Practice</span>
      </button>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon size={22} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom User Footer */}
      <div className="sidebar-footer">
        <div className="user-avatar-badge">
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'P'}
        </div>
        <div className="user-info-text">
          <div className="user-display-name">{user.fullName || 'Practitioner'}</div>
          <div className="user-email-text">{user.email}</div>
        </div>
        <button className="sidebar-logout-btn" title="Sign Out" onClick={onLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
