"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageSquare, Award } from 'lucide-react';
import { businessSettings, serviceVerticals, serviceAreas } from '@/lib/data/business';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12">
        
        {/* Column 1: Brand Info */}
        <div className="lg:col-span-4 space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-brand-secondary flex items-center justify-center text-white font-bold">
              D
            </div>
            <div>
              <span className="text-base font-bold text-white block tracking-tight">Daddy</span>
              <span className="text-[10px] font-bold text-brand-secondary block uppercase tracking-wider -mt-1.5">uPVC & Aluminium</span>
            </div>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            With over {businessSettings.experienceYears} years of custom manufacturing experience, we specialize in high-performance windows, doors, mosquito meshes, and structural glass installations. Fabricated in our local facility and installed by experts.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-white bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
              <Award className="w-3.5 h-3.5 text-brand-secondary" />
              <span>Direct Factory Fabrication</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="lg:col-span-2.5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Product Systems</h3>
          <ul className="space-y-2 text-xs">
            {serviceVerticals.map((vert) => (
              <li key={vert.id}>
                <Link
                  href={vert.slug === 'mosquito-mesh' ? `/mesh/${vert.slug}` : `/${vert.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {vert.title}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-slate-800">
              <Link href="/quote" className="text-brand-secondary hover:underline font-bold">
                Configure Price Estimate
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Info */}
        <div className="lg:col-span-3.5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Contact Specialist</h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
              <div>
                <a href={`tel:${businessSettings.phone}`} className="hover:text-white block font-semibold text-white">
                  {businessSettings.phone}
                </a>
                <span className="text-[10px] text-slate-500">Call for Site Survey</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <a
                  href={`https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white block font-semibold text-white"
                >
                  WhatsApp Handoff
                </a>
                <span className="text-[10px] text-slate-500">Send custom configurations</span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <a href={`mailto:${businessSettings.email}`} className="hover:text-white">
                {businessSettings.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed text-slate-400">
                {businessSettings.address}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-400">{businessSettings.hours}</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Service Areas */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Service Areas</h3>
          <div className="space-y-2">
            {serviceAreas.map((area) => (
              <div key={area.id} className="text-xs">
                <span className="font-semibold text-white block">{area.city}</span>
                <span className="text-[10px] text-slate-400 block leading-relaxed">
                  {area.areas.slice(0, 5).join(', ')}...
                </span>
              </div>
            ))}
            <Link href="/service-areas" className="text-[10px] text-brand-secondary hover:underline block font-semibold">
              View All Served Cities & Areas
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Legal Disclaimer Section */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left leading-relaxed">
            &copy; {currentYear} {businessSettings.name}. All rights reserved.<br />
            <span className="text-[10px]">
              Disclaimer: All calculations provided on this site are **estimated price guides**. Final quotations are subject to actual physical site measurements, framing profiles, and selected glass/locking hardware specifications.
            </span>
          </p>
          <div className="flex gap-4 font-medium">
            <Link href="/about" className="hover:text-slate-400">About</Link>
            <span>&middot;</span>
            <Link href="/faq" className="hover:text-slate-400">FAQs</Link>
            <span>&middot;</span>
            <Link href="/contact" className="hover:text-slate-400">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
