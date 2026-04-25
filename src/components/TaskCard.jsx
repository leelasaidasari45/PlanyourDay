import { useRef, useState } from 'react';
import { SubjectBadge } from './SubjectFilter';
import AddTaskModal from './AddTaskModal';

export default function TaskCard({ task, onToggle, onCompleteWithProof, onDelete, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const handleToggle = async () => {
    if (!task.completed) {
      // If marking as complete, trigger file upload
      fileInputRef.current.click();
    } else {
      // If unmarking, just toggle (this will clear the proof in the hook)
      setToggling(true);
      try { await onToggle(task.id, task.completed); }
      finally { setToggling(false); }
    }
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setToggling(true);
    try {
      await onCompleteWithProof(task.id, Array.from(files));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setToggling(false);
      e.target.value = ''; // Reset input
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
        {/* Hidden File Input (Multiple) */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*,application/pdf"
          multiple
          onChange={handleFileChange}
        />

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
          
          {/* Multiple Proof Previews */}
          {task.proof_urls && task.proof_urls.length > 0 && (
            <div className="proof-gallery">
              {task.proof_urls.map((url, idx) => {
                const isImg = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || url.includes('image');
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
          )}
        </div>


        {/* Actions */}
        <div className="task-actions">
          {/* ── Complete / Undo button ── */}
          <button
            className={`btn btn-sm complete-btn ${task.completed ? 'complete-btn--done' : 'complete-btn--pending'}`}
            onClick={handleToggle}
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
    </>
  );
}

