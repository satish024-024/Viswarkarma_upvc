"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send, Sparkles, AlertCircle, Shield, Scale, CheckCircle2 } from 'lucide-react';
import { ConfiguratorState, ProductFamily } from '../types';
import { productTypes, productSeries, colorOptions, glassOptions, meshOptions, hardwareOptions } from '../config/data';
import { calculatePrice } from '../lib/estimator';
import { generateWhatsAppLink } from '../lib/whatsapp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatINR } from '@/lib/utils';
import {
  getProductTypes,
  getProductSeries,
  getColorOptions,
  getGlassOptions,
  getMeshOptions,
  getHardwareOptions,
  createQuoteRequest
} from '@/lib/supabase';
import Image from 'next/image';

// ---------------------------------------------------------------------------
// Types
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

const SQ_FT_PRESETS = [500, 750, 1000, 1200, 1500, 2000, 2500, 3000] as const;

interface WindowTypeOption {
  id: string;
  label: string;
  image: string;
}

const WINDOW_TYPES: WindowTypeOption[] = [
  {
    id: 'sliding',
    label: 'Sliding Window',
    image: 'https://5.imimg.com/data5/SX/YV/YG/SELLER-64612523/upvc-sliding-window-500x500.jpg',
  },
  {
    id: 'casement',
    label: 'Casement Window',
    image: 'https://5.imimg.com/data5/QR/VY/TK/SELLER-64612523/casement-window-500x500.jpeg',
  },
  {
    id: 'french_door',
    label: 'French Door / Balcony Slider',
    image: 'https://5.imimg.com/data5/RU/YJ/HX/SELLER-64612523/upvc-french-door-500x500.jpg',
  },
  {
    id: 'fixed',
    label: 'Fixed Window',
    image: 'https://5.imimg.com/data5/LQ/MY/FJ/SELLER-64612523/upvc-sliding-profile-125x125.jpeg',
  },
  {
    id: 'top_hung',
    label: 'Top-Hung Window',
    image: 'https://5.imimg.com/data5/PK/AF/KY/SELLER-64612523/upvc-top-hung-window-500x500.jpg',
  },
];

interface ColorSwatch {
  id: string;
  label: string;
  hex: string;
  mult: number;
}

const FRAME_COLORS: ColorSwatch[] = [
  { id: 'white',  label: 'White',           hex: '#FFFFFF', mult: 1.0  },
  { id: 'sand',   label: 'Sand / Cream',    hex: '#D4B896', mult: 1.05 },
  { id: 'grey',   label: 'Anthracite Grey', hex: '#3D3D3D', mult: 1.1  },
  { id: 'walnut', label: 'Walnut Wood',     hex: '#5C3D1E', mult: 1.2  },
  { id: 'black',  label: 'Black',           hex: '#1A1A1A', mult: 1.15 },
];

interface PillOption {
  id: string;
  label: string;
}

const GLASS_OPTIONS: PillOption[] = [
  { id: 'clear',   label: 'Clear' },
  { id: 'frosted', label: 'Frosted' },
  { id: 'double',  label: 'Double Glazed' },
];

const MESH_OPTIONS: PillOption[] = [
  { id: 'none',       label: 'None' },
  { id: 'fiberglass', label: 'Fiberglass Mesh' },
  { id: 'ss304',      label: 'SS304 Security Mesh' },
];

