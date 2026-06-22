import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProductTypes } from '@/lib/supabase';

export const metadata = {
  title: 'Reinforced uPVC Doors | Sliding Patio & Swing | Viswarkarma uPVC & Aluminium',
  description: 'Heavy-duty custom fabricated uPVC doors, sliding balcony doors, and openable terrace doors. Equipped with secure multi-point lock systems.',
};

export default async function UpvcDoorsPage() {
  const productTypes = await getProductTypes();

  // Find images dynamically from database so they are changeable by admin
  const slidingDoorImg = productTypes.find(t => t.id === 'sliding_door')?.image || 'https://5.imimg.com/data5/RU/YJ/HX/SELLER-64612523/upvc-french-door-500x500.jpg';
  const swingDoorImg = productTypes.find(t => t.id === 'openable_door')?.image || 'https://5.imimg.com/data5/AL/LI/CS/SELLER-64612523/upvc-glass-double-door-500x500.jpg';

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
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">DOOR SYSTEMS</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight">
          Heavy-Duty Custom uPVC Doors
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          Our door frames utilize larger, thick-walled uPVC profiles with heavy steel reinforcement. They are designed to withstand frequent use, carry heavy double-glazed units (DGU) easily, and seal tightly to block outdoor sound and dust.
        </p>
        <div className="pt-2">
          <Link href="/upvc/configurator" className="w-full sm:w-auto inline-block">
            <Button className="font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md w-full sm:w-auto">
              Configure uPVC Door Estimate <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-64 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src={slidingDoorImg} 
              alt="Sliding Balcony Doors"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-6 sm:p-8 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-brand-primary">Sliding Balcony Doors</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Perfect for balconies, terrace entries, and partition openings. Running on heavy-duty steel tracks with specialized tandem rollers, even sashes weighing 120 kg slide open smoothly with one hand. Low-threshold tracks are available to prevent tripping.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-64 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src={swingDoorImg} 
              alt="Swing & Utility Doors"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-6 sm:p-8 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-brand-primary">Swing & Utility Doors</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Classic inward or outward swinging doors, ideal for terrace entries, kitchens, and utilities. Equipped with full perimeter gaskets and secure key-locking cylinders that drive multi-point locking rods directly into the frame.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}


