"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send, Sparkles, AlertCircle, Shield, CheckCircle2, LogIn, Save } from 'lucide-react';
import { ProductFamily, ProductType, ColorOption, GlassOption, MeshOption } from '../types';
import { 
  createQuoteRequest, 
  getProductTypes, 
  getColorOptions, 
  getGlassOptions, 
  getMeshOptions 
} from '@/lib/supabase';
import { businessSettings } from '@/lib/data/business';
import { 
  productTypes as localTypes, 
  colorOptions as localColors, 
  glassOptions as localGlass, 
  meshOptions as localMesh 
} from '../config/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useDraft, markDraftSubmitted, DraftRecord } from '../lib/useDraft';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

interface HomeEstimatorState {
  family: 'upvc' | 'aluminium';
  selectedTypes: string[];
  windowCount: number;
  homeSqFt: number;
  installationRequired: boolean;
  colorChoice: string;
  glassChoice: string;
  meshChoice: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  callbackTime: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEPS = [
  { id: 1, name: 'System Type' },
  { id: 2, name: 'Window Styles' },
  { id: 3, name: 'Home Details' },
  { id: 4, name: 'Finishes' },
  { id: 5, name: 'Your Contact' },
  { id: 6, name: 'Your Estimate' },
];

const CALLBACK_OPTIONS = [
  { id: 'morning',   label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening',   label: 'Evening' },
];

const SQ_FT_PRESETS = [500, 750, 1000, 1200, 1500, 2000, 2500, 3000] as const;

const INITIAL_STATE: HomeEstimatorState = {
  family: 'upvc',
  selectedTypes: [],
  windowCount: 10,
  homeSqFt: 1200,
  installationRequired: true,
  colorChoice: 'white',
  glassChoice: 'clear',
  meshChoice: 'none',
  customerName: '',
  customerPhone: '',
  customerCity: '',
  callbackTime: 'morning',
};

interface ConfiguratorProps {
  initialFamily?: ProductFamily;
}

export default function Configurator({ initialFamily }: ConfiguratorProps) {
  const { user, openLoginModal } = useAuth();
  const draftIdRef = useRef<string | null>(null);

  const [types, setTypes] = useState<ProductType[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [glass, setGlass] = useState<GlassOption[]>([]);
  const [mesh, setMesh] = useState<MeshOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState<HomeEstimatorState>({
    ...INITIAL_STATE,
    family: initialFamily === 'aluminium' ? 'aluminium' : 'upvc',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customSqFt, setCustomSqFt] = useState('');
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [dbError, setDbError] = useState(false);

  // Load database options on mount
  useEffect(() => {
    let active = true;
    async function loadConfig() {
      try {
        const dbPromise = Promise.all([
          getProductTypes(true),
          getColorOptions(true),
          getGlassOptions(true),
          getMeshOptions(true)
        ]);

        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Supabase request timeout')), 4500)
        );

        const [dbTypes, dbColors, dbGlass, dbMesh] = await Promise.race([
          dbPromise,
          timeoutPromise
        ]);

        if (active) {
          setTypes(dbTypes);
          setColors(dbColors);
          setGlass(dbGlass);
          setMesh(dbMesh);
          setLoading(false);

          // Update default choices if needed
          const initialColor = dbColors.find(c => c.family === state.family)?.id || dbColors[0]?.id || 'white';
          const initialGlass = dbGlass.find(g => g.family === state.family)?.id || dbGlass[0]?.id || 'clear';
          const initialMesh = dbMesh.find(m => m.family === state.family)?.id || dbMesh[0]?.id || 'none';

          setState(prev => ({
            ...prev,
            colorChoice: prev.colorChoice || initialColor,
            glassChoice: prev.glassChoice || initialGlass,
            meshChoice: prev.meshChoice || initialMesh,
          }));
        }
      } catch (err) {
        console.error("Failed to load configurator db data", err);
        if (active) {
          const isProduction = process.env.NODE_ENV === 'production';
          if (isProduction) {
            setDbError(true);
            setLoading(false);
          } else {
            // Fallback to local config data (development only)
            setTypes(localTypes);
            setColors(localColors);
            setGlass(localGlass);
            setMesh(localMesh);
            setLoading(false);
          }
        }
      }
    }
    loadConfig();
    return () => { active = false; };
  }, [state.family]);

  // Dynamic base price from selected window styles in database
  const getBasePrice = (family: 'upvc' | 'aluminium', selectedTypes: string[]): number => {
    if (selectedTypes.length === 0) return family === 'upvc' ? 500 : 650;
    
    let totalBase = 0;
    let count = 0;
    selectedTypes.forEach(styleId => {
      const match = types.find(t => t.id === styleId);
      if (match) {
        totalBase += match.basePricePerSqFt;
        count++;
      }
    });
    
    return count > 0 ? (totalBase / count) : (family === 'upvc' ? 500 : 650);
  };

  const computeEstimate = (st: HomeEstimatorState): { min: number; max: number; area: number } => {
    const area = Math.max(st.homeSqFt * 0.12, st.windowCount * 16);
    const base = getBasePrice(st.family, st.selectedTypes);
    
    const glassObj = glass.find(g => g.id === st.glassChoice) || glass.find(g => g.family === st.family) || { priceModifierPerSqFt: 0 };
    const meshObj = mesh.find(m => m.id === st.meshChoice) || mesh.find(m => m.family === st.family) || { priceModifierPerSqFt: 0 };
    const colorObj = colors.find(c => c.id === st.colorChoice) || colors.find(c => c.family === st.family) || { priceMultiplier: 1.0 };
    
    const glassMod = glassObj.priceModifierPerSqFt || 0;
    const meshMod = meshObj.priceModifierPerSqFt || 0;
    const colorMultiplier = colorObj.priceMultiplier || 1.0;
    
    const installationCost = st.installationRequired ? 60 : 0;
    
    const unitPrice = ((base + glassMod + meshMod) * colorMultiplier + installationCost) * area;
    return { min: Math.round(unitPrice), max: Math.round(unitPrice * 1.15), area: Math.round(area) };
  };

  const buildWhatsAppMessage = (st: HomeEstimatorState, min: number, max: number): string => {
    const familyStyles = types.filter(t => t.family === st.family);
    const familyColors = colors.filter(c => !c.family || c.family === st.family);
    const familyGlass = glass.filter(g => !g.family || g.family === st.family);
    const familyMesh = mesh.filter(m => !m.family || m.family === st.family);

    const typesLabel = st.selectedTypes.length
      ? st.selectedTypes.map(id => familyStyles.find(w => w.id === id)?.name ?? id).join(', ')
      : 'Not selected';
    const colorLabel = familyColors.find(c => c.id === st.colorChoice)?.name ?? st.colorChoice;
    const glassLabel = familyGlass.find(g => g.id === st.glassChoice)?.name ?? st.glassChoice;
    const meshLabel  = familyMesh.find(m => m.id === st.meshChoice)?.name  ?? st.meshChoice;
    const cbLabel    = CALLBACK_OPTIONS.find(c => c.id === st.callbackTime)?.label ?? st.callbackTime;

    return [
      `🏠 *Whole-Home Estimator Enquiry*`,
      ``,
      `*System:* ${st.family === 'upvc' ? 'uPVC' : 'Aluminium'}`,
      `*Window Types:* ${typesLabel}`,
      `*Window/Door Count:* ${st.windowCount}`,
      `*Home Floor Area:* ${st.homeSqFt} sq.ft.`,
      `*Installation Required:* ${st.installationRequired ? 'Yes' : 'No'}`,
      ``,
      `*Frame Colour:* ${colorLabel}`,
      `*Glass Type:* ${glassLabel}`,
      `*Flyscreen:* ${meshLabel}`,
      ``,
      `*Estimate Range:* ₹${min.toLocaleString('en-IN')} – ₹${max.toLocaleString('en-IN')}`,
      ``,
      `*Customer Details*`,
      `Name: ${st.customerName}`,
      `Phone: ${st.customerPhone}`,
      `City / Area: ${st.customerCity}`,
      `Preferred Callback: ${cbLabel}`,
      ``,
      `_Kindly arrange a free site measurement at the earliest._`,
    ].join('\n');
  };

  // Build the current draft record from live state
  function buildDraft(overrideStep?: number): DraftRecord {
    const { min: dMin, max: dMax } = computeEstimate(state);
    return {
      id: draftIdRef.current ?? undefined,
      status: 'in_progress',
      currentStep: overrideStep ?? currentStep,
      family: state.family,
      selectedTypes: state.selectedTypes,
      windowCount: state.windowCount,
      homeSqFt: state.homeSqFt,
      installationRequired: state.installationRequired,
      colorChoice: state.colorChoice,
      glassChoice: state.glassChoice,
      meshChoice: state.meshChoice,
      customerName: state.customerName,
      customerPhone: state.customerPhone,
      customerCity: state.customerCity,
      callbackTime: state.callbackTime,
      estimateLow: dMin,
      estimateHigh: dMax,
    };
  }

  // Restore state from a loaded draft
  function handleRestore(draft: DraftRecord) {
    setState({
      family: draft.family as 'upvc' | 'aluminium',
      selectedTypes: draft.selectedTypes,
      windowCount: draft.windowCount,
      homeSqFt: draft.homeSqFt,
      installationRequired: draft.installationRequired,
      colorChoice: draft.colorChoice,
      glassChoice: draft.glassChoice,
      meshChoice: draft.meshChoice,
      customerName: draft.customerName,
      customerPhone: draft.customerPhone,
      customerCity: draft.customerCity,
      callbackTime: draft.callbackTime,
    });
    setCurrentStep(draft.currentStep > 0 ? draft.currentStep : 1);
  }

  const { save } = useDraft({ user, draftIdRef, onRestore: handleRestore });

  // Auto-save when state or step changes
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (!loading) {
      save(buildDraft());
    }
    setSaveIndicator(true);
    const t = setTimeout(() => setSaveIndicator(false), 1800);
    return () => clearTimeout(t);
  }, [state, currentStep, loading]);

  const handleFamilyChange = (newFamily: 'upvc' | 'aluminium') => {
    if (newFamily === state.family) return;
    
    const familyColors = colors.filter(c => !c.family || c.family === newFamily);
    const familyGlass = glass.filter(g => !g.family || g.family === newFamily);
    const familyMesh = mesh.filter(m => !m.family || m.family === newFamily);

    const defaultColor = familyColors[0]?.id || (newFamily === 'upvc' ? 'white' : 'anodized_silver');
    const defaultGlass = familyGlass[0]?.id || (newFamily === 'upvc' ? 'clear' : 'clear_alu');
    const defaultMesh = familyMesh[0]?.id || (newFamily === 'upvc' ? 'none' : 'none_alu');

    setState(prev => ({
      ...prev,
      family: newFamily,
      selectedTypes: [],
      colorChoice: defaultColor,
      glassChoice: defaultGlass,
      meshChoice: defaultMesh,
    }));
  };

  const validate = (): string => {
    if (currentStep === 2 && state.selectedTypes.length === 0) {
      return 'Please select at least one window style.';
    }
    if (currentStep === 3) {
      if (state.windowCount < 3 || state.windowCount > 200) return 'Window count must be between 3 and 200.';
      if (state.homeSqFt < 100) return 'Please enter a valid home floor area.';
    }
    if (currentStep === 5) {
      if (!state.customerName.trim()) return 'Please enter your name.';
      if (state.customerPhone.replace(/\D/g, '').length !== 10) return 'Please enter a valid 10-digit phone number.';
      if (!state.customerCity.trim()) return 'Please enter your city / area.';
    }
    return '';
  };

  const handleNext = () => {
    const msg = validate();
    if (msg) { setError(msg); return; }
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const toggleType = (id: string) => {
    setState(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(id)
        ? prev.selectedTypes.filter(t => t !== id)
        : [...prev.selectedTypes, id],
    }));
  };

