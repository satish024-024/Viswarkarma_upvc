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

const safeProductTypes = defaultProductTypes || [];
const safeProductSeries = defaultProductSeries || [];
const safeColorOptions = defaultColorOptions || [];
const safeGlassOptions = defaultGlassOptions || [];
const safeMeshOptions = defaultMeshOptions || [];
const safeHardwareOptions = defaultHardwareOptions || [];

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
export async function getProductTypes(activeOnly = true): Promise<ProductType[]> {
  if (!supabase) {
    const list = getLocalItem<ProductType[]>('viswarkarma_mock_types', safeProductTypes);
    return activeOnly ? list.filter(t => t.status !== 'draft') : list;
  }
  try {
    let query = supabase.from('product_types').select('*');
    if (activeOnly) {
      query = query.eq('status', 'active');
    }
    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const list = getLocalItem<ProductType[]>('viswarkarma_mock_types', safeProductTypes);
      return activeOnly ? list.filter(t => t.status !== 'draft') : list;
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      family: d.family_id as any,
      description: d.description,
      basePricePerSqFt: Number(d.base_price_per_sqft),
      supportedSeries: d.supported_series || [],
      status: d.status,
      sortOrder: d.sort_order,
      image: d.image_url || safeProductTypes.find(t => t.id === d.id)?.image || ''
    }));
  } catch {
    const list = getLocalItem<ProductType[]>('viswarkarma_mock_types', safeProductTypes);
    return activeOnly ? list.filter(t => t.status !== 'draft') : list;
  }
}

