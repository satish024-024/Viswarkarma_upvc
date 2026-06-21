"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Calculator, MessageSquare, Menu, X } from 'lucide-react';
import { businessSettings as defaultSettings } from '@/lib/data/business';
import { getBusinessSettings } from '@/lib/supabase';

export default function StickyMobileCta() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    getBusinessSettings().then(setSettings);
  }, []);

  useEffect(() => {
    const handleDrawerState = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setIsDrawerOpen(!!customEvent.detail.open);
      }
    };
    window.addEventListener('mobile-drawer-state', handleDrawerState);
    return () => window.removeEventListener('mobile-drawer-state', handleDrawerState);
  }, []);

  const toggleDrawer = () => {
    window.dispatchEvent(new CustomEvent('toggle-mobile-drawer'));
  };

  const isActive = (href: string) => {
    if (href === '/') return path === '/';
    return path.startsWith(href);
  };

  const waLink = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`;

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border-soft px-2 pt-2 shadow-[0_-4px_16px_rgba(22,59,99,0.06)]"
      style={{
        paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))'
      }}
    >
      <div className="grid grid-cols-5 gap-1 max-w-lg mx-auto">
        
        {/* Home Link */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
            isActive('/') && !isDrawerOpen
              ? 'text-gold bg-gold-pale/30'
              : 'text-[#6B7B8C] hover:text-gold active:bg-slate-50'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform active:scale-95 ${isActive('/') && !isDrawerOpen ? 'text-gold' : ''}`} />
          <span className="text-[9px] font-bold mt-1 tracking-tight">Home</span>
        </Link>

        {/* Services Link */}
        <Link
          href="/#what-we-install"
          className="flex flex-col items-center justify-center py-1.5 rounded-xl text-[#6B7B8C] hover:text-gold active:bg-slate-50 transition-all"
        >
          <Grid className="w-5 h-5 transition-transform active:scale-95" />
          <span className="text-[9px] font-bold mt-1 tracking-tight">Services</span>
        </Link>

        {/* Estimate Link */}
        <Link
          href="/quote"
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
            isActive('/quote') && !isDrawerOpen
              ? 'text-gold bg-gold-pale/30'
              : 'text-[#6B7B8C] hover:text-gold active:bg-slate-50'
          }`}
        >
          <Calculator className={`w-5 h-5 transition-transform active:scale-95 ${isActive('/quote') && !isDrawerOpen ? 'text-gold' : ''}`} />
          <span className="text-[9px] font-bold mt-1 tracking-tight">Estimate</span>
        </Link>

        {/* WhatsApp Link */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 rounded-xl text-[#6B7B8C] hover:text-emerald-600 active:bg-emerald-50/50 transition-all"
        >
          <MessageSquare className="w-5 h-5 text-emerald-600 transition-transform active:scale-95" />
          <span className="text-[9px] font-bold mt-1 tracking-tight">WhatsApp</span>
        </a>

        {/* Menu Toggle Trigger */}
        <button
          onClick={toggleDrawer}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
            isDrawerOpen
              ? 'text-gold bg-gold-pale/30'
              : 'text-[#6B7B8C] hover:text-gold active:bg-slate-50'
          }`}
        >
          {isDrawerOpen ? (
            <X className="w-5 h-5 text-gold transition-transform active:scale-95" />
          ) : (
            <Menu className="w-5 h-5 transition-transform active:scale-95" />
          )}
          <span className="text-[9px] font-bold mt-1 tracking-tight">Menu</span>
        </button>

      </div>
    </div>
  );
}
