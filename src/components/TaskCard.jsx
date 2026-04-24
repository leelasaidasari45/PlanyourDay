// TaskCard.jsx — Individual task row with complete button, edit, and delete
import { useState } from 'react';
import { SubjectBadge } from './SubjectFilter';
import AddTaskModal from './AddTaskModal';

export default function TaskCard({ task, onToggle, onDelete, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggle(task.id, task.completed); }
    finally { setToggling(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setDeleting(true);
    try { await onDelete(task.id); }
    catch { setDeleting(false); }
  };

  const handleUpdate = async (updates) => {
    await onUpdate(task.id, updates);
  };

  return (
    <>
      <div className={`task-card ${task.completed ? 'completed' : ''}`}>
        {/* Body */}
        <div className="task-body">
          <div className="task-meta">
            <SubjectBadge subject={task.subject} />
          </div>
          <div className="task-title" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title}
          </div>
          {task.notes && <div className="task-notes">📝 {task.notes}</div>}
        </div>

        {/* Actions */}
        <div className="task-actions">
          {/* ── Complete / Undo button ── */}
          <button
            className={`btn btn-sm complete-btn ${task.completed ? 'complete-btn--done' : 'complete-btn--pending'}`}
            onClick={handleToggle}
            disabled={toggling}
            title={task.completed ? 'Mark as pending' : 'Mark as completed'}
          >
            {toggling
              ? '…'
              : task.completed
                ? '↩ Undo'
                : '✓ Complete'}
          </button>

          {/* Edit */}
          <button
            className="btn-icon"
            onClick={() => setShowEdit(true)}
            title="Edit task"
            style={{ fontSize: '0.85rem' }}
          >
            ✏️
          </button>

          {/* Delete */}
          <button
            className="btn-icon btn-danger"
            onClick={handleDelete}
            title="Delete task"
            disabled={deleting}
            style={{ fontSize: '0.85rem' }}
          >
            🗑️
          </button>
        </div>
      </div>

      {showEdit && (
        <AddTaskModal
          editTask={task}
          onClose={() => setShowEdit(false)}
          onSave={handleUpdate}
        />
      )}
    </>
  );
}
