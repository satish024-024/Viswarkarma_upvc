"use client";

import React, { useEffect, useState } from 'react';
import { getServices, createService, updateService, deleteService } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2, X, FileText } from 'lucide-react';
import { ServiceVertical } from '@/types/entities';

export default function AdminServices() {
  const [services, setServices] = useState<ServiceVertical[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceVertical | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [system, setSystem] = useState<'upvc' | 'aluminium' | 'mesh' | 'glass'>('upvc');
  const [featureInputs, setFeatureInputs] = useState<string[]>(['']);

  const loadData = async () => {
    setLoading(true);
    const data = await getServices();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getServices();
      if (active) {
        setServices(data);
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const openNew = () => {
    setEditingItem(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setSystem('upvc');
    setFeatureInputs(['']);
    setEditorOpen(true);
  };

  const openEdit = (item: ServiceVertical) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setDescription(item.description);
    setSystem(item.system as 'upvc' | 'aluminium' | 'mesh' | 'glass');
    setFeatureInputs(item.features.length > 0 ? [...item.features] : ['']);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    const { error } = await deleteService(id);
    if (!error) {
      loadData();
    }
  };

  const handleAddFeature = () => {
    setFeatureInputs(prev => [...prev, '']);
  };

  const handleFeatureChange = (index: number, val: string) => {
    setFeatureInputs(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveFeature = (index: number) => {
    setFeatureInputs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const activeFeatures = featureInputs.filter(f => f.trim() !== '');
    const activeSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const payload = {
      title,
      slug: activeSlug,
      short_description: description,
      long_description: description,
      category: system,
      feature_points: activeFeatures,
      status: 'active',
      sort_order: 0
    };

    if (editingItem) {
      const { error } = await updateService(editingItem.id, payload);
      if (!error) {
        setEditorOpen(false);
        loadData();
      }
    } else {
      const { error } = await createService(payload);
      if (!error) {
        setEditorOpen(false);
        loadData();
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Manage Services</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Configure service verticals displayed across headers and public pages.</p>
        </div>
        <Button onClick={openNew} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 text-xs uppercase tracking-wider gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Services</span>
        </div>
      ) : services.length === 0 ? (
        <div className="p-12 text-center border border-slate-200 bg-white rounded-lg">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500">No services listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((item) => (
            <Card key={item.id} className="border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded-sm">
                      {item.system}
                    </span>
                    <h3 className="font-bold text-slate-950 text-sm mt-1">{item.title}</h3>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button size="sm" onClick={() => openEdit(item)} className="w-7 h-7 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" onClick={() => handleDelete(item.id)} className="w-7 h-7 bg-slate-50 hover:bg-red-50 text-red-600 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-500 leading-relaxed">{item.description}</p>
                
                {item.features.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Key selling points:</span>
                    <ul className="list-disc list-inside text-[10px] text-slate-600 space-y-0.5 font-semibold">
                      {item.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase">
                {editingItem ? 'Edit Service' : 'Add Service'}
              </h3>
              <button onClick={() => setEditorOpen(false)} className="p-1 rounded hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-semibold text-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Service Title</label>
                  <Input
                    placeholder="e.g. uPVC Sliding Mesh Doors"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10 border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">URL Slug (leave blank to auto-generate)</label>
                  <Input
                    placeholder="e.g. upvc-sliding-mesh"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="h-10 border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">System Category</label>
                <select
                  value={system}
                  onChange={(e) => setSystem(e.target.value as 'upvc' | 'aluminium' | 'mesh' | 'glass')}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-semibold bg-white"
                >
                  <option value="upvc">uPVC System</option>
                  <option value="aluminium">Aluminium System</option>
                  <option value="mesh">Integrated Mesh System</option>
                  <option value="glass">Glass Railings & Structural Work</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Short Description</label>
                <textarea
                  placeholder="Summarize the service offerings, materials, profile configurations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[80px] p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>

              {/* Service Features list */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Bullet Feature Points</label>
                  <button type="button" onClick={handleAddFeature} className="text-[10px] font-bold text-slate-500 hover:text-slate-900 uppercase">
                    + Add Bullet
                  </button>
                </div>
                <div className="space-y-2">
                  {featureInputs.map((feat, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input
                        placeholder={`Feature bullet point #${i + 1}`}
                        value={feat}
                        onChange={(e) => handleFeatureChange(i, e.target.value)}
                        className="h-9 border-slate-200 text-xs font-semibold flex-1"
                      />
                      {featureInputs.length > 1 && (
                        <button type="button" onClick={() => handleRemoveFeature(i)} className="text-red-500 hover:text-red-700 text-xs p-1">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setEditorOpen(false)} className="h-10 text-xs font-semibold px-5">
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs uppercase tracking-wider px-6 cursor-pointer">
                  {editingItem ? 'Save Changes' : 'Create Service'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
