import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { faqsList } from '@/lib/data/business';

export const metadata = {
  title: 'Frequently Asked Questions | Daddy uPVC & Aluminium',
  description: 'Find answers about uPVC vs aluminium window profiles, double-glazing specifications, sound insulation, Peenya manufacturing, and home installations.',
};

export default function FAQPage() {
  return (
    <div className="py-12 sm:py-16 space-y-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">ANSWERS & EXPLANATIONS</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-brand-muted leading-relaxed">
          Need details about double glazed units, wind-load resistance, or our old window demolition process? Read our detailed responses below.
        </p>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {faqsList.map((faq) => (
          <Card key={faq.id} className="border-brand-border bg-white overflow-hidden">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-bold text-sm sm:text-base text-brand-primary flex items-start gap-3">
                <span className="text-brand-secondary text-xs uppercase bg-brand-light px-2 py-0.5 rounded font-bold mt-0.5 flex-shrink-0">Q</span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed pl-8">
                {faq.answer}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
