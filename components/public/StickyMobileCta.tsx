"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Calculator } from 'lucide-react';
import { businessSettings as defaultSettings } from '@/lib/data/business';
import { getBusinessSettings } from '@/lib/supabase';

export default function StickyMobileCta() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    getBusinessSettings().then(setSettings);
  }, []);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-brand-border px-4 py-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
        {/* Call Now */}
        <a
          href={`tel:${settings.phone}`}
          className="flex flex-col items-center justify-center py-2 rounded-lg bg-slate-50 border border-brand-border text-brand-primary active:bg-slate-100 transition-colors"
        >
          <Phone className="w-4 h-4 text-brand-secondary" />
          <span className="text-[10px] font-bold mt-1">Call Now</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 active:bg-emerald-100 transition-colors"
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-bold mt-1">WhatsApp</span>
        </a>

        {/* Get Quote */}
        <Link
          href="/quote"
          className="flex flex-col items-center justify-center py-2 rounded-lg bg-brand-primary text-white active:bg-brand-primary-hover transition-colors"
        >
          <Calculator className="w-4 h-4 text-brand-secondary" />
          <span className="text-[10px] font-bold mt-1">Get Quote</span>
        </Link>
      </div>
    </div>
  );
}