export async function createProductType(type: ProductType) {
  if (!supabase) {
    const list = getLocalItem<ProductType[]>('viswarkarma_mock_types', defaultProductTypes);
    const updated = [...list, type];
    setLocalItem('viswarkarma_mock_types', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('product_types').insert([{
      id: type.id,
      family_id: type.family,
      name: type.name,
      description: type.description,
      base_price_per_sqft: type.basePricePerSqFt,
      supported_series: type.supportedSeries,
      status: type.status || 'active',
      sort_order: type.sortOrder || 0,
      image_url: type.image || ''
    }]);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateProductType(id: string, type: Partial<ProductType>) {
  if (!supabase) {
    const list = getLocalItem<ProductType[]>('viswarkarma_mock_types', defaultProductTypes);
    const updated = list.map(t => t.id === id ? { ...t, ...type } : t);
    setLocalItem('viswarkarma_mock_types', updated);
    return { error: null };
  }
  try {
    const updateData: any = {};
    if (type.family !== undefined) updateData.family_id = type.family;
    if (type.name !== undefined) updateData.name = type.name;
    if (type.description !== undefined) updateData.description = type.description;
    if (type.basePricePerSqFt !== undefined) updateData.base_price_per_sqft = type.basePricePerSqFt;
    if (type.supportedSeries !== undefined) updateData.supported_series = type.supportedSeries;
    if (type.status !== undefined) updateData.status = type.status;
    if (type.sortOrder !== undefined) updateData.sort_order = type.sortOrder;
    if (type.image !== undefined) updateData.image_url = type.image;

    const { error } = await supabase.from('product_types').update(updateData).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateProductTypePrice(id: string, basePricePerSqFt: number) {
  return updateProductType(id, { basePricePerSqFt });
}

export async function deleteProductType(id: string) {
  if (!supabase) {
    const list = getLocalItem<ProductType[]>('viswarkarma_mock_types', defaultProductTypes);
    const updated = list.filter(t => t.id !== id);
    setLocalItem('viswarkarma_mock_types', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('product_types').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 7. Configurator - Series Options
export async function getProductSeries(activeOnly = true): Promise<ProductSeries[]> {
  if (!supabase) {
    const list = getLocalItem<ProductSeries[]>('viswarkarma_mock_series', safeProductSeries);
    return activeOnly ? list.filter(s => s.status !== 'draft') : list;
  }
  try {
    let query = supabase.from('product_series').select('*');
    if (activeOnly) {
      query = query.eq('status', 'active');
    }
    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const list = getLocalItem<ProductSeries[]>('viswarkarma_mock_series', safeProductSeries);
      return activeOnly ? list.filter(s => s.status !== 'draft') : list;
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      family: d.family_id as any,
      description: d.description,
      thickness: d.thickness,
      priceModifierPerSqFt: Number(d.price_modifier_per_sqft),
      status: d.status,
      sortOrder: d.sort_order
    }));
  } catch {
    const list = getLocalItem<ProductSeries[]>('viswarkarma_mock_series', safeProductSeries);
    return activeOnly ? list.filter(s => s.status !== 'draft') : list;
  }
}

export async function createProductSeries(series: ProductSeries) {
  if (!supabase) {
    const list = getLocalItem<ProductSeries[]>('viswarkarma_mock_series', safeProductSeries);
    const updated = [...list, series];
    setLocalItem('viswarkarma_mock_series', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('product_series').insert([{
      id: series.id,
      family_id: series.family,
      name: series.name,
      description: series.description,
      thickness: series.thickness,
      price_modifier_per_sqft: series.priceModifierPerSqFt,
      status: series.status || 'active',
      sort_order: series.sortOrder || 0
    }]);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateProductSeries(id: string, series: Partial<ProductSeries>) {
  if (!supabase) {
    const list = getLocalItem<ProductSeries[]>('viswarkarma_mock_series', safeProductSeries);
    const updated = list.map(s => s.id === id ? { ...s, ...series } : s);
    setLocalItem('viswarkarma_mock_series', updated);
    return { error: null };
  }
  try {
    const updateData: any = {};
    if (series.family !== undefined) updateData.family_id = series.family;
    if (series.name !== undefined) updateData.name = series.name;
    if (series.description !== undefined) updateData.description = series.description;
    if (series.thickness !== undefined) updateData.thickness = series.thickness;
    if (series.priceModifierPerSqFt !== undefined) updateData.price_modifier_per_sqft = series.priceModifierPerSqFt;
    if (series.status !== undefined) updateData.status = series.status;
    if (series.sortOrder !== undefined) updateData.sort_order = series.sortOrder;

    const { error } = await supabase.from('product_series').update(updateData).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateProductSeriesPrice(id: string, priceModifierPerSqFt: number) {
  return updateProductSeries(id, { priceModifierPerSqFt });
}

export async function deleteProductSeries(id: string) {
  if (!supabase) {
    const list = getLocalItem<ProductSeries[]>('viswarkarma_mock_series', safeProductSeries);
    const updated = list.filter(s => s.id !== id);
    setLocalItem('viswarkarma_mock_series', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('product_series').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 8. Configurator - Colors
export async function getColorOptions(activeOnly = true): Promise<ColorOption[]> {
  if (!supabase) {
    const list = getLocalItem<ColorOption[]>('viswarkarma_mock_colors', safeColorOptions);
    return activeOnly ? list.filter(c => c.status !== 'draft') : list;
  }
  try {
    let query = supabase.from('colour_options').select('*');
    if (activeOnly) {
      query = query.eq('status', 'active');
    }
    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const list = getLocalItem<ColorOption[]>('viswarkarma_mock_colors', safeColorOptions);
      return activeOnly ? list.filter(c => c.status !== 'draft') : list;
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      hex: d.hex,
      priceMultiplier: Number(d.price_multiplier),
      description: d.description,
      isWoodGrain: d.is_wood_grain,
      family: d.family_id as any,
      status: d.status,
      sortOrder: d.sort_order
    }));
  } catch {
    const list = getLocalItem<ColorOption[]>('viswarkarma_mock_colors', safeColorOptions);
    return activeOnly ? list.filter(c => c.status !== 'draft') : list;
  }
}

export async function createColorOption(color: ColorOption) {
  if (!supabase) {
    const list = getLocalItem<ColorOption[]>('viswarkarma_mock_colors', safeColorOptions);
    const updated = [...list, color];
    setLocalItem('viswarkarma_mock_colors', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('colour_options').insert([{
      id: color.id,
      family_id: color.family || 'upvc',
      name: color.name,
      hex: color.hex,
      price_multiplier: color.priceMultiplier,
      description: color.description,
      is_wood_grain: color.isWoodGrain || false,
      status: color.status || 'active',
      sort_order: color.sortOrder || 0
    }]);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateColorOption(id: string, color: Partial<ColorOption>) {
  if (!supabase) {
    const list = getLocalItem<ColorOption[]>('viswarkarma_mock_colors', safeColorOptions);
    const updated = list.map(c => c.id === id ? { ...c, ...color } : c);
    setLocalItem('viswarkarma_mock_colors', updated);
    return { error: null };
  }
  try {
    const updateData: any = {};
    if (color.family !== undefined) updateData.family_id = color.family;
    if (color.name !== undefined) updateData.name = color.name;
    if (color.hex !== undefined) updateData.hex = color.hex;
    if (color.priceMultiplier !== undefined) updateData.price_multiplier = color.priceMultiplier;
    if (color.description !== undefined) updateData.description = color.description;
    if (color.isWoodGrain !== undefined) updateData.is_wood_grain = color.isWoodGrain;
    if (color.status !== undefined) updateData.status = color.status;
    if (color.sortOrder !== undefined) updateData.sort_order = color.sortOrder;

    const { error } = await supabase.from('colour_options').update(updateData).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateColorOptionMultiplier(id: string, priceMultiplier: number) {
  return updateColorOption(id, { priceMultiplier });
}

export async function deleteColorOption(id: string) {
  if (!supabase) {
    const list = getLocalItem<ColorOption[]>('viswarkarma_mock_colors', safeColorOptions);
    const updated = list.filter(c => c.id !== id);
    setLocalItem('viswarkarma_mock_colors', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('colour_options').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 9. Configurator - Glass Options
export async function getGlassOptions(activeOnly = true): Promise<GlassOption[]> {
  if (!supabase) {
    const list = getLocalItem<GlassOption[]>('viswarkarma_mock_glass', safeGlassOptions);
    return activeOnly ? list.filter(g => g.status !== 'draft') : list;
  }
  try {
    let query = supabase.from('glass_options').select('*');
    if (activeOnly) {
      query = query.eq('status', 'active');
    }
    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const list = getLocalItem<GlassOption[]>('viswarkarma_mock_glass', safeGlassOptions);
      return activeOnly ? list.filter(g => g.status !== 'draft') : list;
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      priceModifierPerSqFt: Number(d.price_modifier_per_sqft),
      family: d.family_id as any,
      status: d.status,
      sortOrder: d.sort_order
    }));
  } catch {
    const list = getLocalItem<GlassOption[]>('viswarkarma_mock_glass', safeGlassOptions);
    return activeOnly ? list.filter(g => g.status !== 'draft') : list;
  }
}

export async function createGlassOption(glass: GlassOption) {
  if (!supabase) {
    const list = getLocalItem<GlassOption[]>('viswarkarma_mock_glass', safeGlassOptions);
    const updated = [...list, glass];
    setLocalItem('viswarkarma_mock_glass', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('glass_options').insert([{
      id: glass.id,
      family_id: glass.family || 'upvc',
      name: glass.name,
      description: glass.description,
      price_modifier_per_sqft: glass.priceModifierPerSqFt,
      status: glass.status || 'active',
      sort_order: glass.sortOrder || 0
    }]);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateGlassOption(id: string, glass: Partial<GlassOption>) {
  if (!supabase) {
    const list = getLocalItem<GlassOption[]>('viswarkarma_mock_glass', safeGlassOptions);
    const updated = list.map(g => g.id === id ? { ...g, ...glass } : g);
    setLocalItem('viswarkarma_mock_glass', updated);
    return { error: null };
  }
  try {
    const updateData: any = {};
    if (glass.family !== undefined) updateData.family_id = glass.family;
    if (glass.name !== undefined) updateData.name = glass.name;
    if (glass.description !== undefined) updateData.description = glass.description;
    if (glass.priceModifierPerSqFt !== undefined) updateData.price_modifier_per_sqft = glass.priceModifierPerSqFt;
    if (glass.status !== undefined) updateData.status = glass.status;
    if (glass.sortOrder !== undefined) updateData.sort_order = glass.sortOrder;

    const { error } = await supabase.from('glass_options').update(updateData).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateGlassOptionPrice(id: string, priceModifierPerSqFt: number) {
  return updateGlassOption(id, { priceModifierPerSqFt });
}

export async function deleteGlassOption(id: string) {
  if (!supabase) {
    const list = getLocalItem<GlassOption[]>('viswarkarma_mock_glass', safeGlassOptions);
    const updated = list.filter(g => g.id !== id);
    setLocalItem('viswarkarma_mock_glass', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('glass_options').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 10. Configurator - Mesh Options
export async function getMeshOptions(activeOnly = true): Promise<MeshOption[]> {
  if (!supabase) {
    const list = getLocalItem<MeshOption[]>('viswarkarma_mock_mesh', safeMeshOptions);
    return activeOnly ? list.filter(m => m.status !== 'draft') : list;
  }
  try {
    let query = supabase.from('mesh_options').select('*');
    if (activeOnly) {
      query = query.eq('status', 'active');
    }
    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const list = getLocalItem<MeshOption[]>('viswarkarma_mock_mesh', safeMeshOptions);
      return activeOnly ? list.filter(m => m.status !== 'draft') : list;
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      priceModifierPerSqFt: Number(d.price_modifier_per_sqft),
      family: d.family_id as any,
      status: d.status,
      sortOrder: d.sort_order
    }));
  } catch {
    const list = getLocalItem<MeshOption[]>('viswarkarma_mock_mesh', safeMeshOptions);
    return activeOnly ? list.filter(m => m.status !== 'draft') : list;
  }
}

export async function createMeshOption(mesh: MeshOption) {
  if (!supabase) {
    const list = getLocalItem<MeshOption[]>('viswarkarma_mock_mesh', safeMeshOptions);
    const updated = [...list, mesh];
    setLocalItem('viswarkarma_mock_mesh', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('mesh_options').insert([{
      id: mesh.id,
      family_id: mesh.family || 'upvc',
      name: mesh.name,
      description: mesh.description,
      price_modifier_per_sqft: mesh.priceModifierPerSqFt,
      status: mesh.status || 'active',
      sort_order: mesh.sortOrder || 0
    }]);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateMeshOption(id: string, mesh: Partial<MeshOption>) {
  if (!supabase) {
    const list = getLocalItem<MeshOption[]>('viswarkarma_mock_mesh', safeMeshOptions);
    const updated = list.map(m => m.id === id ? { ...m, ...mesh } : m);
    setLocalItem('viswarkarma_mock_mesh', updated);
    return { error: null };
  }
  try {
    const updateData: any = {};
    if (mesh.family !== undefined) updateData.family_id = mesh.family;
    if (mesh.name !== undefined) updateData.name = mesh.name;
    if (mesh.description !== undefined) updateData.description = mesh.description;
    if (mesh.priceModifierPerSqFt !== undefined) updateData.price_modifier_per_sqft = mesh.priceModifierPerSqFt;
    if (mesh.status !== undefined) updateData.status = mesh.status;
    if (mesh.sortOrder !== undefined) updateData.sort_order = mesh.sortOrder;

    const { error } = await supabase.from('mesh_options').update(updateData).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateMeshOptionPrice(id: string, priceModifierPerSqFt: number) {
  return updateMeshOption(id, { priceModifierPerSqFt });
}

export async function deleteMeshOption(id: string) {
  if (!supabase) {
    const list = getLocalItem<MeshOption[]>('viswarkarma_mock_mesh', safeMeshOptions);
    const updated = list.filter(m => m.id !== id);
    setLocalItem('viswarkarma_mock_mesh', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('mesh_options').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// 11. Configurator - Hardware Options
export async function getHardwareOptions(activeOnly = true): Promise<HardwareOption[]> {
  if (!supabase) {
    const list = getLocalItem<HardwareOption[]>('viswarkarma_mock_hardware', safeHardwareOptions);
    return activeOnly ? list.filter(h => h.status !== 'draft') : list;
  }
  try {
    let query = supabase.from('hardware_options').select('*');
    if (activeOnly) {
      query = query.eq('status', 'active');
    }
    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const list = getLocalItem<HardwareOption[]>('viswarkarma_mock_hardware', safeHardwareOptions);
      return activeOnly ? list.filter(h => h.status !== 'draft') : list;
    }

    return data.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      priceModifierPerUnit: Number(d.price_modifier_per_unit),
      status: d.status,
      sortOrder: d.sort_order
    }));
  } catch {
    const list = getLocalItem<HardwareOption[]>('viswarkarma_mock_hardware', safeHardwareOptions);
    return activeOnly ? list.filter(h => h.status !== 'draft') : list;
  }
}

export async function createHardwareOption(hardware: HardwareOption) {
  if (!supabase) {
    const list = getLocalItem<HardwareOption[]>('viswarkarma_mock_hardware', safeHardwareOptions);
    const updated = [...list, hardware];
    setLocalItem('viswarkarma_mock_hardware', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('hardware_options').insert([{
      id: hardware.id,
      name: hardware.name,
      description: hardware.description,
      price_modifier_per_unit: hardware.priceModifierPerUnit,
      status: hardware.status || 'active',
      sort_order: hardware.sortOrder || 0
    }]);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateHardwareOption(id: string, hardware: Partial<HardwareOption>) {
  if (!supabase) {
    const list = getLocalItem<HardwareOption[]>('viswarkarma_mock_hardware', safeHardwareOptions);
    const updated = list.map(h => h.id === id ? { ...h, ...hardware } : h);
    setLocalItem('viswarkarma_mock_hardware', updated);
    return { error: null };
  }
  try {
    const updateData: any = {};
    if (hardware.name !== undefined) updateData.name = hardware.name;
    if (hardware.description !== undefined) updateData.description = hardware.description;
    if (hardware.priceModifierPerUnit !== undefined) updateData.price_modifier_per_unit = hardware.priceModifierPerUnit;
    if (hardware.status !== undefined) updateData.status = hardware.status;
    if (hardware.sortOrder !== undefined) updateData.sort_order = hardware.sortOrder;

    const { error } = await supabase.from('hardware_options').update(updateData).eq('id', id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

export async function updateHardwareOptionPrice(id: string, priceModifierPerUnit: number) {
  return updateHardwareOption(id, { priceModifierPerUnit });
}

export async function deleteHardwareOption(id: string) {
  if (!supabase) {
    const list = getLocalItem<HardwareOption[]>('viswarkarma_mock_hardware', safeHardwareOptions);
    const updated = list.filter(h => h.id !== id);
    setLocalItem('viswarkarma_mock_hardware', updated);
    return { error: null };
  }
  try {
    const { error } = await supabase.from('hardware_options').delete().eq('id', id);
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
