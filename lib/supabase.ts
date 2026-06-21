import { createClient } from '@supabase/supabase-js';
import { 
  businessSettings as defaultSettings, 
  serviceVerticals as defaultServices, 
  projectsList as defaultProjects, 
  testimonialsList as defaultTestimonials, 
  faqsList as defaultFaqs
} from './data/business';
import { 
  productTypes as defaultProductTypes, 
  productSeries as defaultProductSeries, 
  colorOptions as defaultColorOptions, 
  glassOptions as defaultGlassOptions, 
  meshOptions as defaultMeshOptions, 
  hardwareOptions as defaultHardwareOptions 
} from '@/features/configurator/config/data';
import { BusinessSettings, ServiceVertical, Project, Testimonial, FAQ, SystemType } from '@/types/entities';
import { ProductType, ProductSeries, ColorOption, GlassOption, MeshOption, HardwareOption } from '@/features/configurator/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize client if env vars are present
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn("Supabase credentials missing. App is running in Local Fallback Mode.");
}

// Helper to handle local storage fallbacks in local bypass mode
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export interface DbLead {
  id?: string;
  customer_name: string;
  phone: string;
  city_area: string;
  product_family: string;
  product_type: string;
  series: string;
  width: number;
  height: number;
  units: number;
  colour: string;
  glass: string;
  mesh: string;
  hardware: string;
  installation_required: boolean;
  callback_time: string;
  notes?: string;
  estimate_low: number;
  estimate_high: number;
  status?: string;
  created_at?: string;
}

// 1. Business Settings
export async function getBusinessSettings(): Promise<BusinessSettings> {
  if (!supabase) {
    return getLocalItem<BusinessSettings>('viswarkarma_mock_settings', defaultSettings);
  }
  try {
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return defaultSettings;

    return {
      name: data.business_name,
      tagline: data.tagline,
      phone: data.phone_primary,
      whatsapp: data.whatsapp_number,
      email: data.email,
      address: data.office_address,
      hours: data.working_hours,
      googleMapUrl: data.googleMapUrl || '',
      experienceYears: data.experience_years || defaultSettings.experienceYears
    };
  } catch {
    return defaultSettings;
  }
}

export async function updateBusinessSettings(settings: BusinessSettings) {
  if (!supabase) {
    setLocalItem<BusinessSettings>('viswarkarma_mock_settings', settings);
    return { error: null };
  }
  try {
    const { data: existing } = await supabase
      .from('business_settings')
      .select('id')
      .limit(1)
      .maybeSingle();
    
    const dbPayload = {
      business_name: settings.name,
      tagline: settings.tagline,
      phone_primary: settings.phone,
      whatsapp_number: settings.whatsapp,
      email: settings.email,
      office_address: settings.address,
      working_hours: settings.hours,
      googleMapUrl: settings.googleMapUrl,
      experience_years: settings.experienceYears,
      updated_at: new Date().toISOString()
    };

    if (existing?.id) {
      const { error } = await supabase
        .from('business_settings')
        .update(dbPayload)
        .eq('id', existing.id);
      return { error };
    } else {
      const { error } = await supabase
        .from('business_settings')
        .insert([dbPayload]);
      return { error };
    }
  } catch (err) {
    console.error("Error updating business settings:", err);
    return { error: err };
  }
}

// 2. Services
export async function getServices(): Promise<ServiceVertical[]> {
  if (!supabase) {
    return getLocalItem<ServiceVertical[]>('viswarkarma_mock_services', defaultServices);
  }
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalItem<ServiceVertical[]>('viswarkarma_mock_services', defaultServices);
    }

    return data.map(d => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      description: d.short_description,
      image: d.image || '',
      system: d.category,
      features: d.feature_points || []
    }));
  } catch {
    return getLocalItem<ServiceVertical[]>('viswarkarma_mock_services', defaultServices);
  }
}

export interface DbServiceInput {
  title: string;
  slug: string;
  short_description: string;
  long_description?: string;
  category: string;
  feature_points: string[];
  status?: string;
  sort_order?: number;
}

