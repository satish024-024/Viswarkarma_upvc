import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Aluminium Balcony Sliding & Fold Doors | Viswarkarma uPVC & Aluminium',
  description: 'Heavy-duty architectural aluminium balcony sliding doors, folding glass doors, and entrance doors. Custom manufactured at our Bangalore facility.',
};

export default function AluminiumDoorsPage() {
  return (
    <div className="py-8 md:py-16 space-y-10 md:space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">DOOR SYSTEMS</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight">
          Heavy-Duty Aluminium Balcony Doors
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          Designed specifically to bridge indoor spaces and outdoor balconies. Utilizing heavy structural frames, we fabricate panoramic sliding door sashes, folding stack sashes, and robust swing entrance doors that carry large glass sheets cleanly.
        </p>
        <div className="pt-2">
          <Link href="/aluminium/configurator" className="w-full sm:w-auto inline-block">
            <Button className="font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md w-full sm:w-auto">
              Configure Aluminium Door Estimate <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-64 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" 
              alt="Heavy Sliding Patio Doors"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-6 sm:p-8 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-brand-primary">Heavy Sliding Patio Doors</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Available as classic multi-track sliding panels or advanced lift-and-slide configurations. Lift-and-slide mechanics lift the door panel off the track gasket when turning the handle, allowing extremely heavy 200 kg sashes to slide with zero friction.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-64 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" 
              alt="Folding (Bi-Fold) Glass Doors"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent className="p-6 sm:p-8 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-brand-primary">Folding (Bi-Fold) Glass Doors</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Multi-panel glass doors that fold and stack against the wall. Perfect for wide balconies or outdoor patios, creating an uninterrupted opening of up to 90% of the structural aperture width.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

