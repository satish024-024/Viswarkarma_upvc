"use client";
import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } from '@/lib/auth';

type Screen = 'login' | 'signup' | 'forgot';

interface FieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  toggleable?: boolean;
}

function Field({ id, label, type, value, onChange, placeholder, icon, toggleable }: FieldProps) {
  const [visible, setVisible] = useState(false);
  const inputType = toggleable ? (visible ? 'text' : 'password') : type;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-bold text-heading uppercase tracking-wider">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-[#F7FAFC] text-heading text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold-light transition-all"
        />
        {toggleable && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AuthModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuth();
  const [screen, setScreen] = useState<Screen>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const reset = () => { setError(''); setSuccess(''); };
  const go = (s: Screen) => { setScreen(s); reset(); };

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);
    try {
      const { error: e } = await signInWithGoogle();
      if (e) setError(e.message);
    } catch { setError('Could not connect. Please try again.'); }
    setLoading(false);
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const { error: err } = await signInWithEmail(email, password);
      if (err) setError(err.message);
      else closeLoginModal();
    } catch { setError('Login failed. Please try again.'); }
    setLoading(false);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const { error: err } = await signUpWithEmail(email, password, name);
      if (err) setError(err.message);
      else { setSuccess('Account created! Check your email to confirm.'); setScreen('login'); }
    } catch { setError('Sign up failed. Please try again.'); }
    setLoading(false);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true);
    try {
      const { error: err } = await resetPassword(email);
      if (err) setError(err.message);
      else setSuccess('Password reset link sent to your email.');
    } catch { setError('Could not send reset link. Please try again.'); }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeLoginModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-gold via-gold-light to-[#3F78A8]" />

        <div className="p-7 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-gold-faint border border-border flex items-center justify-center font-black text-gold text-xs">V</div>
                <span className="text-xs font-bold text-gold uppercase tracking-widest">Viswarkarma</span>
              </div>
              <h2 className="text-xl font-black text-heading tracking-tight">
                {screen === 'login' && 'Welcome Back'}
                {screen === 'signup' && 'Create Account'}
                {screen === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-xs text-muted mt-0.5">
                {screen === 'login' && 'Save your requirements and continue where you left off.'}
                {screen === 'signup' && 'Save your enquiry details and track your order.'}
                {screen === 'forgot' && "We'll send a reset link to your email."}
              </p>
            </div>
            <button
              onClick={closeLoginModal}
              className="p-2 -mr-2 -mt-1 rounded-lg text-muted hover:text-heading hover:bg-cream transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-2 px-3.5 py-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 px-3.5 py-3 mb-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Google Button — shown on login & signup screens */}
          {screen !== 'forgot' && (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-white hover:bg-cream text-heading font-bold text-sm transition-all shadow-sm hover:shadow disabled:opacity-60"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-muted font-medium">or</span>
                <div className="flex-1 border-t border-border" />
              </div>
            </>
          )}

          {/* Login Form */}
          {screen === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Field id="login-email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} />
              <Field id="login-pass" label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" icon={<Lock className="w-4 h-4" />} toggleable />
              <div className="text-right">
                <button type="button" onClick={() => go('forgot')} className="text-xs text-gold hover:underline font-semibold">Forgot password?</button>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-white font-bold text-sm transition-all shadow-sm hover:shadow disabled:opacity-60">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
              <p className="text-center text-xs text-muted">
                No account?{' '}
                <button type="button" onClick={() => go('signup')} className="text-gold font-bold hover:underline">Create one free</button>
              </p>
            </form>
          )}

          {/* Signup Form */}
          {screen === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <Field id="signup-name" label="Full Name" type="text" value={name} onChange={setName} placeholder="Ravi Kumar" icon={<User className="w-4 h-4" />} />
              <Field id="signup-email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} />
              <Field id="signup-pass" label="Password" type="password" value={password} onChange={setPassword} placeholder="Min 6 characters" icon={<Lock className="w-4 h-4" />} toggleable />
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-white font-bold text-sm transition-all shadow-sm hover:shadow disabled:opacity-60">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
              <p className="text-center text-xs text-muted">
                Already have an account?{' '}
                <button type="button" onClick={() => go('login')} className="text-gold font-bold hover:underline">Sign in</button>
              </p>
            </form>
          )}

          {/* Forgot Password Form */}
          {screen === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <Field id="forgot-email" label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} />
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-white font-bold text-sm transition-all shadow-sm hover:shadow disabled:opacity-60">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
              <p className="text-center text-xs text-muted">
                Remembered it?{' '}
                <button type="button" onClick={() => go('login')} className="text-gold font-bold hover:underline">Back to sign in</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
