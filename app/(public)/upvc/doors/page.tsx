import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Reinforced uPVC Doors | Sliding Patio & Swing | Viswarkarma uPVC & Aluminium',
  description: 'Heavy-duty custom fabricated uPVC doors, sliding balcony doors, and openable terrace doors. Equipped with secure multi-point lock systems.',
};

export default function UpvcDoorsPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">DOOR SYSTEMS</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight">
          Heavy-Duty Custom uPVC Doors
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          Our door frames utilize larger, thick-walled uPVC profiles with heavy steel reinforcement. They are designed to withstand frequent use, carry heavy double-glazed units (DGU) easily, and seal tightly to block outdoor sound and dust.
        </p>
        <div className="pt-2">
          <Link href="/upvc/configurator">
            <Button className="font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md">
              Configure uPVC Door Estimate <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-lg text-brand-primary">Sliding Balcony Doors</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Perfect for balconies, terrace entries, and partition openings. Running on heavy-duty steel tracks with specialized tandem rollers, even sashes weighing 120 kg slide open smoothly with one hand. Low-threshold tracks are available to prevent tripping.
            </p>
          </CardContent>
        </Card>

        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-lg text-brand-primary">Swing & Utility Doors</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Classic inward or outward swinging doors, ideal for terrace entries, kitchens, and utilities. Equipped with full perimeter gaskets and secure key-locking cylinders that drive multi-point locking rods directly into the frame.
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
