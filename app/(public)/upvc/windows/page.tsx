import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProductTypes } from '@/lib/supabase';

export const metadata = {
  title: 'Custom uPVC Windows | sliding, Casement, & Tilt-Turn | Viswarkarma uPVC & Aluminium',
  description: 'Custom fabricated uPVC windows including 2/3 track sliding systems, openable casements, and fixed frames. Engineered in Rajahmundry, Andhra Pradesh.',
};

export default async function UpvcWindowsPage() {
  const productTypes = await getProductTypes();

  // Find images dynamically from database so they are changeable by admin
  const slidingWindowImg = productTypes.find(t => t.id === 'sliding_window')?.image || 'https://5.imimg.com/data5/SX/YV/YG/SELLER-64612523/upvc-sliding-window-500x500.jpg';
  const casementWindowImg = productTypes.find(t => t.id === 'casement_window')?.image || 'https://5.imimg.com/data5/QR/VY/TK/SELLER-64612523/casement-window-500x500.jpeg';
  const fixedWindowImg = productTypes.find(t => t.id === 'fixed_window')?.image || 'https://5.imimg.com/data5/LQ/MY/FJ/SELLER-64612523/upvc-sliding-profile-125x125.jpeg';

  return (
    <div className="py-8 md:py-16 space-y-10 md:space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <Link 
          href="/upvc" 
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors group mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to uPVC Overview
        </Link>
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">WINDOW SYSTEMS</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight">
          Custom Manufactured uPVC Windows
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          We manufacture uPVC windows specifically tuned for Indian tropical weather conditions. By incorporating specialized double-lip EPDM/TPE compression gaskets and multiple interlocking tracks, we completely block outside noise, dust, and rain leaks.
        </p>
        <div className="pt-2">
          <Link href="/upvc/configurator" className="w-full sm:w-auto inline-block">
            <Button className="font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md w-full sm:w-auto">
              Configure uPVC Window Estimate <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-48 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src={slidingWindowImg} 
              alt="Sliding Windows"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-brand-primary">Sliding Windows</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Equipped with smooth brass or nylon roller bearings and integrated mosquito track slots. Ideal for bedrooms, kitchens, and patios where swing clearance is limited. Available in 2, 3, or 4-panel configurations.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-48 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src={casementWindowImg} 
              alt="Casement (Openable) Windows"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-brand-primary">Casement (Openable) Windows</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Provides 100% opening area for high ventilation. Equipped with heavy-duty friction stay hinges that keep sashes steady against high winds without rattling. Double sealing gaskets ensure excellent sound proofing.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-48 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src={fixedWindowImg} 
              alt="Tilt & Turn / Fixed Windows"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-brand-primary">Tilt & Turn / Fixed Windows</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Tilt & Turn window sashes tilt inwards at the top for ventilation or swing open like a door for cleaning. Fixed windows are perfect for maximizing light and architectural partitions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}


