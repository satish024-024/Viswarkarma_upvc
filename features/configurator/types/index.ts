export type ProductFamily = 'upvc' | 'aluminium';

export interface ProductType {
  id: string;
  name: string;
  family: ProductFamily;
  description: string;
  basePricePerSqFt: number; // base price in INR
  image?: string;
  supportedSeries: string[]; // series IDs that support this type
}

export interface ProductSeries {
  id: string;
  name: string;
  family: ProductFamily;
  description: string;
  thickness: string; // e.g. "60mm", "88mm", "112mm"
  priceModifierPerSqFt: number; // added to base price
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  priceMultiplier: number; // e.g. 1.0 for White, 1.25 for wood finish
  description: string;
  isWoodGrain?: boolean;
}

export interface GlassOption {
  id: string;
  name: string;
  description: string;
  priceModifierPerSqFt: number; // added to base price
}

export interface MeshOption {
  id: string;
  name: string;
  description: string;
  priceModifierPerSqFt: number; // added to base price
}

export interface HardwareOption {
  id: string;
  name: string;
  description: string;
  priceModifierPerUnit: number; // added flat per unit
}

export interface ConfiguratorState {
  family: ProductFamily;
  typeId: string;
  seriesId: string;
  width: number; // feet
  height: number; // feet
  colorId: string;
  glassId: string;
  meshId: string;
  hardwareId: string;
  
  // Handoff details
  unitsCount: number;
  installationRequired: boolean;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  preferredCallbackTime: string;
}

export interface PriceBreakdown {
  width: number;
  height: number;
  areaSqFt: number;
  basePricePerSqFt: number;
  seriesModifierPerSqFt: number;
  glassModifierPerSqFt: number;
  meshModifierPerSqFt: number;
  colorMultiplier: number;
  hardwareModifierPerUnit: number;
  
  // Totals
  unitPrice: number;
  subtotal: number;
  installationPrice: number;
  estimatedMinTotal: number;
  estimatedMaxTotal: number;
}
