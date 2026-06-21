"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Menu, X, ChevronDown, Sparkles, LogIn, LogOut, User } from 'lucide-react';
import { businessSettings } from '@/lib/data/business';
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/lib/auth';

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
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [userDrop, setUserDrop] = useState(false);
  const userDropRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const { user, openLoginModal } = useAuth();

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userDropRef.current && !userDropRef.current.contains(e.target as Node)) {
        setUserDrop(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (path !== '/') return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [path]);

  // Sync drawer state with bottom mobile navigation bar
  useEffect(() => {
    const handleToggle = () => setOpen(prev => !prev);
    window.addEventListener('toggle-mobile-drawer', handleToggle);
    return () => window.removeEventListener('toggle-mobile-drawer', handleToggle);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('mobile-drawer-state', { detail: { open } }));
  }, [open]);

  // Scroll lock when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Auto-close on path change
  useEffect(() => {
    setOpen(false);
  }, [path]);

  const toggleExpand = (label: string) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const active = (href: string) =>
    href === '/' ? path === '/' : path.startsWith(href);

  const isHome = path === '/';

  return (
    <header className={
      isHome
        ? scrolled
          ? "fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-soft shadow-[0_1px_8px_rgba(22,59,99,0.03)] transition-all duration-300"
          : "fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#F4F8FB]/95 via-[#F4F8FB]/50 to-transparent border-b border-transparent shadow-none transition-all duration-300"
        : "sticky top-0 z-50 bg-[#F8FBFD]/88 backdrop-blur-md border-b border-border-soft shadow-[0_1px_8px_rgba(22,59,99,0.03)]"
    }>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 md:h-16">

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

        {/* Tablet & Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV.map((item) => {
            const isTabletHidden = item.label === 'Home' || item.label === 'About' || item.label === 'Mosquito Mesh';
            if (item.sub) {
              const childActive = item.sub.some((s) => active(s.href));
              return (
                <div key={item.label} className={`relative ${isTabletHidden ? 'hidden lg:block' : 'block'}`} onMouseEnter={() => setDrop(item.label)} onMouseLeave={() => setDrop(null)}>
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
              <Link key={item.href} href={item.href} className={`px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors ${isTabletHidden ? 'hidden lg:inline-flex' : 'inline-flex'} ${active(item.href) ? 'text-gold bg-gold-pale' : 'text-body hover:text-gold hover:bg-gold-pale'}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Tablet & Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <a href={`tel:${businessSettings.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-body hover:text-gold rounded-lg hover:bg-gold-pale transition-all">
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
          <a href={`https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all">
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
          </a>

          {/* Auth: Login button or user avatar */}
          {!user ? (
            <button
              onClick={openLoginModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-body border border-border rounded-lg hover:bg-gold-pale hover:text-gold hover:border-border-gold transition-all"
            >
              <LogIn className="w-3.5 h-3.5" /> Login
            </button>
          ) : (
            <div className="relative" ref={userDropRef}>
              <button
                onClick={() => setUserDrop((v) => !v)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-border-gold hover:bg-gold-pale transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                  {(user.user_metadata?.full_name as string ?? user.email ?? 'U').charAt(0).toUpperCase()}
                </div>
                <span className="text-[12px] font-bold text-heading max-w-[80px] truncate">
                  {(user.user_metadata?.full_name as string)?.split(' ')[0] ?? 'Account'}
                </span>
                <ChevronDown className={`w-3 h-3 text-muted transition-transform ${userDrop ? 'rotate-180' : ''}`} />
              </button>
              {userDrop && (
                <div className="absolute top-full right-0 mt-1.5 w-48 bg-white border border-border-soft rounded-xl shadow-lg py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-border-soft">
                    <p className="text-xs font-black text-heading truncate">{user.user_metadata?.full_name as string ?? 'My Account'}</p>
                    <p className="text-[11px] text-muted truncate">{user.email}</p>
                  </div>
                  <Link href="/account" className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-body hover:bg-gold-pale hover:text-gold transition-colors">
                    <User className="w-3.5 h-3.5" /> My Enquiries
                  </Link>
                  <button
                    onClick={() => { signOut(); setUserDrop(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          <Link href="/quote" className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold bg-gold hover:bg-gold-light text-white transition-all shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Get Estimate
          </Link>
        </div>

        {/* Mobile Header Menu Trigger (Clean and borderless on top-right) */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setOpen(!open)} 
            className="p-2 -mr-2 rounded-lg text-heading hover:text-[#2B5C88] active:bg-[#EAF2F8]/50 transition-colors"
            aria-label="Toggle Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Drawer Backdrop overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar Drawer Panel */}
      <div 
        className={`md:hidden fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-soft">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gold-faint border border-border flex items-center justify-center font-black text-gold text-sm">
              V
            </div>
            <div className="leading-none text-left">
              <span className="block text-xs font-black text-heading tracking-tight">Viswarkarma</span>
              <span className="block text-[8px] font-bold text-gold uppercase tracking-[0.12em] mt-0.5">uPVC & Aluminium</span>
            </div>
          </Link>
          <button 
            onClick={() => setOpen(false)}
            className="p-2 -mr-2 rounded-lg text-body hover:text-gold transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <nav className="space-y-1">
            {NAV.map((item) => {
              if (item.sub) {
                const isExpanded = !!expanded[item.label];
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-bold text-body hover:text-gold hover:bg-gold-pale/50 transition-all text-left"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-200 pl-4 space-y-1 ${
                        isExpanded ? 'max-h-[180px] opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {item.sub.map((s) => (
                        <Link 
                          key={s.href} 
                          href={s.href}
                          onClick={() => setOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                            active(s.href) ? 'text-gold bg-gold-pale font-bold' : 'text-body hover:text-gold'
                          }`}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    active(item.href) ? 'text-gold bg-gold-pale font-extrabold' : 'text-body hover:text-gold hover:bg-gold-pale/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Get Estimate Link inside Drawer */}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-gold bg-gold-pale/50 hover:bg-gold-pale"
            >
              Get Estimate
            </Link>

            {/* Auth inside drawer */}
            {!user ? (
              <button
                onClick={() => { setOpen(false); openLoginModal(); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-body hover:text-gold hover:bg-gold-pale/50 transition-all w-full text-left"
              >
                <LogIn className="w-4 h-4" /> Login / Sign Up
              </button>
            ) : (
              <>
                <Link href="/account" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-body hover:text-gold hover:bg-gold-pale/50 transition-all">
                  <User className="w-4 h-4" /> My Enquiries
                </Link>
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Drawer Bottom CTAs */}
        <div className="p-4 border-t border-border-soft bg-slate-50 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <a 
              href={`tel:${businessSettings.phone}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-white text-body font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#2B5C88]" /> Call Now
            </a>
            <a 
              href={`https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
          <Link 
            href="/quote"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-white font-bold text-xs transition-colors shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" /> Get Free Estimate
          </Link>
        </div>
      </div>
    </header>
  );
}
