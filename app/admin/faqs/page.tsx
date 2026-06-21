"use client";

import React, { useEffect, useState } from 'react';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2, X, HelpCircle } from 'lucide-react';
import { FAQ } from '@/types/entities';

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);

  // Form states
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<'general' | 'upvc' | 'aluminium' | 'mesh' | 'glass' | 'installation'>('general');

  const loadData = async () => {
    setLoading(true);
    const data = await getFaqs();
    setFaqs(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getFaqs();
      if (active) {
        setFaqs(data);
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const openNew = () => {
    setEditingItem(null);
    setQuestion('');
    setAnswer('');
    setCategory('general');
    setEditorOpen(true);
  };

  const openEdit = (item: FAQ) => {
    setEditingItem(item);
    setQuestion(item.question);
    setAnswer(item.answer);
    setCategory(item.category);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    const { error } = await deleteFaq(id);
    if (!error) {
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    const payload = {
      question,
      answer,
      category,
      status: 'active',
      sort_order: 0
    };

    if (editingItem) {
      const { error } = await updateFaq(editingItem.id, payload);
      if (!error) {
        setEditorOpen(false);
        loadData();
      }
    } else {
      const { error } = await createFaq(payload);
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
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Manage FAQs</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Add or update frequently asked questions shown on the public site.</p>
        </div>
        <Button onClick={openNew} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 text-xs uppercase tracking-wider gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Add FAQ
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading FAQs</span>
        </div>
      ) : faqs.length === 0 ? (
        <div className="p-12 text-center border border-slate-200 bg-white rounded-lg">
          <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500">No FAQs added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((item) => (
            <Card key={item.id} className="border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-colors">
              <CardContent className="p-5 flex justify-between items-start gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded-sm">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-950 text-sm">{item.question}</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">{item.answer}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <Button size="sm" onClick={() => openEdit(item)} className="w-7 h-7 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" onClick={() => handleDelete(item.id)} className="w-7 h-7 bg-slate-50 hover:bg-red-50 text-red-600 rounded-md border border-slate-200 cursor-pointer p-0 flex items-center justify-center">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
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
                {editingItem ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button onClick={() => setEditorOpen(false)} className="p-1 rounded hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs font-semibold text-slate-800">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">FAQ Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FAQ['category'])}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs font-semibold bg-white"
                >
                  <option value="general">General Enquiries</option>
                  <option value="installation">Fabrication & Installation</option>
                  <option value="upvc">uPVC Windows & Doors</option>
                  <option value="aluminium">Aluminium Profiles</option>
                  <option value="mesh">Mosquito Mesh</option>
                  <option value="glass">Glass Railings</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Question</label>
                <Input
                  placeholder="e.g. Do you charge extra for site measurements?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="h-10 border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Answer</label>
                <textarea
                  placeholder="Provide a clear, helpful response..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full min-h-[100px] p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>

              <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setEditorOpen(false)} className="h-10 text-xs font-semibold px-5">
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs uppercase tracking-wider px-6 cursor-pointer">
                  {editingItem ? 'Save Changes' : 'Create FAQ'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
