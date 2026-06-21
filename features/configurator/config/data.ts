import { ProductType, ProductSeries, ColorOption, GlassOption, MeshOption, HardwareOption } from '../types';

export const productTypes: ProductType[] = [
  {
    id: "sliding_window",
    name: "Sliding Window",
    family: "upvc",
    description: "Space-saving horizontal sliding panels with interlocking brush seals.",
    basePricePerSqFt: 500, // Based on Dhatri uPVC Sliding Window (₹500/sq.ft)
    supportedSeries: ["60mm_series", "80mm_series", "88mm_series"]
  },
  {
    id: "casement_window",
    name: "Casement (Openable) Window",
    family: "upvc",
    description: "Classic side-hung openable window that swings outward, offering 100% ventilation.",
    basePricePerSqFt: 500, // Based on Dhatri uPVC Casement Window (₹500/sq.ft)
    supportedSeries: ["60mm_series", "80mm_series", "88mm_series"]
  },
  {
    id: "fixed_window",
    name: "Fixed Window / Partition",
    family: "upvc",
    description: "Non-operational picture window or office partition designed for maximum light.",
    basePricePerSqFt: 300, // Based on Dhatri uPVC Office Partition (₹300/sq.ft)
    supportedSeries: ["60mm_series", "80mm_series"]
  },
  {
    id: "sliding_door",
    name: "Sliding Patio / French Door",
    family: "upvc",
    description: "Wide doors sliding on heavy-duty tracks, perfect for balconies and sit-outs.",
    basePricePerSqFt: 500, // Based on Dhatri uPVC French Door (₹500/sq.ft) & Sliding Door base
    supportedSeries: ["80mm_series", "88mm_series", "112mm_series"]
  },
  {
    id: "openable_door",
    name: "Casement Double Door",
    family: "upvc",
    description: "Heavy-duty sash swing double door with multi-point lock cylinders.",
    basePricePerSqFt: 800, // Based on Dhatri uPVC Glass Casement Double Door (₹800/sq.ft)
    supportedSeries: ["80mm_series", "88mm_series"]
  },
  
  // Aluminium equivalents (Proportionate markup for slimline structural materials)
  {
    id: "alu_sliding_window",
    name: "Aluminium Sliding Window",
    family: "aluminium",
    description: "Slimline architectural aluminium sliding profiles with integrated track systems.",
    basePricePerSqFt: 550,
    supportedSeries: ["alu_50mm_series", "alu_90mm_series"]
  },
  {
    id: "alu_casement_window",
    name: "Aluminium Casement Window",
    family: "aluminium",
    description: "Flush architectural casement window with friction hinges.",
    basePricePerSqFt: 600,
    supportedSeries: ["alu_50mm_series", "alu_90mm_series"]
  },
  {
    id: "alu_fixed_window",
    name: "Aluminium Fixed Window",
    family: "aluminium",
    description: "Slim frame fixed picture window designed for modern panoramic views.",
    basePricePerSqFt: 350,
    supportedSeries: ["alu_50mm_series", "alu_90mm_series"]
  },
  {
    id: "alu_sliding_door",
    name: "Aluminium Sliding Door",
    family: "aluminium",
    description: "Premium large-pane sliding patio doors with low thresholds and structural reinforcements.",
    basePricePerSqFt: 650,
    supportedSeries: ["alu_90mm_series", "alu_120mm_series"]
  },
  {
    id: "alu_openable_door",
    name: "Aluminium Casement Door",
    family: "aluminium",
    description: "Modern architectural doors with high-security locks.",
    basePricePerSqFt: 850,
    supportedSeries: ["alu_50mm_series", "alu_90mm_series"]
  }
];

export const productSeries: ProductSeries[] = [
  // uPVC Series
  {
    id: "60mm_series",
    name: "60mm Eco Series",
    family: "upvc",
    description: "Standard 3-chamber profile system, ideal for budget-friendly residential installations.",
    thickness: "60mm",
    priceModifierPerSqFt: 0
  },
  {
    id: "80mm_series",
    name: "80mm Premium Series",
    family: "upvc",
    description: "Enhanced 4-chamber profile with deeper reinforcement, providing better sound insulation.",
    thickness: "80mm",
    priceModifierPerSqFt: 60
  },
  {
    id: "88mm_series",
    name: "88mm Architectural Series",
    family: "upvc",
    description: "Premium 5-chamber design matching international standards for sound isolation.",
    thickness: "88mm",
    priceModifierPerSqFt: 120
  },
  {
    id: "112mm_series",
    name: "112mm Luxury Patio Series",
    family: "upvc",
    description: "Heavy-duty multi-track system designed specifically for large glass spans and heavy-duty sliding panels.",
    thickness: "112mm",
    priceModifierPerSqFt: 200
  },
  
  // Aluminium Series
  {
    id: "alu_50mm_series",
    name: "50mm Slimline Series",
    family: "aluminium",
    description: "Classic slim profile giving maximum glass area and minimalist aesthetic.",
    thickness: "50mm",
    priceModifierPerSqFt: 0
  },
  {
    id: "alu_90mm_series",
    name: "90mm Thermal Break Series",
    family: "aluminium",
    description: "Heavy-duty thermally insulated profile that prevents heat conduction.",
    thickness: "90mm",
    priceModifierPerSqFt: 140
  },
  {
    id: "alu_120mm_series",
    name: "120mm Lift-and-Slide Luxury",
    family: "aluminium",
    description: "Super-premium lift-and-slide system designed for massive glass facades and smooth rolling operations.",
    thickness: "120mm",
    priceModifierPerSqFt: 280
  }
];

