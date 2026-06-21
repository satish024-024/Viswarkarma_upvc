import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Custom uPVC Windows | sliding, Casement, & Tilt-Turn | Daddy',
  description: 'Custom fabricated uPVC windows including 2/3 track sliding systems, openable casements, and fixed frames. Engineered in Bangalore.',
};

export default function UpvcWindowsPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">WINDOW SYSTEMS</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight">
          Custom Manufactured uPVC Windows
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          We manufacture uPVC windows specifically tuned for Indian tropical weather conditions. By incorporating specialized double-lip EPDM/TPE compression gaskets and multiple interlocking tracks, we completely block outside noise, dust, and rain leaks.
        </p>
        <div className="pt-2">
          <Link href="/upvc/configurator">
            <Button className="font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md">
              Configure uPVC Window Estimate <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-brand-primary">Sliding Windows</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Equipped with smooth brass or nylon roller bearings and integrated mosquito track slots. Ideal for bedrooms, kitchens, and patios where swing clearance is limited. Available in 2, 3, or 4-panel configurations.
            </p>
          </CardContent>
        </Card>

        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-brand-primary">Casement (Openable) Windows</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Provides 100% opening area for high ventilation. Equipped with heavy-duty friction stay hinges that keep sashes steady against high winds without rattling. Double sealing gaskets ensure excellent sound proofing.
            </p>
          </CardContent>
        </Card>

        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-brand-primary">Tilt & Turn / Fixed Windows</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Tilt & Turn window sashes tilt inwards at the top for ventilation or swing open like a door for cleaning. Fixed windows are perfect for maximizing light and architectural partitions.
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
