"use client";

import React, { useEffect, useState } from 'react';
import { getQuoteRequests, updateQuoteRequestStatus, deleteQuoteRequest, DbLead } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Inbox, Phone, MapPin, Calendar, Trash2, X } from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function AdminLeads() {
  const [leads, setLeads] = useState<DbLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<DbLead | null>(null);

  const loadLeads = async () => {
    setLoading(true);
    const data = await getQuoteRequests();
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getQuoteRequests();
      if (active) {
        setLeads(data);
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await updateQuoteRequestStatus(id, newStatus);
    if (!error) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    const { error } = await deleteQuoteRequest(id);
    if (!error) {
      setLeads(prev => prev.filter(l => l.id !== id));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(null);
      }
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.city_area.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Enquiries / Leads</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Manage, filter, and review custom calculator submissions.</p>
        </div>
        <Button onClick={loadLeads} variant="secondary" className="text-xs font-semibold h-9">
          Refresh List
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 border border-slate-200 rounded-lg">
        <Input
          placeholder="Search by customer name, phone or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-slate-200 text-xs font-semibold h-9"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 text-xs font-semibold h-9 border-slate-200"
        >
          <option value="all">All Statuses</option>
          <option value="new">New / Unaddressed</option>
          <option value="contacted">Contacted / Quoted</option>
          <option value="completed">Completed / Finalized</option>
          <option value="archived">Archived</option>
        </Select>
      </div>

      {/* Layout Splitter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Leads Table Card */}
        <Card className={`border border-slate-200 bg-white ${selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Enquiries</span>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-500">No leads match search filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-600 uppercase tracking-wider">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Configured Item</th>
                      <th className="p-4 text-right">Estimate Range</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => (
                      <tr 
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                          selectedLead?.id === lead.id ? 'bg-slate-50' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="font-bold text-slate-950">{lead.customer_name}</div>
                          <div className="text-[10px] text-slate-500 font-semibold">{lead.phone}</div>
                        </td>
                        <td className="p-4 text-slate-600 font-semibold">{lead.city_area}</td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-700 capitalize">
                            {lead.product_family} • {lead.product_type.replace(/_/g, ' ')}
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {lead.width}W × {lead.height}H ft | {lead.units} unit(s)
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-slate-900">
                          {formatINR(lead.estimate_low)} - {formatINR(lead.estimate_high)}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase tracking-wider ${
                            lead.status === 'new'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : lead.status === 'contacted'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : lead.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lead Detail Panel */}
        {selectedLead && (
          <Card className="lg:col-span-5 border border-slate-200 bg-white sticky top-6 overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between pb-4">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Enquiry Detail</span>
                <CardTitle className="text-sm font-black text-slate-900 uppercase">
                  {selectedLead.customer_name}
                </CardTitle>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1 rounded hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-xs">
              {/* Contact Block */}
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                  <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-1.5 font-bold text-slate-950 hover:underline">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedLead.phone}</span>
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">City/Area Location</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedLead.city_area}</span>
                  </div>
                </div>
              </div>

              {/* Specs List */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Configuration Details</span>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 font-semibold text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-[9px] font-medium text-slate-400 block uppercase">Product Family</span>
                    <span className="capitalize">{selectedLead.product_family}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-medium text-slate-400 block uppercase">Product Style</span>
                    <span className="capitalize">{selectedLead.product_type.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-medium text-slate-400 block uppercase">Profile Series</span>
                    <span>{selectedLead.series.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-medium text-slate-400 block uppercase">Dimensions (W × H)</span>
                    <span>{selectedLead.width} × {selectedLead.height} feet</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-medium text-slate-400 block uppercase">Quantity</span>
                    <span>{selectedLead.units} Unit(s)</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-medium text-slate-400 block uppercase">Profile Color</span>
                    <span className="capitalize">{selectedLead.colour}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-medium text-slate-400 block uppercase">Glass Type</span>
                    <span>{selectedLead.glass.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-medium text-slate-400 block uppercase">Integrated Mesh</span>
                    <span>{selectedLead.mesh.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-medium text-slate-400 block uppercase">Hardware Accessories</span>
                    <span>{selectedLead.hardware.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-medium text-slate-400 block uppercase">Installation Required</span>
                    <span>{selectedLead.installation_required ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Callback details & creation */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Submitted on: {selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="capitalize">Prefers Callback: {selectedLead.callback_time}</div>
                </div>
              </div>

              {/* Actions Box */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Update Lead Status</span>
                  <Select
                    value={selectedLead.status}
                    onChange={(e) => selectedLead.id && handleStatusChange(selectedLead.id, e.target.value)}
                    className="w-full text-xs font-semibold h-10 border-slate-200"
                  >
                    <option value="new">New / Unaddressed</option>
                    <option value="contacted">Contacted / Quote Sent</option>
                    <option value="completed">Completed / Won</option>
                    <option value="archived">Archived</option>
                  </Select>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => {
                      const msg = `Hello ${selectedLead.customer_name}, regarding your quotation request for ${selectedLead.product_family === 'upvc' ? 'uPVC' : 'Aluminium'} ${selectedLead.product_type.replace(/_/g, ' ')}...`;
                      window.open(`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Chat on WhatsApp
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => selectedLead.id && handleDelete(selectedLead.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50 h-10 px-3 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
