"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, FileText, ArrowRight, LogOut, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/lib/auth';
import { loadUserDrafts, DraftRecord } from '@/features/configurator/lib/useDraft';

const STEP_NAMES = ['', 'System Type', 'Window Styles', 'Home Details', 'Finishes', 'Your Contact', 'Your Estimate'];

function statusBadge(status: string) {
  return status === 'submitted'
    ? <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Submitted</span>
    : <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold-faint text-gold border border-border-gold"><Clock className="w-3 h-3" /> In Progress</span>;
}

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [drafts, setDrafts] = useState<DraftRecord[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) { setFetching(false); return; }
    loadUserDrafts(user.id).then((d) => { setDrafts(d); setFetching(false); });
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
  const inProgress = drafts.filter((d) => d.status === 'in_progress');
  const submitted  = drafts.filter((d) => d.status === 'submitted');

  return (
    <div className="min-h-screen bg-ivory py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-border-gold bg-gold-faint px-3 py-1 rounded-full mb-3">
              My Account
            </span>
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

        {/* User card */}
        <div className="bg-white border border-border rounded-2xl p-5 flex items-center gap-4 shadow-[0_2px_12px_rgba(22,59,99,0.03)]">
          <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white text-lg font-black flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-black text-heading text-base truncate">{displayName}</p>
            <p className="text-xs text-muted truncate">{user.email}</p>
          </div>
          <User className="w-5 h-5 text-muted ml-auto flex-shrink-0" />
        </div>

        {/* In-progress drafts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" /> Saved Drafts
            </h2>
            <Link href="/quote" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gold hover:bg-gold-light text-white transition-all">
              <Sparkles className="w-3 h-3" /> New Estimate
            </Link>
          </div>

          {fetching ? (
            <div className="py-8 flex justify-center">
              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : inProgress.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-muted mx-auto" />
              <p className="text-sm font-bold text-heading">No saved drafts</p>
              <p className="text-xs text-muted">Start an estimate and your progress will be saved here automatically.</p>
              <Link href="/quote" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-white font-bold text-sm transition-all">
                <Sparkles className="w-4 h-4" /> Get Free Estimate
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {inProgress.map((draft) => (
                <div key={draft.id} className="bg-white border border-border rounded-2xl p-4 sm:p-5 hover:border-border-gold transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {statusBadge(draft.status)}
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                          Step {draft.currentStep} / 6 — {STEP_NAMES[draft.currentStep] ?? ''}
                        </span>
                      </div>
                      <p className="text-sm font-black text-heading capitalize">{draft.family} System</p>
                      {draft.selectedTypes.length > 0 && (
                        <p className="text-xs text-muted truncate">{draft.selectedTypes.join(', ')}</p>
                      )}
                      {draft.estimateLow > 0 && (
                        <p className="text-xs font-bold text-gold">
                          ₹{draft.estimateLow.toLocaleString('en-IN')} – ₹{draft.estimateHigh.toLocaleString('en-IN')} (indicative)
                        </p>
                      )}
                    </div>
                    <Link
                      href="/quote"
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-gold hover:bg-gold-light text-white transition-all"
                    >
                      Resume <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Submitted enquiries */}
        {submitted.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-black text-heading flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Submitted Enquiries
            </h2>
            <div className="space-y-3">
              {submitted.map((draft) => (
                <div key={draft.id} className="bg-white border border-border rounded-2xl p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      {statusBadge(draft.status)}
                      <p className="text-sm font-black text-heading capitalize mt-1">{draft.family} System</p>
                      {draft.selectedTypes.length > 0 && (
                        <p className="text-xs text-muted">{draft.selectedTypes.join(', ')}</p>
                      )}
                      {draft.estimateLow > 0 && (
                        <p className="text-xs font-bold text-gold">
                          ₹{draft.estimateLow.toLocaleString('en-IN')} – ₹{draft.estimateHigh.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted flex-shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
