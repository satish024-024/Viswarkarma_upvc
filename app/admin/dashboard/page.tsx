"use client";

import React, { useEffect, useState } from 'react';
import { getQuoteRequests, getProjects, getTestimonials, DbLead } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Inbox, Briefcase, MessageSquare, Calendar } from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function AdminDashboard() {
  const [leads, setLeads] = useState<DbLead[]>([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedLeads, fetchedProjects, fetchedTestimonials] = await Promise.all([
          getQuoteRequests(),
          getProjects(),
          getTestimonials()
        ]);
        setLeads(fetchedLeads);
        setProjectsCount(fetchedProjects.length);
        setTestimonialsCount(fetchedTestimonials.length);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const newLeadsCount = leads.filter(l => l.status === 'new').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 w-1/4 rounded-md animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Dashboard Overview</h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">Real-time status of your enquiries and site data.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enquiries / Leads</span>
            <Inbox className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-slate-900">{leads.length}</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">
              {newLeadsCount} new requests waiting for callback
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Showcased Projects</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-slate-900">{projectsCount}</div>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Active on public portfolio</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Client Testimonials</span>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-slate-900">{testimonialsCount}</div>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Trust indicators displayed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent leads list */}
      <Card className="border border-slate-200 bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span>Recent Leads & Custom Configurator Enquiries</span>
            {newLeadsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-[9px] text-red-800 font-bold uppercase">
                {newLeadsCount} Action Required
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {leads.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-500">No quote requests submitted yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/30 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-950">{lead.customer_name}</span>
                      <span className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase tracking-wider ${
                        lead.status === 'new'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : lead.status === 'contacted'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">
                      {lead.city_area} • {lead.phone}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      System: {lead.product_family === 'upvc' ? 'uPVC' : 'Aluminium'} • {lead.width} × {lead.height} ft
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto text-xs font-bold text-slate-900">
                    <div className="text-right">
                      {formatINR(lead.estimate_low)} - {formatINR(lead.estimate_high)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
