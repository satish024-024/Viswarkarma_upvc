"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageSquare, ArrowRight, ShieldCheck, Award, VolumeX, Thermometer, Droplets, Sparkles, CheckCircle2, Star, Ruler, Wrench } from 'lucide-react';
import { businessSettings as dflt, projectsList as dfltProjects, testimonialsList as dfltTestimonials } from '@/lib/data/business';
import { getBusinessSettings, getProjects, getTestimonials } from '@/lib/supabase';

/* ─── DATA ───────────────────────────────────────────────── */
const PRODUCTS = [
  { id: 'sliding',   name: 'Sliding Window',        note: 'Opens Left & Right',       desc: 'Space-saving horizontal panels. Great for bedrooms & compact rooms. No swing space needed.',          img: 'https://5.imimg.com/data5/SX/YV/YG/SELLER-64612523/upvc-sliding-window-500x500.jpg',     badge: 'Most Popular' },
  { id: 'casement',  name: 'Casement Window',        note: 'Swings Open Like a Door',  desc: 'Side-hinged, opens outward fully. 100% glass exposed for maximum fresh air and light.',              img: 'https://5.imimg.com/data5/QR/VY/TK/SELLER-64612523/casement-window-500x500.jpeg',        badge: 'Best Airflow' },
  { id: 'tophung',   name: 'Top-Hung Window',        note: 'Hinged at Top — Rain-Safe', desc: 'Ventilates even during rain. Ideal for bathrooms, kitchens, and staircase openings.',              img: 'https://5.imimg.com/data5/PK/AF/KY/SELLER-64612523/upvc-top-hung-window-500x500.jpg',    badge: 'Rain-Safe' },
  { id: 'french',    name: 'French / Balcony Door',  note: 'Wide Sliding or Swing',    desc: 'Full-height glass for balconies & sit-outs. Multi-point locking as standard.',                       img: 'https://5.imimg.com/data5/RU/YJ/HX/SELLER-64612523/upvc-french-door-500x500.jpg',        badge: 'Balcony Pick' },
  { id: 'glassdoor', name: 'Glass Double Door',       note: 'Grand Entry Statement',    desc: 'Full-glass swing double doors. Architecturally striking with German anti-intrusion locks.',          img: 'https://5.imimg.com/data5/AL/LI/CS/SELLER-64612523/upvc-glass-double-door-500x500.jpg',  badge: 'Premium Look' },
  { id: 'mesh',      name: 'Mosquito Mesh Screen',   note: 'Zero Insects, Full Airflow', desc: 'Retrofitted to existing frames. Fiberglass, SS304 steel, or retractable pleated options.',        img: 'https://5.imimg.com/data5/VJ/OO/VB/SELLER-64612523/upvc-sliding-window-profiles-125x125.jpg', badge: 'Pest-Free' },
];

const STEPS = [
  { n: '01', Icon: Sparkles, title: 'Get an Instant Estimate',  body: 'Use our online home estimator. Enter your home size and number of windows — get a price range in 2 minutes.' },
  { n: '02', Icon: Ruler,    title: 'We Visit & Measure — Free', body: 'Our surveyor visits at no charge, laser-measures every opening, and records exact wall depths.' },
  { n: '03', Icon: Wrench,   title: 'Fabricated & Installed',   body: 'Profiles custom-made in our Rajahmundry workshop, then installed by our own team with full weather sealing.' },
];

const BENEFITS = [
  { Icon: VolumeX,    label: 'Sound-Proof',       sub: 'Up to 38 dB noise reduction' },
  { Icon: Thermometer, label: 'Heat-Insulating',  sub: 'Cuts AC electricity bills' },
  { Icon: Droplets,   label: '100% Waterproof',   sub: 'Triple monsoon-proof gaskets' },
  { Icon: ShieldCheck, label: 'Burglar-Resistant', sub: 'German multi-point locks' },
];

