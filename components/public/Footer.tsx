"use client";
import React, { useState, useEffect } from 'react';
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
    <footer className="bg-[#F8F4EC] border-t border-[#E2D9C8]">

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#FAF4E6] border border-[#D4AF6A] flex items-center justify-center font-black text-[#B8963E] text-base">V</div>
            <div>
              <span className="block text-sm font-black text-[#1C160C] tracking-tight">Viswarkarma</span>
              <span className="block text-[9px] font-bold text-[#B8963E] uppercase tracking-widest -mt-0.5">uPVC & Aluminium</span>
            </div>
          </Link>
          <p className="text-xs text-[#4A3F2F] leading-relaxed">
            {s.experienceYears}+ years of custom fabrication. Windows, doors, mosquito mesh & glass — measured, made, and installed by our own team.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0E3C0] border border-[#D4AF6A] text-[11px] font-bold text-[#9A7C2E]">
            <Award className="w-3.5 h-3.5" /> Direct Factory · No Middlemen
          </div>
        </div>

        {/* Products */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#1C160C] uppercase tracking-wider">Product Systems</h3>
          <ul className="space-y-2">
            {svcs.map((v) => (
              <li key={v.id}>
                <Link href={v.slug === 'mosquito-mesh' ? `/mesh/${v.slug}` : `/${v.slug}`} className="text-xs text-[#4A3F2F] hover:text-[#B8963E] transition-colors">
                  {v.title}
                </Link>
              </li>
            ))}
            <li className="pt-1 border-t border-[#E2D9C8]">
              <Link href="/quote" className="text-xs font-bold text-[#B8963E] hover:text-[#9A7C2E]">
                Get Free Estimate →
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#1C160C] uppercase tracking-wider">Contact Us</h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-[#B8963E] mt-0.5 flex-shrink-0" />
              <div>
                <a href={`tel:${s.phone}`} className="font-bold text-[#1C160C] hover:text-[#B8963E] block">{s.phone}</a>
                <span className="text-[#8C7B68]">Call for site survey</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-bold text-[#1C160C] hover:text-emerald-700">
                WhatsApp Us
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 text-[#8C7B68] mt-0.5 flex-shrink-0" />
              <a href={`mailto:${s.email}`} className="text-[#4A3F2F] hover:text-[#B8963E]">{s.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#8C7B68] mt-0.5 flex-shrink-0" />
              <span className="text-[#4A3F2F] leading-relaxed">{s.address}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-[#8C7B68] mt-0.5 flex-shrink-0" />
              <span className="text-[#4A3F2F]">{s.hours}</span>
            </li>
          </ul>
        </div>

        {/* Areas */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#1C160C] uppercase tracking-wider">Service Areas</h3>
          <div className="space-y-2">
            {serviceAreas.map((a) => (
              <div key={a.id}>
                <span className="block text-xs font-bold text-[#1C160C]">{a.city}</span>
                <span className="block text-[10px] text-[#8C7B68] leading-relaxed">{a.areas.slice(0, 4).join(', ')}…</span>
              </div>
            ))}
            <Link href="/service-areas" className="text-[11px] font-bold text-[#B8963E] hover:text-[#9A7C2E]">
              View All Areas →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E2D9C8] bg-[#F2EBD9] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8C7B68]">
          <p>© {year} {s.name}. All rights reserved. · Estimates are indicative; final quote after site measurement.</p>
          <nav className="flex gap-4 font-semibold flex-shrink-0">
            <Link href="/about" className="hover:text-[#B8963E]">About</Link>
            <Link href="/faq" className="hover:text-[#B8963E]">FAQs</Link>
            <Link href="/contact" className="hover:text-[#B8963E]">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
