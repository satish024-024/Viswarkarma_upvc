"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageSquare, Award } from 'lucide-react';
import { businessSettings as defaultSettings, serviceVerticals as defaultServices, serviceAreas } from '@/lib/data/business';
import { getBusinessSettings, getServices } from '@/lib/supabase';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(defaultSettings);
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    getBusinessSettings().then(setSettings);
    getServices().then(setServices);
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-gold/40 flex items-center justify-center text-gold font-black text-lg">
                V
              </div>
              <div>
                <span className="text-base font-black text-white block tracking-tight">Viswarkarma</span>
                <span className="text-[10px] font-bold text-gold block uppercase tracking-wider -mt-1">
                  uPVC &amp; Aluminium
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              With over {settings.experienceYears} years of custom manufacturing experience, we specialize in
              high-performance windows, doors, mosquito meshes, and structural glass installations. Fabricated
              in our local facility and installed by experts.
            </p>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-gold/10 border border-gold/30 px-3 py-1.5 rounded-md">
              <Award className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span>Direct Factory Fabrication</span>
            </div>
          </div>

          {/* Column 2: Product Systems */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Product Systems</h3>
            <ul className="space-y-2 text-xs">
              {services.map((vert) => (
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
                <Link href="/quote" className="text-gold hover:underline font-bold">
                  Get a Price Estimate &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${settings.phone}`} className="block font-semibold text-white hover:text-gold transition-colors">
                    {settings.phone}
                  </a>
                  <span className="text-[10px] text-slate-500">Call for Site Survey</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-semibold text-white hover:text-emerald-400 transition-colors"
                  >
                    WhatsApp Us
                  </a>
                  <span className="text-[10px] text-slate-500">Send custom configurations</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-400">{settings.address}</span>
              </li>

              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400">{settings.hours}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Service Areas */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Service Areas</h3>
            <div className="space-y-3">
              {serviceAreas.map((area) => (
                <div key={area.id} className="text-xs">
                  <span className="font-semibold text-white block">{area.city}</span>
                  <span className="text-[10px] text-slate-400 block leading-relaxed">
                    {area.areas.slice(0, 5).join(', ')}&hellip;
                  </span>
                </div>
              ))}
              <Link
                href="/service-areas"
                className="inline-block text-[11px] text-gold hover:underline font-semibold mt-1"
              >
                View All Served Cities &amp; Areas &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-center md:text-left leading-relaxed">
            &copy; {currentYear} {settings.name}. All rights reserved.{' '}
            <span className="text-[10px] text-slate-600 block md:inline mt-0.5 md:mt-0">
              Prices shown are estimates only. Final quotations subject to physical site measurements, profile
              selection, and hardware specifications.
            </span>
          </p>
          <nav className="flex items-center gap-3 font-medium shrink-0">
            <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
            <span aria-hidden="true">&middot;</span>
            <Link href="/faq" className="hover:text-slate-300 transition-colors">FAQs</Link>
            <span aria-hidden="true">&middot;</span>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
          </nav>
        </div>
      </div>

    </footer>
  );
}
