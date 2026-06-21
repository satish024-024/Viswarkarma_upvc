"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, FileText, ArrowRight, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface SavedLead {
  id: string;
  product_type: string;
  product_family: string;
  city_area: string;
  created_at: string;
  status?: string;
}

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState<SavedLead[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !supabase) { setFetching(false); return; }
    supabase
      .from('leads')
      .select('id, product_type, product_family, city_area, created_at, status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setLeads((data as SavedLead[]) ?? []);
        setFetching(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = (user.user_metadata?.full_name as string) ?? user.email ?? 'User';

  return (
    <div className="min-h-screen bg-ivory py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-border-gold bg-gold-faint px-3 py-1 rounded-full mb-3">My Account</span>
            <h1 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">
              Welcome back, {displayName.split(' ')[0]}
            </h1>
            <p className="text-sm text-muted mt-1">{user.email}</p>
          </div>
          <button
            onClick={() => signOut().then(() => router.replace('/'))}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white text-lg font-black flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-black text-heading text-base truncate">{displayName}</p>
            <p className="text-sm text-muted truncate">{user.email}</p>
          </div>
          <div className="ml-auto">
            <User className="w-5 h-5 text-muted" />
          </div>
        </div>

        {/* Saved Enquiries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-heading tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" /> My Enquiries
            </h2>
            <Link href="/quote" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gold hover:bg-gold-light text-white transition-all">
              <Sparkles className="w-3 h-3" /> New Estimate
            </Link>
          </div>

          {fetching ? (
            <div className="py-8 flex justify-center">
              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-muted mx-auto" />
              <p className="text-sm font-bold text-heading">No enquiries yet</p>
              <p className="text-xs text-muted">Get a free estimate — your details will be saved here so you can continue later.</p>
              <Link href="/quote" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-white font-bold text-sm transition-all mt-2">
                <Sparkles className="w-4 h-4" /> Get Free Estimate
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-white border border-border rounded-2xl p-4 sm:p-5 flex items-center justify-between hover:border-border-gold transition-all">
                  <div className="space-y-1">
                    <span className="block text-xs font-black uppercase tracking-wider text-gold">{lead.product_family}</span>
                    <span className="block text-sm font-bold text-heading">{lead.product_type}</span>
                    <span className="block text-xs text-muted">{lead.city_area} · {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {lead.status && (
                      <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold-faint text-gold border border-border-gold">
                        {lead.status}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