export async function createService(service: DbServiceInput) {
  if (!supabase) {
    const list = getLocalItem<ServiceVertical[]>('viswarkarma_mock_services', defaultServices);
    const newItem: ServiceVertical = { 
      id: Math.random().toString(), 
      title: service.title,
      slug: service.slug,
      description: service.short_description,
      image: '',
      system: service.category as SystemType,
      features: service.feature_points
    };
    setLocalItem<ServiceVertical[]>('viswarkarma_mock_services', [...list, newItem]);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('services').insert([service]);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateService(id: string, service: Partial<DbServiceInput>) {
  if (!supabase) {
    const list = getLocalItem<ServiceVertical[]>('viswarkarma_mock_services', defaultServices);
    const updated = list.map((s: ServiceVertical) => {
      if (s.id === id) {
        return {
          ...s,
          title: service.title ?? s.title,
          slug: service.slug ?? s.slug,
          description: service.short_description ?? s.description,
          system: (service.category ?? s.system) as SystemType,
          features: service.feature_points ?? s.features
        };
      }
      return s;
    });
    setLocalItem<ServiceVertical[]>('viswarkarma_mock_services', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('services').update(service).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function deleteService(id: string) {
  if (!supabase) {
    const list = getLocalItem<ServiceVertical[]>('viswarkarma_mock_services', defaultServices);
    const updated = list.filter((s: ServiceVertical) => s.id !== id);
    setLocalItem<ServiceVertical[]>('viswarkarma_mock_services', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('services').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 3. Projects
export async function getProjects(): Promise<Project[]> {
  if (!supabase) {
    return getLocalItem<Project[]>('viswarkarma_mock_projects', defaultProjects);
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalItem<Project[]>('viswarkarma_mock_projects', defaultProjects);
    }

    return data.map(d => ({
      id: d.id,
      title: d.title,
      description: d.description,
      image: d.cover_image,
      category: d.product_family,
      location: d.location_name,
      completedYear: d.completion_date ? new Date(d.completion_date).getFullYear() : 2025,
      specs: {
        system: d.specs?.system || '',
        series: d.specs?.series || '',
        glass: d.specs?.glass || '',
        color: d.specs?.color || ''
      }
    }));
  } catch {
    return getLocalItem<Project[]>('viswarkarma_mock_projects', defaultProjects);
  }
}

export async function createProject(project: Omit<Project, 'id' | 'image' | 'category' | 'location' | 'completedYear'> & { cover_image: string, product_family: string, location_name: string }) {
  if (!supabase) {
    const list = getLocalItem<Project[]>('viswarkarma_mock_projects', defaultProjects);
    const newItem: Project = { 
      id: Math.random().toString(), 
      title: project.title,
      description: project.description,
      image: project.cover_image,
      category: project.product_family as SystemType,
      location: project.location_name,
      completedYear: 2025,
      specs: project.specs
    };
    setLocalItem<Project[]>('viswarkarma_mock_projects', [...list, newItem]);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('projects').insert([project]);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateProject(id: string, project: Partial<Omit<Project, 'id' | 'image' | 'category' | 'location' | 'completedYear'> & { cover_image: string, product_family: string, location_name: string }>) {
  if (!supabase) {
    const list = getLocalItem<Project[]>('viswarkarma_mock_projects', defaultProjects);
    const updated = list.map((p: Project) => {
      if (p.id === id) {
        return {
          ...p,
          title: project.title ?? p.title,
          description: project.description ?? p.description,
          image: project.cover_image ?? p.image,
          category: (project.product_family ?? p.category) as SystemType,
          location: project.location_name ?? p.location,
          specs: project.specs ? { ...p.specs, ...project.specs } : p.specs
        };
      }
      return p;
    });
    setLocalItem<Project[]>('viswarkarma_mock_projects', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('projects').update(project).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function deleteProject(id: string) {
  if (!supabase) {
    const list = getLocalItem<Project[]>('viswarkarma_mock_projects', defaultProjects);
    const updated = list.filter((p: Project) => p.id !== id);
    setLocalItem<Project[]>('viswarkarma_mock_projects', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 4. Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!supabase) {
    return getLocalItem<Testimonial[]>('viswarkarma_mock_testimonials', defaultTestimonials);
  }
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalItem<Testimonial[]>('viswarkarma_mock_testimonials', defaultTestimonials);
    }

    return data.map(d => ({
      id: d.id,
      name: d.customer_name,
      role: d.related_service,
      content: d.testimonial_text,
      rating: d.rating,
      location: d.location_name,
      projectType: d.related_service
    }));
  } catch {
    return getLocalItem<Testimonial[]>('viswarkarma_mock_testimonials', defaultTestimonials);
  }
}

export interface DbTestimonialInput {
  customer_name: string;
  location_name: string;
  testimonial_text: string;
  related_service: string;
  rating: number;
  status?: string;
  sort_order?: number;
}

export async function createTestimonial(testimonial: DbTestimonialInput) {
  if (!supabase) {
    const list = getLocalItem<Testimonial[]>('viswarkarma_mock_testimonials', defaultTestimonials);
    const newItem: Testimonial = { 
      id: Math.random().toString(), 
      name: testimonial.customer_name,
      role: testimonial.related_service,
      content: testimonial.testimonial_text,
      rating: testimonial.rating,
      location: testimonial.location_name,
      projectType: testimonial.related_service
    };
    setLocalItem<Testimonial[]>('viswarkarma_mock_testimonials', [...list, newItem]);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('testimonials').insert([testimonial]);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateTestimonial(id: string, testimonial: Partial<DbTestimonialInput>) {
  if (!supabase) {
    const list = getLocalItem<Testimonial[]>('viswarkarma_mock_testimonials', defaultTestimonials);
    const updated = list.map((t: Testimonial) => {
      if (t.id === id) {
        return {
          ...t,
          name: testimonial.customer_name ?? t.name,
          role: testimonial.related_service ?? t.role,
          content: testimonial.testimonial_text ?? t.content,
          rating: testimonial.rating ?? t.rating,
          location: testimonial.location_name ?? t.location,
          projectType: testimonial.related_service ?? t.projectType
        };
      }
      return t;
    });
    setLocalItem<Testimonial[]>('viswarkarma_mock_testimonials', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('testimonials').update(testimonial).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function deleteTestimonial(id: string) {
  if (!supabase) {
    const list = getLocalItem<Testimonial[]>('viswarkarma_mock_testimonials', defaultTestimonials);
    const updated = list.filter((t: Testimonial) => t.id !== id);
    setLocalItem<Testimonial[]>('viswarkarma_mock_testimonials', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 5. FAQs
export async function getFaqs(): Promise<FAQ[]> {
  if (!supabase) {
    return getLocalItem<FAQ[]>('viswarkarma_mock_faqs', defaultFaqs);
  }
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalItem<FAQ[]>('viswarkarma_mock_faqs', defaultFaqs);
    }

    return data.map(d => ({
      id: d.id,
      question: d.question,
      answer: d.answer,
      category: d.category as FAQ['category']
    }));
  } catch {
    return getLocalItem<FAQ[]>('viswarkarma_mock_faqs', defaultFaqs);
  }
}

export async function createFaq(faq: Omit<FAQ, 'id'>) {
  if (!supabase) {
    const list = getLocalItem<FAQ[]>('viswarkarma_mock_faqs', defaultFaqs);
    const newItem: FAQ = { ...faq, id: Math.random().toString() };
    setLocalItem<FAQ[]>('viswarkarma_mock_faqs', [...list, newItem]);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('faqs').insert([faq]);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateFaq(id: string, faq: Partial<Omit<FAQ, 'id'>>) {
  if (!supabase) {
    const list = getLocalItem<FAQ[]>('viswarkarma_mock_faqs', defaultFaqs);
    const updated = list.map((f: FAQ) => f.id === id ? { ...f, ...faq } : f);
    setLocalItem<FAQ[]>('viswarkarma_mock_faqs', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('faqs').update(faq).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function deleteFaq(id: string) {
  if (!supabase) {
    const list = getLocalItem<FAQ[]>('viswarkarma_mock_faqs', defaultFaqs);
    const updated = list.filter((f: FAQ) => f.id !== id);
    setLocalItem<FAQ[]>('viswarkarma_mock_faqs', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 6. Configurator - Product Types
export async function getProductTypes(): Promise<ProductType[]> {
  if (!supabase) {
    return getLocalItem<ProductType[]>('viswarkarma_mock_types', defaultProductTypes);
  }
  try {
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalItem<ProductType[]>('viswarkarma_mock_types', defaultProductTypes);
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      family: d.family_id,
      description: d.description,
      basePricePerSqFt: Number(d.base_price_per_sqft),
      supportedSeries: d.supported_series || []
    }));
  } catch {
    return getLocalItem<ProductType[]>('viswarkarma_mock_types', defaultProductTypes);
  }
}

export async function updateProductTypePrice(id: string, basePricePerSqFt: number) {
  if (!supabase) {
    const list = getLocalItem<ProductType[]>('viswarkarma_mock_types', defaultProductTypes);
    const updated = list.map((t: ProductType) => t.id === id ? { ...t, basePricePerSqFt } : t);
    setLocalItem<ProductType[]>('viswarkarma_mock_types', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('product_types').update({ base_price_per_sqft: basePricePerSqFt }).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 7. Configurator - Series Options
export async function getProductSeries(): Promise<ProductSeries[]> {
  if (!supabase) {
    return getLocalItem<ProductSeries[]>('viswarkarma_mock_series', defaultProductSeries);
  }
  try {
    const { data, error } = await supabase
      .from('product_series')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalItem<ProductSeries[]>('viswarkarma_mock_series', defaultProductSeries);
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      family: d.family_id,
      description: d.description,
      thickness: d.thickness,
      priceModifierPerSqFt: Number(d.price_modifier_per_sqft)
    }));
  } catch {
    return getLocalItem<ProductSeries[]>('viswarkarma_mock_series', defaultProductSeries);
  }
}

export async function updateProductSeriesPrice(id: string, priceModifierPerSqFt: number) {
  if (!supabase) {
    const list = getLocalItem<ProductSeries[]>('viswarkarma_mock_series', defaultProductSeries);
    const updated = list.map((s: ProductSeries) => s.id === id ? { ...s, priceModifierPerSqFt } : s);
    setLocalItem<ProductSeries[]>('viswarkarma_mock_series', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('product_series').update({ price_modifier_per_sqft: priceModifierPerSqFt }).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 8. Configurator - Colors
export async function getColorOptions(): Promise<ColorOption[]> {
  if (!supabase) {
    return getLocalItem<ColorOption[]>('viswarkarma_mock_colors', defaultColorOptions);
  }
  try {
    const { data, error } = await supabase
      .from('colour_options')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalItem<ColorOption[]>('viswarkarma_mock_colors', defaultColorOptions);
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      hex: d.hex,
      priceMultiplier: Number(d.price_multiplier),
      description: d.description,
      isWoodGrain: d.is_wood_grain
    }));
  } catch {
    return getLocalItem<ColorOption[]>('viswarkarma_mock_colors', defaultColorOptions);
  }
}

export async function updateColorOptionMultiplier(id: string, priceMultiplier: number) {
  if (!supabase) {
    const list = getLocalItem<ColorOption[]>('viswarkarma_mock_colors', defaultColorOptions);
    const updated = list.map((c: ColorOption) => c.id === id ? { ...c, priceMultiplier } : c);
    setLocalItem<ColorOption[]>('viswarkarma_mock_colors', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('colour_options').update({ price_multiplier: priceMultiplier }).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 9. Configurator - Glass Options
export async function getGlassOptions(): Promise<GlassOption[]> {
  if (!supabase) {
    return getLocalItem<GlassOption[]>('viswarkarma_mock_glass', defaultGlassOptions);
  }
  try {
    const { data, error } = await supabase
      .from('glass_options')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalItem<GlassOption[]>('viswarkarma_mock_glass', defaultGlassOptions);
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      priceModifierPerSqFt: Number(d.price_modifier_per_sqft)
    }));
  } catch {
    return getLocalItem<GlassOption[]>('viswarkarma_mock_glass', defaultGlassOptions);
  }
}

export async function updateGlassOptionPrice(id: string, priceModifierPerSqFt: number) {
  if (!supabase) {
    const list = getLocalItem<GlassOption[]>('viswarkarma_mock_glass', defaultGlassOptions);
    const updated = list.map((g: GlassOption) => g.id === id ? { ...g, priceModifierPerSqFt } : g);
    setLocalItem<GlassOption[]>('viswarkarma_mock_glass', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('glass_options').update({ price_modifier_per_sqft: priceModifierPerSqFt }).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 10. Configurator - Mesh Options
export async function getMeshOptions(): Promise<MeshOption[]> {
  if (!supabase) {
    return getLocalItem<MeshOption[]>('viswarkarma_mock_mesh', defaultMeshOptions);
  }
  try {
    const { data, error } = await supabase
      .from('mesh_options')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalItem<MeshOption[]>('viswarkarma_mock_mesh', defaultMeshOptions);
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      priceModifierPerSqFt: Number(d.price_modifier_per_sqft)
    }));
  } catch {
    return getLocalItem<MeshOption[]>('viswarkarma_mock_mesh', defaultMeshOptions);
  }
}

export async function updateMeshOptionPrice(id: string, priceModifierPerSqFt: number) {
  if (!supabase) {
    const list = getLocalItem<MeshOption[]>('viswarkarma_mock_mesh', defaultMeshOptions);
    const updated = list.map((m: MeshOption) => m.id === id ? { ...m, priceModifierPerSqFt } : m);
    setLocalItem<MeshOption[]>('viswarkarma_mock_mesh', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('mesh_options').update({ price_modifier_per_sqft: priceModifierPerSqFt }).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 11. Configurator - Hardware Options
export async function getHardwareOptions(): Promise<HardwareOption[]> {
  if (!supabase) {
    return getLocalItem<HardwareOption[]>('viswarkarma_mock_hardware', defaultHardwareOptions);
  }
  try {
    const { data, error } = await supabase
      .from('hardware_options')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalItem<HardwareOption[]>('viswarkarma_mock_hardware', defaultHardwareOptions);
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      priceModifierPerUnit: Number(d.price_modifier_per_unit)
    }));
  } catch {
    return getLocalItem<HardwareOption[]>('viswarkarma_mock_hardware', defaultHardwareOptions);
  }
}

export async function updateHardwareOptionPrice(id: string, priceModifierPerUnit: number) {
  if (!supabase) {
    const list = getLocalItem<HardwareOption[]>('viswarkarma_mock_hardware', defaultHardwareOptions);
    const updated = list.map((h: HardwareOption) => h.id === id ? { ...h, priceModifierPerUnit } : h);
    setLocalItem<HardwareOption[]>('viswarkarma_mock_hardware', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('hardware_options').update({ price_modifier_per_unit: priceModifierPerUnit }).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 12. Leads / Quote Requests
export async function createQuoteRequest(lead: {
  customer_name: string;
  phone: string;
  city_area: string;
  product_family: string;
  product_type: string;
  series: string;
  width: number;
  height: number;
  units: number;
  colour: string;
  glass: string;
  mesh: string;
  hardware: string;
  installation_required: boolean;
  callback_time: string;
  notes?: string;
  estimate_low: number;
  estimate_high: number;
}) {
  if (!supabase) {
    console.log("Supabase client is not initialized. Mocking quote request submission locally:", lead);
    const list = getLocalItem<DbLead[]>('viswarkarma_mock_leads', []);
    const mockLead: DbLead = {
      ...lead,
      id: Math.random().toString(),
      created_at: new Date().toISOString(),
      status: 'new'
    };
    setLocalItem<DbLead[]>('viswarkarma_mock_leads', [...list, mockLead]);
    return { data: [mockLead], error: null };
  }
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .insert([lead])
      .select();
    return { data, error };
  } catch (err) {
    console.error("Error creating quote request:", err);
    return { data: null, error: err };
  }
}

export async function getQuoteRequests(): Promise<DbLead[]> {
  if (!supabase) {
    const list = getLocalItem<DbLead[]>('viswarkarma_mock_leads', []);
    return [...list].reverse();
  }
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching quote requests:", err);
    return [];
  }
}

export async function updateQuoteRequestStatus(id: string, status: string) {
  if (!supabase) {
    const list = getLocalItem<DbLead[]>('viswarkarma_mock_leads', []);
    const updated = list.map((item: DbLead) => item.id === id ? { ...item, status } : item);
    setLocalItem<DbLead[]>('viswarkarma_mock_leads', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase
      .from('quote_requests')
      .update({ status })
      .eq('id', id);
    return { error };
  } catch (err) {
    console.error("Error updating quote request status:", err);
    return { error: err };
  }
}

export async function deleteQuoteRequest(id: string) {
  if (!supabase) {
    const list = getLocalItem<DbLead[]>('viswarkarma_mock_leads', []);
    const updated = list.filter((item: DbLead) => item.id !== id);
    setLocalItem<DbLead[]>('viswarkarma_mock_leads', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id);
    return { error };
  } catch (err) {
    console.error("Error deleting quote request:", err);
    return { error: err };
  }
}
