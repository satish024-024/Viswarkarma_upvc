"use client";

import React, { useEffect, useState } from 'react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2, X, MessageSquare, Star } from 'lucide-react';
import { Testimonial } from '@/types/entities';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [relatedService, setRelatedService] = useState('uPVC Sliding Windows');
  const [rating, setRating] = useState(5);

  const loadData = async () => {
    setLoading(true);
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getTestimonials();
      if (active) {
        setTestimonials(data);
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const openNew = () => {
    setEditingItem(null);
    setCustomerName('');
    setLocationName('');
    setTestimonialText('');
    setRelatedService('uPVC Sliding Windows');
    setRating(5);
    setEditorOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingItem(item);
    setCustomerName(item.name);
    setLocationName(item.location);
    setTestimonialText(item.content);
    setRelatedService(item.role);
    setRating(item.rating);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    const { error } = await deleteTestimonial(id);
    if (!error) {
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !testimonialText.trim()) return;

    const payload = {
      customer_name: customerName,
      location_name: locationName,
      testimonial_text: testimonialText,
      related_service: relatedService,
      rating: Number(rating),
      status: 'active',
      sort_order: 0
    };

    if (editingItem) {
      const { error } = await updateTestimonial(editingItem.id, payload);
      if (!error) {
        setEditorOpen(false);
        loadData();
      }
    } else {
      const { error } = await createTestimonial(payload);
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
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Testimonials</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Configure user feedback shown on the landing page.</p>
        </div>
        <Button onClick={openNew} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 text-xs uppercase tracking-wider gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Testimonial
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Testimonials</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 text-center border border-slate-200 bg-white rounded-lg">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500">No testimonials listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <Card key={item.id} className="border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-950 text-sm">{item.name}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">{item.location} • {item.role}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" onClick={() => openEdit(item)} className="w-7 h-7 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" onClick={() => handleDelete(item.id)} className="w-7 h-7 bg-slate-50 hover:bg-red-50 text-red-600 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                
                {/* Rating stars */}
                <div className="flex text-amber-400 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>

                 <p className="text-xs font-semibold text-slate-600 italic">&quot;{item.content}&quot;</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-lg w-full max-w-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase">
                {editingItem ? 'Edit Testimonial' : 'Create Testimonial'}
              </h3>
              <button onClick={() => setEditorOpen(false)} className="p-1 rounded hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs font-semibold text-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Customer Name</label>
                  <Input
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-10 border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Location</label>
                  <Input
                    placeholder="e.g. Prakasam Nagar"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="h-10 border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Service Provided</label>
                  <Input
                    placeholder="e.g. 3-Track Sliding Mesh Window"
                    value={relatedService}
                    onChange={(e) => setRelatedService(e.target.value)}
                    className="h-10 border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Rating (1 to 5 Stars)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-semibold bg-white"
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Below Average</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Testimonial Content</label>
                <textarea
                  placeholder="Paste customer review here..."
                  value={testimonialText}
                  onChange={(e) => setTestimonialText(e.target.value)}
                  className="w-full min-h-[80px] p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>

              <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setEditorOpen(false)} className="h-10 text-xs font-semibold px-5">
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs uppercase tracking-wider px-6 cursor-pointer">
                  {editingItem ? 'Save Changes' : 'Add Testimonial'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
