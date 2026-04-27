// AddTaskModal.jsx — Modal for adding and editing tasks
import { useState, useEffect } from 'react';

const SUBJECTS = ['DSA', 'Python', 'JavaScript', 'React', 'TypeScript', 'CSS', 'HTML', 'Node', 'SQL', 'Other'];

export default function AddTaskModal({ onClose, onSave, editTask = null }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Python');
  const [notes, setNotes] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill when editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setNotes(editTask.notes || '');
      if (SUBJECTS.includes(editTask.subject)) {
        setSubject(editTask.subject);
      } else {
        setSubject('Other');
        setCustomSubject(editTask.subject);
      }
    }
  }, [editTask]);

  const getFinalSubject = () => {
    if (subject === 'Other' && customSubject.trim()) return customSubject.trim();
    return subject;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    setError('');
    setLoading(true);
    try {
      await onSave({ title, subject: getFinalSubject(), notes });
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">{editTask ? '✏️ Edit Task' : '➕ Add New Task'}</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="auth-error">⚠️ {error}</div>}

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. Learn Python loops"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Subject */}
            <div className="form-group">
              <label className="form-label">Subject / Category</label>
              <select
                className="input"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Custom subject if Other */}
            {subject === 'Other' && (
              <div className="form-group">
                <label className="form-label">Custom Subject Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. Machine Learning"
                  value={customSubject}
                  onChange={e => setCustomSubject(e.target.value)}
                />
              </div>
            )}

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <textarea
                className="input"
                placeholder="Add any additional notes or resources…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Saving…' : editTask ? '💾 Save Changes' : '✅ Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
