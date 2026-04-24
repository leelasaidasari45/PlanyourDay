// Dashboard.jsx — Overview stats + task list for the selected date
// Single useTasks instance shared between stats and task list for instant updates
import { useTasks } from '../hooks/useTasks';
import TaskList from './TaskList';

function formatDisplayDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  const label = d.toDateString() === today.toDateString()     ? 'Today'
              : d.toDateString() === tomorrow.toDateString()  ? 'Tomorrow'
              : d.toDateString() === yesterday.toDateString() ? 'Yesterday'
              : d.toLocaleDateString('en-IN', { weekday: 'long' });

  const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return { label, formatted };
}

// Stats receive pre-computed values from the shared hook — no extra fetches
function DashboardStats({ total, completedCount, percentage, subjects }) {
  const pending = total - completedCount;

  const stats = [
    { value: total,          label: 'Total Tasks', color: 'var(--accent-light)', icon: '📋' },
    { value: completedCount, label: 'Completed',   color: 'var(--success)',      icon: '✅' },
    { value: pending,        label: 'Pending',     color: 'var(--warning)',      icon: '⏳' },
    { value: `${percentage}%`, label: 'Completion', color: 'var(--accent2)',     icon: '🎯' },
    { value: subjects,       label: 'Subjects',    color: '#f472b6',             icon: '📚' },
  ];

  return (
    <div className="stats-grid">
      {stats.map(stat => (
        <div className="stat-card" key={stat.label}>
          <div style={{ fontSize: '1.4rem' }}>{stat.icon}</div>
          <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ selectedDate, user }) {
  const { label, formatted } = formatDisplayDate(selectedDate);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const userName = user?.email?.split('@')[0] || 'there';

  // ── Single shared hook instance ──────────────────────────────────────────
  // Both DashboardStats and TaskList read from this one source of truth.
  // Adding/completing/deleting a task updates `tasks` here → stats re-render instantly.
  const taskData = useTasks(selectedDate);
  const subjectCount = [...new Set(taskData.tasks.map(t => t.subject))].length;
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-title">
            {greeting}, <span>{userName}</span> 👋
          </div>
          <div className="dashboard-subtitle">
            {label === 'Today' ? '📅 ' : ''}{label} · {formatted}
          </div>
        </div>
      </div>

      {/* Stats — driven by shared taskData, update instantly on any change */}
      <DashboardStats
        total={taskData.totalCount}
        completedCount={taskData.completedCount}
        percentage={taskData.percentage}
        subjects={subjectCount}
      />

      {/* Task list — receives all hook values as props, no second fetch */}
      <div className="glass-card" style={{ padding: '24px 28px' }}>
        <TaskList
          displayDate={`${label} · ${formatted}`}
          date={selectedDate}
          taskData={taskData}
        />
      </div>
    </div>
  );
}
