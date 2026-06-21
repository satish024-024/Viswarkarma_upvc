"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { businessSettings } from '@/lib/data/business';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    {
      name: 'uPVC Systems',
      href: '/upvc',
      submenu: [
        { name: 'Overview', href: '/upvc' },
        { name: 'uPVC Windows', href: '/upvc/windows' },
        { name: 'uPVC Doors', href: '/upvc/doors' },
        { name: 'Configurator', href: '/upvc/configurator' },
      ]
    },
    {
      name: 'Aluminium Systems',
      href: '/aluminium',
      submenu: [
        { name: 'Overview', href: '/aluminium' },
        { name: 'Aluminium Windows', href: '/aluminium/windows' },
        { name: 'Aluminium Doors', href: '/aluminium/doors' },
        { name: 'Configurator', href: '/aluminium/configurator' },
      ]
    },
    { name: 'Mosquito Mesh', href: '/mesh/mosquito-mesh' },
    {
      name: 'Architectural Glass',
      href: '#',
      submenu: [
        { name: 'Glass Railing', href: '/glass-railing' },
        { name: 'Elevation Glass', href: '/elevation-work' },
      ]
    },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (href: string) => {
    if (href === '/' && pathname !== '/') return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Title */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold transition-transform duration-300 group-hover:scale-105">
              D
            </div>
            <div>
              <span className="text-base font-bold text-brand-primary block tracking-tight">Daddy</span>
              <span className="text-[10px] font-bold text-brand-secondary block uppercase tracking-wider -mt-1.5">uPVC & Aluminium</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => {
              if (item.submenu) {
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand-primary cursor-pointer py-2 ${
                        item.submenu.some(sub => isActive(sub.href)) ? 'text-brand-primary font-semibold' : 'text-brand-muted'
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 w-48 bg-white border border-brand-border rounded-lg shadow-md py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`block px-4 py-2 text-xs font-medium transition-colors hover:bg-slate-50 ${
                              isActive(sub.href) ? 'text-brand-primary bg-slate-50 font-bold' : 'text-brand-muted'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-brand-primary ${
                    isActive(item.href) ? 'text-brand-primary font-semibold' : 'text-brand-muted'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Key Actions Block (Always visible on desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${businessSettings.phone}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-secondary" />
              <span>Call</span>
            </a>
            
            <a
              href={`https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <Link href="/quote">
              <Button size="sm" className="font-bold flex items-center gap-1 shadow-xs hover:shadow-md">
                Get Estimate
              </Button>
            </Link>
          </div>

          {/* Hamburger trigger for mobile */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Quick call button for mobile */}
            <a
              href={`tel:${businessSettings.phone}`}
              className="p-2 rounded-full border border-brand-border bg-white text-brand-primary shadow-xs hover:bg-slate-50"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full border border-brand-border bg-white text-brand-primary shadow-xs"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer menu */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white border-t border-brand-border pt-20 animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4 h-full overflow-y-auto">
            {navigation.map((item) => {
              if (item.submenu) {
                return (
                  <div key={item.name} className="space-y-1">
                    <span className="block text-xs font-bold text-brand-primary uppercase tracking-wider px-3">
                      {item.name}
                    </span>
                    <div className="pl-4 space-y-1">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={toggleMenu}
                          className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            isActive(sub.href) ? 'text-brand-primary bg-slate-50' : 'text-brand-muted'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={toggleMenu}
                  className={`block px-3 py-2 rounded-lg text-base font-bold transition-colors ${
                    isActive(item.href) ? 'text-brand-primary bg-slate-50' : 'text-brand-muted'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile CTAs */}
            <div className="pt-6 border-t border-brand-border space-y-3">
              <a
                href={`tel:${businessSettings.phone}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-brand-border text-brand-primary font-bold bg-white text-sm"
              >
                <Phone className="w-4 h-4 text-brand-secondary" /> Call Specialist
              </a>
              <a
                href={`https://wa.me/${businessSettings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-emerald-200 text-emerald-700 font-bold bg-emerald-50 text-sm"
              >
                <MessageSquare className="w-4 h-4" /> Message on WhatsApp
              </a>
              <Link href="/quote" onClick={toggleMenu} className="block">
                <Button className="w-full py-3 text-sm font-bold bg-brand-primary hover:bg-brand-primary-hover">
                  Open Price Configurator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
