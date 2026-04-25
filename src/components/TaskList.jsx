// TaskList.jsx — Task list for the selected date with filter + add button
// Receives taskData as prop from Dashboard (shared state — no duplicate fetch)
import { useState } from 'react';
import TaskCard from './TaskCard';
import ProgressBar from './ProgressBar';
import SubjectFilter from './SubjectFilter';
import AddTaskModal from './AddTaskModal';

export default function TaskList({ displayDate, date, taskData }) {
  // Destructure everything from the shared hook instance passed down from Dashboard
  const {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    completeWithProof,
    updateTask,
    deleteTask,
    completedCount,
    totalCount,
    percentage,
  } = taskData;

  const [showModal, setShowModal] = useState(false);
  const [activeSubject, setActiveSubject] = useState('All');

  // Get unique subjects from current tasks
  const subjects = [...new Set(tasks.map(t => t.subject))];

  // Reset subject filter if active subject no longer exists (e.g. after delete)
  const validSubject = subjects.includes(activeSubject) ? activeSubject : 'All';

  // Filtered view
  const filtered = validSubject === 'All' ? tasks : tasks.filter(t => t.subject === validSubject);
  const pending   = filtered.filter(t => !t.completed);
  const completed = filtered.filter(t => t.completed);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="section-title" style={{ marginBottom: 2 }}>
            📋 Tasks for {displayDate}
          </h2>
          {totalCount > 0 && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {completedCount}/{totalCount} completed
            </span>
          )}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          ＋ Add Task
        </button>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div style={{ marginBottom: 20 }}>
          <ProgressBar completed={completedCount} total={totalCount} percentage={percentage} />
        </div>
      )}

      {/* Subject filter chips */}
      {subjects.length > 1 && (
        <SubjectFilter
          subjects={subjects}
          active={validSubject}
          onChange={setActiveSubject}
        />
      )}

      {/* Loading */}
      {loading && (
        <div style={{ padding: '40px 0' }}>
          <div className="spinner" />
        </div>
      )}

      {/* Error */}
      {error && <div className="auth-error">⚠️ {error}</div>}

      {/* Empty state */}
      {!loading && !error && tasks.length === 0 && (() => {
        const today = new Date().toISOString().split('T')[0];
        const isPast = date < today;
        return (
          <div className="empty-state glass-card">
            <span className="empty-icon">{isPast ? '📅' : '📝'}</span>
            <strong style={{ color: 'var(--text-secondary)' }}>
              {isPast ? 'No tasks recorded for this day' : 'No tasks yet for this day'}
            </strong>
            <p>{isPast ? 'You didn\'t log any tasks for this date.' : 'Click "Add Task" to plan your day!'}</p>
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => setShowModal(true)}>
              ＋ {isPast ? 'Log Task Retroactively' : 'Add Your First Task'}
            </button>
          </div>
        );
      })()}

      {/* Pending tasks */}
      {!loading && pending.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            ⏳ Pending ({pending.length})
          </div>
          <div className="task-list">
            {pending.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onCompleteWithProof={completeWithProof}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed tasks */}
      {!loading && completed.length > 0 && (
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            ✅ Completed ({completed.length})
          </div>
          <div className="task-list">
            {completed.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onCompleteWithProof={completeWithProof}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add task modal */}
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onSave={addTask}
        />
      )}
    </div>
  );
}
