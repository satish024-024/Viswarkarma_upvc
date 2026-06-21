"use client";
import { supabase } from './supabase';

export async function signInWithGoogle(redirectTo?: string) {
  if (!supabase) throw new Error('Supabase not initialised');
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const redirectUrl = redirectTo 
    ? `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    : `${origin}/auth/callback`;

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  });
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not initialised');
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  if (!supabase) throw new Error('Supabase not initialised');
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
}

export async function resetPassword(email: string) {
  if (!supabase) throw new Error('Supabase not initialised');
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset`,
  });
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase not initialised');
  return supabase.auth.signOut();
}
