import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageSquare, ArrowRight, ShieldCheck, Award, VolumeX, Thermometer, Droplets, Sparkles, CheckCircle2, Star, Ruler, Wrench, Calculator, MapPin } from 'lucide-react';
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
  { n: '01', Icon: Calculator, title: 'Get an Instant Estimate',  body: 'Use our online home estimator. Enter your home size and number of windows — get a price range in 2 minutes.' },
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
export default async function Homepage() {
  const settings = await getBusinessSettings();
  const projects = await getProjects();
  const reviews = await getTestimonials();

  const wa = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`;

  return (
    <div className="w-full">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-[#F4F8FB] border-b border-border-soft overflow-hidden flex items-center min-h-[500px] md:min-h-[580px] lg:min-h-[640px]">
        {/* Subtle grid pattern background on the left */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[50%] opacity-[0.4] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#D5E0E8 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Desktop & Tablet Hero Layout (Visible on screens >= 768px) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column (Copy) */}
            <div className="lg:col-span-6 xl:col-span-7 pt-24 pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-28 space-y-7">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#8FB1C9]/40 bg-[#EAF2F8] text-[#163B63] text-xs font-bold uppercase tracking-wider shadow-sm">
                <Award className="w-3.5 h-3.5" /> 25+ Years · Family-Run · Rajahmundry HQ · Pan-India
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-heading tracking-tight leading-[1.15]">
                Bespoke <span className="text-gold">uPVC</span> & Aluminium Systems
                <span className="block mt-2 text-xl sm:text-3xl lg:text-4xl font-normal text-body leading-tight">
                  Engineered for India&apos;s <span className="font-serif italic font-semibold text-heading">Finest Residences</span>
                </span>
              </h1>

              <p className="text-body text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
                We engineer, custom-fabricate, and precision-install complete window and door systems for prestigious homes. Handcrafted in our Rajahmundry workshop and installed anywhere in India with zero middlemen, ensuring unmatched security, acoustics, and elegance.
              </p>

              <div className="flex flex-row flex-wrap gap-3">
                <Link href="/quote" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-gold hover:bg-gold-light text-white text-sm transition-all shadow-[0_4px_12px_rgba(22,59,99,0.15)] hover:shadow-[0_6px_16px_rgba(22,59,99,0.2)]">
                  <Sparkles className="w-4 h-4" /> Get Free Home Estimate
                </Link>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold border border-emerald-500/30 bg-white text-emerald-800 hover:bg-emerald-50/50 text-sm transition-all">
                  <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp Us
                </a>
                <a href={`tel:${settings.phone}`} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold border border-border bg-white text-heading hover:bg-cream text-sm transition-all">
                  <Phone className="w-4 h-4 text-gold-light" /> Call Now
                </a>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-border/60">
                {['Free Site Measurement', '20-Year Profile Warranty', 'German Multi-Point Locks', 'Whole-Home Pricing'].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs font-semibold text-body">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-light flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Empty space for desktop overlay layout */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-5 pointer-events-none"></div>

          </div>
        </div>

        {/* Mobile Hero Layout (Visible on screens < 768px) */}
        <div className="relative w-full z-10 md:hidden px-4 pt-20 pb-10 flex flex-col space-y-4">
          {/* 1. Small Trust Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-light/20 bg-gold-pale/60 text-gold text-[10px] font-bold uppercase tracking-wider w-max max-w-full">
            <Award className="w-3 h-3 text-gold-light" /> 25+ Years · Rajahmundry HQ · Direct Factory
          </span>

          {/* 2. Headline */}
          <h1 className="text-2xl font-extrabold text-heading tracking-tight leading-tight">
            Bespoke <span className="text-gold">uPVC</span> & Aluminium Systems
            <span className="block mt-1 text-base font-normal text-body">
              Engineered for India&apos;s <span className="font-serif italic font-semibold text-heading">Finest Residences</span>
            </span>
          </h1>

          {/* 3. Hero Media Block */}
          <div className="w-full aspect-[16/10] relative overflow-hidden rounded-2xl border border-border/80 shadow-sm bg-zinc-900">
            <video 
              src="/hero-video.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="object-cover w-full h-full object-center"
            />
          </div>

          {/* 4. Short Paragraph */}
          <p className="text-body text-xs sm:text-sm leading-relaxed">
            We custom-fabricate and precision-install premium window and door systems directly from our workshop with a 20-year profile warranty.
          </p>

          {/* 5. CTA Row */}
          <div className="flex flex-col gap-2 pt-1 w-full">
            <Link href="/quote" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold bg-gold text-white text-xs hover:bg-gold-light transition-all shadow-md">
              <Sparkles className="w-3.5 h-3.5" /> Get Free Home Estimate
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <a href={`tel:${settings.phone}`} className="flex items-center justify-center gap-1.5 py-3 rounded-xl font-semibold border border-border bg-white text-heading text-xs hover:bg-slate-50 transition-all">
                <Phone className="w-3.5 h-3.5 text-gold-light" /> Call Now
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-3 rounded-xl font-semibold border border-emerald-200 bg-emerald-50/50 text-emerald-800 text-xs hover:bg-emerald-50 transition-all">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
              </a>
            </div>
          </div>

          {/* 6. Trust Bullets */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 pt-3 border-t border-border/50">
            {['Free Site Measurement', '20-Year Warranty', 'German Multi Locks', 'Direct Factory Price'].map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-[10px] font-bold text-body">
                <CheckCircle2 className="w-3 h-3 text-gold-light flex-shrink-0" /> {f}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Absolute Video (Cinematic side panel, spans center to right edge of screen) */}
        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[60%] xl:w-[65%] hidden lg:block z-0 overflow-hidden">
          <video 
            src="/hero-video.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="object-cover w-full h-full object-right"
          />
          {/* Soft ease-in gradient overlay to blend with left side background */}
          <div className="absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-[#F4F8FB] via-[#F4F8FB]/80 to-transparent pointer-events-none z-10"></div>
        </div>

        {/* Tablet Landscape Video (Appears below text on tablet viewports) */}
        <div className="hidden md:block lg:hidden w-full aspect-[16/9] relative overflow-hidden bg-black z-0">
          <video 
            src="/hero-video.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="object-cover w-full h-full object-right"
          />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#F4F8FB] via-[#F4F8FB]/60 to-transparent pointer-events-none z-10"></div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {[
            { n: '25+',   l: 'Years of Experience', s: 'Family-run since 1999', bg: 'bg-white' },
            { n: '5,000+', l: 'Windows Installed',   s: 'Across AP & Pan-India', bg: 'bg-warm' },
            { n: '100%',  l: 'In-house Fabrication', s: 'No middlemen or resellers', bg: 'bg-warm' },
            { n: 'Free',  l: 'Site Measurement',     s: 'We come to you at no cost', bg: 'bg-white' },
          ].map((st) => (
            <div key={st.n} className={`${st.bg} border border-border rounded-2xl p-4 sm:p-6 space-y-1 sm:space-y-1.5 shadow-[0_10px_30px_rgba(22,59,99,0.06)] hover:border-border-gold transition-all`}>
              <span className="block text-2xl sm:text-3xl font-black text-gold leading-none">{st.n}</span>
              <span className="block text-[10px] sm:text-xs font-black text-heading leading-tight uppercase tracking-wider">{st.l}</span>
              <span className="block text-[9px] sm:text-[11px] text-muted leading-tight">{st.s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────────────────── */}
      <section id="what-we-install" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-border-gold bg-gold-faint px-3 py-1 rounded-full">What We Install</span>
            <h2 className="text-2xl sm:text-4xl font-black text-heading tracking-tight">See Exactly What You&apos;re Getting</h2>
            <p className="text-body text-xs sm:text-sm leading-relaxed">Every style is custom-made at our fabrication facility. Tap any card to get an instant price estimate.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {PRODUCTS.map((p, i) => (
              <Link href="/quote" key={p.id} className="group block">
                <div className="bg-white border border-border rounded-2xl overflow-hidden hover:border-border-gold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
                  <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-cream">
                    <Image src={p.img} alt={p.name} fill sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" priority={i < 3} />
                    <span className="absolute top-3 left-3 bg-gold text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">{p.badge}</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-black text-heading text-sm group-hover:text-gold transition-colors">{p.name}</h3>
                      <p className="text-[9px] sm:text-[10px] font-bold text-gold uppercase tracking-wide mt-0.5">{p.note}</p>
                      <p className="text-xs text-body mt-1.5 leading-relaxed line-clamp-2 sm:line-clamp-none">{p.desc}</p>
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
      <section className="relative w-full overflow-hidden bg-[#F4F8FB] py-10 md:py-16 border-b border-border-soft flex items-center">
        
        {/* Full-width integrated background visual */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          {/* Base background color */}
          <div className="absolute inset-0 bg-[#F4F8FB]" />
          
          {/* Architectural villa image fading across the entire section width */}
          <div 
            className="absolute inset-y-0 right-0 w-full lg:w-[65%] xl:w-[70%] h-full"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.02) 20%, rgba(0, 0, 0, 0.12) 40%, rgba(0, 0, 0, 0.45) 65%, rgba(0, 0, 0, 0.8) 85%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.02) 20%, rgba(0, 0, 0, 0.12) 40%, rgba(0, 0, 0, 0.45) 65%, rgba(0, 0, 0, 0.8) 85%, black 100%)'
            }}
          >
            <Image 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80" 
              alt="Architectural modern residential home design with premium windows" 
              fill 
              className="object-cover object-right opacity-90 lg:opacity-100"
              priority
            />
          </div>

          {/* On mobile, overlay a soft white/blue tint to guarantee text contrast */}
          <div className="absolute inset-0 bg-[#F4F8FB]/85 lg:hidden z-10" />

          {/* Soft top and bottom gradients to blend with surrounding sections */}
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#F4F8FB] to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#F4F8FB] to-transparent z-10" />
        </div>

        {/* Content Container (Floated over the background layer) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
          <div className="max-w-4xl space-y-8">
            
            {/* Header Area */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2B5C88]">Simple 3-Step Process</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight leading-tight">
                From Estimate to Installed — We Handle Everything
              </h2>
            </div>

            {/* Connected Timeline Row */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 pt-2">
              {/* Horizontal connector line on desktop */}
              <div className="hidden md:block absolute top-[18px] left-10 right-10 border-t border-dashed border-[#2B5C88]/20 z-0"></div>
              
              {STEPS.map((st) => (
                <div key={st.n} className="relative z-10 flex flex-col space-y-2 max-w-[270px]">
                  {/* Icon & Number Badge */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-[#2B5C88]/15 flex items-center justify-center text-heading shadow-xs transition-colors hover:border-[#2B5C88]/40">
                      <st.Icon className="w-3.5 h-3.5 text-[#2B5C88]" />
                    </div>
                    <span className="text-[9px] font-bold text-[#2B5C88]/80 bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-border/40 font-mono">
                      Step {st.n}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-[#1C2E40] text-sm sm:text-[15px] tracking-tight leading-tight">
                      {st.title}
                    </h3>
                    <p className="text-body text-xs sm:text-[12.5px] leading-relaxed">
                      {st.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-white border-b border-border-soft overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-[#2B5C88]">Our Work</span>
              <h2 className="text-3xl font-black text-heading tracking-tight">Recent Installations</h2>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-[#425466] font-bold text-sm hover:border-[#163B63] transition-all">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Infinite Horizontal Scroll Showcase Container */}
        <div className="relative w-full overflow-hidden py-6 mt-6">
          {/* Gradient fade overlays for edges */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/40 to-transparent z-10 pointer-events-none hidden md:block"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/40 to-transparent z-10 pointer-events-none hidden md:block"></div>

          {/* Marquee Track: Animated continuously on all screen sizes, pauses on hover */}
          <div className="animate-marquee gap-6">
            {/* Triplicate the projects array to ensure there's enough horizontal track length for seamless loop */}
            {[...projects, ...projects, ...projects].map((proj, idx) => (
              <div 
                key={`${proj.id}-${idx}`} 
                className="w-[290px] sm:w-[350px] flex-shrink-0 snap-start snap-always bg-white border border-border/50 rounded-2xl overflow-hidden hover:border-border-gold shadow-[0_4px_20px_rgba(22,59,99,0.01)] hover:shadow-[0_8px_30px_rgba(22,59,99,0.04)] transition-all duration-300 flex flex-col group"
              >
                {/* Large Project Image */}
                <div className="relative w-full h-[180px] sm:h-[210px] overflow-hidden bg-cream">
                  <Image 
                    src={proj.image} 
                    alt={proj.title} 
                    fill 
                    sizes="(max-width:640px)290px,350px" 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  {/* Category Tag Overlay */}
                  <span className="absolute bottom-3 left-3 bg-[#1C2E40]/80 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {proj.category}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="block text-[10px] text-[#2B5C88] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2B5C88]" /> {proj.location}
                    </span>
                    <h3 className="font-bold text-heading text-sm sm:text-base leading-tight group-hover:text-[#163B63] transition-colors line-clamp-1">
                      {proj.title}
                    </h3>
                  </div>

                  {/* Specifications Footer line */}
                  <div className="pt-3 border-t border-border/40 flex justify-between items-center text-[10px] font-bold text-[#163B63] uppercase tracking-wider">
                    <span>{proj.specs.system}</span>
                    <span className="text-[#6B7B8C] font-mono text-[9px]">{proj.specs.series}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS STRIP ───────────────────────────────────── */}
      <section className="py-6 md:py-10 bg-cream border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {BENEFITS.map((b) => (
              <div key={b.label} className="flex items-center gap-2 sm:gap-4 p-2.5 sm:p-4 rounded-xl bg-white border border-border-soft shadow-[0_2px_12px_rgba(22,59,99,0.02)]">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gold-faint border border-border flex items-center justify-center flex-shrink-0">
                  <b.Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-light" />
                </div>
                <div className="min-w-0">
                  <span className="block font-black text-heading text-[10px] sm:text-xs tracking-wider uppercase truncate">{b.label}</span>
                  <span className="block text-[9px] sm:text-[11px] text-muted leading-tight mt-0.5">{b.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-10 md:py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="text-center space-y-1">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-border-gold bg-gold-faint px-3 py-1 rounded-full">Client Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">Trusted by Families Across India</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="bg-white border border-border rounded-2xl p-5 sm:p-6 space-y-4 hover:border-border-gold hover:shadow-md transition-all">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
                </div>
                <p className="text-sm text-body italic leading-relaxed">&ldquo;{r.content}&rdquo;</p>
                <div className="pt-3 border-t border-border flex items-center justify-between">
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

      {/* ── uPVC vs ALUMINIUM ────────────────────────────────── */}
      <section className="py-10 md:py-20 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          <div className="text-center space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold border border-border-gold bg-gold-faint px-3 py-1 rounded-full">uPVC vs Aluminium</span>
            <h2 className="text-2xl sm:text-3xl font-black text-heading tracking-tight">Which System is Right for Your Home?</h2>
            <p className="text-body text-xs sm:text-sm max-w-lg mx-auto">Both are excellent choices — here&apos;s a quick comparison.</p>
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
                <div className="relative h-40 sm:h-48 overflow-hidden bg-cream">
                  <Image src={c.img} alt={c.title} fill sizes="(max-width:768px)100vw,50vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="block text-white font-black text-lg">{c.title}</span>
                    <span className="block text-gold-light text-xs mt-0.5">{c.sub}</span>
                  </div>
                </div>
                <div className="p-4 sm:p-5 space-y-3">
                  {c.pros.map((p) => (
                    <div key={p} className="flex items-start gap-2 text-xs sm:text-sm">
                      <span className="text-gold font-bold mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-body">{p}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-2 text-xs sm:text-sm">
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

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-8 md:py-14 bg-gold text-white relative overflow-hidden border-t border-border-gold">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/20 mx-auto">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Ready to Upgrade Your Entire Home?
          </h2>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Enter your home size and window count — get a price range in 2 minutes. Then we visit, measure, and give a final quote. <strong>No pressure. No hidden charges.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
            <Link href="/quote" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-white text-gold hover:bg-[#EEF5FA] text-sm shadow-md transition-all w-full sm:w-auto">
              <Sparkles className="w-4 h-4 text-gold" /> Launch Home Estimator
            </Link>
            <a href={`tel:${settings.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold border border-white/30 text-white hover:bg-white/10 text-sm transition-all w-full sm:w-auto">
              <Phone className="w-4 h-4" /> Book Free Site Visit
            </a>
          </div>
          <p className="text-white/60 text-xs">Serving Pan-India · No visit charges · Professional installation · 25+ years experience</p>
        </div>
      </section>
    </div>
  );
}
