import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProductTypes } from '@/lib/supabase';

export const metadata = {
  title: 'Aluminium Windows | Slimline Sliding & Casement | Viswarkarma uPVC & Aluminium',
  description: 'Custom fabricated aluminium windows with slim profiles, heavy T6 alloys, and multi-point locking. Manufactured directly at our Rajahmundry facility.',
};

export default async function AluminiumWindowsPage() {
  const productTypes = await getProductTypes();

  // Find images dynamically from database so they are changeable by admin
  const aluSlidingWindowImg = productTypes.find(t => t.id === 'alu_sliding_window')?.image || 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=80';
  const aluCasementWindowImg = productTypes.find(t => t.id === 'alu_casement_window')?.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
  const aluFixedWindowImg = productTypes.find(t => t.id === 'alu_fixed_window')?.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="py-8 md:py-16 space-y-10 md:space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <Link 
          href="/aluminium" 
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors group mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Aluminium Overview
        </Link>
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">WINDOW SYSTEMS</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight">
          Architectural Aluminium Windows
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          Our aluminium windows utilize premium 6063 T6 structural alloys. By taking advantage of metal&apos;s inherent strength, we fabricate frames with minimal sightline widths, giving you maximum glass area for modern, daylight-filled rooms.
        </p>
        <div className="pt-2">
          <Link href="/aluminium/configurator" className="w-full sm:w-auto inline-block">
            <Button className="font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md w-full sm:w-auto">
              Configure Aluminium Window Estimate <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-48 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src={aluSlidingWindowImg} 
              alt="Slim Sliding Windows"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-brand-primary">Slim Sliding Windows</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Premium minimal sightlines. Double-brushed wool seals and weather stripping block dust and heavy monsoon drafts. Supported by bottom-rolling tracks for effortless sliding action.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-48 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src={aluCasementWindowImg} 
              alt="Architectural Casement"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-brand-primary">Architectural Casement</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Classic openable windows with heavy-duty hidden friction hinges. Closes airtight with continuous compression seals, providing high soundproofing and structural seal performance.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-48 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src={aluFixedWindowImg} 
              alt="Fixed Picture Panels"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-brand-primary">Fixed Picture Panels</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Designed for structural openings that only require natural light and views. Fits large laminated or double glazed safety glass units securely without sagging.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}


