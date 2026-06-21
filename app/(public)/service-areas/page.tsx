import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Truck } from 'lucide-react';
import { serviceAreas } from '@/lib/data/business';

export const metadata = {
  title: 'Service Areas & Locations Served | Viswarkarma uPVC & Aluminium',
  description: 'Viswarkarma uPVC serves Bangalore (Whitefield, Indiranagar, Jayanagar), Mysuru, and Tumakuru, providing direct transport and professional installation.',
};

export default function ServiceAreasPage() {
  return (
    <div className="py-12 sm:py-16 space-y-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">OUR REGIONAL REACH</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight">
          Areas We Serve Across Karnataka
        </h1>
        <p className="text-sm text-brand-muted leading-relaxed">
          From our local fabrication plant, we dispatch custom window sashes and technicians directly to building sites.
        </p>
      </div>

      {/* Dispatch logistics details card */}
      <div className="bg-slate-50 border border-brand-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-12 h-12 rounded-xl bg-brand-light text-brand-secondary flex items-center justify-center flex-shrink-0">
          <Truck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-brand-primary">Factory Direct Specialized Transport</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Windows are fragile products. We do not use standard freight companies. All fabricated frames are padded and loaded onto our specialized transport frame trucks, ensuring they arrive on-site with zero scratches, dents, or glass micro-cracks.
          </p>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceAreas.map((area) => (
          <Card key={area.id} className="border-brand-border bg-white flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-secondary" />
                <h3 className="font-bold text-base text-brand-primary">{area.city}</h3>
              </div>
              
              <ul className="space-y-2 pl-7">
                {area.areas.map((subArea, i) => (
                  <li key={i} className="text-xs text-brand-muted list-disc leading-relaxed">
                    {subArea}
                  </li>
                ))}
              </ul>

              {area.isMajor && (
                <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2.5 py-0.5 inline-block self-start">
                  Daily Installation Dispatches
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
