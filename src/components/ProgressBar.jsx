// ProgressBar.jsx — Daily completion progress bar
export default function ProgressBar({ completed, total, percentage }) {
  return (
    <div className="progress-section glass-card" style={{ padding: '20px 24px' }}>
      <div className="progress-header">
        <div>
          <div className="progress-label">Daily Progress</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {completed} of {total} tasks completed
          </div>
        </div>
        <div className="progress-pct">{percentage}%</div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      {percentage === 100 && total > 0 && (
        <div style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--success)', fontWeight: 600 }}>
          🎉 All tasks completed! Amazing work!
        </div>
      )}
    </div>
  );
}