const CALLBACK_OPTIONS: PillOption[] = [
  { id: 'morning',   label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening',   label: 'Evening' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function glassModifier(g: string): number {
  const map: Record<string, number> = { clear: 0, frosted: 30, double: 120 };
  return map[g] ?? 0;
}

function meshModifier(m: string): number {
  const map: Record<string, number> = { none: 0, fiberglass: 40, ss304: 80 };
  return map[m] ?? 0;
}

function colorMult(c: string): number {
  return FRAME_COLORS.find(fc => fc.id === c)?.mult ?? 1.0;
}

function computeEstimate(st: HomeEstimatorState): { min: number; max: number; area: number } {
  const area = Math.max(st.homeSqFt * 0.12, st.windowCount * 16);
  const base = st.family === 'upvc' ? 500 : 600;
  const unitPrice = ((base + glassModifier(st.glassChoice) + meshModifier(st.meshChoice)) * colorMult(st.colorChoice) + (st.installationRequired ? 60 : 0)) * area;
  return { min: Math.round(unitPrice), max: Math.round(unitPrice * 1.15), area: Math.round(area) };
}

function buildWhatsAppMessage(st: HomeEstimatorState, min: number, max: number): string {
  const typesLabel = st.selectedTypes.length
    ? st.selectedTypes.map(id => WINDOW_TYPES.find(w => w.id === id)?.label ?? id).join(', ')
    : 'Not selected';
  const colorLabel = FRAME_COLORS.find(c => c.id === st.colorChoice)?.label ?? st.colorChoice;
  const glassLabel = GLASS_OPTIONS.find(g => g.id === st.glassChoice)?.label ?? st.glassChoice;
  const meshLabel  = MESH_OPTIONS.find(m => m.id === st.meshChoice)?.label  ?? st.meshChoice;
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
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface PillButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function PillButton({ label, active, onClick }: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${
        active
          ? 'border-gold bg-gold/10 text-gold'
          : 'border-brand-border bg-white text-brand-primary hover:border-gold/40'
      }`}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ConfiguratorProps {
  initialFamily?: ProductFamily;
}

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

export default function Configurator({ initialFamily }: ConfiguratorProps) {
  const [state, setState] = useState<HomeEstimatorState>({
    ...INITIAL_STATE,
    family: initialFamily === 'aluminium' ? 'aluminium' : 'upvc',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customSqFt, setCustomSqFt] = useState('');

  // Validation
  const validate = (): string => {
    if (currentStep === 2 && state.selectedTypes.length === 0) {
      return 'Please select at least one window type.';
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
    } catch (err) {
      console.error('Error storing lead in database:', err);
    } finally {
      setIsSubmitting(false);
    }
    const message = buildWhatsAppMessage(state, estimatedMin, estimatedMax);
    window.open(`https://wa.me/919449400555?text=${encodeURIComponent(message)}`, '_blank');
  };

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const renderStepIndicator = () => (
    <>
      <div className="relative mb-10 hidden md:block">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-border -translate-y-1/2 z-0" />
        <div className="flex justify-between items-center relative z-10">
          {STEPS.map(step => {
            const isActive    = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-gold border-gold text-white shadow-md'
                      : isCompleted
                      ? 'bg-gold/80 border-gold text-white'
                      : 'bg-white text-brand-muted border-brand-border'
                  }`}
                >
                  {isCompleted ? '✓' : step.id}
                </div>
                <span className={`mt-2 text-xs font-medium ${isActive || isCompleted ? 'text-gold' : 'text-brand-muted'}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="md:hidden flex items-center justify-between bg-white border border-brand-border p-4 rounded-xl mb-6">
        <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-sm font-bold text-gold">{STEPS[currentStep - 1].name}</span>
      </div>
    </>
  );

  // Step 1 — System Selection
  const renderStep1 = () => (
    <div className="space-y-5">
      <p className="text-xs text-brand-muted">
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
              onClick={() => setState(prev => ({ ...prev, family: opt.key }))}
              className={`relative rounded-2xl border-2 overflow-hidden text-left cursor-pointer transition-all duration-300 group ${
                isSelected ? 'border-gold shadow-lg shadow-gold/10' : 'border-brand-border hover:border-gold/40'
              }`}
            >
              <div className="relative w-full h-44 bg-zinc-900">
                <Image
                  src={opt.image}
                  alt={opt.label}
                  fill
                  className="object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-300"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-gold/10 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-gold drop-shadow-lg" />
                  </div>
                )}
              </div>
              <div className="p-4 bg-zinc-900">
                <span className="block font-bold text-base text-white">{opt.label}</span>
                <span className="block text-xs text-zinc-400 mt-1 leading-relaxed">{opt.sub}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Step 2 — Window Types (multi-select)
  const renderStep2 = () => (
    <div className="space-y-4">
      <p className="text-xs text-brand-muted">
        Select all window and door types present (or planned) in your home. You can pick multiple.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {WINDOW_TYPES.map(wt => {
          const isSelected = state.selectedTypes.includes(wt.id);
          return (
            <button
              key={wt.id}
              type="button"
              onClick={() => toggleType(wt.id)}
              className={`relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 group ${
                isSelected ? 'border-gold shadow-md shadow-gold/10' : 'border-brand-border hover:border-gold/40'
              }`}
            >
              <div className="relative w-full h-32 bg-zinc-800">
                <Image
                  src={wt.image}
                  alt={wt.label}
                  fill
                  className="object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-200"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-gold drop-shadow" />
                  </div>
                )}
              </div>
              <div className={`px-3 py-2 text-center ${isSelected ? 'bg-gold/10' : 'bg-zinc-900'}`}>
                <span className={`block text-xs font-semibold leading-tight ${isSelected ? 'text-gold' : 'text-white'}`}>
                  {wt.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Step 3 — Home Details
  const renderStep3 = () => (
    <div className="space-y-8">
      {/* Window Count */}
      <div>
        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-4">
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
            className="flex-1 h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-gold"
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
            className="w-20 text-center font-bold"
          />
        </div>
        <div className="flex justify-between text-xs text-brand-muted mt-1">
          <span>3</span><span>200</span>
        </div>
      </div>

      {/* Home Sq Ft */}
      <div>
        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-3">
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
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-brand-border bg-white text-brand-primary hover:border-gold/40'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted font-medium">Custom:</span>
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
            className="w-32"
          />
          <span className="text-xs text-brand-muted">sq.ft.</span>
        </div>
        <p className="text-xs text-brand-muted mt-2">
          Selected: <span className="font-bold text-brand-primary">{state.homeSqFt} sq.ft.</span>
        </p>
      </div>

      {/* Installation Toggle */}
      <div className="border-t border-brand-border pt-6">
        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-3">
          Installation Required?
        </label>
        <div className="flex gap-3">
          {(
            [
              { val: true,  label: 'Yes — Include Installation' },
              { val: false, label: 'No — Supply Only' },
            ] as const
          ).map(opt => (
            <button
              key={String(opt.val)}
              type="button"
              onClick={() => setState(prev => ({ ...prev, installationRequired: opt.val }))}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 cursor-pointer ${
                state.installationRequired === opt.val
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-brand-border bg-white text-brand-primary hover:border-gold/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 4 — Finishes
  const renderStep4 = () => (
    <div className="space-y-8">
      {/* Frame Colour */}
      <div>
        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-4">
          Frame Colour{' '}
          <span className="text-brand-muted font-normal normal-case text-xs">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-5">
          {FRAME_COLORS.map(fc => {
            const isSelected = state.colorChoice === fc.id;
            return (
              <button
                key={fc.id}
                type="button"
                onClick={() => setState(prev => ({ ...prev, colorChoice: fc.id }))}
                className="flex flex-col items-center gap-2 cursor-pointer group"
                title={fc.label}
              >
                <div
                  className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-gold ring-2 ring-gold/40 scale-110'
                      : 'border-brand-border group-hover:border-gold/40'
                  }`}
                  style={{
                    backgroundColor: fc.hex,
                    boxShadow: fc.id === 'white' ? 'inset 0 0 0 1px #e2e8f0' : undefined,
                  }}
                />
                <span className={`text-[10px] font-semibold leading-tight text-center max-w-[56px] ${isSelected ? 'text-gold' : 'text-brand-primary'}`}>
                  {fc.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Glass Type */}
      <div>
        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-3">
          Glass Type{' '}
          <span className="text-brand-muted font-normal normal-case text-xs">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {GLASS_OPTIONS.map(g => (
            <PillButton
              key={g.id}
              label={g.label}
              active={state.glassChoice === g.id}
              onClick={() => setState(prev => ({ ...prev, glassChoice: g.id }))}
            />
          ))}
        </div>
      </div>

      {/* Flyscreen */}
      <div>
        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-3">
          Integrated Flyscreen{' '}
          <span className="text-brand-muted font-normal normal-case text-xs">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {MESH_OPTIONS.map(m => (
            <PillButton
              key={m.id}
              label={m.label}
              active={state.meshChoice === m.id}
              onClick={() => setState(prev => ({ ...prev, meshChoice: m.id }))}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Step 5 — Contact
  const renderStep5 = () => (
    <div className="space-y-6">
      <p className="text-xs text-brand-muted">
        Enter your details to generate the estimate and receive it directly on WhatsApp.
      </p>

      <div>
        <label className="text-xs font-semibold text-brand-primary block mb-1.5">Your Name *</label>
        <Input
          placeholder="Rajesh Kumar"
          value={state.customerName}
          onChange={e => setState(prev => ({ ...prev, customerName: e.target.value }))}
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-brand-primary block mb-1.5">WhatsApp Phone (10 digits) *</label>
        <Input
          type="tel"
          placeholder="9886012345"
          maxLength={10}
          value={state.customerPhone}
          onChange={e => setState(prev => ({ ...prev, customerPhone: e.target.value.replace(/\D/g, '') }))}
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-brand-primary block mb-1.5">City / Area *</label>
        <Input
          placeholder="Indiranagar, Bangalore"
          value={state.customerCity}
          onChange={e => setState(prev => ({ ...prev, customerCity: e.target.value }))}
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-3">
          Preferred Callback Time
        </label>
        <div className="flex flex-wrap gap-3">
          {CALLBACK_OPTIONS.map(cb => (
            <PillButton
              key={cb.id}
              label={cb.label}
              active={state.callbackTime === cb.id}
              onClick={() => setState(prev => ({ ...prev, callbackTime: cb.id }))}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Step 6 — Estimate Summary
  const renderStep6 = () => {
    const selectedTypeLabels = state.selectedTypes
      .map(id => WINDOW_TYPES.find(w => w.id === id)?.label ?? id)
      .join(', ');
    const colorLabel = FRAME_COLORS.find(c => c.id === state.colorChoice)?.label ?? state.colorChoice;
    const glassLabel = GLASS_OPTIONS.find(g => g.id === state.glassChoice)?.label ?? state.glassChoice;
    const meshLabel  = MESH_OPTIONS.find(m => m.id === state.meshChoice)?.label  ?? state.meshChoice;

    return (
      <div className="space-y-6">
        {/* Big estimate display */}
        <div className="rounded-2xl border-2 border-gold/40 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Your Home Estimate
          </span>
          <div className="text-4xl font-extrabold text-gold tracking-tight leading-none">
            ₹{estimatedMin.toLocaleString('en-IN')}
            <span className="text-2xl mx-2 text-zinc-400">–</span>
            ₹{estimatedMax.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            Based on ~{estimatedArea} sq.ft. of estimated glazing area
          </p>
          <p className="text-[11px] text-zinc-500 max-w-xs mx-auto leading-relaxed border-t border-zinc-700 pt-3">
            This is an indicative estimate only. Final quote given after free site measurement.
          </p>
        </div>

        {/* Config summary grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider border-b border-brand-border pb-2">
            Configuration Summary
          </h4>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
            {(
              [
                ['System',        state.family === 'upvc' ? 'uPVC' : 'Aluminium'],
                ['Window Types',  selectedTypeLabels || '—'],
                ['Window Count',  `${state.windowCount} openings`],
                ['Home Area',     `${state.homeSqFt} sq.ft.`],
                ['Installation',  state.installationRequired ? 'Included' : 'Supply Only'],
                ['Frame Colour',  colorLabel],
                ['Glass',         glassLabel],
                ['Flyscreen',     meshLabel],
                ['Name',          state.customerName],
                ['Phone',         state.customerPhone],
                ['City',          state.customerCity],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k}>
                <span className="text-brand-muted block">{k}</span>
                <span className="font-bold text-brand-primary">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badge */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
          <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
            Free site measurement included. Factory-direct pricing with genuine weather-grade silicon sealing and structural anchoring warranty.
          </p>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/30 mb-3">
          <Sparkles className="w-3 h-3" /> Whole-Home Estimator
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-primary">
          Get Your Free Home Window Estimate
        </h1>
        <p className="mt-2 text-base text-brand-muted max-w-2xl mx-auto">
          Tell us about your home in 5 quick steps and receive an instant indicative price range — no salesperson needed.
        </p>
      </div>

      {/* Step indicator */}
      {renderStepIndicator()}

      {/* Wizard card */}
      <Card className="shadow-sm bg-white border-brand-border">
        <CardContent className="p-6 sm:p-8">
          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Step label */}
          <h2 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-5">
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
          <div className="mt-8 pt-6 border-t border-brand-border flex items-center justify-between gap-4">
            {currentStep > 1 && currentStep < 6 ? (
              <Button variant="secondary" onClick={handleBack} className="flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            ) : currentStep === 6 ? (
              <Button
                variant="secondary"
                onClick={() => { setCurrentStep(1); setError(''); }}
                className="flex items-center gap-1.5"
              >
                Start Over
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <Button onClick={handleNext} className="flex items-center gap-1.5 ml-auto">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleWhatsAppSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white ml-auto"
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

