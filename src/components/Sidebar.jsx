// Sidebar.jsx — Navigation, date selection, user info, logout, theme toggle
import { useAuth } from '../hooks/useAuth';
import StreakBadge from './StreakBadge';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}
function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
function tomorrowStr() {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function Sidebar({ selectedDate, onDateChange, isOpen, onClose, theme, onToggleTheme }) {
  const { user, logout } = useAuth();
  const today     = todayStr();
  const yesterday = yesterdayStr();
  const tomorrow  = tomorrowStr();
  const initials  = user?.email ? user.email[0].toUpperCase() : '?';
  const isDark    = theme === 'dark';

  return (
    <>
      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <h1>📅 PlanYouDay</h1>
          <span>Daily Productivity Tracker</span>
        </div>

        {/* Streak */}
        <div className="sidebar-section">
          <StreakBadge />
        </div>

        {/* ── Theme Toggle ─────────────────────────────── */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Appearance</div>
          <button className="theme-toggle-btn" onClick={onToggleTheme} title="Toggle theme">
            <span className="theme-toggle-track">
              <span className={`theme-toggle-thumb ${isDark ? 'theme-toggle-thumb--dark' : 'theme-toggle-thumb--light'}`} />
            </span>
            <span className="theme-toggle-label">
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
          </button>
        </div>
        {/* ─────────────────────────────────────────────── */}

        {/* Date Picker */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Select Date</div>
          <div className="date-strip">
            <input
              className="date-strip-input"
              type="date"
              value={selectedDate}
              onChange={e => { onDateChange(e.target.value); onClose(); }}
            />
            <div className="quick-dates">
              <button
                className={`quick-date-btn ${selectedDate === yesterday ? 'active-date' : ''}`}
                onClick={() => { onDateChange(yesterday); onClose(); }}
              >
                <span>Yesterday</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{yesterday}</span>
              </button>
              <button
                className={`quick-date-btn ${selectedDate === today ? 'active-date' : ''}`}
                onClick={() => { onDateChange(today); onClose(); }}
              >
                <span>Today ✨</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{today}</span>
              </button>
              <button
                className={`quick-date-btn ${selectedDate === tomorrow ? 'active-date' : ''}`}
                onClick={() => { onDateChange(tomorrow); onClose(); }}
              >
                <span>Tomorrow</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tomorrow}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Tips</div>
          <div style={{
            background: 'rgba(108,99,255,0.08)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6
          }}>
            💡 Plan tasks the night before for a productive morning!
          </div>
        </div>

        {/* User info + Logout */}
        <div className="sidebar-user">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Signed in as</div>
              <div className="user-email">{user?.email}</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign out">⏏</button>
          </div>
        </div>
      </aside>
    </>
  );
}
