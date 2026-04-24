// SubjectFilter.jsx — Clickable filter chips for subjects
// Maps subject names to colors for visual distinction

const SUBJECT_COLORS = {
  Python:     { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.35)', text: '#60a5fa', dot: '#3b82f6' },
  JavaScript: { bg: 'rgba(234,179,8,0.15)',  border: 'rgba(234,179,8,0.35)',  text: '#facc15', dot: '#eab308' },
  React:      { bg: 'rgba(14,165,233,0.15)', border: 'rgba(14,165,233,0.35)', text: '#38bdf8', dot: '#0ea5e9' },
  TypeScript: { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.35)', text: '#a5b4fc', dot: '#6366f1' },
  CSS:        { bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.35)', text: '#f472b6', dot: '#ec4899' },
  HTML:       { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.35)', text: '#fb923c', dot: '#f97316' },
  Node:       { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.35)',  text: '#4ade80', dot: '#22c55e' },
  SQL:        { bg: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.35)', text: '#2dd4bf', dot: '#14b8a6' },
  Other:      { bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.25)',text: '#9ca3af', dot: '#6b7280' },
};

export function getSubjectColor(subject) {
  return SUBJECT_COLORS[subject] || SUBJECT_COLORS.Other;
}

export function SubjectBadge({ subject }) {
  const colors = getSubjectColor(subject);
  return (
    <span className="subject-badge" style={{
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      color: colors.text,
    }}>
      <span className="subject-dot" style={{ background: colors.dot }} />
      {subject}
    </span>
  );
}

export default function SubjectFilter({ subjects, active, onChange }) {
  return (
    <div className="filter-chips">
      <button
        className={`filter-chip ${active === 'All' ? 'active' : ''}`}
        onClick={() => onChange('All')}
      >
        All
      </button>
      {subjects.map(sub => {
        const colors = getSubjectColor(sub);
        return (
          <button
            key={sub}
            className={`filter-chip ${active === sub ? 'active' : ''}`}
            onClick={() => onChange(sub)}
            style={active === sub ? {
              background: colors.bg,
              borderColor: colors.border,
              color: colors.text,
            } : {}}
          >
            <span className="subject-dot" style={{ background: colors.dot, display: 'inline-block', width: 7, height: 7, borderRadius: '50%', marginRight: 4 }} />
            {sub}
          </button>
        );
      })}
    </div>
  );
}
