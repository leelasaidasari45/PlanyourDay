// StreakBadge.jsx — Shows consecutive days with completed tasks
import { useStreak } from '../hooks/useStreak';

export default function StreakBadge() {
  const { streak, loading } = useStreak();

  if (loading) return null;

  return (
    <div className="streak-badge">
      <span className="streak-flame">🔥</span>
      <span className="streak-count">{streak}</span>
      <div className="streak-text">
        <span style={{ fontWeight: 600, color: 'var(--warning)' }}>Day Streak</span><br />
        {streak === 0
          ? 'Complete tasks to start!'
          : streak === 1
          ? 'Keep it going today!'
          : `${streak} days strong!`}
      </div>
    </div>
  );
}
