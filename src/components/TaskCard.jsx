import { useState } from 'react';
import { SubjectBadge } from './SubjectFilter';
import AddTaskModal from './AddTaskModal';
import CompleteTaskModal from './CompleteTaskModal';

export default function TaskCard({ task, onToggle, onCompleteWithProof, onDelete, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggleClick = async () => {
    if (!task.completed) {
      // Open modal to add proofs first
      setShowCompleteModal(true);
    } else {
      // If unmarking, just toggle
      setToggling(true);
      try { await onToggle(task.id, task.completed); }
      finally { setToggling(false); }
    }
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
            {task.proof_urls && task.proof_urls.length > 0 && (
              <span className="proof-count">
                🖼️ {task.proof_urls.length} Proof{task.proof_urls.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="task-title" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title}
          </div>
          {task.notes && <div className="task-notes">📝 {task.notes}</div>}
          
          {/* Multiple Proof Previews (Handles both array and single string for compatibility) */}
          {(() => {
            const urls = Array.isArray(task.proof_urls) 
              ? task.proof_urls 
              : (task.proof_urls ? [task.proof_urls] : []);
            
            if (urls.length === 0) return null;

            return (
              <div className="proof-gallery">
                {urls.map((url, idx) => {
                  const isImg = typeof url === 'string' && (url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || url.includes('image'));
                  return (
                    <div key={idx} className="proof-item">
                      {isImg ? (
                        <div className="proof-preview">
                          <img src={url} alt={`Proof ${idx + 1}`} onClick={() => window.open(url, '_blank')} />
                        </div>
                      ) : (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="proof-link">
                          📄 Doc {idx + 1}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Actions */}
        <div className="task-actions">
          {/* ── Complete / Undo button ── */}
          <button
            className={`btn btn-sm complete-btn ${task.completed ? 'complete-btn--done' : 'complete-btn--pending'}`}
            onClick={handleToggleClick}
            disabled={toggling}
            title={task.completed ? 'Mark as pending' : 'Mark as completed (requires proof)'}
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

      {showCompleteModal && (
        <CompleteTaskModal
          task={task}
          onClose={() => setShowCompleteModal(false)}
          onComplete={onCompleteWithProof}
        />
      )}
    </>
  );
}
