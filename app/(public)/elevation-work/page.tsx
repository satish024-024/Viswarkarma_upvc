import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Structural Elevation Glass & Spider Glazing | Daddy uPVC & Aluminium',
  description: 'Premium structural glass facades, curtain walls, spider-fitting glass joints, and commercial storefronts. Built to high safety standards.',
};

export default function ElevationWorkPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">FACADE GLAZING</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight">
          Structural Elevation Glass & Façades
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          Transform your building&apos;s exterior. We custom engineer, fabricate, and install heavy structural glass facades, curtain wall panels, and spider fittings designed to withstand high-altitude wind load stresses.
        </p>
        <div className="pt-2">
          <Link href="/contact">
            <Button className="font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md">
              Book Site Survey & Pricing <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-lg text-brand-primary">Spider Fitting Joints</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Utilizes high-strength stainless steel spider brackets to connect glass panels to a supporting steel framework or glass fins. Offers maximum transparency, allowing for beautiful commercial fronts or modern lobby entries.
            </p>
          </CardContent>
        </Card>

        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-lg text-brand-primary">Semi-Unitized Curtain Walls</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              A grid system composed of aluminium mullions and sashes, glazed locally at the site. It is designed to drain water cleanly, withstand expansion stresses, and insulate the interior of commercial structures and residential facades.
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
