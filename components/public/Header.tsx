"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { businessSettings } from '@/lib/data/business';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  {
    name: 'uPVC',
    href: '/upvc',
    submenu: [
      { name: 'Overview', href: '/upvc' },
      { name: 'Windows', href: '/upvc/windows' },
      { name: 'Doors', href: '/upvc/doors' },
    ],
  },
  {
    name: 'Aluminium',
    href: '/aluminium',
    submenu: [
      { name: 'Overview', href: '/aluminium' },
      { name: 'Windows', href: '/aluminium/windows' },
      { name: 'Doors', href: '/aluminium/doors' },
    ],
  },
  { name: 'Mosquito Mesh', href: '/mesh/mosquito-mesh' },
  {
    name: 'Glass Work',
    href: '/glass-railing',
    submenu: [
      { name: 'Glass Railings', href: '/glass-railing' },
      { name: 'Elevation Glass', href: '/elevation-work' },
    ],
  },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/' && pathname !== '/') return false;
    return pathname.startsWith(href);
  };

  const hasActiveChild = (item: { submenu?: { href: string }[] }) =>
    item.submenu?.some((s) => isActive(s.href)) ?? false;

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-950 border border-gold/50 flex items-center justify-center text-gold font-black text-base transition-all duration-200 group-hover:border-gold group-hover:shadow-[0_0_12px_rgba(197,168,128,0.25)]">
              V
            </div>
            <div className="leading-none">
              <span className="text-[15px] font-black text-slate-950 block tracking-tight">Viswarkarma</span>
              <span className="text-[9px] font-bold text-gold block uppercase tracking-[0.15em] mt-0.5">uPVC & Aluminium</span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              if (item.submenu) {
                const active = hasActiveChild(item);
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 text-[13px] font-semibold px-3 py-2 rounded-md transition-all duration-150 cursor-pointer ${
                        active
                          ? 'text-slate-950 bg-gold/10'
                          : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
                      }`}
                    >
                      {item.name}
                      <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>

                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`block px-4 py-2 text-[12px] font-medium transition-colors ${
                              isActive(sub.href)
                                ? 'text-slate-950 font-bold bg-gold/10'
                                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[13px] font-semibold px-3 py-2 rounded-md transition-all duration-150 ${
                    isActive(item.href)
                      ? 'text-slate-950 bg-gold/10'
                      : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <a
              href={`tel:${businessSettings.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>
            <a
              href={`https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <Link
              href="/quote"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold bg-slate-950 hover:bg-gold text-white hover:text-slate-950 transition-all duration-200 border border-transparent hover:border-gold/50 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Get Estimate
            </Link>
          </div>

          {/* ── Mobile triggers ── */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href={`tel:${businessSettings.phone}`}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white pt-[68px] overflow-y-auto">
          <div className="px-4 py-6 space-y-1">
            {navigation.map((item) => {
              if (item.submenu) {
                return (
                  <div key={item.name} className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pt-3 pb-1">
                      {item.name}
                    </p>
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          isActive(sub.href)
                            ? 'text-slate-950 bg-gold/10 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive(item.href)
                      ? 'text-slate-950 bg-gold/10'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile CTA block */}
            <div className="pt-6 border-t border-slate-100 space-y-3 mt-4">
              <a
                href={`tel:${businessSettings.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm"
              >
                <Phone className="w-4 h-4" /> {businessSettings.phone}
              </a>
              <a
                href={`https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm"
              >
                <MessageSquare className="w-4 h-4" /> Message on WhatsApp
              </a>
              <Link
                href="/quote"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-950 text-white font-bold text-sm"
              >
                <Sparkles className="w-4 h-4" /> Get Home Estimate
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
