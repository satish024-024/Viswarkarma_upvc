"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MessageSquare, Mail, MapPin, Clock, Award } from 'lucide-react';
import { businessSettings as dflt, serviceVerticals as dfltSvcs, serviceAreas } from '@/lib/data/business';
import { getBusinessSettings, getServices } from '@/lib/supabase';

export default function Footer() {
  const year = new Date().getFullYear();
  const [s, setS] = useState(dflt);
  const [svcs, setSvcs] = useState(dfltSvcs);
  useEffect(() => { getBusinessSettings().then(setS); getServices().then(setSvcs); }, []);

  return (
    <footer className="bg-cream border-t border-border">

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 flex-shrink-0">
              <Image src="/logo.png" alt="Viswarkarma Logo" width={36} height={36} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="block text-sm font-black text-[#1F2937] tracking-tight">Viswarkarma</span>
              <span className="block text-[9px] font-bold text-gold uppercase tracking-widest -mt-0.5">uPVC &amp; Aluminium</span>
            </div>
          </Link>
          <p className="text-xs text-[#374151] leading-relaxed">
            {s.experienceYears}+ years of custom fabrication. Windows, doors, mosquito mesh & glass — measured, made, and installed by our own team.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-border text-[11px] font-bold text-gold">
            <Award className="w-3.5 h-3.5 text-gold-light" /> Direct Factory · No Middlemen
          </div>
        </div>

        {/* Products */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#1F2937] uppercase tracking-wider">Product Systems</h3>
          <ul className="space-y-2">
            {svcs.map((v) => (
              <li key={v.id}>
                <Link href={v.slug === 'mosquito-mesh' ? `/mesh/${v.slug}` : `/${v.slug}`} className="text-xs text-[#374151] hover:text-gold transition-colors">
                  {v.title}
                </Link>
              </li>
            ))}
            <li className="pt-1 border-t border-border">
              <Link href="/quote" className="text-xs font-bold text-gold hover:text-gold-rich">
                Get Free Estimate →
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#1F2937] uppercase tracking-wider">Contact Us</h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <a href={`tel:${s.phone}`} className="font-bold text-[#1F2937] hover:text-gold block">{s.phone}</a>
                <span className="text-muted">Call for site survey</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-bold text-[#1F2937] hover:text-emerald-700">
                WhatsApp Us
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 text-muted mt-0.5 flex-shrink-0" />
              <a href={`mailto:${s.email}`} className="text-[#374151] hover:text-gold">{s.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted mt-0.5 flex-shrink-0" />
              <span className="text-[#374151] leading-relaxed">{s.address}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-muted mt-0.5 flex-shrink-0" />
              <span className="text-[#374151]">{s.hours}</span>
            </li>
          </ul>
        </div>

        {/* Areas */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#1F2937] uppercase tracking-wider">Service Areas</h3>
          <div className="space-y-2">
            {serviceAreas.map((a) => (
              <div key={a.id}>
                <span className="block text-xs font-bold text-[#1F2937]">{a.city}</span>
                <span className="block text-[10px] text-muted leading-relaxed">{a.areas.slice(0, 4).join(', ')}…</span>
              </div>
            ))}
            <Link href="/service-areas" className="text-[11px] font-bold text-gold hover:text-gold-rich">
              View All Areas →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-warm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted">
          <p>© {year} {s.name}. All rights reserved. · Estimates are indicative; final quote after site measurement.</p>
          <nav className="flex gap-4 font-semibold flex-shrink-0">
            <Link href="/about" className="hover:text-gold">About</Link>
            <Link href="/faq" className="hover:text-gold">FAQs</Link>
            <Link href="/contact" className="hover:text-gold">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
