import { BusinessSettings, ServiceVertical, Project, Testimonial, FAQ, ServiceArea } from '@/types/entities';

export const businessSettings: BusinessSettings = {
  name: "Viswarkarma uPVC & Aluminium",
  tagline: "25+ Years of Custom Fabrication & Precision Installation | Pan-India Service",
  phone: "+91 98860 12345",
  whatsapp: "+919886012345",
  email: "contact@viswarkarmaupvc.com",
  address: "Rajahmundry Head Office & Fabrication Workshop, Rajahmundry, Andhra Pradesh, India",
  hours: "Monday - Saturday: 9:30 AM - 7:00 PM",
  googleMapUrl: "",
  experienceYears: 25
};

export const serviceVerticals: ServiceVertical[] = [
  {
    id: "upvc",
    title: "uPVC Windows & Doors",
    slug: "upvc",
    description: "Premium German-engineered uPVC profiles providing excellent thermal insulation, acoustic damping (up to 40dB reduction), water-tightness, and multi-point locking security. Customized for modern apartments and private villas.",
    image: "https://5.imimg.com/data5/RU/GG/VF/SELLER-64612523/upvc-sliding-window-profiles-500x500.jpg",
    system: "upvc",
    features: [
      "20-Year Profile Warranty",
      "Multi-point Locking Systems",
      "Steel Reinforcement Core",
      "Excellent Sound Insulation",
      "Zero Maintenance required"
    ]
  },
  {
    id: "aluminium",
    title: "Aluminium Windows & Doors",
    slug: "aluminium",
    description: "Sleek, architectural-grade aluminium systems with slim sightlines, thermal break technology, and superior structural strength. Ideal for large structural openings, high-rise wind loads, and modern panoramic views.",
    image: "https://5.imimg.com/data5/QG/ME/JW/SELLER-64612523/upvc-casement-window-500x500.jpg",
    system: "aluminium",
    features: [
      "Slim Architectural Profiles",
      "Thermal Break Technology",
      "Heavy Wind-Load Resistant",
      "Anodized & Powder Coated Finishes",
      "Lifetime Structural Durability"
    ]
  },
  {
    id: "mesh",
    title: "Mosquito Mesh Systems",
    slug: "mosquito-mesh",
    description: "Mosquito protection screens integrated directly into window/door profiles or retrofitted cleanly. We offer flexible fiberglass mesh, pleated mesh for wide balcony doors, and high-strength stainless steel security mesh.",
    image: "https://5.imimg.com/data5/SU/TW/MD/SELLER-64612523/heavy-duty-adjustable-copper-wheel-roller-500x500.jpg",
    system: "mesh",
    features: [
      "Pleated, Sliding & Roll-up systems",
      "SS304 Marine Grade Mesh",
      "Fiberglass Invisible Mesh",
      "Pest & Mosquito Shielding",
      "Smooth Child-Safe Operation"
    ]
  },
  {
    id: "glass",
    title: "Glass Railing & Structural Glass",
    slug: "glass-railing",
    description: "Premium architectural glass solutions including frameless glass railings for balconies, spider-fitting elevation glass, double-glazed structural partitions, and premium toughened glass work.",
    image: "https://5.imimg.com/data5/NM/TM/OQ/SELLER-64612523/toughened-glass-sliding-door-500x500.jpg",
    system: "glass",
    features: [
      "Toughened & Laminated Safety Glass",
      "Stainless Steel 316 Spigots & Handrails",
      "Spider-Fitting Structural Glazing",
      "Wind-Load Engineered Balconies",
      "Modern Architectural Look"
    ]
  }
];

export const projectsList: Project[] = [
  {
    id: "proj-1",
    title: "Modern Villa uPVC Installation",
    description: "Full-house custom uPVC casement windows and wide sliding doors installed for a luxury villa in Rajahmundry, featuring Golden Oak wood finish and double-glazed toughened glass.",
    image: "https://5.imimg.com/data5/MM/LH/JN/SELLER-64612523/upvc-modern-windows-500x500.jpg",
    category: "upvc",
    location: "Rajahmundry, Andhra Pradesh",
    completedYear: 2025,
    specs: {
      system: "uPVC Windows & Doors",
      series: "88mm Premium Sliding",
      glass: "6mm + 12Ar + 6mm DGU Toughened",
      color: "Golden Oak Finish"
    }
  },
  {
    id: "proj-2",
    title: "Commercial Building Aluminium Work",
    description: "Sleek slate-grey anodized aluminium sliding balcony windows engineered for high wind load resistance in a multi-story commercial building in Vijayawada.",
    image: "https://5.imimg.com/data5/QR/VY/TK/SELLER-64612523/casement-window-500x500.jpeg",
    category: "aluminium",
    location: "Vijayawada, Andhra Pradesh",
    completedYear: 2025,
    specs: {
      system: "Slimline Aluminium Systems",
      series: "90mm Thermal Break Sliding",
      glass: "6mm Clear Toughened Glass",
      color: "Anthracite Matte Grey"
    }
  },
  {
    id: "proj-3",
    title: "Frameless Glass Railing Installation",
    description: "Custom frameless glass balcony railings utilizing heavy-duty floor-mounted SS316 spigots and 12mm laminated toughened safety glass for clear views.",
    image: "https://5.imimg.com/data5/NM/TM/OQ/SELLER-64612523/toughened-glass-sliding-door-500x500.jpg",
    category: "glass",
    location: "Visakhapatnam, Andhra Pradesh",
    completedYear: 2024,
    specs: {
      system: "Frameless Glass Railing",
      series: "Heavy-Duty SS316 Base Spigots",
      glass: "12mm Laminated Toughened Safety Glass",
      color: "Satin Brush Finish"
    }
  },
  {
    id: "proj-4",
    title: "uPVC Sliding Doors with Integrated Pleated Mesh",
    description: "Multi-track uPVC sliding doors in Anthracite Grey color with integrated premium pleated mosquito mesh for a penthouse balcony in Hyderabad.",
    image: "https://5.imimg.com/data5/AL/LI/CS/SELLER-64612523/upvc-glass-double-door-500x500.jpg",
    category: "upvc",
    location: "Hyderabad, Telangana",
    completedYear: 2024,
    specs: {
      system: "uPVC Sliding Doors",
      series: "112mm Multi-Track Sliding",
      glass: "5mm + 9Ar + 5mm DGU Tinted",
      color: "Anthracite Grey"
    }
  }
];

