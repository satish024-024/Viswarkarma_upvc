"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: string | null;
  isAdmin: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  role: null,
  isAdmin: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  isLoginModalOpen: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      // Demo authentication local storage check
      const mockSession = typeof window !== 'undefined' ? localStorage.getItem('viswarkarma_mock_admin_session') : null;
      if (mockSession === 'true') {
        setRole('admin');
      } else {
        setRole('user');
      }
      return;
    }

    let active = true;

    async function checkUser() {
      setLoading(true);
      const { data } = await supabase!.auth.getSession();
      const currentSession = data.session;
      const currentUser = currentSession?.user ?? null;

      if (!currentUser) {
        if (active) {
          setSession(null);
          setUser(null);
          setRole(null);
          setLoading(false);
        }
        return;
      }

      // Fetch role
      try {
        const { data: profile } = await supabase!
          .from('user_profiles')
          .select('role')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (active) {
          setSession(currentSession);
          setUser(currentUser);
          setRole(profile?.role || 'user');
          setLoading(false);
        }
      } catch {
        if (active) {
          setSession(currentSession);
          setUser(currentUser);
          setRole('user');
          setLoading(false);
        }
      }
    }

    checkUser();

    // Listen for auth changes
    const { data: listener } = supabase!.auth.onAuthStateChange(async (_event, s) => {
      const currentUser = s?.user ?? null;
      if (!currentUser) {
        if (active) {
          setSession(null);
          setUser(null);
          setRole(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const { data: profile } = await supabase!
          .from('user_profiles')
          .select('role')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (active) {
          setSession(s);
          setUser(currentUser);
          setRole(profile?.role || 'user');
          setLoading(false);
        }
      } catch {
        if (active) {
          setSession(s);
          setUser(currentUser);
          setRole('user');
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider value={{ user, session, loading, role, isAdmin, openLoginModal, closeLoginModal, isLoginModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
