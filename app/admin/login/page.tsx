"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDemoMode = !supabase;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (isDemoMode) {
      // Demo authentication bypass
      if (email === 'admin@Viswakarmaupvc.com' && password === 'admin123') {
        localStorage.setItem('Viswakarma_mock_admin_session', 'true');
        // Reload to trigger layout effect update
        window.location.href = '/admin/dashboard';
      } else {
        setError('Invalid credentials for Demo Mode. (Use admin@Viswakarmaupvc.com / admin123)');
        setLoading(false);
      }
      return;
    }

    try {
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Query the role from user_profiles table
        const { data: profile, error: profileError } = await supabase!
          .from('user_profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .maybeSingle();

        if (profileError) {
          await supabase!.auth.signOut();
          setError('Error validating admin credentials.');
        } else if (profile?.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          await supabase!.auth.signOut();
          setError('Unauthorized: Admin access required.');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-slate-200 shadow-sm bg-white">
        <CardHeader className="space-y-1.5 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Control Panel</span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded-sm bg-amber-50 text-[9px] font-bold text-amber-800 uppercase border border-amber-200">
                Demo Bypass Mode
              </span>
            )}
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            Admin Auth
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 font-semibold">
            {isDemoMode 
              ? 'Demo credentials: admin@Viswakarmaupvc.com / admin123'
              : 'Sign in with your administrator credentials.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 border-slate-200 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10 border-slate-200 text-sm font-semibold"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs uppercase tracking-wider mt-2 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
