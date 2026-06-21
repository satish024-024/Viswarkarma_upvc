"use client";

import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Plus, Trash2, Edit2, X, Briefcase } from 'lucide-react';
import { Project } from '@/types/entities';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [serviceType, setServiceType] = useState('uPVC Casement Window');
  const [productFamily, setProductFamily] = useState('upvc');
  const [coverImage, setCoverImage] = useState('');
  const [specsSystem, setSpecsSystem] = useState('');
  const [specsSeries, setSpecsSeries] = useState('');
  const [specsGlass, setSpecsGlass] = useState('');
  const [specsColor, setSpecsColor] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    async function load() {
      const data = await getProjects();
      if (active) {
        setProjects(data);
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const openNewProject = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setLocationName('');
    setServiceType('uPVC Casement Window');
    setProductFamily('upvc');
    setCoverImage('https://5.imimg.com/data5/RU/YJ/HX/SELLER-64612523/upvc-french-door-500x500.jpg');
    setSpecsSystem('Casement Window');
    setSpecsSeries('60mm Outer Frame');
    setSpecsGlass('5mm Single Clear');
    setSpecsColor('White');
    setEditorOpen(true);
  };

  const openEditProject = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setLocationName(project.location);
    setServiceType(project.specs?.system || 'uPVC Window');
    setProductFamily(project.category);
    setCoverImage(project.image);
    setSpecsSystem(project.specs?.system || '');
    setSpecsSeries(project.specs?.series || '');
    setSpecsGlass(project.specs?.glass || '');
    setSpecsColor(project.specs?.color || '');
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this project?")) return;
    const { error } = await deleteProject(id);
    if (!error) {
      loadProjects();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const payload = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description,
      location_name: locationName,
      service_type: serviceType,
      product_family: productFamily,
      cover_image: coverImage,
      gallery_images: [coverImage],
      specs: {
        system: specsSystem,
        series: specsSeries,
        glass: specsGlass,
        color: specsColor
      },
      sort_order: 0,
      status: 'active'
    };

    if (editingProject) {
      const { error } = await updateProject(editingProject.id, payload);
      if (!error) {
        setEditorOpen(false);
        loadProjects();
      }
    } else {
      const { error } = await createProject(payload);
      if (!error) {
        setEditorOpen(false);
        loadProjects();
      }
    }
  };

  // Pre-configured premium images for selection
  const imagePresets = [
    { name: 'uPVC French Door', url: 'https://5.imimg.com/data5/RU/YJ/HX/SELLER-64612523/upvc-french-door-500x500.jpg' },
    { name: 'uPVC Double Door', url: 'https://5.imimg.com/data5/AL/LI/CS/SELLER-64612523/upvc-glass-double-door-500x500.jpg' },
    { name: 'uPVC Top Hung Window', url: 'https://5.imimg.com/data5/PK/AF/KY/SELLER-64612523/upvc-top-hung-window-500x500.jpg' },
    { name: 'Casement Window', url: 'https://5.imimg.com/data5/QR/VY/TK/SELLER-64612523/casement-window-500x500.jpeg' },
    { name: 'Sliding Window', url: 'https://5.imimg.com/data5/SX/YV/YG/SELLER-64612523/upvc-sliding-window-500x500.jpg' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Manage Projects</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Showcase finished window/door installations in the public portfolio.</p>
        </div>
        <Button onClick={openNewProject} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 text-xs uppercase tracking-wider gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Projects</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center border border-slate-200 bg-white rounded-lg">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500">No projects listed yet. Click &quot;Add Project&quot; to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-300 transition-colors flex flex-col">
              <div className="aspect-video relative bg-slate-100 border-b border-slate-100">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://5.imimg.com/data5/RU/YJ/HX/SELLER-64612523/upvc-french-door-500x500.jpg';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <Button
                    size="sm"
                    onClick={() => openEditProject(project)}
                    className="w-7 h-7 bg-white text-slate-700 hover:bg-slate-50 rounded-md border border-slate-200 cursor-pointer shadow-xs p-0 flex items-center justify-center"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="w-7 h-7 bg-white text-red-600 hover:bg-red-50 rounded-md border border-slate-200 cursor-pointer shadow-xs p-0 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{project.category} Systems</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{project.location}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-950 mt-1">{project.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold line-clamp-2 mt-1">{project.description}</p>
                </div>
                
                {project.specs && (
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                    <div>Sys: {project.specs.system}</div>
                    <div>Ser: {project.specs.series}</div>
                    <div>Gl: {project.specs.glass}</div>
                    <div>Col: {project.specs.color}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Modal Drawer */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase">
                {editingProject ? 'Edit Showcase Project' : 'Create Showcase Project'}
              </h3>
              <button onClick={() => setEditorOpen(false)} className="p-1 rounded hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-semibold text-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Project Title</label>
                  <Input
                    placeholder="e.g. Premium Villa French Windows"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10 border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Location / City Area</label>
                  <Input
                    placeholder="e.g. Rajahmundry"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="h-10 border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="Describe the scope, material challenges, and results..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[80px] p-3 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Product Family</label>
                  <Select
                    value={productFamily}
                    onChange={(e) => setProductFamily(e.target.value)}
                    className="h-10 border-slate-200 text-xs font-semibold"
                  >
                    <option value="upvc">uPVC</option>
                    <option value="aluminium">Aluminium</option>
                    <option value="mesh">Mosquito Mesh</option>
                    <option value="glass">Glass Railings</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Installation Style / Type</label>
                  <Input
                    placeholder="e.g. French Sliding Doors"
                    value={specsSystem}
                    onChange={(e) => setSpecsSystem(e.target.value)}
                    className="h-10 border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Cover Image Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Cover Image URL</label>
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="h-10 border-slate-200 text-xs font-semibold"
                />
                
                {/* Image Presets Selector */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Or select an image preset:</span>
                  <div className="flex flex-wrap gap-2">
                    {imagePresets.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setCoverImage(preset.url)}
                        className={`px-3 py-1.5 rounded border text-[10px] font-bold transition-all cursor-pointer ${
                          coverImage === preset.url
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom specs */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Technical specifications</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-600 uppercase">Profile Series used</label>
                    <Input
                      placeholder="e.g. 60mm Multi-Chamber"
                      value={specsSeries}
                      onChange={(e) => setSpecsSeries(e.target.value)}
                      className="h-9 border-slate-200 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-600 uppercase">Glazing/Glass specs</label>
                    <Input
                      placeholder="e.g. 6mm Toughened Clear"
                      value={specsGlass}
                      onChange={(e) => setSpecsGlass(e.target.value)}
                      className="h-9 border-slate-200 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-600 uppercase">Profile Color foil</label>
                    <Input
                      placeholder="e.g. Golden Oak wood foil"
                      value={specsColor}
                      onChange={(e) => setSpecsColor(e.target.value)}
                      className="h-9 border-slate-200 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setEditorOpen(false)} className="h-10 text-xs font-semibold px-5">
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs uppercase tracking-wider px-6 cursor-pointer">
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