export const testimonialsList: Testimonial[] = [
  {
    id: "t-1",
    name: "Subhash Chandran",
    role: "Homeowner",
    content: "We installed uPVC windows for our entire independent house in Rajahmundry. The soundproofing is remarkable. We live near a busy intersection, and once we close the windows, it is dead silent. Highly professional installation team.",
    rating: 5,
    location: "Rajahmundry, Andhra Pradesh",
    projectType: "uPVC Windows & Doors"
  },
  {
    id: "t-2",
    name: "Architect Anjali Mehta",
    role: "Lead Architect, Mehta & Associates",
    content: "As an architect, I am very picky about profiles and alignment. Viswarkarma uPVC has fabricated and installed profiles for three of my villa projects. Their attention to detail on gaskets, corner joints, and silicone sealing is top-tier.",
    rating: 5,
    location: "Visakhapatnam, Andhra Pradesh",
    projectType: "Architectural Aluminium Sliding Systems"
  },
  {
    id: "t-3",
    name: "Murali Krishna",
    role: "Villa Owner",
    content: "Highly recommend their pleated mosquito mesh systems. It slides smoothly and disappears when not in use. Their 25 years of experience shows in how they handled our crooked masonry openings and made everything look perfectly level.",
    rating: 5,
    location: "Vijayawada, Andhra Pradesh",
    projectType: "Pleated Mesh & uPVC Sliding Doors"
  }
];

export const faqsList: FAQ[] = [
  {
    id: "faq-1",
    question: "What is the difference between uPVC and Aluminium windows?",
    answer: "uPVC is excellent for thermal insulation, energy efficiency, and noise reduction (acoustic damping) at a lower relative cost, making it ideal for residential rooms. Aluminium offers higher structural strength, allowing for slimmer frames and much larger glass panes, which makes it suitable for massive sliding balcony doors and high-rise buildings.",
    category: "general"
  },
  {
    id: "faq-2",
    question: "How long does a typical home installation take?",
    answer: "Once site measurements are finalized, custom fabrication at our local fabrication facility takes about 7 to 10 days. The actual installation of windows in your home is fast, typically completed within 1 to 2 days depending on the number of units. We ensure minimal disruption and clean up after the job.",
    category: "installation"
  },
  {
    id: "faq-3",
    question: "Do you offer soundproofing glass?",
    answer: "Yes. For acoustic damping, we recommend Double Glazed Units (DGU) with varying glass thicknesses (e.g., 6mm + 12mm air gap + 5mm glass) or laminated acoustic glass. This setup can reduce incoming street noise by up to 35 to 40 decibels.",
    category: "upvc"
  },
  {
    id: "faq-4",
    question: "What warranty do you provide on your profiles?",
    answer: "We provide a 20-year warranty on our uPVC profiles against discoloration, cracking, or warping under UV exposure. We also provide a 2 to 5-year warranty on locking hardware, sliding rollers, and gaskets depending on the chosen grade.",
    category: "general"
  },
  {
    id: "faq-5",
    question: "Do you remove and dispose of our old wooden or steel windows?",
    answer: "Yes, we offer complete replacement services. Our team will carefully dismantle your existing wooden, steel, or old aluminium windows, clear the opening, install the new uPVC/aluminium frames, and handle the removal of old scrap if requested.",
    category: "installation"
  }
];

export const serviceAreas: ServiceArea[] = [
  {
    id: "sa-1",
    city: "Andhra Pradesh (HQ)",
    areas: ["Rajahmundry", "Vijayawada", "Visakhapatnam (Vizag)", "Kakinada", "Guntur", "Eluru", "Nellore", "Tirupati"],
    isMajor: true
  },
  {
    id: "sa-2",
    city: "Telangana & Hyderabad",
    areas: ["Gachibowli", "Jubilee Hills", "Madhapur", "Kondapur", "Secunderabad"],
    isMajor: false
  },
  {
    id: "sa-3",
    city: "Pan-India Services",
    areas: ["Mumbai", "Bengaluru", "Chennai", "Delhi NCR", "Kolkata", "Pune"],
    isMajor: false
  }
];
