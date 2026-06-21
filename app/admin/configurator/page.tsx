"use client";

import React, { useEffect, useState } from 'react';
import { 
  getProductTypes, 
  getProductSeries, 
  getColorOptions, 
  getGlassOptions, 
  getMeshOptions, 
  getHardwareOptions,
  updateProductTypePrice,
  updateProductSeriesPrice,
  updateColorOptionMultiplier,
  updateGlassOptionPrice,
  updateMeshOptionPrice,
  updateHardwareOptionPrice
} from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { ProductType, ProductSeries, ColorOption, GlassOption, MeshOption, HardwareOption } from '@/features/configurator/types';

export default function AdminConfigurator() {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [seriesList, setSeriesList] = useState<ProductSeries[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [glass, setGlass] = useState<GlassOption[]>([]);
  const [mesh, setMesh] = useState<MeshOption[]>([]);
  const [hardware, setHardware] = useState<HardwareOption[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const [dbTypes, dbSeries, dbColors, dbGlass, dbMesh, dbHardware] = await Promise.all([
        getProductTypes(),
        getProductSeries(),
        getColorOptions(),
        getGlassOptions(),
        getMeshOptions(),
        getHardwareOptions()
      ]);
      if (active) {
        setTypes(dbTypes);
        setSeriesList(dbSeries);
        setColors(dbColors);
        setGlass(dbGlass);
        setMesh(dbMesh);
        setHardware(dbHardware);
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const handleUpdateTypePrice = async (id: string, price: number) => {
    setSaving(true);
    const { error } = await updateProductTypePrice(id, price);
    setSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setTypes(prev => prev.map(t => t.id === id ? { ...t, basePricePerSqFt: price } : t));
    }
  };

  const handleUpdateSeriesPrice = async (id: string, modifier: number) => {
    setSaving(true);
    const { error } = await updateProductSeriesPrice(id, modifier);
    setSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setSeriesList(prev => prev.map(s => s.id === id ? { ...s, priceModifierPerSqFt: modifier } : s));
    }
  };

  const handleUpdateColorMultiplier = async (id: string, mult: number) => {
    setSaving(true);
    const { error } = await updateColorOptionMultiplier(id, mult);
    setSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setColors(prev => prev.map(c => c.id === id ? { ...c, priceMultiplier: mult } : c));
    }
  };

  const handleUpdateGlassPrice = async (id: string, modifier: number) => {
    setSaving(true);
    const { error } = await updateGlassOptionPrice(id, modifier);
    setSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setGlass(prev => prev.map(g => g.id === id ? { ...g, priceModifierPerSqFt: modifier } : g));
    }
  };

  const handleUpdateMeshPrice = async (id: string, modifier: number) => {
    setSaving(true);
    const { error } = await updateMeshOptionPrice(id, modifier);
    setSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setMesh(prev => prev.map(m => m.id === id ? { ...m, priceModifierPerSqFt: modifier } : m));
    }
  };

  const handleUpdateHardwarePrice = async (id: string, modifier: number) => {
    setSaving(true);
    const { error } = await updateHardwareOptionPrice(id, modifier);
    setSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setHardware(prev => prev.map(h => h.id === id ? { ...h, priceModifierPerUnit: modifier } : h));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 w-1/4 rounded-md animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Configurator Pricing Rules</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Fine-tune the pricing variables and formulas for the instant cost estimator.</p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold max-w-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Price modifier saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-semibold text-slate-800">
        {/* Product Type Base Rates */}
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider">1. Base Rates by Product Type</CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-400">Starting base cost per sq. ft. of the main frames.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {types.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <span className="font-bold text-slate-950 capitalize">{t.name}</span>
                  <span className="text-[9px] text-slate-400 block uppercase font-mono">{t.family} systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={t.basePricePerSqFt}
                    onChange={(e) => setTypes(prev => prev.map(item => item.id === t.id ? { ...item, basePricePerSqFt: Number(e.target.value) || 0 } : item))}
                    className="w-24 h-9 text-xs font-mono font-bold text-right"
                  />
                  <Button 
                    onClick={() => handleUpdateTypePrice(t.id, t.basePricePerSqFt)}
                    disabled={saving}
                    className="bg-slate-900 text-white font-bold h-9 text-[10px] uppercase tracking-wider px-3 cursor-pointer"
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Series modifiers */}
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider">2. Profile Series Cost Addons</CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-400">Additional charge per sq. ft. based on sliding tracks and wall thickness.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {seriesList.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <span className="font-bold text-slate-950 capitalize">{s.name}</span>
                  <span className="text-[9px] text-slate-400 block uppercase font-mono">Thk: {s.thickness} | {s.family}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={s.priceModifierPerSqFt}
                    onChange={(e) => setSeriesList(prev => prev.map(item => item.id === s.id ? { ...item, priceModifierPerSqFt: Number(e.target.value) || 0 } : item))}
                    className="w-24 h-9 text-xs font-mono font-bold text-right"
                  />
                  <Button 
                    onClick={() => handleUpdateSeriesPrice(s.id, s.priceModifierPerSqFt)}
                    disabled={saving}
                    className="bg-slate-900 text-white font-bold h-9 text-[10px] uppercase tracking-wider px-3 cursor-pointer"
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Colors Foil Multipliers */}
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider">3. Profile Color Multipliers</CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-400">Ratio multipliers applied to frames total price (1.0 = Base, 1.3 = +30%).</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {colors.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full border border-slate-200" style={{ backgroundColor: c.hex }} />
                  <div>
                    <span className="font-bold text-slate-950 capitalize">{c.name}</span>
                    <span className="text-[9px] text-slate-400 block uppercase font-mono">{c.isWoodGrain ? 'Wood grain foil' : 'Plain Foil'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.05"
                    value={c.priceMultiplier}
                    onChange={(e) => setColors(prev => prev.map(item => item.id === c.id ? { ...item, priceMultiplier: Number(e.target.value) || 1 } : item))}
                    className="w-24 h-9 text-xs font-mono font-bold text-right"
                  />
                  <Button 
                    onClick={() => handleUpdateColorMultiplier(c.id, c.priceMultiplier)}
                    disabled={saving}
                    className="bg-slate-900 text-white font-bold h-9 text-[10px] uppercase tracking-wider px-3 cursor-pointer"
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Glass, Mesh and Hardware modifiers */}
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider">4. Glass / Glazing Addons</CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-400">Glazing surcharge addon per sq. ft.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {glass.map((g) => (
              <div key={g.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <span className="font-bold text-slate-950 capitalize">{g.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={g.priceModifierPerSqFt}
                    onChange={(e) => setGlass(prev => prev.map(item => item.id === g.id ? { ...item, priceModifierPerSqFt: Number(e.target.value) || 0 } : item))}
                    className="w-24 h-9 text-xs font-mono font-bold text-right"
                  />
                  <Button 
                    onClick={() => handleUpdateGlassPrice(g.id, g.priceModifierPerSqFt)}
                    disabled={saving}
                    className="bg-slate-900 text-white font-bold h-9 text-[10px] uppercase tracking-wider px-3 cursor-pointer"
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mesh Screen Modifiers */}
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider">5. Mosquito Mesh Addons</CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-400">Insect mesh screen surcharge per sq. ft.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {mesh.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <span className="font-bold text-slate-950 capitalize">{m.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={m.priceModifierPerSqFt}
                    onChange={(e) => setMesh(prev => prev.map(item => item.id === m.id ? { ...item, priceModifierPerSqFt: Number(e.target.value) || 0 } : item))}
                    className="w-24 h-9 text-xs font-mono font-bold text-right"
                  />
                  <Button 
                    onClick={() => handleUpdateMeshPrice(m.id, m.priceModifierPerSqFt)}
                    disabled={saving}
                    className="bg-slate-900 text-white font-bold h-9 text-[10px] uppercase tracking-wider px-3 cursor-pointer"
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Locking Hardware Accessories Modifiers */}
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider">6. Locking Hardware Unit Price Addons</CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-400">Flat rate surcharge added per window/door unit for multi-point locks and handles.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {hardware.map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <span className="font-bold text-slate-950 capitalize">{h.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={h.priceModifierPerUnit}
                    onChange={(e) => setHardware(prev => prev.map(item => item.id === h.id ? { ...item, priceModifierPerUnit: Number(e.target.value) || 0 } : item))}
                    className="w-24 h-9 text-xs font-mono font-bold text-right"
                  />
                  <Button 
                    onClick={() => handleUpdateHardwarePrice(h.id, h.priceModifierPerUnit)}
                    disabled={saving}
                    className="bg-slate-900 text-white font-bold h-9 text-[10px] uppercase tracking-wider px-3 cursor-pointer"
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
