import { useState, useRef } from 'react';

export default function CompleteTaskModal({ task, onClose, onComplete }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    e.target.value = ''; // Reset for consecutive selections
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please add at least one proof image or document.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onComplete(task.id, files);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to upload proofs.');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2 className="modal-title">📸 Add Completion Proof</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            Task: <strong style={{ color: 'var(--text-primary)' }}>{task.title}</strong>
          </p>

          {error && <div className="auth-error" style={{ marginBottom: 15 }}>⚠️ {error}</div>}

          {/* Staged Files List */}
          <div className="staged-files">
            {files.length > 0 ? (
              <div className="staged-grid">
                {files.map((file, idx) => (
                  <div key={idx} className="staged-item glass-card">
                    <div className="staged-info">
                      <span className="file-icon">{file.type.startsWith('image/') ? '🖼️' : '📄'}</span>
                      <span className="file-name">{file.name}</span>
                    </div>
                    <button className="remove-staged" onClick={() => removeFile(idx)}>✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-staging">
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>📤</div>
                <p>No files added yet</p>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            onChange={handleFileSelect}
            accept="image/*,application/pdf"
          />

          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: 12, borderStyle: 'dashed' }}
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            ➕ {files.length > 0 ? 'Add More Proofs' : 'Select Proof Files'}
          </button>
        </div>

        <div className="modal-footer" style={{ marginTop: 20 }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={loading || files.length === 0}
          >
            {loading ? '⏳ Uploading…' : '✅ Mark as Completed'}
          </button>
        </div>
      </div>
    </div>
  );
}
