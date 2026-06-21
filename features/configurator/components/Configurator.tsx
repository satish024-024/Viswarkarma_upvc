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


const STEPS = [
  { id: 1, name: "System & Style" },
  { id: 2, name: "Profile Series" },
  { id: 3, name: "Dimensions" },
  { id: 4, name: "Materials" },
  { id: 5, name: "Contact & Handoff" },
  { id: 6, name: "Estimated Quote" }
];

export default function Configurator({ initialFamily }: ConfiguratorProps) {
  // Set up initial state with dynamic resolution to prevent empty strings on first render
  const [state, setState] = useState<ConfiguratorState>(() => {
    const family = initialFamily || 'upvc';
    const filteredTypes = productTypes.filter(t => t.family === family);
    const defaultType = filteredTypes[0]?.id || '';
    const typeObj = productTypes.find(t => t.id === defaultType);
    const defaultSeries = typeObj?.supportedSeries[0] || '';

    return {
      family,
      typeId: defaultType,
      seriesId: defaultSeries,
      width: 4,
      height: 4,
      colorId: 'white',
      glassId: 'single_5mm_clear',
      meshId: 'none',
      hardwareId: 'standard',
      unitsCount: 1,
      installationRequired: true,
      customerName: '',
      customerPhone: '',
      customerCity: '',
      preferredCallbackTime: 'morning'
    };
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic configuration option states
  const [types, setTypes] = useState(productTypes);
  const [seriesList, setSeriesList] = useState(productSeries);
  const [colors, setColors] = useState(colorOptions);
  const [glassList, setGlassList] = useState(glassOptions);
  const [meshList, setMeshList] = useState(meshOptions);
  const [hardwareList, setHardwareList] = useState(hardwareOptions);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [dbTypes, dbSeries, dbColors, dbGlass, dbMesh, dbHardware] = await Promise.all([
          getProductTypes(),
          getProductSeries(),
          getColorOptions(),
          getGlassOptions(),
          getMeshOptions(),
          getHardwareOptions()
        ]);
        setTypes(dbTypes);
        setSeriesList(dbSeries);
        setColors(dbColors);
        setGlassList(dbGlass);
        setMeshList(dbMesh);
        setHardwareList(dbHardware);
      } catch (err) {
        console.error("Failed to load options from Supabase, using defaults:", err);
      }
    }
    loadOptions();
  }, []);

  const filteredTypes = types.filter(t => t.family === state.family);
  const selectedTypeObj = types.find(t => t.id === state.typeId) || filteredTypes[0];
  const filteredSeries = seriesList.filter(s => s.family === state.family && (selectedTypeObj?.supportedSeries.includes(s.id)));
  
  const selectedColorObj = colors.find(c => c.id === state.colorId) || colors[0];
  const selectedSeriesObj = seriesList.find(s => s.id === state.seriesId) || filteredSeries[0];
  const selectedGlassObj = glassList.find(g => g.id === state.glassId) || glassList[0];
  const selectedMeshObj = meshList.find(m => m.id === state.meshId) || meshList[0];
  const selectedHardwareObj = hardwareList.find(h => h.id === state.hardwareId) || hardwareList[0];

  const priceBreakdown = calculatePrice({
    ...state,
    typeId: state.typeId || selectedTypeObj?.id || '',
    seriesId: state.seriesId || selectedSeriesObj?.id || ''
  });

  const handleNext = () => {
    setError('');
    if (currentStep === 1 && !state.typeId) {
      setError('Please select a product style.');
      return;
    }
    if (currentStep === 2 && !state.seriesId) {
      setError('Please select a profile series.');
      return;
    }
    if (currentStep === 3) {
      if (state.width < 1.5 || state.width > 12) {
        setError('Width must be between 1.5 and 12 feet.');
        return;
      }
      if (state.height < 1.5 || state.height > 10) {
        setError('Height must be between 1.5 and 10 feet.');
        return;
      }
      if (state.unitsCount < 1 || state.unitsCount > 100) {
        setError('Please enter a valid number of units (1-100).');
        return;
      }
    }
    if (currentStep === 5) {
      if (!state.customerName.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (!state.customerPhone.trim() || state.customerPhone.length < 10) {
        setError('Please enter a valid 10-digit phone number.');
        return;
      }
      if (!state.customerCity.trim()) {
        setError('Please enter your city/area.');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleWhatsAppSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createQuoteRequest({
        customer_name: state.customerName,
        phone: state.customerPhone,
        city_area: state.customerCity,
        product_family: state.family,
        product_type: state.typeId || selectedTypeObj?.id || '',
        series: state.seriesId || selectedSeriesObj?.id || '',
        width: Number(state.width),
        height: Number(state.height),
        units: Number(state.unitsCount),
        colour: state.colorId,
        glass: state.glassId,
        mesh: state.meshId,
        hardware: state.hardwareId,
        installation_required: state.installationRequired,
        callback_time: state.preferredCallbackTime,
        estimate_low: priceBreakdown.estimatedMinTotal,
        estimate_high: priceBreakdown.estimatedMaxTotal
      });
    } catch (err) {
      console.error("Error storing lead in database:", err);
    } finally {
      setIsSubmitting(false);
    }

    const link = generateWhatsAppLink({
      ...state,
      typeId: state.typeId || selectedTypeObj?.id || '',
      seriesId: state.seriesId || selectedSeriesObj?.id || ''
    }, priceBreakdown);
    window.open(link, '_blank');
  };


  // Helper to render SVG blueprint based on width/height proportions and type
  const renderSVGBlueprint = () => {
    const w = state.width;
    const h = state.height;
    const isDoor = state.typeId.includes('door');
    const isSliding = state.typeId.includes('sliding');
    
    // Proportional canvas sizing
    const maxCanvas = 260;
    let canvasW = maxCanvas;
    let canvasH = maxCanvas;
    
    if (w > h) {
      canvasH = (h / w) * maxCanvas;
    } else {
      canvasW = (w / h) * maxCanvas;
    }
    
    // Minimum sizes for SVG visibility
    canvasW = Math.max(100, canvasW);
    canvasH = Math.max(100, canvasH);
    
    const frameColorHex = selectedColorObj.hex;
    const frameBorderColor = state.colorId === 'white' ? '#94a3b8' : '#1e293b';

    return (
      <svg
        width={canvasW}
        height={canvasH}
        viewBox="0 0 100 100"
        className="transition-all duration-300 drop-shadow-md"
      >
        {/* Outer Brick/Aperture bounds */}
        <rect x="0" y="0" width="100" height="100" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3,3" rx="4" />
        
        {/* Silicon weather seal gap */}
        <rect x="2" y="2" width="96" height="96" fill="none" stroke="#cbd5e1" strokeWidth="1" />
        
        {/* Window/Door Outer Frame */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          fill="none"
          stroke={frameColorHex}
          strokeWidth="6"
          className="transition-colors duration-300"
        />
        <rect x="7" y="7" width="86" height="86" fill="none" stroke={frameBorderColor} strokeWidth="0.5" />
        
        {/* Inner layout panels */}
        {isDoor ? (
          // Door layouts
          isSliding ? (
            // Sliding Door (2 panels)
            <>
              <line x1="50" y1="4" x2="50" y2="96" stroke={frameColorHex} strokeWidth="4" />
              <line x1="50" y1="4" x2="50" y2="96" stroke={frameBorderColor} strokeWidth="0.5" />
              
              {/* Glass background tint */}
              <rect x="8" y="8" width="40" height="84" fill="#eff6ff" opacity="0.6" />
              <rect x="52" y="8" width="40" height="84" fill="#eff6ff" opacity="0.6" />
              
              {/* Sliding arrows */}
              <path d="M18 50 L28 50 M24 46 L28 50 L24 54" stroke="#4a7b9d" strokeWidth="1.5" fill="none" />
              {/* Lock handle */}
              <rect x="44" y="46" width="2" height="8" fill="#64748b" rx="0.5" />
            </>
          ) : (
            // Swing Door (1 panel)
            <>
              <rect x="8" y="8" width="84" height="84" fill="#eff6ff" opacity="0.6" />
              {/* Hinge markers */}
              <circle cx="8" cy="20" r="1.5" fill="#475569" />
              <circle cx="8" cy="50" r="1.5" fill="#475569" />
              <circle cx="8" cy="80" r="1.5" fill="#475569" />
              {/* Door swing dotted lines */}
              <path d="M8 8 L92 50 L8 92" stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="2,2" fill="none" />
              {/* Lock handle */}
              <rect x="86" y="46" width="3" height="8" fill="#64748b" rx="0.5" />
            </>
          )
        ) : (
          // Window layouts
          isSliding ? (
            // Sliding Window
            <>
              <line x1="50" y1="4" x2="50" y2="96" stroke={frameColorHex} strokeWidth="4" />
              <line x1="50" y1="4" x2="50" y2="96" stroke={frameBorderColor} strokeWidth="0.5" />
              
              <rect x="8" y="8" width="40" height="84" fill="#eff6ff" opacity="0.6" />
              <rect x="52" y="8" width="40" height="84" fill="#eff6ff" opacity="0.6" />
              
              <path d="M18 50 L28 50 M24 46 L28 50 L24 54" stroke="#4a7b9d" strokeWidth="1.5" fill="none" />
              <path d="M82 50 L72 50 M76 46 L72 50 L76 54" stroke="#4a7b9d" strokeWidth="1.5" fill="none" />
              <rect x="45" y="46" width="2" height="8" fill="#64748b" rx="0.5" />
            </>
          ) : state.typeId.includes('fixed') ? (
            // Fixed Window
            <>
              <rect x="8" y="8" width="84" height="84" fill="#eff6ff" opacity="0.6" />
              <line x1="8" y1="8" x2="92" y2="92" stroke="#cbd5e1" strokeWidth="0.25" />
              <line x1="92" y1="8" x2="8" y2="92" stroke="#cbd5e1" strokeWidth="0.25" />
            </>
          ) : (
            // Casement / Openable Window
            <>
              <rect x="8" y="8" width="84" height="84" fill="#eff6ff" opacity="0.6" />
              <path d="M8 8 L50 92 L92 8" stroke="#94a3b8" strokeWidth="0.75" strokeDasharray="2,2" fill="none" />
              <rect x="88" y="47" width="2" height="6" fill="#64748b" rx="0.5" />
            </>
          )
        )}
        
        {/* Mosquito mesh pattern overlays overlay if selected */}
        {state.meshId !== 'none' && (
          <pattern id="meshGrid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#475569" strokeWidth="0.15" opacity="0.25" />
          </pattern>
        )}
        {state.meshId !== 'none' && (
          <rect x="8" y="8" width="84" height="84" fill="url(#meshGrid)" pointerEvents="none" />
        )}
      </svg>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      {/* Top Banner indicating customization parameters */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent text-brand-accent-text mb-3">
          <Sparkles className="w-3 h-3" /> Standard Size Estimator
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-primary">
          Design Your Custom Window & Door
        </h1>
        <p className="mt-2 text-base text-brand-muted max-w-2xl mx-auto">
          Configure uPVC or Aluminium systems, choose dimensions and specifications, and receive a guided estimate directly over WhatsApp.
        </p>
      </div>

      {/* Steps indicator */}
      <div className="relative mb-10 hidden md:block">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-border -translate-y-1/2 z-0" />
        <div className="flex justify-between items-center relative z-10">
          {STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border transition-all duration-300 ${
                    isActive
                      ? "bg-brand-primary text-white border-brand-primary shadow-md"
                      : isCompleted
                      ? "bg-brand-secondary text-white border-brand-secondary"
                      : "bg-white text-brand-muted border-brand-border"
                  }`}
                >
                  {isCompleted ? "✓" : step.id}
                </div>
                <span className={`mt-2 text-xs font-medium ${isActive ? "text-brand-primary" : "text-brand-muted"}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile step indicator */}
      <div className="md:hidden flex items-center justify-between bg-white border border-brand-border p-4 rounded-xl mb-6">
        <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-sm font-bold text-brand-primary">
          {STEPS[currentStep - 1].name}
        </span>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Controls wizard */}
        <div className="lg:col-span-7 flex flex-col">
          <Card className="shadow-xs bg-white border-brand-border">
            <CardContent className="p-6 sm:p-8">
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 animate-pulse">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[300px]"
                >
                  {/* STEP 1: FAMILY & TYPE */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-3">
                          1. Select Base System
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setState(prev => ({ 
                              ...prev, 
                              family: 'upvc',
                              typeId: 'sliding_window',
                              seriesId: '60mm_series'
                            }))}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer ${
                              state.family === 'upvc'
                                ? 'border-brand-primary bg-blue-50/20'
                                : 'border-brand-border hover:border-brand-secondary bg-white'
                            }`}
                          >
                            <span className="block font-bold text-lg text-brand-primary">uPVC Systems</span>
                            <span className="block text-xs text-brand-muted mt-1">Excellent thermal, sound, and weatherproofing insulation.</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setState(prev => ({ 
                              ...prev, 
                              family: 'aluminium',
                              typeId: 'alu_sliding_window',
                              seriesId: 'alu_50mm_series'
                            }))}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer ${
                              state.family === 'aluminium'
                                ? 'border-brand-primary bg-blue-50/20'
                                : 'border-brand-border hover:border-brand-secondary bg-white'
                            }`}
                          >
                            <span className="block font-bold text-lg text-brand-primary">Aluminium Systems</span>
                            <span className="block text-xs text-brand-muted mt-1">Sleek, slimline architectural frame strength for huge glass views.</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-3">
                          2. Select Opening Style
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {filteredTypes.map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setState(prev => ({ ...prev, typeId: type.id }))}
                              className={`p-4 rounded-lg border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                                state.typeId === type.id
                                  ? 'border-brand-secondary bg-brand-accent/30 ring-1 ring-brand-secondary'
                                  : 'border-brand-border hover:bg-slate-50/50 bg-white'
                              }`}
                            >
                              <span className="font-bold text-sm text-brand-primary">{type.name}</span>
                              <span className="text-xs text-brand-muted mt-1.5 leading-relaxed">{type.description}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PROFILE SERIES */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-2">
                        Select Frame Profile Series
                      </label>
                      <p className="text-xs text-brand-muted -mt-3 mb-4">
                        Heavier frame widths have extra hollow chambers inside the material, providing superior sound barriers and frame stability.
                      </p>
                      <div className="space-y-3">
                        {filteredSeries.map((series) => (
                          <button
                            key={series.id}
                            type="button"
                            onClick={() => setState(prev => ({ ...prev, seriesId: series.id }))}
                            className={`w-full p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 ${
                              state.seriesId === series.id
                                ? 'border-brand-secondary bg-brand-accent/30 ring-1 ring-brand-secondary'
                                : 'border-brand-border hover:bg-slate-50/50 bg-white'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-brand-primary">{series.name}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-brand-border text-brand-secondary">
                                  {series.thickness}
                                </span>
                              </div>
                              <p className="text-xs text-brand-muted leading-relaxed">{series.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: DIMENSIONS */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div>
                        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-2">
                          1. Set Frame Dimensions (feet)
                        </label>
                        <p className="text-xs text-brand-muted mb-6">
                          Enter approximate dimensions of the window/door opening. Exact sizes will be confirmed during our specialist survey.
                        </p>

                        <div className="space-y-6">
                          {/* Width slider */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="text-brand-primary font-bold">Width: {state.width} ft</span>
                              <span className="text-brand-muted">Range: 1.5 - 12 ft</span>
                            </div>
                            <input
                              type="range"
                              min="1.5"
                              max="12"
                              step="0.5"
                              value={state.width}
                              onChange={(e) => setState(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
                              className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                            />
                          </div>

                          {/* Height slider */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="text-brand-primary font-bold">Height: {state.height} ft</span>
                              <span className="text-brand-muted">Range: 1.5 - 10 ft</span>
                            </div>
                            <input
                              type="range"
                              min="1.5"
                              max="10"
                              step="0.5"
                              value={state.height}
                              onChange={(e) => setState(prev => ({ ...prev, height: parseFloat(e.target.value) }))}
                              className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-brand-border pt-6 grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-brand-primary block mb-2">
                            Number of Units
                          </label>
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={state.unitsCount}
                            onChange={(e) => setState(prev => ({ ...prev, unitsCount: parseInt(e.target.value) || 1 }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-brand-primary block mb-2">
                            Aperture Area
                          </label>
                          <div className="h-11 flex items-center px-4 rounded-lg bg-slate-50 border border-brand-border text-sm font-semibold text-brand-primary">
                            {(state.width * state.height).toFixed(2)} sq. ft.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: MATERIALS */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      {/* Frame Color */}
                      <div>
                        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-3">
                          1. Profile Frame Color
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {colors.map((color) => (
                            <button
                              key={color.id}
                              type="button"
                              onClick={() => setState(prev => ({ ...prev, colorId: color.id }))}
                              className={`p-3 rounded-lg border text-center transition-all duration-200 cursor-pointer flex flex-col items-center ${
                                state.colorId === color.id
                                  ? 'border-brand-secondary bg-brand-accent/20 ring-1 ring-brand-secondary'
                                  : 'border-brand-border bg-white hover:bg-slate-50/50'
                              }`}
                            >
                              <div
                                className="w-8 h-8 rounded-full border border-brand-border shadow-xs mb-2 transition-transform duration-300 hover:scale-110"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-xs font-bold text-brand-primary block">{color.name}</span>
                              <span className="text-[10px] text-brand-secondary mt-1">
                                {color.priceMultiplier === 1.0 ? "Base Rate" : `+ ${(Math.round((color.priceMultiplier - 1) * 100))}%`}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Glass Selection */}
                      <div>
                        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-2">
                          2. Glazing / Glass Option
                        </label>
                        <Select
                          value={state.glassId}
                          onChange={(e) => setState(prev => ({ ...prev, glassId: e.target.value }))}
                        >
                          {glassList.map(g => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                        </Select>
                      </div>

                      {/* Mesh Selection */}
                      <div>
                        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-2">
                          3. Integrated Mosquito Mesh Screen
                        </label>
                        <Select
                          value={state.meshId}
                          onChange={(e) => setState(prev => ({ ...prev, meshId: e.target.value }))}
                        >
                          {meshList.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </Select>
                      </div>

                      {/* Hardware Level */}
                      <div>
                        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-2">
                          4. Locking Hardware Accessories
                        </label>
                        <Select
                          value={state.hardwareId}
                          onChange={(e) => setState(prev => ({ ...prev, hardwareId: e.target.value }))}
                        >
                          {hardwareList.map(h => (
                            <option key={h.id} value={h.id}>
                              {h.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: CONTACT & HANDOFF */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block mb-2">
                        Installation Details & Location
                      </label>
                      <p className="text-xs text-brand-muted -mt-3 mb-4">
                        Provide your details below to generate your estimated price range.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-brand-primary block mb-1">
                            Your Name *
                          </label>
                          <Input
                            placeholder="Rajesh Kumar"
                            value={state.customerName}
                            onChange={(e) => setState(prev => ({ ...prev, customerName: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-brand-primary block mb-1">
                            Your WhatsApp Phone *
                          </label>
                          <Input
                            type="tel"
                            placeholder="9886012345"
                            value={state.customerPhone}
                            onChange={(e) => setState(prev => ({ ...prev, customerPhone: e.target.value }))}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-brand-primary block mb-1">
                              City / Area (Karnataka) *
                            </label>
                            <Input
                              placeholder="Indiranagar, Bangalore"
                              value={state.customerCity}
                              onChange={(e) => setState(prev => ({ ...prev, customerCity: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-brand-primary block mb-1">
                              Preferred Callback Time *
                            </label>
                            <Select
                              value={state.preferredCallbackTime}
                              onChange={(e) => setState(prev => ({ ...prev, preferredCallbackTime: e.target.value }))}
                            >
                              <option value="morning">Morning (9 AM - 12 PM)</option>
                              <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                              <option value="evening">Evening (4 PM - 7 PM)</option>
                            </Select>
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={state.installationRequired}
                              onChange={(e) => setState(prev => ({ ...prev, installationRequired: e.target.checked }))}
                              className="w-4.5 h-4.5 text-brand-primary border-brand-border rounded-sm focus:ring-brand-secondary"
                            />
                            <div className="text-xs text-brand-primary font-medium">
                              <span className="block font-bold">Request professional installation service</span>
                              <span className="block text-brand-muted text-[10px]">End-to-end site prep, alignment, anchoring, and silicone waterproofing.</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: ESTIMATED QUOTE SUMMARY */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-slate-50 border border-brand-border rounded-xl space-y-3">
                        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">
                          Estimated Price Guide
                        </span>
                        <div className="text-3xl font-extrabold text-brand-primary tracking-tight">
                          {formatINR(priceBreakdown.estimatedMinTotal)} - {formatINR(priceBreakdown.estimatedMaxTotal)}
                        </div>
                        <p className="text-[10px] text-brand-muted font-semibold max-w-sm mx-auto leading-relaxed">
                          * Final quote depends on site measurement, hardware, glass, and installation requirements.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-semibold text-brand-primary uppercase tracking-wider block border-b border-brand-border pb-1">
                          Configuration Highlights
                        </label>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                          <div>
                            <span className="text-brand-muted block">Base System</span>
                            <span className="font-bold text-brand-primary">{state.family === 'upvc' ? 'uPVC' : 'Aluminium'} Systems</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">Frame Style</span>
                            <span className="font-bold text-brand-primary">{selectedTypeObj?.name}</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">Profile Class</span>
                            <span className="font-bold text-brand-primary">{selectedSeriesObj?.name}</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">Dimensions</span>
                            <span className="font-bold text-brand-primary">{state.width}ft × {state.height}ft ({(state.width*state.height).toFixed(1)} sq.ft)</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">Profile Color</span>
                            <span className="font-bold text-brand-primary">{selectedColorObj?.name}</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">Glass Option</span>
                            <span className="font-bold text-brand-primary">{selectedGlassObj?.name}</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">Integrated Mesh</span>
                            <span className="font-bold text-brand-primary">{selectedMeshObj?.name}</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">Lock Hardware</span>
                            <span className="font-bold text-brand-primary">{selectedHardwareObj?.name}</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">Quantity</span>
                            <span className="font-bold text-brand-primary">{state.unitsCount} units</span>
                          </div>
                          <div>
                            <span className="text-brand-muted block">Installation Service</span>
                            <span className="font-bold text-brand-primary">{state.installationRequired ? 'Included' : 'Supply Only'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
                        <Shield className="w-5 h-5 text-brand-secondary flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-brand-primary font-medium leading-relaxed">
                          Your quote includes our factory-direct fabrication warranty, genuine weather-grade silicon sealing, and professional structural anchoring.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-brand-border flex items-center justify-between">
                {currentStep > 1 && currentStep < 6 ? (
                  <Button variant="secondary" onClick={handleBack} className="flex items-center gap-1.5">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 6 ? (
                  <Button onClick={handleNext} className="flex items-center gap-1.5 ml-auto">
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="w-full space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-between items-center">
                      <Button variant="secondary" onClick={() => setCurrentStep(1)} className="w-full sm:w-auto">
                        Start Over
                      </Button>
                      <Button 
                        onClick={handleWhatsAppSubmit} 
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>Send Enquiry on WhatsApp</span>
                      </Button>
                    </div>
                    <p className="text-[10px] text-brand-muted text-center leading-relaxed font-semibold">
                      * Final quote depends on site measurement, hardware, glass, and installation requirements.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Blueprint / Specs summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <Card className="border-brand-border bg-slate-50/50 overflow-hidden shadow-xs">
            <div className="p-4 bg-brand-primary text-white flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Dynamic Schematic Preview</span>
              <Scale className="w-4 h-4 opacity-75" />
            </div>
            
            <div className="p-6 flex flex-col items-center justify-center min-h-[300px] border-b border-brand-border bg-white">
              {renderSVGBlueprint()}
              <div className="mt-4 flex items-center gap-6 text-xs font-semibold text-brand-primary bg-slate-50 px-3 py-1.5 rounded-full border border-brand-border">
                <span>W: {state.width} ft</span>
                <span>×</span>
                <span>H: {state.height} ft</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider block">Live Estimate Breakdown</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-brand-muted">Base Frame Rate ({state.family === 'upvc' ? 'uPVC' : 'Aluminium'})</span>
                  <span className="font-bold text-brand-primary">{formatINR(priceBreakdown.basePricePerSqFt)}/sq.ft</span>
                </div>
                {priceBreakdown.seriesModifierPerSqFt > 0 && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Profile Series Addon ({selectedSeriesObj?.thickness})</span>
                    <span className="font-bold text-brand-primary">+ {formatINR(priceBreakdown.seriesModifierPerSqFt)}/sq.ft</span>
                  </div>
                )}
                {priceBreakdown.colorMultiplier > 1 && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Color foil modifier ({selectedColorObj?.name})</span>
                    <span className="font-bold text-brand-primary">× {priceBreakdown.colorMultiplier}</span>
                  </div>
                )}
                {priceBreakdown.glassModifierPerSqFt > 0 && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Glass Selection Addon ({selectedGlassObj?.name})</span>
                    <span className="font-bold text-brand-primary">+ {formatINR(priceBreakdown.glassModifierPerSqFt)}/sq.ft</span>
                  </div>
                )}
                {priceBreakdown.meshModifierPerSqFt > 0 && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Mosquito Screen Addon ({selectedMeshObj?.name})</span>
                    <span className="font-bold text-brand-primary">+ {formatINR(priceBreakdown.meshModifierPerSqFt)}/sq.ft</span>
                  </div>
                )}
                {priceBreakdown.hardwareModifierPerUnit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Security Lock Accessories ({selectedHardwareObj?.name})</span>
                    <span className="font-bold text-brand-primary">+{formatINR(priceBreakdown.hardwareModifierPerUnit)}/unit</span>
                  </div>
                )}
                <div className="border-t border-brand-border my-2 pt-2 flex justify-between font-bold text-sm text-brand-primary">
                  <span>Unit Price Subtotal</span>
                  <span>{formatINR(priceBreakdown.unitPrice)}</span>
                </div>
                {state.unitsCount > 1 && (
                  <div className="flex justify-between text-brand-muted">
                    <span>Subtotal ({state.unitsCount} Units)</span>
                    <span className="font-semibold">{formatINR(priceBreakdown.subtotal)}</span>
                  </div>
                )}
                {state.installationRequired && (
                  <div className="flex justify-between text-brand-muted">
                    <span>Professional Installation Service</span>
                    <span className="font-semibold">{formatINR(priceBreakdown.installationPrice)}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
