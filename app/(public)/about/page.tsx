import React from 'react';
import { Award, Compass, ShieldCheck, ShieldAlert, Sparkles, Factory, HeartHandshake } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { businessSettings } from '@/lib/data/business';

export const metadata = {
  title: 'About Us | Daddy uPVC & Aluminium',
  description: 'With 25+ years of custom fabrication, Daddy uPVC manufactures and installs premium architectural windows and doors across Karnataka.',
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Introduction Hero */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">OUR HERITAGE</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight">
          A 25+ Year Legacy of Structural Integrity and Trust
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
          Established as a small family-run fabrication facility, {businessSettings.name} has grown to become one of Bengaluru&apos;s most trusted manufacturers of custom uPVC and aluminium architectural systems. We don&apos;t act as middleman distributors; we own our factory, oversee our extrusions, and deploy our in-house installers to ensure total quality control.
        </p>
      </div>

      {/* Our Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-brand-border">
          <CardContent className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center text-brand-secondary">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-brand-primary">Peenya Factory Direct</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              We own and operate our fabrication facility in Peenya Industrial Area. By cutting out third-party dealers and distributors, we provide factory-direct savings and maintain absolute command over weld strength and frame tolerances.
            </p>
          </CardContent>
        </Card>

        <Card className="border-brand-border">
          <CardContent className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center text-brand-secondary">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-brand-primary">Family Integrity</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Run by two generations of engineering and architectural fabrication experts, we operate on transparent terms. We do not use fake markups or low-quality hardware. Our reputation is built on relationships that span decades.
            </p>
          </CardContent>
        </Card>

        <Card className="border-brand-border">
          <CardContent className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center text-brand-secondary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-brand-primary">Lifetime Service Philosophy</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              We believe a window is a 30-year asset. We stand by our 20-year profile color warranty and maintain responsive call-out support to service rollers, gaskets, or mesh alignments long after installation is done.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Detail */}
      <div className="bg-slate-50 border border-brand-border rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-2xl font-bold text-brand-primary tracking-tight">Our Manufacturing Standards</h2>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            Every window system that leaves our Peenya plant undergoes checking for profile squareness, gasket fitment, and lock alignment. We reinforce our uPVC frames using galvanized steel reinforcement channels (minimum 1.5mm thickness) to guarantee our windows withstand gusting wind loads.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-brand-primary">
            <span className="flex items-center gap-1"><span className="text-brand-secondary">✔</span> Lead-Free Profiles</span>
            <span className="flex items-center gap-1"><span className="text-brand-secondary">✔</span> High UV Resistance</span>
            <span className="flex items-center gap-1"><span className="text-brand-secondary">✔</span> Friction Stay Hinges</span>
          </div>
        </div>
        <div className="lg:col-span-4 bg-white border border-brand-border p-6 rounded-xl space-y-2 text-center shadow-xs">
          <span className="block text-4xl font-extrabold text-brand-secondary">25+</span>
          <span className="block text-xs font-bold text-brand-primary uppercase tracking-wider">Years of Solid Service</span>
          <span className="block text-[10px] text-brand-muted">across Bengaluru, Mysuru, & Tumakuru</span>
        </div>
      </div>

    </div>
  );
}