  const { min: estimatedMin, max: estimatedMax, area: estimatedArea } = computeEstimate(state);

  const handleWhatsAppSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createQuoteRequest({
        customer_name: state.customerName,
        phone: state.customerPhone,
        city_area: state.customerCity,
        product_family: state.family,
        product_type: state.selectedTypes.join(', '),
        series: '',
        width: 0,
        height: 0,
        units: state.windowCount,
        colour: state.colorChoice,
        glass: state.glassChoice,
        mesh: state.meshChoice,
        hardware: 'standard',
        installation_required: state.installationRequired,
        callback_time: state.callbackTime,
        estimate_low: estimatedMin,
        estimate_high: estimatedMax,
      });
      // Mark draft as submitted so it doesn't show as resumable
      if (user && draftIdRef.current) {
        await markDraftSubmitted(draftIdRef.current, user.id);
        draftIdRef.current = null;
      }
    } catch (err) {
      console.error('Error storing lead in database:', err);
    } finally {
      setIsSubmitting(false);
    }
    const message = buildWhatsAppMessage(state, estimatedMin, estimatedMax);
    const cleanPhone = businessSettings.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // ---------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------

  const renderStepIndicator = () => (
    <>
      <div className="relative mb-10 hidden md:block">
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-border/80 -translate-y-1/2 z-0" />
        <div className="flex justify-between items-center relative z-10">
          {STEPS.map(step => {
            const isActive    = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs border transition-all duration-300 ${
                    isActive
                      ? 'bg-gold border-gold text-white shadow-sm ring-4 ring-gold/10 scale-105 font-bold'
                      : isCompleted
                      ? 'bg-gold-pale border-gold text-gold'
                      : 'bg-white text-muted border-border'
                  }`}
                >
                  {isCompleted ? '✓' : step.id}
                </div>
                <span className={`mt-2 text-[11px] font-semibold tracking-wide uppercase ${isActive ? 'text-gold' : isCompleted ? 'text-gold/80' : 'text-muted'}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="md:hidden flex items-center justify-between bg-white border border-border/80 p-4 rounded-xl mb-6">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-xs font-bold text-gold uppercase tracking-wide">{STEPS[currentStep - 1].name}</span>
      </div>
    </>
  );

  // Step 1 — System Selection
  const renderStep1 = () => (
    <div className="space-y-5">
      <p className="text-xs text-muted">
        Choose the primary material system for your home. This sets the base pricing and profile aesthetics.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {(
          [
            {
              key: 'upvc' as const,
              label: 'uPVC Systems',
              sub: 'Excellent thermal, sound & weather insulation. Most popular for residential homes.',
              image: 'https://5.imimg.com/data5/SX/YV/YG/SELLER-64612523/upvc-sliding-window-500x500.jpg',
            },
            {
              key: 'aluminium' as const,
              label: 'Aluminium Systems',
              sub: 'Sleek slimline architectural frames. Ideal for large glass views & commercial projects.',
              image: 'https://5.imimg.com/data5/VJ/OO/VB/SELLER-64612523/upvc-sliding-window-profiles-125x125.jpg',
            },
          ] as const
        ).map(opt => {
          const isSelected = state.family === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleFamilyChange(opt.key)}
              className={`relative flex flex-col rounded-2xl border transition-all duration-300 text-left overflow-hidden cursor-pointer bg-white group ${
                isSelected ? 'border-gold ring-1 ring-gold/20 shadow-md' : 'border-border/60 hover:border-gold/30 hover:shadow-sm'
              }`}
            >
              <div className="relative w-full h-32 sm:h-44 bg-slate-50">
                <Image
                  src={opt.image}
                  alt={opt.label}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-102"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-gold text-white rounded-full p-1 shadow-md z-10">
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <span className="block font-bold text-sm sm:text-base text-heading leading-tight">{opt.label}</span>
                  <span className="block text-[11px] sm:text-xs text-muted mt-1 leading-normal">{opt.sub}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Step 2 — Window Types (multi-select, system-aware)
  const renderStep2 = () => {
    const configStyles = types.filter(t => t.family === state.family);
    return (
      <div className="space-y-4">
        <p className="text-xs text-muted">
          Select all window and door types present (or planned) in your home. You can pick multiple.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {configStyles.map(wt => {
            const isSelected = state.selectedTypes.includes(wt.id);
            return (
              <button
                key={wt.id}
                type="button"
                onClick={() => toggleType(wt.id)}
                className={`relative flex flex-col rounded-xl border transition-all duration-200 text-left overflow-hidden cursor-pointer bg-white group ${
                  isSelected ? 'border-gold ring-1 ring-gold/20 shadow-sm' : 'border-border/60 hover:border-gold/30'
                }`}
              >
                <div className="relative w-full h-24 sm:h-32 bg-slate-50">
                  {wt.image ? (
                    <Image
                      src={wt.image}
                      alt={wt.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-102"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold uppercase text-[9px]">
                      No Image
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 bg-gold text-white rounded-full p-0.5 shadow-sm z-10">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-heading leading-tight">{wt.name}</span>
                    <span className="block text-[10px] sm:text-xs text-muted mt-1 leading-normal">{wt.description}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Step 3 — Home Details
  const renderStep3 = () => (
    <div className="space-y-8">
      {/* Window Count */}
      <div>
        <label className="text-xs font-bold text-heading uppercase tracking-widest block mb-4">
          Number of Windows &amp; Doors
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={3}
            max={200}
            step={1}
            value={state.windowCount}
            onChange={e => setState(prev => ({ ...prev, windowCount: parseInt(e.target.value) }))}
            className="flex-1 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
          />
          <Input
            type="number"
            min={3}
            max={200}
            value={state.windowCount}
            onChange={e =>
              setState(prev => ({
                ...prev,
                windowCount: Math.min(200, Math.max(3, parseInt(e.target.value) || 3)),
              }))
            }
            className="w-20 text-center font-bold text-xs h-10 border-border/80 rounded-xl"
          />
        </div>
        <div className="flex justify-between text-[10px] font-semibold text-muted mt-1.5">
          <span>3</span><span>200</span>
        </div>
      </div>

      {/* Home Sq Ft */}
      <div>
        <label className="text-xs font-bold text-heading uppercase tracking-widest block mb-3">
          Approx. Home Floor Area (sq.ft.)
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {SQ_FT_PRESETS.map(preset => {
            const label = preset === 3000 ? '3000+' : String(preset);
            const isActive = state.homeSqFt === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => { setCustomSqFt(''); setState(prev => ({ ...prev, homeSqFt: preset })); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-gold bg-gold/5 text-gold font-bold'
                    : 'border-border/60 bg-white text-heading hover:border-gold/30 hover:bg-slate-50/50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted font-bold uppercase tracking-wider">Custom:</span>
          <Input
            type="number"
            placeholder="e.g. 1800"
            value={customSqFt}
            onChange={e => {
              const val = e.target.value;
              setCustomSqFt(val);
              const parsed = parseInt(val);
              if (!isNaN(parsed) && parsed > 0) setState(prev => ({ ...prev, homeSqFt: parsed }));
            }}
            className="w-32 text-xs h-10 border-border/80 rounded-xl"
          />
          <span className="text-xs text-muted font-medium">sq.ft.</span>
        </div>
        <p className="text-[11px] text-muted mt-2 font-medium">
          Selected Area: <span className="font-bold text-heading">{state.homeSqFt} sq.ft.</span>
        </p>
      </div>

      {/* Installation Toggle */}
      <div className="border-t border-border-soft pt-6">
        <label className="text-xs font-bold text-heading uppercase tracking-widest block mb-3">
          Installation Services
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(
            [
              { val: true,  label: 'Include Installation', desc: 'Precise leveling, structural anchoring, and weather-grade silicone sealing.' },
              { val: false, label: 'Supply Only', desc: 'Fabrication of profiles only. Transport and setup handled by your contractor.' },
            ] as const
          ).map(opt => {
            const isSelected = state.installationRequired === opt.val;
            return (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => setState(prev => ({ ...prev, installationRequired: opt.val }))}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-gold bg-gold/5 ring-1 ring-gold/15'
                    : 'border-border/60 bg-white hover:border-gold/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold ${isSelected ? 'text-gold' : 'text-heading'}`}>{opt.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-gold stroke-[2.5]" />}
                </div>
                <span className="block text-[11px] text-muted mt-1 leading-normal">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Step 4 — Finishes (System-Aware Colors, Glass, and Flyscreens)
  const renderStep4 = () => {
    const configColors = colors.filter(c => !c.family || c.family === state.family);
    const configGlass = glass.filter(g => !g.family || g.family === state.family);
    const configMesh = mesh.filter(m => !m.family || m.family === state.family);
    return (
      <div className="space-y-8">
        {/* Frame Colour */}
        <div>
          <label className="text-xs font-bold text-heading uppercase tracking-widest block mb-4">
            Frame Colour / Finish
          </label>
          <div className="flex flex-wrap gap-6">
            {configColors.map(fc => {
              const isSelected = state.colorChoice === fc.id;
              return (
                <button
                  key={fc.id}
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, colorChoice: fc.id }))}
                  className="flex flex-col items-center gap-2 cursor-pointer group focus:outline-none"
                  title={fc.description}
                >
                  <div
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-200 relative flex items-center justify-center ${
                      isSelected
                        ? 'border-gold ring-4 ring-gold/10 scale-105'
                        : 'border-border/60 group-hover:border-gold/30'
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-full shadow-inner"
                      style={{
                        backgroundColor: fc.hex,
                        boxShadow: fc.id === 'white' || fc.id === 'anodized_silver' ? 'inset 0 0 0 1px rgba(0,0,0,0.06)' : undefined,
                      }}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-white drop-shadow stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide uppercase leading-tight text-center max-w-[64px] ${isSelected ? 'text-gold' : 'text-heading'}`}>
                    {fc.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Glass Type */}
        <div>
          <label className="text-xs font-bold text-heading uppercase tracking-widest block mb-3">
            Glass Option <span className="text-muted font-normal normal-case text-[10px] tracking-normal leading-none">(all options are safety-tempered)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {configGlass.map(g => {
              const isSelected = state.glassChoice === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, glassChoice: g.id }))}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-gold bg-gold/5 ring-1 ring-gold/15'
                      : 'border-border/60 bg-white hover:border-gold/30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold ${isSelected ? 'text-gold' : 'text-heading'}`}>{g.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-gold stroke-[2.5]" />}
                  </div>
                  <span className="block text-[11px] text-muted mt-1 leading-normal">{g.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Flyscreen */}
        <div>
          <label className="text-xs font-bold text-heading uppercase tracking-widest block mb-3">
            Integrated Flyscreen
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {configMesh.map(m => {
              const isSelected = state.meshChoice === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setState(prev => ({ ...prev, meshChoice: m.id }))}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-gold bg-gold/5 ring-1 ring-gold/15'
                      : 'border-border/60 bg-white hover:border-gold/30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold ${isSelected ? 'text-gold' : 'text-heading'}`}>{m.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-gold stroke-[2.5]" />}
                  </div>
                  <span className="block text-[11px] text-muted mt-1 leading-normal">{m.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Step 5 — Contact
  const renderStep5 = () => (
    <div className="space-y-6">
      <p className="text-xs text-muted">
        Enter your details to generate the estimate and receive it directly on WhatsApp.
      </p>

      <div>
        <label className="text-xs font-bold text-heading block mb-1.5">Your Name *</label>
        <Input
          placeholder="Satish Kumar"
          value={state.customerName}
          onChange={e => setState(prev => ({ ...prev, customerName: e.target.value }))}
          className="border-border/80 focus-visible:ring-gold/30 focus-visible:border-gold rounded-xl px-4 py-3 text-xs h-11"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-heading block mb-1.5">WhatsApp Phone (10 digits) *</label>
        <Input
          type="tel"
          placeholder="9505683584"
          maxLength={10}
          value={state.customerPhone}
          onChange={e => setState(prev => ({ ...prev, customerPhone: e.target.value.replace(/\D/g, '') }))}
          className="border-border/80 focus-visible:ring-gold/30 focus-visible:border-gold rounded-xl px-4 py-3 text-xs h-11"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-heading block mb-1.5">City / Area *</label>
        <Input
          placeholder="Indiranagar, Bangalore"
          value={state.customerCity}
          onChange={e => setState(prev => ({ ...prev, customerCity: e.target.value }))}
          className="border-border/80 focus-visible:ring-gold/30 focus-visible:border-gold rounded-xl px-4 py-3 text-xs h-11"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-heading uppercase tracking-widest block mb-3">
          Preferred Callback Time
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CALLBACK_OPTIONS.map(cb => {
            const isActive = state.callbackTime === cb.id;
            return (
              <button
                key={cb.id}
                type="button"
                onClick={() => setState(prev => ({ ...prev, callbackTime: cb.id }))}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer text-center ${
                  isActive
                    ? 'border-gold bg-gold/5 text-gold font-bold shadow-sm'
                    : 'border-border/60 bg-white text-heading hover:border-gold/30 hover:bg-slate-50/50'
                }`}
              >
                {cb.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Step 6 — Estimate Summary (System-Aware Wording & Wavelength)
  const renderStep6 = () => {
    const familyStyles = types.filter(t => t.family === state.family);
    const familyColors = colors.filter(c => !c.family || c.family === state.family);
    const familyGlass = glass.filter(g => !g.family || g.family === state.family);
    const familyMesh = mesh.filter(m => !m.family || m.family === state.family);

    const selectedTypeLabels = state.selectedTypes
      .map(id => familyStyles.find(w => w.id === id)?.name ?? id)
      .join(', ');
    const colorLabel = familyColors.find(c => c.id === state.colorChoice)?.name ?? state.colorChoice;
    const glassLabel = familyGlass.find(g => g.id === state.glassChoice)?.name ?? state.glassChoice;
    const meshLabel  = familyMesh.find(m => m.id === state.meshChoice)?.name  ?? state.meshChoice;

    return (
      <div className="space-y-6">
        {/* Big estimate display card in pearl neutral / faint navy-tint theme */}
        <div className="rounded-2xl border border-gold/10 bg-gold-pale/25 p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-gold uppercase tracking-widest bg-gold/5 border border-gold/10">
            <Sparkles className="w-3 h-3 text-gold" /> Estimated Investment Range
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-heading tracking-tight leading-none">
            ₹{estimatedMin.toLocaleString('en-IN')}
            <span className="text-xl mx-2 text-muted font-normal">–</span>
            ₹{estimatedMax.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-body max-w-md mx-auto leading-relaxed">
            Indicative quote for <span className="font-bold text-heading">~{estimatedArea} sq.ft.</span> of premium {state.family === 'upvc' ? 'uPVC' : 'Aluminium'} glazing area
          </div>
          <div className="border-t border-border-soft pt-3.5 text-[11px] text-muted max-w-xs mx-auto leading-relaxed">
            Includes profile fabrication, glass options, locks, mesh, and transport. Final quote given post free site measurement.
          </div>
        </div>

        {/* Config summary grid */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-heading uppercase tracking-widest border-b border-border/60 pb-2">
            Selected Configuration
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
            {(
              [
                ['System Type',   state.family === 'upvc' ? 'uPVC Windows & Doors' : 'Aluminium Systems'],
                ['Window Styles', selectedTypeLabels || '—'],
                ['Openings Count',`${state.windowCount} Units`],
                ['Floor Area',    `${state.homeSqFt} sq.ft.`],
                ['Installation',  state.installationRequired ? 'Included (Dhatri Certified)' : 'Supply Only'],
                ['Frame Colour',  colorLabel],
                ['Glass Style',   glassLabel],
                ['Flyscreen Mesh',meshLabel],
                ['Name',          state.customerName],
                ['Contact Phone', state.customerPhone],
                ['City / Area',   state.customerCity],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="text-muted text-[10px] uppercase tracking-wider font-semibold block mb-0.5">{k}</span>
                <span className="font-bold text-heading text-[12px]">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badge */}
        <div className="p-4 rounded-xl bg-slate-50 border border-border/60 flex items-start gap-2.5">
          <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-body leading-relaxed">
            Free site measurement included. Factory-direct pricing with genuine weather-grade silicone sealing and structural anchoring warranty.
          </p>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // Main Render
  // ---------------------------------------------------------------------------

  if (dbError) {
    return (
      <div className="bg-white border border-red-100 rounded-2xl p-8 text-center max-w-md mx-auto my-12 shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Estimator Offline</h3>
        <p className="text-sm text-slate-600 mb-6">
          We are currently updating our pricing catalog and configurator settings. Online quotes are temporarily unavailable.
        </p>
        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => window.open(`https://wa.me/${businessSettings.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 rounded-xl"
          >
            Inquire on WhatsApp
          </Button>
          <a 
            href={`tel:${businessSettings.phone}`}
            className="text-xs font-semibold text-slate-500 hover:underline"
          >
            Or call us at {businessSettings.phone}
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white rounded-2xl border border-border/60 p-8 shadow-sm">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-muted uppercase tracking-widest">Loading Estimator Options</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-4 sm:px-6 lg:px-8">

      {/* Auto-save indicator */}
      {saveIndicator && user && (
        <div className="fixed bottom-24 md:bottom-6 right-4 z-[100] flex items-center gap-2 px-3.5 py-2 bg-white border border-border rounded-full shadow-lg text-xs font-bold text-heading animate-fade-in">
          <Save className="w-3.5 h-3.5 text-gold" /> Progress saved
        </div>
      )}

      {/* Guest nudge — show after step 2 */}
      {!user && currentStep >= 2 && (
        <div className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gold/20 bg-gold-faint text-xs">
          <span className="text-heading font-semibold">💾 <strong>Login to save your progress</strong> — come back later and continue from here.</span>
          <button
            onClick={openLoginModal}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold hover:bg-gold-light text-white font-bold transition-all"
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold/5 text-gold border border-gold/10 mb-3">
          <Sparkles className="w-3 h-3" /> Whole-Home Estimator
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-heading">
          Get Your Free Home Window Estimate
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-body max-w-2xl mx-auto">
          Tell us about your home in 5 quick steps and receive an instant indicative price range — no salesperson needed.
        </p>
      </div>

      {/* Step indicator */}
      {renderStepIndicator()}

      {/* Wizard card */}
      <Card className="shadow-sm bg-white border border-border/60 rounded-2xl overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step label */}
          <h2 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-5">
            Step {currentStep} — {STEPS[currentStep - 1].name}
          </h2>

          {/* Animated step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="min-h-[320px]"
            >
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-border-soft flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleBack} className="flex items-center gap-1.5 border border-border text-heading hover:bg-slate-50 rounded-xl px-5 py-2.5 text-xs font-bold h-10">
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                {currentStep === 6 && (
                  <Button
                    variant="secondary"
                    onClick={() => { setCurrentStep(1); setError(''); }}
                    className="flex items-center gap-1.5 border border-border text-heading hover:bg-slate-50 rounded-xl px-5 py-2.5 text-xs font-bold h-10"
                  >
                    Start Over
                  </Button>
                )}
              </div>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <Button onClick={handleNext} className="flex items-center gap-1.5 ml-auto bg-gold hover:bg-gold-rich text-white rounded-xl px-6 py-2.5 text-xs font-bold h-10 shadow-sm border-none">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleWhatsAppSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2.5 text-xs font-bold h-10 shadow-sm border-none"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send Enquiry on WhatsApp</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
