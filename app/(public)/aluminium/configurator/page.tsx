import React from 'react';
import Configurator from '@/features/configurator/components/Configurator';

export const metadata = {
  title: 'Configure Aluminium Windows & Doors | Viswarkarma uPVC & Aluminium',
  description: 'Custom design and calculate an estimated price guide for your architectural aluminium windows and doors. Send configuration directly to WhatsApp.',
};

export default function AluminiumConfiguratorPage() {
  return (
    <div className="py-8 md:py-12 bg-slate-50/30 flex-grow">
      <Configurator initialFamily="aluminium" />
    </div>
  );
}
