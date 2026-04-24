// App.jsx — Auth guard + main app layout + theme toggle
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function App() {
  const { session } = useAuth();
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Theme state — persisted in localStorage ─────────────────────────────
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('planner-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('planner-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  // ─────────────────────────────────────────────────────────────────────────

  // Still loading auth state
  if (session === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ marginBottom: 16 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading…</p>
        </div>
      </div>
    );
  }

  // Not logged in → show auth page
  if (!session) return <AuthPage theme={theme} onToggleTheme={toggleTheme} />;

  // Logged in → show full app
  return (
    <div className="app-layout">
      {/* Mobile hamburger */}
      <button
        className="btn-icon mobile-menu-btn"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
        style={{ position: 'fixed', top: 16, left: 16, zIndex: 300 }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <Sidebar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main content */}
      <main className="main-content">
        <Dashboard selectedDate={selectedDate} user={session.user} />
      </main>
    </div>
  );
}
