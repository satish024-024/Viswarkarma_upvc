import React from 'react';
import Configurator from '@/features/configurator/components/Configurator';

export const metadata = {
  title: 'Configure Window & Door Estimate | Daddy uPVC & Aluminium',
  description: 'Custom design and calculate an estimated price guide for your uPVC or Aluminium windows and doors. Get details pre-filled directly to WhatsApp.',
};

export default function QuotePage() {
  return (
    <div className="py-8 sm:py-12 bg-slate-50/30 flex-grow">
      <Configurator />
    </div>
  );
}
