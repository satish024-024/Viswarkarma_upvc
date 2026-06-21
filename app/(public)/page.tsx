"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  VolumeX, 
  Thermometer, 
  Droplets,
  Sparkles,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { businessSettings, projectsList, testimonialsList } from '@/lib/data/business';

export default function Homepage() {
  const [activeHeroTab, setActiveHeroTab] = useState<'blueprint' | 'video'>('blueprint');
  
  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/30 to-transparent pt-12 sm:pt-20 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Text & Key Actions */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-accent text-brand-accent-text">
                <Award className="w-3.5 h-3.5" /> 25+ Years Family-Run Fabrication
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary leading-tight">
                Architectural <span className="text-brand-secondary font-medium">uPVC & Aluminium</span> Windows and Doors
              </h1>
              <p className="text-base sm:text-lg text-brand-muted leading-relaxed max-w-xl">
                We custom-fabricate high-performance window & door systems directly at our local fabrication workshop, ensuring precision insulation, soundproofing, and structural strength for your home.
              </p>
              
              {/* Primary Actions - Highly visible, no scroll needed */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/quote" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full font-bold flex items-center justify-center gap-2">
                    Configure Price Estimate <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href={`tel:${businessSettings.phone}`} className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full font-bold flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-brand-secondary" /> Call Specialist
                  </Button>
                </a>
                <a 
                  href={`https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-lg transition-all duration-300 shadow-xs"
                >
                  <MessageSquare className="w-4.5 h-4.5" /> WhatsApp
                </a>
              </div>

              {/* Quick trust bullet checklist */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-semibold text-brand-primary pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-brand-secondary">✓</span> 20-Year Profile Warranty
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-secondary">✓</span> German Multi-Point Locks
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-secondary">✓</span> Demolition of Old Frames
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-secondary">✓</span> Silicone Waterproofing
                </div>
              </div>
            </div>

            {/* Right: Technical Blueprint & Video Visualizer */}
            <div className="lg:col-span-5 relative flex flex-col items-center">
              <div className="w-full max-w-md bg-white border border-brand-border rounded-2xl p-6 shadow-xl aspect-square flex flex-col justify-between overflow-hidden relative">
                
                {/* Header Tabs */}
                <div className="flex justify-between items-center border-b border-brand-border pb-3">
                  <div className="flex gap-1.5 bg-slate-100 p-0.5 rounded-lg">
                    <button
                      onClick={() => setActiveHeroTab('blueprint')}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                        activeHeroTab === 'blueprint'
                          ? 'bg-white text-brand-primary shadow-xs'
                          : 'text-brand-muted hover:text-brand-primary'
                      }`}
                    >
                      SCHEMATIC
                    </button>
                    <button
                      onClick={() => setActiveHeroTab('video')}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                        activeHeroTab === 'video'
                          ? 'bg-white text-brand-primary shadow-xs'
                          : 'text-brand-muted hover:text-brand-primary'
                      }`}
                    >
                      FACTORY TOUR
                    </button>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-secondary bg-brand-accent px-2 py-0.5 rounded">
                    {activeHeroTab === 'blueprint' ? 'System Profile' : 'In Production'}
                  </span>
                </div>

                {activeHeroTab === 'blueprint' ? (
                  <>
                    <div className="space-y-1 mt-3">
                      <h3 className="text-base font-extrabold text-brand-primary">Multi-Chamber uPVC Profile</h3>
                      <p className="text-xs text-brand-muted">Precision corner welding with galvanized steel core reinforcement.</p>
                    </div>
                    
                    {/* SVG Blueprint */}
                    <div className="my-6 flex justify-center">
                      <svg width="180" height="130" viewBox="0 0 100 80">
                        <rect x="2" y="2" width="96" height="76" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2" />
                        {/* Outer frame */}
                        <rect x="8" y="8" width="84" height="64" fill="none" stroke="#1e3d59" strokeWidth="4" />
                        {/* Inner vertical slider mullion */}
                        <line x1="50" y1="8" x2="50" y2="72" stroke="#1e3d59" strokeWidth="3" />
                        {/* Glass reflections */}
                        <path d="M22 25 L34 25" stroke="#cbd5e1" strokeWidth="0.75" />
                        <path d="M25 21 L31 21" stroke="#cbd5e1" strokeWidth="0.75" />
                        <path d="M64 45 L76 45" stroke="#cbd5e1" strokeWidth="0.75" />
                        <path d="M67 41 L73 41" stroke="#cbd5e1" strokeWidth="0.75" />
                        {/* Hardware latch */}
                        <circle cx="48" cy="40" r="1.5" fill="#64748b" />
                        <line x1="48" y1="40" x2="48" y2="46" stroke="#64748b" strokeWidth="1" />
                        {/* Double-glazing spacer icon in corner */}
                        <rect x="12" y="12" width="8" height="8" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
                        <line x1="16" y1="12" x2="16" y2="20" stroke="#94a3b8" strokeWidth="0.5" />
                      </svg>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-semibold text-brand-muted border-t border-brand-light pt-3">
                      <span>Acoustic Isolation: 38dB</span>
                      <span>Wind Load: 1500 Pascal</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1 mt-3">
                      <h3 className="text-base font-extrabold text-brand-primary">Precision Manufacturing</h3>
                      <p className="text-xs text-brand-muted">Watch how our sliding tracks and steel reinforcement are put together.</p>
                    </div>

                    {/* Premium Video Placeholder Slot */}
                    <div className="my-4 bg-slate-900 rounded-xl relative overflow-hidden aspect-video flex flex-col items-center justify-center border border-slate-800 group cursor-pointer shadow-inner">
                      {/* Grid overlay for texture */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30" />
                      
                      {/* Dark gradient filter */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                      
                      {/* Play Button Action */}
                      <div className="relative z-10 w-12 h-12 rounded-full bg-white/95 text-brand-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 fill-brand-primary ml-0.5" />
                      </div>
                      
                      {/* Video Caption info */}
                      <div className="absolute bottom-3 left-3 right-3 text-left z-10">
                        <span className="text-[9px] font-bold text-brand-secondary block uppercase tracking-wider">Video Guide</span>
                        <span className="text-xs font-semibold text-white block mt-0.5">Bangalore Workshop Tour (1:45)</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-semibold text-brand-muted border-t border-brand-light pt-3">
                      <span>Corner Fusion Welding</span>
                      <span>CNC Profile Cutting</span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST / PROOF STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-primary text-white rounded-2xl py-8 px-6 sm:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="block text-3xl font-extrabold text-brand-secondary">25+</span>
            <span className="block text-xs uppercase tracking-wider text-slate-300">Years Industry Trust</span>
          </div>
          <div className="space-y-1 border-l border-slate-700/60 pl-4">
            <span className="block text-3xl font-extrabold text-brand-secondary">5,000+</span>
            <span className="block text-xs uppercase tracking-wider text-slate-300">Windows Fabricated</span>
          </div>
          <div className="space-y-1 border-l border-slate-700/60 pl-4">
            <span className="block text-3xl font-extrabold text-brand-secondary">100%</span>
            <span className="block text-xs uppercase tracking-wider text-slate-300">In-house Installation</span>
          </div>
          <div className="space-y-1 border-l border-slate-700/60 pl-4">
            <span className="block text-3xl font-extrabold text-brand-secondary">Bangalore</span>
            <span className="block text-xs uppercase tracking-wider text-slate-300">Local Workshop</span>
          </div>
        </div>
      </section>

      {/* 3. FLAGSHIP UPVC SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left info column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">HIGH PERFORMANCE SYSTEMS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight">
              German-Engineered uPVC Systems
            </h2>
            <p className="text-brand-muted text-sm leading-relaxed">
              Our uPVC profiles are formulated with special UV stabilizers to withstand intense tropical heat without yellowing, cracking, or turning brittle. Equipped with double-gasket insulation and multi-chambered sash frames, they are the gold standard for peaceful, dust-free indoor living.
            </p>

            {/* Performance bullet grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-2.5">
                <VolumeX className="w-5 h-5 text-brand-secondary flex-shrink-0" />
                <div>
                  <span className="block font-bold text-xs text-brand-primary">Acoustic Soundproofing</span>
                  <span className="block text-[11px] text-brand-muted mt-0.5">Dampens traffic and neighborhood noise by up to 35-40 decibels.</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Thermometer className="w-5 h-5 text-brand-secondary flex-shrink-0" />
                <div>
                  <span className="block font-bold text-xs text-brand-primary">Thermal Insulation</span>
                  <span className="block text-[11px] text-brand-muted mt-0.5">Prevents heat conduction, lowering your summer AC electricity bills.</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Droplets className="w-5 h-5 text-brand-secondary flex-shrink-0" />
                <div>
                  <span className="block font-bold text-xs text-brand-primary">100% Water Tight</span>
                  <span className="block text-[11px] text-brand-muted mt-0.5">Gradient weep holes and double TPE gaskets seal out monsoon rain.</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <ShieldCheck className="w-5 h-5 text-brand-secondary flex-shrink-0" />
                <div>
                  <span className="block font-bold text-xs text-brand-primary">Anti-Intrusion Locking</span>
                  <span className="block text-[11px] text-brand-muted mt-0.5">Multi-point lock bolts latch into the steel reinforcement core.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-4">
              <Link href="/upvc/windows">
                <Button variant="secondary" size="sm" className="font-bold">uPVC Windows</Button>
              </Link>
              <Link href="/upvc/doors">
                <Button variant="secondary" size="sm" className="font-bold">uPVC Doors</Button>
              </Link>
              <Link href="/upvc/configurator">
                <Button size="sm" className="font-bold flex items-center gap-1.5">
                  Configure uPVC <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right graphics column */}
          <div className="lg:col-span-6 bg-slate-50 border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider block border-b border-brand-border pb-2">
              End-to-End Home Service Workflow
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-brand-primary text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-bold text-sm text-brand-primary block">Laser-Accurate Site Measurement</span>
                  <span className="text-xs text-brand-muted block mt-0.5">Our experienced surveyor visits your home to record opening sizes in three dimensions, ensuring perfect sash fitting.</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-brand-primary text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-bold text-sm text-brand-primary block">In-house Custom Fabrication</span>
                  <span className="text-xs text-brand-muted block mt-0.5">Profiles are reinforced with rust-resistant steel sashes and corner-welded inside our local fabrication facility.</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-brand-primary text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-bold text-sm text-brand-primary block">Anchor Drilling & Silicone Sealing</span>
                  <span className="text-xs text-brand-muted block mt-0.5">We dismantle old frames, mount the profiles plumb, and secure the edges with premium, weather-grade silicone sealant.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ALUMINIUM SECTION */}
      <section className="bg-slate-50 py-16 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Graphics */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="border border-brand-border bg-white rounded-2xl p-6 space-y-4">
                <span className="text-[10px] font-bold text-brand-secondary block uppercase tracking-wider">STRUCTURAL STRENGTH</span>
                <h4 className="font-extrabold text-base text-brand-primary">Architectural-Grade Aluminium</h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Engineered using premium T6 tempering grade alloy profiles. Standard profiles have extremely narrow sightlines, allowing for expansive glass surfaces that frame panoramic views without compromising wind resistance.
                </p>
                <div className="p-4 bg-slate-50 rounded-lg space-y-2 border border-brand-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-muted">Max Panel Width</span>
                    <span className="font-bold text-brand-primary">up to 6.5 Feet</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-muted">Max Panel Height</span>
                    <span className="font-bold text-brand-primary">up to 10 Feet</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-muted">Surface Finishes</span>
                    <span className="font-bold text-brand-primary">Powder Coated & Anodized</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right content info */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">SLIMLINE PANORAMIC SYSTEMS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight">
                Premium Architectural Aluminium Work
              </h2>
              <p className="text-brand-muted text-sm leading-relaxed">
                Ideal for modern penthouse balconies, wide structural partition walls, and high-altitude sliding doors. We offer advanced thermal break profiles to isolate heat and avoid metal frame conduction.
              </p>
              
              <ul className="space-y-3 text-xs text-brand-primary font-semibold">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></span> Slim frames provide a minimalist, architect-selected look.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></span> Anodized colors resist peel, fade, scratch, and salty humidity.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></span> Smooth, heavy-duty lift-and-slide rollers for panoramic sashes.
                </li>
              </ul>

              <div className="pt-2 flex gap-4">
                <Link href="/aluminium/windows">
                  <Button variant="secondary" size="sm" className="font-bold">Aluminium Windows</Button>
                </Link>
                <Link href="/aluminium/doors">
                  <Button variant="secondary" size="sm" className="font-bold">Aluminium Doors</Button>
                </Link>
                <Link href="/aluminium/configurator">
                  <Button size="sm" className="font-bold flex items-center gap-1.5">
                    Configure Aluminium <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PROJECTS / TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">OUR FABRICATION PORTFOLIO</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-primary">
            Featured Balcony & Villa Installations
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            Take a look at some of our actual residential installations carried out across Bangalore, engineered for sound isolation, safety, and modern looks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectsList.map((project) => (
            <Card key={project.id} className="group overflow-hidden border-brand-border flex flex-col justify-between">
              <div>
                {/* Image Placeholder with high-end architectural naming */}
                <div className="bg-slate-100 border-b border-brand-border aspect-video w-full flex items-center justify-center text-brand-muted text-xs font-semibold relative">
                  <span className="group-hover:scale-105 transition-transform duration-300">{project.title} Image</span>
                  <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {project.category}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-brand-primary group-hover:text-brand-secondary transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0 text-[10px] text-brand-muted border-t border-brand-light mt-2 space-y-1.5 bg-slate-50/50">
                <div className="flex justify-between font-semibold text-brand-primary">
                  <span>Location:</span>
                  <span>{project.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profile:</span>
                  <span>{project.specs.series}</span>
                </div>
                <div className="flex justify-between">
                  <span>Glass:</span>
                  <span className="truncate max-w-[120px]">{project.specs.glass}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Testimonials snippet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {testimonialsList.map((t) => (
            <Card key={t.id} className="border-brand-border bg-white p-6 space-y-4">
              <div className="flex items-center gap-1 text-brand-secondary">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-sm">★</span>
                ))}
              </div>
              <p className="text-xs text-brand-primary italic leading-relaxed">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="border-t border-brand-light pt-3 flex justify-between items-center text-[10px]">
                <div>
                  <span className="font-bold text-brand-primary block">{t.name}</span>
                  <span className="text-brand-muted block">{t.role}</span>
                </div>
                <span className="text-slate-400 font-medium">{t.location}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. CONFIGURATOR TEASER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="absolute inset-0 bg-radial-gradient from-blue-900/10 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-secondary/20 text-brand-secondary">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Pricing Calculator
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Get an Instant Estimated Price Guide Over WhatsApp
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
              Choose your window style, series dimensions, frame colours, and hardware locks. Our configurator calculates a pricing guide range and compiles everything into a WhatsApp message ready to send to our surveyors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/quote">
                <Button size="lg" className="w-full font-bold bg-brand-secondary text-white hover:bg-brand-secondary-hover border-none flex items-center justify-center gap-1.5">
                  Launch Configurator <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href={`tel:${businessSettings.phone}`}>
                <Button variant="ghost" size="lg" className="w-full font-bold text-white hover:bg-slate-800 border border-slate-700">
                  Book Site Measurement
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center relative z-10">
            <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 w-full max-w-sm space-y-4">
              <h3 className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">Estimated Quote Example</h3>
              <div className="p-4 bg-slate-950/80 rounded-xl space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">System Choice</span>
                  <span className="font-bold">uPVC sliding sash</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Dimensions</span>
                  <span className="font-bold">5.0 ft x 4.0 ft (20 sq.ft)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Colour Profile</span>
                  <span className="font-bold">Anthracite Grey foil</span>
                </div>
                <div className="border-t border-slate-800 my-2 pt-2 flex justify-between font-bold text-sm text-brand-secondary">
                  <span>Estimated Guide</span>
                  <span>₹19,500 - ₹22,400</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 leading-relaxed text-center">
                Includes custom local fabrication, weather sealing & installation setup.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. MESH / GLASS SUPPORT SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mosquito protection systems */}
        <Card className="border-brand-border p-6 sm:p-8 flex flex-col justify-between bg-white hover:bg-slate-50/20">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded bg-brand-light text-brand-primary text-xs font-bold uppercase tracking-wider inline-block">
              Mosquito Flyscreens
            </span>
            <h3 className="text-xl font-extrabold text-brand-primary">
              Mosquito Mesh Protection
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Insects can be a major nuisance. We manufacture and retrofit integrated mosquito barriers using fiberglass invisible mesh, heavy-duty SS304 mesh (pet and rodent-proof), and premium pleated folding systems designed for sliding doors.
            </p>
            <ul className="space-y-1.5 text-xs text-brand-muted">
              <li>&middot; <strong>Fiberglass screens</strong>: Budget-friendly and highly transparent.</li>
              <li>&middot; <strong>SS304 mesh</strong>: Extremely durable, rust-proof safety barrier.</li>
              <li>&middot; <strong>Pleated screens</strong>: Folds away neatly inside the track frame.</li>
            </ul>
          </div>
          <div className="pt-6">
            <Link href="/mesh/mosquito-mesh">
              <Button variant="secondary" size="sm" className="font-bold flex items-center gap-1">
                Browse Mesh Screens <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Structural glass railings */}
        <Card className="border-brand-border p-6 sm:p-8 flex flex-col justify-between bg-white hover:bg-slate-50/20">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded bg-brand-light text-brand-primary text-xs font-bold uppercase tracking-wider inline-block">
              Architectural Glass
            </span>
            <h3 className="text-xl font-extrabold text-brand-primary">
              Glass Balustrades & Railings
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Elevate your home&apos;s aesthetics. We install heavy-duty frameless glass balustrades for balconies, spider-fitting structural elevation glass, shower cubicles, and safety glazing options that comply with wind load constraints.
            </p>
            <ul className="space-y-1.5 text-xs text-brand-muted">
              <li>&middot; <strong>Laminated Safety Glass</strong>: 12mm thick, remains intact even if cracked.</li>
              <li>&middot; <strong>SS316 Spigots</strong>: Marine-grade stainless steel floor mounts.</li>
              <li>&middot; <strong>Structural Elevation</strong>: Large glass curtain walls for modern facades.</li>
            </ul>
          </div>
          <div className="pt-6">
            <Link href="/glass-railing">
              <Button variant="secondary" size="sm" className="font-bold flex items-center gap-1">
                View Glass Installations <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

      </section>

    </div>
  );
}
