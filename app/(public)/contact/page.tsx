"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { businessSettings } from '@/lib/data/business';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) {
      alert("Please fill in all required fields.");
      return;
    }

    const whatsappMessage = `Hello Daddy uPVC & Aluminium! I have a general enquiry:
- Name: ${formData.name}
- Phone: ${formData.phone}
- Location: ${formData.city}
- Message: ${formData.message}`;

    const link = `https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(link, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Page Header */}
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">GET IN TOUCH</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight">
          Request a Physical Site Survey
        </h1>
        <p className="text-sm text-brand-muted leading-relaxed">
          Ready to measure your window apertures or discuss framing profiles? Call our office or submit your message below to connect via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Form */}
        <div className="lg:col-span-7">
          <Card className="border-brand-border bg-white shadow-xs">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-brand-primary block border-b border-brand-border pb-2">
                Send Quick Message
              </h2>

              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-primary">Enquiry Formatted!</h3>
                  <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
                    Your details have been compiled. We have opened a new window redirecting you to WhatsApp to complete your message delivery.
                  </p>
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', city: '', message: '' });
                    }} 
                    className="mt-4 font-bold"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-brand-primary block mb-1">
                      Your Name *
                    </label>
                    <Input 
                      placeholder="Rajesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="cursor-text"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-brand-primary block mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <Input 
                      type="tel"
                      placeholder="9886012345"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="cursor-text"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-brand-primary block mb-1">
                      City / Area *
                    </label>
                    <Input 
                      placeholder="Indiranagar, Bangalore"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                      className="cursor-text"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-brand-primary block mb-1">
                      Enquiry details or window specs (Optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="I need 3 sliding windows in my bedroom, and a wide sliding balcony door. Looking for Golden Oak wood finish..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="flex w-full rounded-lg border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-foreground shadow-xs transition-all duration-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-accent focus:outline-none placeholder:text-brand-muted-light cursor-text"
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                      <MessageSquare className="w-4 h-4" /> Send Enquiry via WhatsApp
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-brand-border bg-slate-50/50 p-6 sm:p-8 space-y-6">
            <h2 className="text-xs font-bold text-brand-primary uppercase tracking-wider block border-b border-brand-border pb-2">
              Factory & Office Info
            </h2>
            
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-primary block">Bangalore Fabrication Facility</span>
                  <span className="text-brand-muted mt-0.5 block leading-relaxed">{businessSettings.address}</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-primary block">Call Office Direct</span>
                  <a href={`tel:${businessSettings.phone}`} className="text-brand-secondary font-bold block mt-0.5 hover:underline">
                    {businessSettings.phone}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-primary block">Email Specialist</span>
                  <a href={`mailto:${businessSettings.email}`} className="text-brand-muted block mt-0.5 hover:underline">
                    {businessSettings.email}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-primary block">Working Hours</span>
                  <span className="text-brand-muted block mt-0.5">{businessSettings.hours}</span>
                </div>
              </li>
            </ul>

            <div className="border-t border-brand-border pt-6 flex items-start gap-2.5">
              <Shield className="w-5 h-5 text-brand-secondary flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-brand-muted leading-relaxed">
                As a factory-direct fabrication shop, we welcome builders, contractors, architects, and homeowners for scheduled walk-ins to inspect our profiles, reinforcement steels, and corner weld equipment.
              </p>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
