import React from 'react';
import Configurator from '@/features/configurator/components/Configurator';

export const metadata = {
  title: 'Configure uPVC Windows & Doors | Viswarkarma uPVC & Aluminium',
  description: 'Custom design and calculate an estimated price guide for your uPVC windows and doors. Send configuration directly to WhatsApp.',
};

export default function UpvcConfiguratorPage() {
  return (
    <div className="py-8 sm:py-12 bg-slate-50/30 flex-grow">
      <Configurator initialFamily="upvc" />
    </div>
  );
}
