"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { businessSettings } from '@/lib/data/business';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'uPVC', href: '/upvc',
    sub: [
      { label: 'Overview', href: '/upvc' },
      { label: 'Windows', href: '/upvc/windows' },
      { label: 'Doors', href: '/upvc/doors' },
    ],
  },
  {
    label: 'Aluminium', href: '/aluminium',
    sub: [
      { label: 'Overview', href: '/aluminium' },
      { label: 'Windows', href: '/aluminium/windows' },
      { label: 'Doors', href: '/aluminium/doors' },
    ],
  },
  { label: 'Mosquito Mesh', href: '/mesh/mosquito-mesh' },
  {
    label: 'Glass Work', href: '/glass-railing',
    sub: [
      { label: 'Glass Railings', href: '/glass-railing' },
      { label: 'Elevation Glass', href: '/elevation-work' },
    ],
  },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);
  const path = usePathname();

  const active = (href: string) =>
    href === '/' ? path === '/' : path.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-[#F8FBFD]/88 backdrop-blur-md border-b border-border-soft shadow-[0_1px_8px_rgba(22,59,99,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gold-faint border border-border flex items-center justify-center font-black text-gold text-base transition-all group-hover:bg-gold-pale">
            V
          </div>
          <div className="leading-none">
            <span className="block text-[15px] font-black text-heading tracking-tight">Viswarkarma</span>
            <span className="block text-[9px] font-bold text-gold uppercase tracking-[0.14em] mt-0.5">uPVC & Aluminium</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV.map((item) => {
            if (item.sub) {
              const childActive = item.sub.some((s) => active(s.href));
              return (
                <div key={item.label} className="relative" onMouseEnter={() => setDrop(item.label)} onMouseLeave={() => setDrop(null)}>
                  <button className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors ${childActive ? 'text-gold bg-gold-pale' : 'text-body hover:text-gold hover:bg-gold-pale'}`}>
                    {item.label}
                    <ChevronDown className={`w-3 h-3 transition-transform ${drop === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  {drop === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-border-soft rounded-xl shadow-lg py-1.5 z-50">
                      {item.sub.map((s) => (
                        <Link key={s.href} href={s.href} className={`block px-4 py-2 text-[12px] font-medium transition-colors ${active(s.href) ? 'text-gold font-bold bg-gold-pale' : 'text-body hover:bg-gold-pale hover:text-gold'}`}>
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link key={item.href} href={item.href} className={`px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors ${active(item.href) ? 'text-gold bg-gold-pale' : 'text-body hover:text-gold hover:bg-gold-pale'}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <a href={`tel:${businessSettings.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-body hover:text-gold rounded-lg hover:bg-gold-pale transition-all">
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
          <a href={`https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all">
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
          </a>
          <Link href="/quote" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold bg-gold hover:bg-gold-light text-white transition-all shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Get Estimate
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <a href={`tel:${businessSettings.phone}`} className="p-2 rounded-lg border border-border text-body">
            <Phone className="w-4 h-4" />
          </a>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg border border-border text-body">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white pt-16 overflow-y-auto">
          <div className="px-4 py-5 space-y-1">
            {NAV.map((item) => item.sub ? (
              <div key={item.label}>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted px-3 pt-4 pb-1">{item.label}</p>
                {item.sub.map((s) => (
                  <Link key={s.href} href={s.href} onClick={() => setOpen(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${active(s.href) ? 'text-gold bg-gold-pale' : 'text-body'}`}>
                    {s.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-bold ${active(item.href) ? 'text-gold bg-gold-pale' : 'text-body'}`}>
                {item.label}
              </Link>
            ))}
            <div className="pt-5 border-t border-border mt-3 space-y-3">
              <a href={`tel:${businessSettings.phone}`} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-body font-bold text-sm">
                <Phone className="w-4 h-4" /> {businessSettings.phone}
              </a>
              <a href={`https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm">
                <MessageSquare className="w-4 h-4" /> Message on WhatsApp
              </a>
              <Link href="/quote" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gold text-white font-bold text-sm">
                <Sparkles className="w-4 h-4" /> Get Home Estimate
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
