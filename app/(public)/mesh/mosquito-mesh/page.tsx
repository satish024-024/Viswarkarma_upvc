import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Mosquito Mesh Screens & Systems | Daddy uPVC & Aluminium',
  description: 'Premium insect screening systems: Pleated mesh, sliding mesh, rolling screens, and high-strength SS304 rodent-proof grids. Custom sizes.',
};

export default function MosquitoMeshPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">INSECT PROTECTION</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight">
          Mosquito Mesh & Flyscreen Systems
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          Ensure fresh air and ventilation without mosquitoes or pests entering your home. We custom manufacture integrated flyscreens using high-durability mesh options tailored for our uPVC and aluminium window systems.
        </p>
        <div className="pt-2 flex gap-4">
          <Link href="/quote">
            <Button className="font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md">
              Calculate Estimate <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-brand-primary">Pleated (Folding) Mesh</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Folds away like an accordion inside its frame when not in use, making it virtually invisible. Perfect for wide balcony sliding doors, independent villas, and penthouses. Operates smoothly on floor guide wires.
            </p>
          </CardContent>
        </Card>

        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-brand-primary">SS304 Stainless Steel Shield</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Woven from high-tensile marine-grade stainless steel wire. Extremely robust, acts as a physical security barrier against break-ins, and is completely rodent-proof (will not tear from rat or cat claws).
            </p>
          </CardContent>
        </Card>

        <Card className="border-brand-border bg-white flex flex-col justify-between">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-base text-brand-primary">Fiberglass Invisible Mesh</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              The standard budget-friendly mesh choice. Woven from flexible fiberglass coated with protective vinyl. Provides excellent visibility, high ventilation, and is easily cleanable with a damp cloth.
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