export const colorOptions: ColorOption[] = [
  {
    id: "white",
    name: "Classic White",
    hex: "#ffffff",
    priceMultiplier: 1.0,
    description: "Standard clean, high-gloss UV-stabilized white. Low maintenance.",
    isWoodGrain: false
  },
  {
    id: "anthracite",
    name: "Anthracite Grey",
    hex: "#374151",
    priceMultiplier: 1.20,
    description: "Premium matte charcoal finish. Fits modern industrial styles.",
    isWoodGrain: false
  },
  {
    id: "golden_oak",
    name: "Golden Oak",
    hex: "#854d0e",
    priceMultiplier: 1.25,
    description: "Textured realistic golden wood grain finish. Combines wooden aesthetic with uPVC durability.",
    isWoodGrain: true
  },
  {
    id: "walnut",
    name: "Walnut Wood",
    hex: "#451a03",
    priceMultiplier: 1.28,
    description: "Dark, premium textured walnut wood grain. Looks indistinguishable from timber.",
    isWoodGrain: true
  }
];

export const glassOptions: GlassOption[] = [
  {
    id: "single_5mm_clear",
    name: "5mm Single Clear Glass",
    description: "Standard clear glass suitable for budget windows.",
    priceModifierPerSqFt: 0
  },
  {
    id: "single_6mm_toughened",
    name: "6mm Toughened Safety Glass",
    description: "Tempered safety glass. Combined with sliding doors, yields ₹600/sq.ft, matching Dhatri Enterprises toughened door rates.",
    priceModifierPerSqFt: 100 // Yields exactly 500 base + 100 = 600/sq ft Dhatri toughened glass doors
  },
  {
    id: "dgu_20mm_clear",
    name: "20mm DGU Double Glazing (6+8Ar+6)",
    description: "Double glazed unit with argon gas infill. Drastically reduces heat gain and noise.",
    priceModifierPerSqFt: 200
  },
  {
    id: "dgu_24mm_toughened",
    name: "24mm DGU Toughened Laminated",
    description: "Double glazed safety glass, perfect for absolute silence and safety.",
    priceModifierPerSqFt: 300
  },
  {
    id: "frosted_6mm",
    name: "6mm Frosted Privacy Glass",
    description: "Acid-etched obscure safety glass, ideal for bathrooms and partitions.",
    priceModifierPerSqFt: 90
  }
];

export const meshOptions: MeshOption[] = [
  {
    id: "none",
    name: "No Mosquito Mesh",
    description: "Standard glass frame without integrated flyscreens.",
    priceModifierPerSqFt: 0
  },
  {
    id: "fiberglass",
    name: "Fiberglass Invisible Mesh",
    description: "Flexible, high-visibility dark grey mesh. Blends in and keeps out bugs.",
    priceModifierPerSqFt: 40
  },
  {
    id: "ss304_mesh",
    name: "SS304 Stainless Steel Shield",
    description: "High-tensile, heavy-duty stainless steel wire mesh.",
    priceModifierPerSqFt: 150
  },
  {
    id: "pleated_mesh",
    name: "Premium Pleated Mesh",
    description: "Collapsible zigzag folding mesh. Folds out of sight when open.",
    priceModifierPerSqFt: 220
  }
];

export const hardwareOptions: HardwareOption[] = [
  {
    id: "standard",
    name: "Standard Lock & Handles",
    description: "High-quality single-point locks with heavy-duty handles.",
    priceModifierPerUnit: 0
  },
  {
    id: "premium",
    name: "Premium Multi-Point Security",
    description: "Espagnolette multi-point locks that latch at 3 positions.",
    priceModifierPerUnit: 1200
  },
  {
    id: "luxury_key",
    name: "Luxury Key-Locking Architectural",
    description: "Key-locking handles with internal friction stays.",
    priceModifierPerUnit: 2600
  }
];
