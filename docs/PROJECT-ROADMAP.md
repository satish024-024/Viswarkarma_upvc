# Project Roadmap - Daddy uPVC & Aluminium Platform

This document outlines the planned future phases for expanding and polishing the platform.

---

## 📍 Phase 1: Foundation & Skeletons (Completed)
- Next.js App Router project initialized.
- Custom premium theme (neutral base + steel-blue accents) integrated via Tailwind v4.0.
- All core and sub-vertical public routes mapped out.
- Multi-step customer-facing configurator implemented with live dynamic SVG blueprinting.
- WhatsApp enquiry message compiler and link redirect integrated.
- Static business database setup (projects, testimonials, FAQs).

---

## 🎨 Phase 2: Copywriting & High-Fidelity Styling (Next)
- Incorporate real assets and copywriting (about us historical pictures, factory Peenya photos).
- Integrate actual testimonials from Jayanagar, Indiranagar, Whitefield.
- Polish layout margins, cards transitions, and spacing using custom animations.
- Refine visual colors inside SVG schematic based on exact color profiles.

---

## 🧮 Phase 3: Advanced Pricing & Estimator Logic
- Hook up multiple custom hardware suppliers (e.g. Siegenia, Kinlong, Yale, Giesse) with custom unit prices.
- Add window configurations modifiers (combination windows, bay windows, tilt-and-turn ratios).
- Set up custom discounts for large orders (e.g., volume discount of 5% if ordering > 10 units).
- Formulate tax / GST estimation inclusions or exclusions.

---

## 📦 Phase 4: 3D Product Visualizations (Three.js / React Three Fiber)
- Integrate `@react-three/fiber` and `@react-three/drei`.
- Build a lightweight 3D canvas inside the configurator right column.
- Render 3D window frames that can:
  - Rotate 360 degrees to inspect double glazed unit thickness.
  - Slide open/close on mouse click.
  - Apply realistic wood-grain textures (Golden Oak, Walnut) or matte finishes (Anthracite Grey).

---

## 🔍 Phase 5: City-Level Local SEO Landing Pages
- Generate dynamic templates at `/locations/[city]/upvc-windows` and `/locations/[city]/aluminium-windows`.
- Support cities in Karnataka: Bengaluru, Mysuru, Tumakuru, Mangaluru, Hubballi.
- Structure landing pages with localized FAQs and project logs to capture search engine leads.

---

## 🏢 Phase 6: Optional Database & Admin Portal
- Set up Supabase Postgres schemas from V1 TypeScript definitions.
- Implement dashboard to manage:
  - Contact submissions and leads.
  - Projects gallery CRUD.
  - Live uPVC profile price per sq ft base rates.
- Add admin login utilizing secure Supabase Auth.
