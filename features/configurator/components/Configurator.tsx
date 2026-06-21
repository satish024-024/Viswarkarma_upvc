"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send, Sparkles, AlertCircle, Shield, Scale } from 'lucide-react';
import { ConfiguratorState, ProductFamily } from '../types';
import { productTypes, productSeries, colorOptions, glassOptions, meshOptions, hardwareOptions } from '../config/data';
import { calculatePrice } from '../lib/estimator';
import { generateWhatsAppLink } from '../lib/whatsapp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatINR } from '@/lib/utils';

interface ConfiguratorProps {
  initialFamily?: ProductFamily;
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

  const filteredTypes = productTypes.filter(t => t.family === state.family);
  const selectedTypeObj = productTypes.find(t => t.id === state.typeId) || filteredTypes[0];
  const filteredSeries = productSeries.filter(s => s.family === state.family && (selectedTypeObj?.supportedSeries.includes(s.id)));
  
  const selectedColorObj = colorOptions.find(c => c.id === state.colorId) || colorOptions[0];
  const selectedSeriesObj = productSeries.find(s => s.id === state.seriesId) || filteredSeries[0];
  const selectedGlassObj = glassOptions.find(g => g.id === state.glassId) || glassOptions[0];
  const selectedMeshObj = meshOptions.find(m => m.id === state.meshId) || meshOptions[0];
  const selectedHardwareObj = hardwareOptions.find(h => h.id === state.hardwareId) || hardwareOptions[0];

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

  const handleWhatsAppSubmit = () => {
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
                          {colorOptions.map((color) => (
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
                          {glassOptions.map(g => (
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
                          {meshOptions.map(m => (
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
                          {hardwareOptions.map(h => (
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
                      <Button onClick={handleWhatsAppSubmit} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" /> Send Enquiry on WhatsApp
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
