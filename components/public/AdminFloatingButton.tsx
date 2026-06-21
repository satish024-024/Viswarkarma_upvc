"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sliders } from 'lucide-react';

export default function AdminFloatingButton() {
  const { session, isAdmin } = useAuth();

  // Only show the button if the user is authenticated AND has the admin role
  if (!session || !isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-8 md:right-8 animate-fade-in">
      <Link 
        href="/admin/dashboard" 
        className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xl transition-all uppercase tracking-wider border border-slate-800 hover:scale-105"
      >
        <Sliders className="w-3.5 h-3.5 text-gold-light" /> 
        <span>Admin Console</span>
      </Link>
    </div>
  );
}
