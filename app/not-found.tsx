import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Page Not Found | Viswarkarma uPVC & Aluminium',
  description: 'The requested architectural window/door page could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center bg-white border border-brand-border rounded-2xl p-8 shadow-md space-y-6">
        <div className="w-16 h-16 rounded-full bg-brand-light text-brand-secondary flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-brand-primary tracking-tight">404</h1>
          <h2 className="text-lg font-bold text-brand-primary">Aperture Out of Alignment</h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            The page you are looking for has been moved, renamed, or is currently out of vertical plumb.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button className="w-full font-bold flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
