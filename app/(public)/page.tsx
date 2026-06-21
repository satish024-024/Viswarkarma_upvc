"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  CheckCircle2,
  Home,
  Star,
  Ruler,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  businessSettings as defaultSettings,
  projectsList as defaultProjects,
  testimonialsList as defaultTestimonials,
} from '@/lib/data/business';
import { getBusinessSettings, getProjects, getTestimonials } from '@/lib/supabase';

// ─── Window type data with images ───────────────────────────────────────────
const WINDOW_TYPES = [
  {
    id: 'sliding',
    name: 'Sliding Window',
    subtitle: 'Opens Left & Right',
    desc: 'Panels glide sideways. No swing space needed. Great for bedrooms, living rooms, and smaller openings.',
    img: 'https://5.imimg.com/data5/SX/YV/YG/SELLER-64612523/upvc-sliding-window-500x500.jpg',
    badge: 'Most Popular',
  },
  {
    id: 'casement',
    name: 'Casement Window',
    subtitle: 'Swings Open Like a Door',
    desc: 'Hinged on one side, swings outward. 100% glass exposed for full ventilation. Ideal for fresh air.',
    img: 'https://5.imimg.com/data5/QR/VY/TK/SELLER-64612523/casement-window-500x500.jpeg',
    badge: 'Best Airflow',
  },
  {
    id: 'tophung',
    name: 'Top-Hung Window',
    subtitle: 'Opens Outward from Top',
    desc: 'Hinged at the top. Perfect for bathrooms and kitchens — lets in air even during light rain.',
    img: 'https://5.imimg.com/data5/PK/AF/KY/SELLER-64612523/upvc-top-hung-window-500x500.jpg',
    badge: 'Rain-Safe Vent',
  },
  {
    id: 'french',
    name: 'French / Balcony Door',
    subtitle: 'Wide Sliding or Swing Door',
    desc: 'Full-height glass panels for balconies and sit-outs. Multi-point locking for security.',
    img: 'https://5.imimg.com/data5/RU/YJ/HX/SELLER-64612523/upvc-french-door-500x500.jpg',
    badge: 'Balcony Favourite',
  },
  {
    id: 'double_door',
    name: 'Glass Double Door',
    subtitle: 'Grand Entry Statement',
    desc: 'Full-glass swing doors for main entrances. Architecturally striking with secure multi-point locks.',
    img: 'https://5.imimg.com/data5/AL/LI/CS/SELLER-64612523/upvc-glass-double-door-500x500.jpg',
    badge: 'Premium Look',
  },
  {
    id: 'mesh',
    name: 'Mosquito Mesh Screen',
    subtitle: 'Zero Insects, Full Airflow',
    desc: 'Fitted to your existing windows. Fiberglass, SS304 steel, or pleated retractable options.',
    img: 'https://5.imimg.com/data5/VJ/OO/VB/SELLER-64612523/upvc-sliding-window-profiles-125x125.jpg',
    badge: 'Pest-Free Comfort',
  },
];

// ─── How it works steps ───────────────────────────────────────────────────────
const PROCESS = [
  {
    step: '01',
    icon: Sparkles,
    title: 'Tell Us Your Home Details',
    body: 'Use our online estimator. Enter the number of windows, home size, and what style you want. Get an instant price range in 2 minutes.',
  },
  {
    step: '02',
    icon: Ruler,
    title: 'We Visit & Measure Free',
    body: 'Our team visits your home at no charge. We laser-measure every opening, check wall thickness, and understand your requirements.',
  },
  {
    step: '03',
    icon: Wrench,
    title: 'Custom-Made & Installed',
    body: "Profiles are fabricated in our Bangalore workshop to your exact measurements, then professionally installed and sealed. No mess left behind.",
  },
];

