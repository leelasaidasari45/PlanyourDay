// AuthPage.jsx — Beautiful multi-user sign in / sign up page
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthPage() {
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);

    if (tab === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess('Account created! Check your email to confirm, then sign in.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper glass-card">
        {/* Left Side: Hero Illustration & Marketing */}
        <div className="auth-hero">
          <div className="auth-hero-content">
            <div className="auth-badge">✨ Now live: v2.0</div>
            <h1>Master Your Time with <br/><span>easyPLANNER</span></h1>
            <p>The ultimate productivity companion for students and professionals. Track subjects, manage tasks, and build unstoppable streaks.</p>
            
            <div className="auth-features">
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span>Real-time Sync</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Subject Tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📸</span>
                <span>Visual Proof</span>
              </div>
            </div>
          </div>
          <div className="auth-hero-image">
            <img src="/auth-hero.png" alt="easyPLANNER Productivity" />
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="auth-form-side">
          <div className="auth-form-header">
            <div className="auth-mini-logo">📅</div>
            <h2>{tab === 'signin' ? 'Welcome Back' : 'Get Started'}</h2>
            <p>{tab === 'signin' ? 'Enter your details to access your dashboard' : 'Create an account to start planning your success'}</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'signin' ? 'active' : ''}`} onClick={() => { setTab('signin'); setError(''); setSuccess(''); }}>
              Sign In
            </button>
            <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}>
              Sign Up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">⚠️ {error}</div>}
            {success && <div className="auth-success">✅ {success}</div>}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-action">
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={tab === 'signup' ? 'Min. 6 characters' : 'Your password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                />
                <button 
                  type="button" 
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {tab === 'signup' && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-with-action">
                  <input
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 10 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  {tab === 'signin' ? 'Verifying…' : 'Processing…'}
                </span>
              ) : (
                tab === 'signin' ? 'Sign In Now' : 'Create Free Account'
              )}
            </button>

            <div className="auth-footer">
              {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" className="auth-footer-btn" onClick={() => { setTab(tab === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}>
                {tab === 'signin' ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

