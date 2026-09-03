import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { ApiService, setAuthToken } from '@/services/api';

export function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authView,
    setAuthView,
    setUser,
  } = useAppContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const mapBackendUser = (backendUser: any) => ({
    id: String(backendUser.id),
    name: backendUser.full_name,
    email: backendUser.email,
    demoBalance: Number(backendUser.demo_balance ?? 1250),
    joinedDate: backendUser.created_at
      ? new Date(backendUser.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Recently',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authView === 'login') {
        const res = await ApiService.login(email, password);
        if (res.success && res.access_token) {
          setAuthToken(res.access_token);
          // Both login & register now return user object directly
          if ((res as any).user) {
            setUser(mapBackendUser((res as any).user));
          } else {
            // Fallback: fetch user separately
            const userData = await ApiService.getUser();
            if (userData) setUser(mapBackendUser(userData));
          }
          setIsAuthModalOpen(false);
        } else {
          setError((res as any).detail || 'Login failed. Check your email and password.');
        }
      } else {
        const res = await ApiService.register(name, email, password);
        if (res.success && res.access_token) {
          setAuthToken(res.access_token);
          if ((res as any).user) {
            setUser(mapBackendUser((res as any).user));
          } else {
            const userData = await ApiService.getUser();
            if (userData) setUser(mapBackendUser(userData));
          }
          setIsAuthModalOpen(false);
        } else {
          setError((res as any).detail || 'Registration failed. Email may already be in use.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-kb-card border border-kb-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-kb-border bg-kb-elevated">
          <div>
            <h2 className="text-base font-black tracking-wide text-kb-primary">
              {authView === 'login' ? '👋 Welcome Back' : '🎉 Create Account'}
            </h2>
            <p className="text-[11px] text-kb-secondary mt-0.5">
              {authView === 'login' ? 'Sign in to your KingsBet account' : 'Join thousands of winners on KingsBet'}
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-kb-secondary hover:text-kb-primary hover:bg-kb-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              error.includes('successful') ? 'bg-kb-green/20 text-kb-green border border-kb-green/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authView === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-kb-secondary uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-kb-muted">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-kb-elevated border border-kb-border rounded-lg py-2.5 pl-10 pr-3 text-sm text-kb-primary focus:border-kb-green focus:ring-1 focus:ring-kb-green outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-kb-secondary uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-kb-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-kb-elevated border border-kb-border rounded-lg py-2.5 pl-10 pr-3 text-sm text-kb-primary focus:border-kb-green focus:ring-1 focus:ring-kb-green outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-kb-secondary uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-kb-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-kb-elevated border border-kb-border rounded-lg py-2.5 pl-10 pr-3 text-sm text-kb-primary focus:border-kb-green focus:ring-1 focus:ring-kb-green outline-none transition-all"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-kb-green hover:bg-kb-green-d text-white font-black py-3 rounded-lg shadow-lg shadow-kb-green/20 transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {authView === 'login' ? 'Login to Account' : 'Create Free Account'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-kb-secondary">
            {authView === 'login' ? (
              <p>
                New to KingsBet?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthView('register'); setError(''); }}
                  className="font-bold text-kb-yellow hover:underline"
                >
                  Register for free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthView('login'); setError(''); }}
                  className="font-bold text-kb-green hover:underline"
                >
                  Login here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