// ─── Benefits ─────────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: VolumeX, label: 'Sound-Proof', desc: 'Blocks up to 38 dB of noise' },
  { icon: Thermometer, label: 'Heat-Insulating', desc: 'Reduces AC electricity bills' },
  { icon: Droplets, label: '100% Waterproof', desc: 'Monsoon-proof triple gasket seals' },
  { icon: ShieldCheck, label: 'Burglar-Resistant', desc: 'German multi-point locks standard' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Homepage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [projects, setProjects] = useState(defaultProjects);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    getBusinessSettings().then(setSettings);
    getProjects().then(setProjects);
    getTestimonials().then(setTestimonials);
  }, []);

  return (
    <div className="w-full pb-20">

      {/* ══════════════════════════════════════════
          SECTION 1: HERO
      ══════════════════════════════════════════ */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none" />
        {/* gold glow */}
        <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-[radial-gradient(ellipse_at_top_right,#c5a88018,transparent_55%)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left copy */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                25+ Years · Family-Run · Bangalore
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.1]">
                Premium{' '}
                <span className="text-gold">uPVC & Aluminium</span>{' '}
                Windows & Doors for Your Whole Home
              </h1>

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
                We measure, fabricate, and install complete window & door solutions for entire homes — custom-made in our Bangalore workshop, installed by our own team. No middlemen.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link href="/quote">
                  <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gold hover:bg-gold-hover transition-all duration-200 text-sm shadow-lg shadow-gold/20">
                    <Sparkles className="w-4 h-4" /> Get Free Home Estimate
                  </button>
                </Link>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white border border-slate-600 hover:border-gold/40 hover:bg-white/5 transition-all duration-200 text-sm"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp Us
                </a>
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white border border-slate-600 hover:border-gold/40 hover:bg-white/5 transition-all duration-200 text-sm"
                >
                  <Phone className="w-4 h-4" /> Call Now
                </a>
              </div>

              {/* Trust bullets */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  'Free Site Measurement',
                  '20-Year Profile Warranty',
                  'Whole-Home Pricing',
                  'German Multi-Point Locks',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Right stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '25+', label: 'Years of Experience', sub: 'Family-run since 1999' },
                { num: '5,000+', label: 'Windows Installed', sub: 'Across Bangalore & Karnataka' },
                { num: '100%', label: 'In-house Fabrication', sub: 'No middlemen or resellers' },
                { num: 'Free', label: 'Site Measurement', sub: 'We come to you at no cost' },
              ].map((s) => (
                <div
                  key={s.num}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-1.5 hover:border-gold/30 hover:bg-white/8 transition-all"
                >
                  <span className="block text-3xl font-black text-gold leading-none">{s.num}</span>
                  <span className="block text-sm font-bold text-white leading-tight">{s.label}</span>
                  <span className="block text-[11px] text-slate-500 leading-tight">{s.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2: WHAT WE INSTALL (Image Grid)
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-gold/30 bg-gold/5 px-3 py-1 rounded-full">
              What We Install
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              See Exactly What You&apos;re Getting
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Every style shown below is custom-fabricated at our Bangalore workshop. Click any card to get an instant price estimate for your home.
            </p>
          </div>

          {/* 3-col image grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WINDOW_TYPES.map((wt, idx) => (
              <Link href="/quote" key={wt.id} className="group">
                <Card className="overflow-hidden border border-slate-200 hover:border-gold/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white h-full flex flex-col">
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={wt.img}
                      alt={wt.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={idx < 3}
                    />
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-sm text-gold text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {wt.badge}
                    </div>
                  </div>

                  {/* Text */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-black text-slate-950 text-base group-hover:text-gold transition-colors">{wt.name}</h3>
                      <p className="text-[11px] font-bold text-gold/80 uppercase tracking-wide mt-0.5">{wt.subtitle}</p>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{wt.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-gold pt-1">
                      Get Estimate <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3: HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-gold/30 bg-gold/10 px-3 py-1 rounded-full">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              From Estimate to Installed — We Handle Everything
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              You don&apos;t need to measure, plan, or manage. Just tell us what you want and we take care of the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROCESS.map((p, idx) => (
              <div key={p.step} className="relative group">
                {/* Connector line */}
                {idx < PROCESS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-6 h-px bg-gold/20 z-10" />
                )}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-7 space-y-5 hover:border-gold/30 hover:bg-white/8 transition-all h-full">
                  <div className="flex items-start justify-between">
                    <span className="text-5xl font-black text-gold/20 group-hover:text-gold/40 transition-colors leading-none font-mono">
                      {p.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <p.icon className="w-5 h-5 text-gold" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-lg leading-tight">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/quote">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-slate-950 bg-gold hover:bg-gold-hover transition-all duration-200 text-sm shadow-lg shadow-gold/20">
                <Sparkles className="w-4 h-4" /> Start Your Free Estimate
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4: BENEFITS
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl font-black text-slate-950">Why Homeowners Choose Viswarkarma</h2>
            <p className="text-slate-500 text-sm">Built to perform for the Indian climate — extreme heat, monsoons, and urban noise.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center space-y-3 p-5 rounded-2xl border border-slate-100 hover:border-gold/30 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <b.icon className="w-5 h-5 text-gold" />
                </div>
                <span className="font-black text-slate-950 text-sm">{b.label}</span>
                <span className="text-xs text-slate-500 leading-tight">{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5: UPVC vs ALUMINIUM visual compare
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-gold/30 bg-gold/5 px-3 py-1 rounded-full">
              uPVC vs Aluminium
            </span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">Which System is Right for Your Home?</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">Both are excellent choices. Here&apos;s a simple comparison to help you decide.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* uPVC */}
            <Card className="border border-slate-200 hover:border-gold/40 transition-all overflow-hidden">
              <div className="relative w-full h-52 overflow-hidden bg-slate-100">
                <Image
                  src="https://5.imimg.com/data5/IT/RJ/XJ/SELLER-64612523/upvc-casement-window-125x125.jpg"
                  alt="uPVC Windows"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-black text-xl">uPVC Systems</span>
                  <p className="text-slate-300 text-xs mt-0.5">Best for apartments & villas</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  {[
                    { pro: true, text: 'Excellent thermal & sound insulation' },
                    { pro: true, text: '20-year warranty, zero maintenance' },
                    { pro: true, text: 'Better energy savings (lower AC bills)' },
                    { pro: false, text: 'Not ideal for very large openings (>8ft wide)' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 flex-shrink-0 font-bold ${item.pro ? 'text-gold' : 'text-slate-400'}`}>
                        {item.pro ? '✓' : '○'}
                      </span>
                      <span className={item.pro ? 'text-slate-700' : 'text-slate-400'}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link href="/upvc">
                  <button className="w-full mt-2 py-2.5 rounded-xl border border-gold/30 text-gold font-bold text-sm hover:bg-gold/5 transition-colors">
                    Explore uPVC Systems →
                  </button>
                </Link>
              </div>
            </Card>

            {/* Aluminium */}
            <Card className="border border-slate-200 hover:border-gold/40 transition-all overflow-hidden">
              <div className="relative w-full h-52 overflow-hidden bg-slate-100">
                <Image
                  src="https://5.imimg.com/data5/QX/UE/YU/SELLER-64612523/upvc-casement-profile-125x125.jpg"
                  alt="Aluminium Windows"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-black text-xl">Aluminium Systems</span>
                  <p className="text-slate-300 text-xs mt-0.5">Best for large openings & modern designs</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  {[
                    { pro: true, text: 'Ultra-slim frames, panoramic glass views' },
                    { pro: true, text: 'Handles very large widths & heights' },
                    { pro: true, text: 'Anodised & powder-coated — fade resistant' },
                    { pro: false, text: 'Conducts heat (thermal break upgrade needed)' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 flex-shrink-0 font-bold ${item.pro ? 'text-gold' : 'text-slate-400'}`}>
                        {item.pro ? '✓' : '○'}
                      </span>
                      <span className={item.pro ? 'text-slate-700' : 'text-slate-400'}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link href="/aluminium">
                  <button className="w-full mt-2 py-2.5 rounded-xl border border-gold/30 text-gold font-bold text-sm hover:bg-gold/5 transition-colors">
                    Explore Aluminium Systems →
                  </button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6: PROJECTS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-gold/30 bg-gold/5 px-3 py-1 rounded-full">
                Our Work
              </span>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight">Recent Installations</h2>
              <p className="text-slate-500 text-sm">Real homes across Bangalore.</p>
            </div>
            <Link href="/projects">
              <Button variant="secondary" className="border-slate-200 font-bold text-sm hover:border-gold/40">
                View All Projects <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {projects.slice(0, 4).map((project) => (
              <Card key={project.id} className="group overflow-hidden border border-slate-200 hover:border-gold/30 hover:shadow-lg transition-all bg-white">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 aspect-video w-full flex flex-col items-center justify-center relative overflow-hidden p-4">
                  <span className="text-gold text-[9px] font-bold uppercase tracking-widest mb-1">{project.category}</span>
                  <span className="text-white font-bold text-sm text-center leading-tight">{project.title}</span>
                  <div className="absolute top-2 right-2 bg-gold/20 text-gold text-[8px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {project.specs.system}
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <h3 className="font-black text-sm text-slate-950 group-hover:text-gold transition-colors leading-snug">{project.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{project.description}</p>
                  <div className="pt-2 flex justify-between text-[10px] text-slate-400 font-medium border-t border-slate-100">
                    <span>{project.location}</span>
                    <span>{project.specs.series}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7: TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-gold/30 bg-gold/5 px-3 py-1 rounded-full">
              What Homeowners Say
            </span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">Trusted by Families Across Bangalore</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <Card key={t.id} className="border border-slate-200 hover:border-gold/30 p-6 space-y-4 bg-white transition-colors hover:shadow-md">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">&ldquo;{t.content}&rdquo;</p>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div>
                    <span className="font-black text-slate-950 text-sm block">{t.name}</span>
                    <span className="text-slate-500 text-xs">{t.role}</span>
                  </div>
                  <span className="text-slate-400 text-xs font-medium">{t.location}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 8: FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 mx-auto">
            <Home className="w-7 h-7 text-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Ready to Upgrade Your Entire Home?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Enter your home size and number of windows — get an estimated price range in 2 minutes. Then we come to you, measure properly, and give a final quote. <strong className="text-white">No pressure. No hidden charges.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quote">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-slate-950 bg-gold hover:bg-gold-hover transition-all duration-200 text-sm shadow-lg shadow-gold/20">
                <Sparkles className="w-4 h-4" /> Launch Home Estimator
              </button>
            </Link>
            <a href={`tel:${settings.phone}`}>
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white border border-slate-700 hover:border-gold/50 hover:bg-white/5 transition-all duration-200 text-sm">
                <Phone className="w-4 h-4" /> Book Free Site Visit
              </button>
            </a>
          </div>
          <p className="text-slate-600 text-xs">
            Serving Bangalore · No visit charges · Professional installation · 25+ years experience
          </p>
        </div>
      </section>

    </div>
  );
}
