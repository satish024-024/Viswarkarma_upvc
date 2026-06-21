"use client";

import React, { useEffect, useState } from 'react';
import { 
  getProductTypes, 
  getProductSeries, 
  getColorOptions, 
  getGlassOptions, 
  getMeshOptions, 
  getHardwareOptions,
  createProductType,
  updateProductType,
  deleteProductType,
  createColorOption,
  updateColorOption,
  deleteColorOption,
  createGlassOption,
  updateGlassOption,
  deleteGlassOption,
  createMeshOption,
  updateMeshOption,
  deleteMeshOption,
  createProductSeries,
  updateProductSeries,
  deleteProductSeries,
  createHardwareOption,
  updateHardwareOption,
  deleteHardwareOption
} from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2, X, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { ProductType, ProductSeries, ColorOption, GlassOption, MeshOption, HardwareOption } from '@/features/configurator/types';

export default function AdminConfigurator() {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [seriesList, setSeriesList] = useState<ProductSeries[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [glass, setGlass] = useState<GlassOption[]>([]);
  const [mesh, setMesh] = useState<MeshOption[]>([]);
  const [hardware, setHardware] = useState<HardwareOption[]>([]);
  
  const [activeTab, setActiveTab] = useState<'styles' | 'colors' | 'glass' | 'mesh' | 'series' | 'hardware'>('styles');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Modal Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form input states
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formFamily, setFormFamily] = useState<'upvc' | 'aluminium'>('upvc');
  const [formDescription, setFormDescription] = useState('');
  const [formBasePrice, setFormBasePrice] = useState(0);
  const [formPriceModifier, setFormPriceModifier] = useState(0);
  const [formPriceMultiplier, setFormPriceMultiplier] = useState(1.0);
  const [formHex, setFormHex] = useState('#ffffff');
  const [formIsWoodGrain, setFormIsWoodGrain] = useState(false);
  const [formThickness, setFormThickness] = useState('');
  const [formSupportedSeries, setFormSupportedSeries] = useState<string[]>([]);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formStatus, setFormStatus] = useState('active');
  const [formSortOrder, setFormSortOrder] = useState(0);

  const loadAllData = async () => {
    setLoading(true);
    const [dbTypes, dbSeries, dbColors, dbGlass, dbMesh, dbHardware] = await Promise.all([
      getProductTypes(false),
      getProductSeries(false),
      getColorOptions(false),
      getGlassOptions(false),
      getMeshOptions(false),
      getHardwareOptions(false)
    ]);
    setTypes(dbTypes);
    setSeriesList(dbSeries);
    setColors(dbColors);
    setGlass(dbGlass);
    setMesh(dbMesh);
    setHardware(dbHardware);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormId('');
    setFormName('');
    setFormFamily('upvc');
    setFormDescription('');
    setFormBasePrice(0);
    setFormPriceModifier(0);
    setFormPriceMultiplier(1.0);
    setFormHex('#ffffff');
    setFormIsWoodGrain(false);
    setFormThickness('');
    setFormSupportedSeries([]);
    setFormImageUrl('');
    setFormStatus('active');
    setFormSortOrder(0);
    setEditorOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setFormId(item.id);
    setFormName(item.name || '');
    setFormFamily(item.family || 'upvc');
    setFormDescription(item.description || '');
    setFormBasePrice(item.basePricePerSqFt || 0);
    setFormPriceModifier(item.priceModifierPerSqFt || item.priceModifierPerUnit || 0);
    setFormPriceMultiplier(item.priceMultiplier || 1.0);
    setFormHex(item.hex || '#ffffff');
    setFormIsWoodGrain(!!item.isWoodGrain);
    setFormThickness(item.thickness || '');
    setFormSupportedSeries(item.supportedSeries || []);
    setFormImageUrl(item.image || '');
    setFormStatus(item.status || 'active');
    setFormSortOrder(item.sortOrder || 0);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this option? This action cannot be undone.")) return;
    setSaving(true);
    try {
      if (activeTab === 'styles') {
        await deleteProductType(id);
      } else if (activeTab === 'colors') {
        await deleteColorOption(id);
      } else if (activeTab === 'glass') {
        await deleteGlassOption(id);
      } else if (activeTab === 'mesh') {
        await deleteMeshOption(id);
      } else if (activeTab === 'series') {
        await deleteProductSeries(id);
      } else if (activeTab === 'hardware') {
        await deleteHardwareOption(id);
      }
      loadAllData();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim() || !formName.trim()) {
      setError('Please provide both a unique ID and a Name.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (activeTab === 'styles') {
        const payload = {
          id: formId.trim(),
          name: formName.trim(),
          family: formFamily,
          description: formDescription.trim(),
          basePricePerSqFt: Number(formBasePrice) || 0,
          supportedSeries: formSupportedSeries,
          image: formImageUrl.trim(),
          status: formStatus,
          sortOrder: Number(formSortOrder) || 0
        };
        if (editingId) {
          await updateProductType(editingId, payload);
        } else {
          await createProductType(payload);
        }
      } else if (activeTab === 'colors') {
        const payload = {
          id: formId.trim(),
          name: formName.trim(),
          hex: formHex.trim(),
          priceMultiplier: Number(formPriceMultiplier) || 1.0,
          description: formDescription.trim(),
          isWoodGrain: formIsWoodGrain,
          family: formFamily,
          status: formStatus,
          sortOrder: Number(formSortOrder) || 0
        };
        if (editingId) {
          await updateColorOption(editingId, payload);
        } else {
          await createColorOption(payload);
        }
      } else if (activeTab === 'glass') {
        const payload = {
          id: formId.trim(),
          name: formName.trim(),
          description: formDescription.trim(),
          priceModifierPerSqFt: Number(formPriceModifier) || 0,
          family: formFamily,
          status: formStatus,
          sortOrder: Number(formSortOrder) || 0
        };
        if (editingId) {
          await updateGlassOption(editingId, payload);
        } else {
          await createGlassOption(payload);
        }
      } else if (activeTab === 'mesh') {
        const payload = {
          id: formId.trim(),
          name: formName.trim(),
          description: formDescription.trim(),
          priceModifierPerSqFt: Number(formPriceModifier) || 0,
          family: formFamily,
          status: formStatus,
          sortOrder: Number(formSortOrder) || 0
        };
        if (editingId) {
          await updateMeshOption(editingId, payload);
        } else {
          await createMeshOption(payload);
        }
      } else if (activeTab === 'series') {
        const payload = {
          id: formId.trim(),
          name: formName.trim(),
          family: formFamily,
          description: formDescription.trim(),
          thickness: formThickness.trim(),
          priceModifierPerSqFt: Number(formPriceModifier) || 0,
          status: formStatus,
          sortOrder: Number(formSortOrder) || 0
        };
        if (editingId) {
          await updateProductSeries(editingId, payload);
        } else {
          await createProductSeries(payload);
        }
      } else if (activeTab === 'hardware') {
        const payload = {
          id: formId.trim(),
          name: formName.trim(),
          description: formDescription.trim(),
          priceModifierPerUnit: Number(formPriceModifier) || 0,
          status: formStatus,
          sortOrder: Number(formSortOrder) || 0
        };
        if (editingId) {
          await updateHardwareOption(editingId, payload);
        } else {
          await createHardwareOption(payload);
        }
      }

      setSuccess(true);
      setEditorOpen(false);
      setTimeout(() => setSuccess(false), 3000);
      loadAllData();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: any, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'draft' : 'active';
    try {
      if (activeTab === 'styles') {
        await updateProductType(item.id, { status: nextStatus });
      } else if (activeTab === 'colors') {
        await updateColorOption(item.id, { status: nextStatus });
      } else if (activeTab === 'glass') {
        await updateGlassOption(item.id, { status: nextStatus });
      } else if (activeTab === 'mesh') {
        await updateMeshOption(item.id, { status: nextStatus });
      } else if (activeTab === 'series') {
        await updateProductSeries(item.id, { status: nextStatus });
      } else if (activeTab === 'hardware') {
        await updateHardwareOption(item.id, { status: nextStatus });
      }
      loadAllData();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const tabs = [
    { id: 'styles', label: 'Window Styles' },
    { id: 'colors', label: 'Colours / Finishes' },
    { id: 'glass', label: 'Glass Glazing' },
    { id: 'mesh', label: 'Mosquito Mesh' },
    { id: 'series', label: 'Profile Series' },
    { id: 'hardware', label: 'Locking Hardware' },
  ] as const;

  const currentTabLabel = tabs.find(t => t.id === activeTab)?.label || '';

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Estimator Options Management</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Manage styles, prices, and options for the whole-home cost calculator.</p>
        </div>
        <Button onClick={handleOpenNew} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 text-xs uppercase tracking-wider gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Add {currentTabLabel.replace(/s$/, '')}
        </Button>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold max-w-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Option saved successfully! Configurator updated immediately.</span>
        </div>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setEditorOpen(false);
            }}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-slate-900 text-slate-950 bg-slate-50'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading options</span>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="border border-slate-200 bg-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-800">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    {activeTab === 'styles' && (
                      <tr>
                        <th className="px-5 py-3">Preview</th>
                        <th className="px-5 py-3">Name / ID</th>
                        <th className="px-5 py-3">System</th>
                        <th className="px-5 py-3">Base Price</th>
                        <th className="px-5 py-3">Series</th>
                        <th className="px-5 py-3">Sort</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    )}
                    {activeTab === 'colors' && (
                      <tr>
                        <th className="px-5 py-3">Swatch</th>
                        <th className="px-5 py-3">Name / ID</th>
                        <th className="px-5 py-3">System</th>
                        <th className="px-5 py-3">Multiplier</th>
                        <th className="px-5 py-3">Type</th>
                        <th className="px-5 py-3">Sort</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    )}
                    {(activeTab === 'glass' || activeTab === 'mesh') && (
                      <tr>
                        <th className="px-5 py-3">Name / ID</th>
                        <th className="px-5 py-3">System</th>
                        <th className="px-5 py-3">Price Modifier</th>
                        <th className="px-5 py-3">Description</th>
                        <th className="px-5 py-3">Sort</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    )}
                    {activeTab === 'series' && (
                      <tr>
                        <th className="px-5 py-3">Name / ID</th>
                        <th className="px-5 py-3">System</th>
                        <th className="px-5 py-3">Thickness</th>
                        <th className="px-5 py-3">Price Modifier</th>
                        <th className="px-5 py-3">Sort</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    )}
                    {activeTab === 'hardware' && (
                      <tr>
                        <th className="px-5 py-3">Name / ID</th>
                        <th className="px-5 py-3">Price Modifier</th>
                        <th className="px-5 py-3">Description</th>
                        <th className="px-5 py-3">Sort</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {/* Render Tab Styles */}
                    {activeTab === 'styles' && types.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-4">
                          <div className="relative w-12 h-10 rounded border border-slate-200 bg-slate-50 overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                            ) : (
                              <span className="text-[8px] font-bold text-slate-400 absolute inset-0 flex items-center justify-center">NONE</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-950">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.id}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700">{item.family}</span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-950">₹{item.basePricePerSqFt}/sq.ft</td>
                        <td className="px-5 py-4 text-[10px] max-w-[200px] truncate" title={item.supportedSeries.join(', ')}>
                          {item.supportedSeries.join(', ') || 'None'}
                        </td>
                        <td className="px-5 py-4 font-mono text-[10px]">{item.sortOrder ?? 0}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleToggleStatus(item, item.status || 'active')} className="cursor-pointer group flex items-center gap-1.5">
                            {item.status === 'active' ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                <Eye className="w-3 h-3 text-emerald-500" /> Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                <EyeOff className="w-3 h-3 text-slate-400" /> Draft / Hidden
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button size="sm" onClick={() => handleOpenEdit(item)} className="w-7 h-7 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" onClick={() => handleDelete(item.id)} className="w-7 h-7 bg-slate-50 hover:bg-red-50 text-red-600 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Render Tab Colors */}
                    {activeTab === 'colors' && colors.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-4">
                          <div className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: item.hex }} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-950">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.id}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700">{item.family || 'both'}</span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-950">{item.priceMultiplier}x</td>
                        <td className="px-5 py-4 text-[10px]">
                          {item.isWoodGrain ? 'Wood Grain' : 'Solid Foil'}
                        </td>
                        <td className="px-5 py-4 font-mono text-[10px]">{item.sortOrder ?? 0}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleToggleStatus(item, item.status || 'active')} className="cursor-pointer group flex items-center gap-1.5">
                            {item.status === 'active' ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                <Eye className="w-3 h-3 text-emerald-500" /> Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                <EyeOff className="w-3 h-3 text-slate-400" /> Draft / Hidden
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button size="sm" onClick={() => handleOpenEdit(item)} className="w-7 h-7 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" onClick={() => handleDelete(item.id)} className="w-7 h-7 bg-slate-50 hover:bg-red-50 text-red-600 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Render Tab Glass & Mesh */}
                    {(activeTab === 'glass' || activeTab === 'mesh') && (activeTab === 'glass' ? glass : mesh).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-950">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.id}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700">{item.family || 'both'}</span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-950">
                          {item.priceModifierPerSqFt > 0 ? `+₹${item.priceModifierPerSqFt}/sq.ft` : '₹0 (Included)'}
                        </td>
                        <td className="px-5 py-4 text-[11px] text-slate-500 font-normal max-w-sm truncate" title={item.description}>
                          {item.description}
                        </td>
                        <td className="px-5 py-4 font-mono text-[10px]">{item.sortOrder ?? 0}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleToggleStatus(item, item.status || 'active')} className="cursor-pointer group flex items-center gap-1.5">
                            {item.status === 'active' ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                <Eye className="w-3 h-3 text-emerald-500" /> Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                <EyeOff className="w-3 h-3 text-slate-400" /> Draft / Hidden
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button size="sm" onClick={() => handleOpenEdit(item)} className="w-7 h-7 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" onClick={() => handleDelete(item.id)} className="w-7 h-7 bg-slate-50 hover:bg-red-50 text-red-600 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Render Tab Series */}
                    {activeTab === 'series' && seriesList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-950">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.id}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-700">{item.family}</span>
                        </td>
                        <td className="px-5 py-4 font-mono">{item.thickness}</td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-950">
                          {item.priceModifierPerSqFt > 0 ? `+₹${item.priceModifierPerSqFt}/sq.ft` : '₹0 (Standard)'}
                        </td>
                        <td className="px-5 py-4 font-mono text-[10px]">{item.sortOrder ?? 0}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleToggleStatus(item, item.status || 'active')} className="cursor-pointer group flex items-center gap-1.5">
                            {item.status === 'active' ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                <Eye className="w-3 h-3 text-emerald-500" /> Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                <EyeOff className="w-3 h-3 text-slate-400" /> Draft / Hidden
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button size="sm" onClick={() => handleOpenEdit(item)} className="w-7 h-7 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" onClick={() => handleDelete(item.id)} className="w-7 h-7 bg-slate-50 hover:bg-red-50 text-red-600 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Render Tab Hardware */}
                    {activeTab === 'hardware' && hardware.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-950">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.id}</div>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-950">
                          {item.priceModifierPerUnit > 0 ? `+₹${item.priceModifierPerUnit}/unit` : '₹0 (Included)'}
                        </td>
                        <td className="px-5 py-4 text-[11px] text-slate-500 font-normal max-w-sm truncate" title={item.description}>
                          {item.description}
                        </td>
                        <td className="px-5 py-4 font-mono text-[10px]">{item.sortOrder ?? 0}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleToggleStatus(item, item.status || 'active')} className="cursor-pointer group flex items-center gap-1.5">
                            {item.status === 'active' ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                <Eye className="w-3 h-3 text-emerald-500" /> Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                <EyeOff className="w-3 h-3 text-slate-400" /> Draft / Hidden
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button size="sm" onClick={() => handleOpenEdit(item)} className="w-7 h-7 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" onClick={() => handleDelete(item.id)} className="w-7 h-7 bg-slate-50 hover:bg-red-50 text-red-600 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Slide-over or Modal form Editor */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-lg w-full max-w-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase">
                {editingId ? `Edit ${currentTabLabel.replace(/s$/, '')}` : `Add New ${currentTabLabel.replace(/s$/, '')}`}
              </h3>
              <button onClick={() => setEditorOpen(false)} className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Unique ID field */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Unique Option ID *</label>
                <Input
                  placeholder="e.g. frosted_privacy"
                  value={formId}
                  onChange={e => setFormId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  disabled={!!editingId}
                  required
                  className="h-9 text-xs"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Lowercase letters, numbers, hyphens, and underscores only. Cannot be changed later.</span>
              </div>

              {/* Name field */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Name *</label>
                <Input
                  placeholder="e.g. 6mm Frosted Privacy Glass"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>

              {/* System Family selector (Styles, Colors, Glass, Mesh, Series) */}
              {activeTab !== 'hardware' && (
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">System Type *</label>
                  <select
                    value={formFamily}
                    onChange={e => setFormFamily(e.target.value as any)}
                    className="w-full h-9 px-3 border border-slate-200 rounded-md bg-white text-xs focus:ring-slate-900 font-semibold"
                  >
                    <option value="upvc">uPVC Systems</option>
                    <option value="aluminium">Aluminium Systems</option>
                  </select>
                </div>
              )}

              {/* Description field */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Description</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Provide a detailed English description shown to customer."
                  className="w-full min-h-[64px] border border-slate-200 rounded-md p-3 text-xs focus:ring-slate-900 font-semibold"
                />
              </div>

              {/* Pricing values depending on tab */}
              {activeTab === 'styles' && (
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Base Price (INR per sq.ft.)</label>
                  <Input
                    type="number"
                    value={formBasePrice}
                    onChange={e => setFormBasePrice(Number(e.target.value) || 0)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Price Multiplier (e.g. 1.25)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formPriceMultiplier}
                      onChange={e => setFormPriceMultiplier(Number(e.target.value) || 1.0)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Hex Color Code</label>
                    <div className="flex gap-2">
                      <Input
                        value={formHex}
                        onChange={e => setFormHex(e.target.value)}
                        required
                        className="h-9 text-xs font-mono"
                      />
                      <input
                        type="color"
                        value={formHex.startsWith('#') && formHex.length === 7 ? formHex : '#ffffff'}
                        onChange={e => setFormHex(e.target.value)}
                        className="w-9 h-9 border border-slate-200 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="woodGrain"
                    checked={formIsWoodGrain}
                    onChange={e => setFormIsWoodGrain(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900"
                  />
                  <label htmlFor="woodGrain" className="text-[11px] font-bold text-slate-700 cursor-pointer">This is a wood grain texture foil</label>
                </div>
              )}

              {(activeTab === 'glass' || activeTab === 'mesh' || activeTab === 'series') && (
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Price Surcharge / Addon (INR per sq.ft.)</label>
                  <Input
                    type="number"
                    value={formPriceModifier}
                    onChange={e => setFormPriceModifier(Number(e.target.value) || 0)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              )}

              {activeTab === 'hardware' && (
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Locking Surcharge (INR flat rate per window unit)</label>
                  <Input
                    type="number"
                    value={formPriceModifier}
                    onChange={e => setFormPriceModifier(Number(e.target.value) || 0)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              )}

              {activeTab === 'series' && (
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Frame Thickness (e.g. 60mm)</label>
                  <Input
                    placeholder="e.g. 88mm"
                    value={formThickness}
                    onChange={e => setFormThickness(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              )}

              {/* Image URL (only for Styles) */}
              {activeTab === 'styles' && (
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Style Preview Image URL</label>
                  <Input
                    placeholder="https://..."
                    value={formImageUrl}
                    onChange={e => setFormImageUrl(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              )}

              {/* Supported Series checkboxes (only for Styles) */}
              {activeTab === 'styles' && (
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5">Supported Profile Series</label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded border border-slate-200">
                    {seriesList
                      .filter(s => s.family === formFamily)
                      .map(ser => {
                        const isChecked = formSupportedSeries.includes(ser.id);
                        return (
                          <div key={ser.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`s-${ser.id}`}
                              checked={isChecked}
                              onChange={() => {
                                setFormSupportedSeries(prev => 
                                  isChecked 
                                    ? prev.filter(id => id !== ser.id) 
                                    : [...prev, ser.id]
                                );
                              }}
                              className="w-3.5 h-3.5 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                            />
                            <label htmlFor={`s-${ser.id}`} className="text-[10px] font-bold text-slate-700 cursor-pointer truncate">
                              {ser.name} ({ser.thickness})
                            </label>
                          </div>
                        );
                      })}
                    {seriesList.filter(s => s.family === formFamily).length === 0 && (
                      <span className="text-[10px] text-slate-400 font-bold block col-span-2">No profile series defined for {formFamily} family.</span>
                    )}
                  </div>
                </div>
              )}

              {/* Status and Sort Order fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full h-9 px-3 border border-slate-200 rounded-md bg-white text-xs focus:ring-slate-900 font-semibold"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Sort Order</label>
                  <Input
                    type="number"
                    value={formSortOrder}
                    onChange={e => setFormSortOrder(Number(e.target.value) || 0)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Submit buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <Button type="button" variant="secondary" onClick={() => setEditorOpen(false)} className="h-9 text-xs font-bold uppercase tracking-wider border border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 text-xs uppercase tracking-wider">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
