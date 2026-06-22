import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'High-Performance uPVC Window & Door Systems | Direct Factory Pricing',
  description: 'Premium uPVC profiles manufactured locally in Bangalore. Offering soundproofing (up to 40dB), thermal efficiency, waterproofing, and multi-point locks.',
};

export default function UpvcOverviewPage() {
  return (
    <div className="py-8 md:py-16 space-y-10 md:space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Back Button */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      {/* Hero Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">PREMIUM VINYL SYSTEM</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight leading-tight">
            High-Performance uPVC Framing Profiles
          </h1>
          <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
            Our uPVC window and door systems are fabricated using special UV-stabilized impact-resistant compound extrusions. Unlike cheap vinyl that yellows or warps under direct sun, our profiles are steel-reinforced and custom corner-welded to remain airtight for over 30 years.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/upvc/configurator" className="w-full sm:w-auto">
              <Button className="font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md w-full sm:w-auto">
                Configure uPVC Estimate <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="secondary" className="font-bold w-full sm:w-auto justify-center">Book Free Site Survey</Button>
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 bg-slate-50 border border-brand-border p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider block border-b border-brand-border pb-2">Technical Properties</h3>
          <div className="space-y-2 text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-brand-muted">Profile Chamber Count</span>
              <span className="text-brand-primary font-bold">3, 4, or 5 Chambers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Steel Reinforcement</span>
              <span className="text-brand-primary font-bold">1.5mm - 2.0mm Galvanized</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Acoustic Reduction</span>
              <span className="text-brand-primary font-bold">up to 38 - 42 Decibels</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">U-Value (Thermal loss)</span>
              <span className="text-brand-primary font-bold">1.2 - 1.8 W/m²K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-vertical links grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-brand-border pt-12">
        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-64 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80" 
              alt="uPVC Windows"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-brand-primary">uPVC Windows</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Choose from classic outward-swinging casement sashes, space-saving multi-track horizontal sliders, fixed picture windows, or advanced European-style tilt-and-turn units.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/upvc/windows">
                <Button variant="secondary" size="sm" className="font-bold flex items-center gap-1">
                  Browse Windows <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-64 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80" 
              alt="uPVC Doors"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-brand-primary">uPVC Doors</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Available as heavy-duty swing entrance doors or wide sliding balcony patio doors with low aluminium thresholds. Fully reinforced with thick steel inserts and key-locking handles.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/upvc/doors">
                <Button variant="secondary" size="sm" className="font-bold flex items-center gap-1">
                  Browse Doors <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}

