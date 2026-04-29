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
    <div className="auth-master-container">
      {/* Dynamic Background Blobs */}
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>
      <div className="auth-blob auth-blob-3"></div>

      <div className="auth-wrapper-v3 glass-card">
        {/* Left Side: Brand & Hero */}
        <div className="auth-hero-v3">
          <div className="auth-hero-top">
            <div className="auth-brand">
              <span className="brand-icon">📅</span>
              <span className="brand-name">easyPLANNER</span>
            </div>
          </div>
          
          <div className="auth-hero-main">
            <h1>Elevate Your <br/><span>Daily Grind.</span></h1>
            <p>The smarter way to plan, track, and conquer your goals. Organize your studies and professional life in one place.</p>
            
            <div className="auth-features-list">
              <div className="feature-pill">🎯 Task Planning</div>
              <div className="feature-pill">📚 Subject Tracking</div>
              <div className="feature-pill">📸 Visual Proofs</div>
              <div className="feature-pill">🔥 Daily Streaks</div>
            </div>
          </div>
        </div>


        {/* Right Side: Form */}
        <div className="auth-form-side-v3">
          <div className="auth-form-inner">
            <div className="auth-form-header-v3">
              <h2>{tab === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{tab === 'signin' ? 'Sign in to your account to continue' : 'Start your productivity journey today'}</p>
            </div>

            {/* Premium Tabs */}
            <div className="auth-tabs-v3">
              <button 
                className={`auth-tab-v3 ${tab === 'signin' ? 'active' : ''}`} 
                onClick={() => { setTab('signin'); setError(''); setSuccess(''); }}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab-v3 ${tab === 'signup' ? 'active' : ''}`} 
                onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}
              >
                Join Now
              </button>
            </div>

            <form className="auth-form-v3" onSubmit={handleSubmit} autoComplete="off">
              {error && <div className="auth-error-v3">⚠️ {error}</div>}
              {success && <div className="auth-success-v3">✅ {success}</div>}

              <div className="form-group-v3">
                <label>Email Address</label>
                <div className="input-wrapper-v3">
                  <span className="input-icon">✉️</span>
                  <input
                    className="input-v3"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    name="user_email_unique"
                  />
                </div>
              </div>

              <div className="form-group-v3">
                <label>Password</label>
                <div className="input-wrapper-v3">
                  <span className="input-icon">🔑</span>
                  <input
                    key={tab === 'signin' ? 'signin-pw' : 'signup-pw'}
                    className="input-v3"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={tab === 'signup' ? 'Min. 6 characters' : '••••••••'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    name={tab === 'signin' ? 'user_pass_signin' : 'user_pass_signup'}
                  />
                  <button 
                    type="button" 
                    className="toggle-password-v3"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {tab === 'signup' && (
                <div className="form-group-v3">
                  <label>Confirm Password</label>
                  <div className="input-wrapper-v3">
                    <span className="input-icon">🛡️</span>
                    <input
                      key="signup-confirm-pw"
                      className="input-v3"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      name="user_pass_confirm"
                    />
                  </div>
                </div>
              )}

              <button className="auth-submit-v3" type="submit" disabled={loading}>
                {loading ? (
                  <span className="btn-loader"></span>
                ) : (
                  tab === 'signin' ? 'Sign In' : 'Sign Up Free'
                )}
              </button>
            </form>

            <div className="auth-switch-v3">
              {tab === 'signin' ? "New here? " : 'Already a member? '}
              <button 
                type="button" 
                onClick={() => { setTab(tab === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}
              >
                {tab === 'signin' ? 'Create an account' : 'Sign in here'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


