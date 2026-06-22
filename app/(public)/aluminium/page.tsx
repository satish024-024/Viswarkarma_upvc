import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Architectural Aluminium Systems | Direct Factory Pricing | Viswarkarma uPVC & Aluminium',
  description: 'Premium structural aluminium windows and doors with slim frames. Durable, powder-coated finishes, wind-load resistant, and thermally broken.',
};

export default function AluminiumOverviewPage() {
  return (
    <div className="py-8 md:py-16 space-y-10 md:space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Hero Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">SLIM ARCHITECTURAL FRAMES</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight leading-tight">
            Architectural Aluminium Systems
          </h1>
          <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
            Our structural-grade aluminium profiles offer unparalleled mechanical strength and slim frames. Perfect for modern architects, builders, and villa owners seeking massive sliding glass panels, high wind-load tolerances for high-rises, and durable anodized or powder-coated finishes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/aluminium/configurator" className="w-full sm:w-auto">
              <Button className="font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md w-full sm:w-auto">
                Configure Aluminium Estimate <ArrowRight className="w-4 h-4" />
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
              <span className="text-brand-muted">Profile Grade Alloy</span>
              <span className="text-brand-primary font-bold">6063 T6 Architectural</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Thermal Break Isolation</span>
              <span className="text-brand-primary font-bold">Polyamide Strips (Optional)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Anodizing Thickness</span>
              <span className="text-brand-primary font-bold">up to 20-25 Microns</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Max Opening Width</span>
              <span className="text-brand-primary font-bold">Unlimited multi-tracks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-vertical links grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-brand-border pt-12">
        <Card className="border-brand-border overflow-hidden bg-white flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="relative h-64 w-full bg-slate-100 border-b border-brand-border">
            <Image 
              src="https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80" 
              alt="Aluminium Windows"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-brand-primary">Aluminium Windows</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Available in slimline horizontal sliding designs, fixed panoramic sashes, and outward-swinging casement units. Low maintenance, high strength.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/aluminium/windows">
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
              src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80" 
              alt="Aluminium Doors"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-brand-primary">Aluminium Doors</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Engineered for large balcony layouts, panoramic sit-outs, and heavy commercial swing doors. Low floor tracks and smooth-rolling lift-and-slide layouts.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/aluminium/doors">
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