/* ─── COMPONENT ──────────────────────────────────────────── */
export default function Homepage() {
  const [settings, setSettings] = useState(dflt);
  const [projects, setProjects] = useState(dfltProjects);
  const [reviews, setReviews] = useState(dfltTestimonials);

  useEffect(() => {
    getBusinessSettings().then(setSettings);
    getProjects().then(setProjects);
    getTestimonials().then(setReviews);
  }, []);

  const wa = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`;

  return (
    <div className="w-full">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-ivory border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Copy */}
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border-gold bg-gold-faint text-gold text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> 25+ Years · Family-Run · Rajahmundry HQ · Pan-India
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-heading tracking-tight leading-[1.15]">
              Bespoke <span className="text-gold">uPVC & Aluminium</span> Systems
              <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-light text-body leading-tight">
                Engineered for India&apos;s <span className="text-gold font-serif italic font-semibold">Finest Residences</span>
              </span>
            </h1>

            <p className="text-body text-base leading-relaxed max-w-xl">
              We engineer, custom-fabricate, and precision-install complete window and door systems for prestigious homes. Handcrafted in our Rajahmundry workshop and installed anywhere in India with zero middlemen, ensuring unmatched security, acoustics, and elegance.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/quote" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-gold hover:bg-gold-rich text-white text-sm transition-all shadow-md shadow-gold/20">
                <Sparkles className="w-4 h-4" /> Get Free Home Estimate
              </Link>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold border border-border bg-white text-heading hover:border-border-gold hover:bg-gold-faint text-sm transition-all">
                <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp Us
              </a>
              <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold border border-border bg-white text-heading hover:border-border-gold hover:bg-gold-faint text-sm transition-all">
                <Phone className="w-4 h-4 text-gold-light" /> Call Now
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {['Free Site Measurement', '20-Year Profile Warranty', 'Whole-Home Pricing', 'German Multi-Point Locks'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs font-semibold text-body">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-light flex-shrink-0" /> {f}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: '25+',   l: 'Years of Experience', s: 'Family-run since 1999' },
              { n: '5,000+', l: 'Windows Installed',   s: 'Across AP & Pan-India' },
              { n: '100%',  l: 'In-house Fabrication', s: 'No middlemen or resellers' },
              { n: 'Free',  l: 'Site Measurement',     s: 'We come to you at no cost' },
            ].map((st) => (
              <div key={st.n} className="bg-white border border-border rounded-2xl p-5 space-y-1 hover:border-border-gold hover:shadow-md transition-all">
                <span className="block text-3xl font-black text-gold leading-none">{st.n}</span>
                <span className="block text-sm font-bold text-heading leading-tight">{st.l}</span>
                <span className="block text-[11px] text-muted">{st.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-border-gold bg-gold-faint px-3 py-1 rounded-full">What We Install</span>
            <h2 className="text-3xl sm:text-4xl font-black text-heading tracking-tight">See Exactly What You&apos;re Getting</h2>
            <p className="text-body text-sm leading-relaxed">Every style is custom-made at our fabrication facility. Tap any card to get an instant price estimate.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p, i) => (
              <Link href="/quote" key={p.id} className="group block">
                <div className="bg-white border border-border rounded-2xl overflow-hidden hover:border-border-gold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-cream">
                    <Image src={p.img} alt={p.name} fill sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" priority={i < 3} />
                    <span className="absolute top-3 left-3 bg-gold text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">{p.badge}</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-black text-heading text-sm group-hover:text-gold transition-colors">{p.name}</h3>
                      <p className="text-[10px] font-bold text-gold uppercase tracking-wide mt-0.5">{p.note}</p>
                      <p className="text-xs text-body mt-1.5 leading-relaxed">{p.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-gold pt-1">
                      Get Estimate <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-border-gold bg-gold-faint px-3 py-1 rounded-full">Simple 3-Step Process</span>
            <h2 className="text-3xl sm:text-4xl font-black text-heading tracking-tight">From Estimate to Installed — We Handle Everything</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((st) => (
              <div key={st.n} className="bg-white border border-border rounded-2xl p-7 hover:border-border-gold hover:shadow-md transition-all space-y-4">
                <div className="flex items-start justify-between">
                  <span className="text-5xl font-black text-warm leading-none font-mono">{st.n}</span>
                  <div className="w-10 h-10 rounded-xl bg-gold-faint border border-border-gold flex items-center justify-center">
                    <st.Icon className="w-5 h-5 text-gold" />
                  </div>
                </div>
                <h3 className="font-bold text-heading text-base leading-tight">{st.title}</h3>
                <p className="text-body text-sm leading-relaxed">{st.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link href="/quote" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-gold hover:bg-gold-rich text-white text-sm transition-all shadow-md shadow-gold/20">
              <Sparkles className="w-4 h-4" /> Start Your Free Estimate
            </Link>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────── */}
      <section className="py-14 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-black text-heading mb-10">Why Homeowners Choose Viswarkarma</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {BENEFITS.map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center space-y-3 p-5 rounded-2xl border border-border hover:border-border-gold hover:bg-gold-faint transition-all">
                <div className="w-11 h-11 rounded-xl bg-gold-faint border border-border-gold flex items-center justify-center">
                  <b.Icon className="w-5 h-5 text-gold-light" />
                </div>
                <span className="font-black text-heading text-sm">{b.label}</span>
                <span className="text-xs text-muted leading-tight">{b.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── uPVC vs ALUMINIUM ────────────────────────────────── */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-border-gold bg-gold-faint px-3 py-1 rounded-full">uPVC vs Aluminium</span>
            <h2 className="text-3xl font-black text-heading tracking-tight">Which System is Right for Your Home?</h2>
            <p className="text-body text-sm max-w-lg mx-auto">Both are excellent choices — here&apos;s a quick comparison.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'uPVC Systems', sub: 'Apartments, villas & standard openings',
                img: 'https://5.imimg.com/data5/IT/RJ/XJ/SELLER-64612523/upvc-casement-window-125x125.jpg',
                href: '/upvc',
                pros: ['Excellent thermal & sound insulation', '20-year warranty, zero maintenance', 'Lower AC bills — energy efficient'],
                con: 'Not ideal for very large openings (>8 ft wide)',
              },
              {
                title: 'Aluminium Systems', sub: 'Large openings & modern architecture',
                img: 'https://5.imimg.com/data5/QX/UE/YU/SELLER-64612523/upvc-casement-profile-125x125.jpg',
                href: '/aluminium',
                pros: ['Ultra-slim frames, panoramic glass views', 'Handles very large widths & heights', 'Anodised finish — fade & rust resistant'],
                con: 'Conducts heat (thermal break option available)',
              },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-border rounded-2xl overflow-hidden hover:border-border-gold hover:shadow-md transition-all">
                <div className="relative h-48 overflow-hidden bg-cream">
                  <Image src={c.img} alt={c.title} fill sizes="(max-width:768px)100vw,50vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="block text-white font-black text-lg">{c.title}</span>
                    <span className="block text-gold-light text-xs mt-0.5">{c.sub}</span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {c.pros.map((p) => (
                    <div key={p} className="flex items-start gap-2 text-sm">
                      <span className="text-gold font-bold mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-body">{p}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-muted font-bold mt-0.5 flex-shrink-0">○</span>
                    <span className="text-muted">{c.con}</span>
                  </div>
                  <Link href={c.href} className="block w-full mt-2 py-2.5 rounded-xl border border-border-gold text-gold font-bold text-sm text-center hover:bg-gold-faint transition-colors">
                    Explore {c.title} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-border-gold bg-gold-faint px-3 py-1 rounded-full">Our Work</span>
              <h2 className="text-3xl font-black text-heading tracking-tight">Recent Installations</h2>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-body font-bold text-sm hover:border-border-gold transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.slice(0, 4).map((proj) => (
              <div key={proj.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:border-border-gold hover:shadow-md transition-all group">
                <div className="h-36 bg-gradient-to-br from-cream to-warm flex items-center justify-center p-4">
                  <div className="text-center">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-gold mb-1">{proj.category}</span>
                    <span className="block text-sm font-bold text-heading leading-tight">{proj.title}</span>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-black text-xs text-heading group-hover:text-gold transition-colors leading-snug">{proj.title}</h3>
                  <p className="text-[11px] text-body line-clamp-2">{proj.description}</p>
                  <div className="flex justify-between text-[10px] text-muted pt-2 border-t border-border">
                    <span>{proj.location}</span><span>{proj.specs.series}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-border-gold bg-gold-faint px-3 py-1 rounded-full">Client Reviews</span>
            <h2 className="text-3xl font-black text-heading tracking-tight">Trusted by Families Across India</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="bg-ivory border border-border rounded-2xl p-5 space-y-3 hover:border-border-gold hover:shadow-sm transition-all">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
                </div>
                <p className="text-sm text-body italic leading-relaxed">&ldquo;{r.content}&rdquo;</p>
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="block font-black text-heading text-sm">{r.name}</span>
                    <span className="block text-muted text-xs">{r.role}</span>
                  </div>
                  <span className="text-muted text-xs font-medium">{r.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-16 bg-cream border-y border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-border mx-auto">
            <Sparkles className="w-6 h-6 text-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-heading tracking-tight leading-tight">
            Ready to Upgrade Your Entire Home?
          </h2>
          <p className="text-body text-sm leading-relaxed max-w-xl mx-auto">
            Enter your home size and window count — get a price range in 2 minutes. Then we visit, measure, and give a final quote. <strong>No pressure. No hidden charges.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quote" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-gold hover:bg-gold-rich text-white text-sm shadow-md shadow-gold/20 transition-all">
              <Sparkles className="w-4 h-4" /> Launch Home Estimator
            </Link>
            <a href={`tel:${settings.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold border border-border-gold text-gold hover:bg-gold-faint text-sm transition-all">
              <Phone className="w-4 h-4" /> Book Free Site Visit
            </a>
          </div>
          <p className="text-muted text-xs">Serving Pan-India · No visit charges · Professional installation · 25+ years experience</p>
        </div>
      </section>

    </div>
  );
}
