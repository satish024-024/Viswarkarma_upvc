"use client";
/**
 * useDraft — Estimator draft persistence hook
 *
 * Strategy:
 *  - Guests:       state lives in sessionStorage (lost on tab close)
 *  - Logged-in:    state auto-saved to Supabase `estimator_drafts` table
 *  - Transition:   when guest logs in mid-flow, their in-memory state is
 *                  immediately upserted to their Supabase draft (no data loss)
 *  - Restore:      on mount, if user is logged in, latest in_progress draft is loaded
 */

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface DraftState {
  family: 'upvc' | 'aluminium';
  selectedTypes: string[];
  windowCount: number;
  homeSqFt: number;
  installationRequired: boolean;
  colorChoice: string;
  seriesChoice: string;
  glassChoice: string;
  meshChoice: string;
  hardwareChoice: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  callbackTime: string;
}

export interface DraftRecord extends DraftState {
  id?: string;
  currentStep: number;
  estimateLow: number;
  estimateHigh: number;
  status: 'in_progress' | 'submitted';
}

const SESSION_KEY = 'vw_estimator_draft';
const DEBOUNCE_MS = 1200;

// ─── Session storage helpers (guests) ────────────────────────────────────────

export function saveDraftToSession(draft: DraftRecord): void {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(draft)); } catch { /* ignore */ }
}

export function loadDraftFromSession(): DraftRecord | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as DraftRecord) : null;
  } catch { return null; }
}

export function clearSessionDraft(): void {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

// ─── Supabase helpers (logged-in users) ──────────────────────────────────────

export async function upsertDraft(userId: string, draft: DraftRecord): Promise<string | null> {
  if (!supabase) return null;
  const row = {
    user_id:        userId,
    status:         draft.status,
    current_step:   draft.currentStep,
    family:         draft.family,
    selected_types: draft.selectedTypes,
    window_count:   draft.windowCount,
    home_sq_ft:     draft.homeSqFt,
    installation:   draft.installationRequired,
    color_choice:   draft.colorChoice,
    series_choice:   draft.seriesChoice,
    glass_choice:   draft.glassChoice,
    mesh_choice:    draft.meshChoice,
    hardware_choice: draft.hardwareChoice,
    customer_name:  draft.customerName,
    customer_phone: draft.customerPhone,
    customer_city:  draft.customerCity,
    callback_time:  draft.callbackTime,
    estimate_low:   draft.estimateLow,
    estimate_high:  draft.estimateHigh,
  };

  if (draft.id) {
    // Update existing draft
    const { error } = await supabase
      .from('estimator_drafts')
      .update(row)
      .eq('id', draft.id)
      .eq('user_id', userId);
    if (error) console.error('[draft] update error:', error.message);
    return draft.id;
  } else {
    // Insert new draft
    const { data, error } = await supabase
      .from('estimator_drafts')
      .insert(row)
      .select('id')
      .single();
    if (error) console.error('[draft] insert error:', error.message);
    return data?.id ?? null;
  }
}

export async function loadLatestDraft(userId: string): Promise<DraftRecord | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('estimator_drafts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id:                  data.id,
    status:              data.status,
    currentStep:         data.current_step,
    family:              data.family,
    selectedTypes:       data.selected_types ?? [],
    windowCount:         data.window_count,
    homeSqFt:            data.home_sq_ft,
    installationRequired: data.installation,
    colorChoice:         data.color_choice,
    seriesChoice:        data.series_choice || '',
    glassChoice:         data.glass_choice,
    meshChoice:          data.mesh_choice,
    hardwareChoice:      data.hardware_choice || 'standard',
    customerName:        data.customer_name,
    customerPhone:       data.customer_phone,
    customerCity:        data.customer_city,
    callbackTime:        data.callback_time,
    estimateLow:         data.estimate_low,
    estimateHigh:        data.estimate_high,
  };
}

export async function markDraftSubmitted(draftId: string, userId: string): Promise<void> {
  if (!supabase) return;
  await supabase
    .from('estimator_drafts')
    .update({ status: 'submitted' })
    .eq('id', draftId)
    .eq('user_id', userId);
}

export async function loadUserDrafts(userId: string): Promise<DraftRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('estimator_drafts')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error || !data) return [];
  return data.map((d) => ({
    id:                  d.id,
    status:              d.status,
    currentStep:         d.current_step,
    family:              d.family,
    selectedTypes:       d.selected_types ?? [],
    windowCount:         d.window_count,
    homeSqFt:            d.home_sq_ft,
    installationRequired: d.installation,
    colorChoice:         d.color_choice,
    seriesChoice:        d.series_choice || '',
    glassChoice:         d.glass_choice,
    meshChoice:          d.mesh_choice,
    hardwareChoice:      d.hardware_choice || 'standard',
    customerName:        d.customer_name,
    customerPhone:       d.customer_phone,
    customerCity:        d.customer_city,
    callbackTime:        d.callback_time,
    estimateLow:         d.estimate_low,
    estimateHigh:        d.estimate_high,
  }));
}

// ─── Hook ────────────────────────────────────────────────────────────────────

interface UseDraftOptions {
  user: User | null;
  draftIdRef: React.MutableRefObject<string | null>;
  onRestore: (draft: DraftRecord) => void;
}

/**
 * Call this hook inside the Configurator.
 * Returns a `save` function to call whenever state changes.
 */
export function useDraft({ user, draftIdRef, onRestore }: UseDraftOptions) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevUserRef = useRef<string | null>(null);

  // ── On mount: restore draft ──────────────────────────────────────────────
  useEffect(() => {
    async function restore() {
      if (user) {
        // Logged-in: try Supabase first, fall back to session
        const remote = await loadLatestDraft(user.id);
        if (remote) {
          draftIdRef.current = remote.id ?? null;
          onRestore(remote);
          clearSessionDraft();
          return;
        }
        // No remote draft — check if there's a guest session draft to migrate
        const session = loadDraftFromSession();
        if (session) {
          const newId = await upsertDraft(user.id, session);
          draftIdRef.current = newId;
          onRestore(session);
          clearSessionDraft();
        }
      } else {
        // Guest: restore from sessionStorage
        const session = loadDraftFromSession();
        if (session) onRestore(session);
      }
    }
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Guest → logged-in transition: migrate session draft to Supabase ────────
  useEffect(() => {
    if (!user) { prevUserRef.current = null; return; }
    if (prevUserRef.current === user.id) return; // already handled
    prevUserRef.current = user.id;

    const session = loadDraftFromSession();
    if (session && !draftIdRef.current) {
      // Migrate guest state to Supabase (do not call onRestore — state is already loaded)
      upsertDraft(user.id, session).then((id) => {
        draftIdRef.current = id;
        clearSessionDraft();
      });
    }
  }, [user, draftIdRef]);

  // ── Save function (debounced) ─────────────────────────────────────────────
  const save = useCallback(
    (draft: DraftRecord) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        if (user) {
          const id = await upsertDraft(user.id, { ...draft, id: draftIdRef.current ?? undefined });
          if (id) draftIdRef.current = id;
        } else {
          saveDraftToSession(draft);
        }
      }, DEBOUNCE_MS);
    },
    [user, draftIdRef],
  );

  return { save };
}
