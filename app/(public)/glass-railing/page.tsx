import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Frameless Glass Railings & Balustrades | Viswakarma uPVC & Aluminium',
  description: 'Premium structural glass railings for balconies, terrace parapets, and indoor stairs. Using 12mm laminated toughened safety glass and SS316 spigots.',
};

export default function GlassRailingPage() {
  return (
    <div className="py-8 md:py-16 space-y-10 md:space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">ARCHITECTURAL GLAZING</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight">
          Frameless Glass Balustrades & Railings
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          Create panoramic, unobstructed views in your balcony or terrace. We manufacture and install premium structural glass balustrades using heavy laminated toughened safety glass anchored by solid marine-grade stainless steel floor fittings.
        </p>
        <div className="pt-2">
          <Link href="/contact" className="w-full sm:w-auto inline-block">
            <Button className="font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md w-full sm:w-auto">
              Book Site Survey & Pricing <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-lg text-brand-primary">Frameless Spigot Systems</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Glass panels are held in place by solid, heavy-duty floor mounts called spigots, cast in corrosion-free SS316. Ideal for modern villa balconies, creating a seamless boundary with zero vertical frames. We utilize 12mm thick laminated toughened glass for absolute safety.
            </p>
          </CardContent>
        </Card>

        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-lg text-brand-primary">U-Channel Profiles & Handrails</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Glass sheets are slotted directly into an aluminium continuous floor-mounted U-channel base, wrapped in satin or timber cladding. Top handrails can be fitted using slim stainless steel tubes to provide extra climbing safety and panel alignment.
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
