"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Inbox, 
  Settings, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  Sliders, 
  LogOut,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

function SidebarItem({ href, icon, label, active, onClick }: SidebarItemProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
        active 
          ? 'bg-slate-900 text-white' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, loading, role, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If Supabase client isn't available, we run in static demo bypass mode
  const isDemoMode = !supabase;

  // Auth guard routing
  useEffect(() => {
    if (loading) return;

    const isAuthorized = isAdmin || (isDemoMode && session?.user?.email === 'admin@Viswakarmaupvc.com');

    if (!session) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('Viswakarma_auth_redirect', pathname);
        sessionStorage.setItem('Viswakarma_trigger_login', 'true');
      }
      router.push('/');
    } else if (session && !isAuthorized) {
      handleLogout();
    } else if (session && pathname === '/admin/login') {
      router.push('/admin/dashboard');
    }
  }, [session, loading, role, isAdmin, pathname, router, isDemoMode]);

  const handleLogout = async () => {
    if (isDemoMode) {
      localStorage.removeItem('Viswakarma_mock_admin_session');
      window.location.href = '/';
      return;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('Viswakarma_auth_error', 'unauthorized');
    }
    await supabase!.auth.signOut();
    router.push('/');
  };

  const navItems = [
    { href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { href: '/admin/leads', icon: <Inbox className="w-4 h-4" />, label: 'Leads / Enquiries' },
    { href: '/admin/settings', icon: <Settings className="w-4 h-4" />, label: 'Business Settings' },
    { href: '/admin/services', icon: <FileText className="w-4 h-4" />, label: 'Services' },
    { href: '/admin/projects', icon: <Briefcase className="w-4 h-4" />, label: 'Projects' },
    { href: '/admin/testimonials', icon: <MessageSquare className="w-4 h-4" />, label: 'Testimonials' },
    { href: '/admin/faqs', icon: <HelpCircle className="w-4 h-4" />, label: 'FAQs' },
    { href: '/admin/configurator', icon: <Sliders className="w-4 h-4" />, label: 'Configurator' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Session</span>
        </div>
      </div>
    );
  }

  // If not logged in and on login page, just show children
  if (!session && pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  // If not logged in and not on login page, show nothing while we redirect
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 space-y-8 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-base font-black tracking-tight text-slate-950 uppercase">Viswakarma</h1>
            <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-[9px] font-bold text-slate-600 uppercase">Admin</span>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold truncate mb-3">{session.user?.email}</p>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => window.open('/', '_blank')}
            className="w-full justify-center gap-2 font-bold text-xs border-slate-200 text-slate-700 hover:bg-slate-50 h-8 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Website</span>
          </Button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
              onClick={() => router.push(item.href)}
            />
          ))}
        </nav>

        <div className="pt-4 border-t border-slate-200">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3 font-semibold text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 md:hidden flex" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 bg-white p-6 flex flex-col space-y-8 h-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-base font-black tracking-tight text-slate-950 uppercase">Viswakarma</h1>
                <p className="text-[10px] text-slate-500 font-semibold truncate mb-1">{session.user?.email}</p>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => { setSidebarOpen(false); window.open('/', '_blank'); }}
              className="w-full justify-center gap-2 font-bold text-xs border-slate-200 text-slate-700 hover:bg-slate-50 h-8 cursor-pointer mt-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Website</span>
            </Button>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.href}
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push(item.href);
                  }}
                />
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-200">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3 font-semibold text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Unified Header */}
        <header className="h-14 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden p-1.5 -ml-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-tight text-slate-900 uppercase hidden md:block">Viswakarma Admin</h1>
              <h1 className="text-sm font-black tracking-tight text-slate-950 uppercase md:hidden">Viswakarma</h1>
              <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-[8px] font-bold text-slate-600 uppercase tracking-wider">Console</span>
            </div>
          </div>

          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-1.5 font-bold text-xs border-slate-200 text-slate-700 hover:bg-slate-50 h-8 px-3 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>Open Website</span>
          </Button>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
