export interface BusinessSettings {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  googleMapUrl?: string;
  experienceYears: number;
}

export type SystemType = 'upvc' | 'aluminium' | 'mesh' | 'glass';

export interface ServiceVertical {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  system: SystemType;
  features: string[];
}

export interface ServiceDetail {
  id: string;
  verticalId: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  benefits: string[];
  specs: Record<string, string>;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: SystemType;
  location: string;
  completedYear: number;
  specs: {
    system: string;
    series: string;
    glass: string;
    color: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  location: string;
  projectType: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'upvc' | 'aluminium' | 'mesh' | 'glass' | 'installation';
}

export interface ServiceArea {
  id: string;
  city: string;
  areas: string[];
  isMajor: boolean;
}

export interface ContactSubmission {
  name: string;
  phone: string;
  email?: string;
  city: string;
  message: string;
}
