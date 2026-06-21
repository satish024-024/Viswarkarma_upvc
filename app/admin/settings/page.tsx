"use client";

import React, { useEffect, useState } from 'react';
import { getBusinessSettings, updateBusinessSettings } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { BusinessSettings } from '@/types/entities';

export default function AdminSettings() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const data = await getBusinessSettings();
      setSettings(data);
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSuccess(false);
    setError('');

    const { error: err } = await updateBusinessSettings(settings);
    setSaving(false);
    if (err) {
      setError('Failed to update business settings.');
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading || !settings) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 w-1/4 rounded-md animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Business Settings</h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">Configure global business variables, contact routes, and office location.</p>
      </div>

      <Card className="border border-slate-200 bg-white max-w-3xl">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider">Business Profile Information</CardTitle>
          <CardDescription className="text-[10px] font-semibold text-slate-400">These details synchronize with headers, footers, CTAs, and contact handoffs across the public website.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold text-slate-800">
            {success && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Business settings updated successfully!</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Business Name</label>
                <Input
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="h-10 border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Years of Experience</label>
                <Input
                  type="number"
                  value={settings.experienceYears}
                  onChange={(e) => setSettings({ ...settings, experienceYears: parseInt(e.target.value) || 0 })}
                  className="h-10 border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tagline / Mission statement</label>
              <Input
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="h-10 border-slate-200 text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Primary Phone</label>
                <Input
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="h-10 border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">WhatsApp Number (with Country Code)</label>
                <Input
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  placeholder="+919505683584"
                  className="h-10 border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Office Email</label>
                <Input
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="h-10 border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Working Hours</label>
                <Input
                  value={settings.hours}
                  onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                  className="h-10 border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Office / Workshop Address</label>
              <textarea
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full min-h-[80px] p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Google Maps URL (Embed/Directions link)</label>
              <Input
                value={settings.googleMapUrl}
                onChange={(e) => setSettings({ ...settings, googleMapUrl: e.target.value })}
                className="h-10 border-slate-200 text-xs font-semibold"
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs uppercase tracking-wider px-6 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
