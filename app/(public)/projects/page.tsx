"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { projectsList as defaultProjects } from '@/lib/data/business';
import { SystemType } from '@/types/entities';
import { getProjects } from '@/lib/supabase';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<SystemType | 'all'>('all');
  const [projects, setProjects] = useState(defaultProjects);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="py-8 md:py-16 space-y-10 md:space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider block">COMPLETED INSTALLATIONS</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-primary tracking-tight">
          Our Structural Showcase
        </h1>
        <p className="text-sm text-brand-muted leading-relaxed">
          Explore actual customer sites where our specialized in-house team engineered and installed uPVC windows, panoramic aluminium sliding doors, and frameless glass balustrades.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-brand-border pb-4">
        {(['all', 'upvc', 'aluminium', 'glass'] as const).map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter(cat)}
            className="capitalize font-bold cursor-pointer"
          >
            {cat === 'all' ? 'All Systems' : cat === 'upvc' ? 'uPVC' : cat}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="group overflow-hidden border-brand-border flex flex-col justify-between">
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-cream border-b border-brand-border">
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill 
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-[#1C2E40]/85 backdrop-blur-sm text-white text-[9px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                  {project.category}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 space-y-2">
                <h3 className="font-bold text-sm text-brand-primary group-hover:text-brand-secondary transition-colors leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
            
            <div className="p-3.5 pt-2 sm:p-4 sm:pt-2 text-[10px] text-brand-muted border-t border-brand-light mt-2 space-y-1.5 bg-slate-50/50">
              <div className="flex justify-between font-semibold text-brand-primary">
                <span>Location:</span>
                <span>{project.location}</span>
              </div>
              <div className="flex justify-between">
                <span>System Class:</span>
                <span>{project.specs.system}</span>
              </div>
              <div className="flex justify-between">
                <span>Series Width:</span>
                <span>{project.specs.series}</span>
              </div>
              <div className="flex justify-between">
                <span>Glass Specs:</span>
                <span className="truncate max-w-[150px]">{project.specs.glass}</span>
              </div>
              <div className="flex justify-between">
                <span>Frame Color:</span>
                <span>{project.specs.color}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
}
