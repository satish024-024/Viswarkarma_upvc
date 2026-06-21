import React from 'react';
import { Card } from '@/components/ui/card';
import { testimonialsList } from '@/lib/data/business';

export const metadata = {
  title: 'Client Reviews | Daddy uPVC & Aluminium',
  description: 'Read actual testimonials from homeowners, architects, and builders who have installed custom uPVC & aluminium windows in Bangalore.',
};

export default function TestimonialsPage() {
  return (
    <div className="py-12 sm:py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">CLIENT FEEDBACK</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight">
          What Homeowners & Architects Say
        </h1>
        <p className="text-sm text-brand-muted leading-relaxed">
          With over two decades of custom installations, we have built lasting partnerships with families and developers by delivering on soundproofing, waterproofing, and durability.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonialsList.map((t) => (
          <Card key={t.id} className="border-brand-border bg-white p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-1 text-brand-secondary">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} className="text-sm">★</span>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-brand-primary italic leading-relaxed">
              &ldquo;{t.content}&rdquo;
            </p>
            <div className="border-t border-brand-light pt-4 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-brand-primary block">{t.name}</span>
                <span className="text-brand-muted text-[10px] block">{t.role}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-brand-secondary block">{t.projectType}</span>
                <span className="text-slate-400 text-[10px] block">{t.location}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
}
