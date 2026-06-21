# Daddy uPVC & Aluminium Website Platform (V1)

A production-grade, customer-facing web platform for a **25+ year family-run uPVC, Aluminium, Mosquito Mesh, and Architectural Glass fabrication & installation business**.

This platform is structured around a **WhatsApp-First conversion funnel** with an interactive price estimator. It has **no client login, customer accounts, or admin auth in V1**, keeping the codebase slim, highly secure, and focused on generating qualified leads.

---

## 🚀 Tech Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS v4.0 (with a custom premium neutral base + steel-blue accent theme)
- **Icons**: Lucide React
- **Animations**: Framer Motion (for smooth step transitions and micro-interactions)
- **Handoff**: Custom URL encoder that compiles system configurations directly into structured WhatsApp messages.

---

## 📁 Directory Structure

```
d:/Daddy_upvc/
├── app/                       # App Router structure
│   ├── (public)/              # Core customer pages (Header/Footer layout)
│   │   ├── page.tsx           # Premium Homepage (Hero, Trust strip, uPVC, Aluminium, Projects, Configurator, Mesh/Glass)
│   │   ├── about/             # About Us heritage details
│   │   ├── projects/          # Showcase gallery filterable by system
│   │   ├── testimonials/      # Client reviews
│   │   ├── faq/               # Common client questions
│   │   ├── contact/           # General contact and site survey requests
│   │   ├── quote/             # Universal price estimator configurator
│   │   ├── service-areas/     # Cities/regions served
│   │   ├── upvc/              # uPVC overview, Windows, and Doors
│   │   ├── aluminium/         # Aluminium overview, Windows, and Doors
│   │   ├── mesh/              # Mosquito mesh solutions
│   │   ├── glass-railing/     # Balcony glass / railing details
│   │   └── elevation-work/    # Facade elevation glass details
│   ├── layout.tsx             # Root layout (fonts, providers)
│   ├── globals.css            # Base Tailwind v4 style config & color variables
│   └── not-found.tsx          # Custom premium 404 page
├── components/                # Reusable UI components
│   ├── ui/                    # Premium minimalist custom elements (Button, Card, Input, Select)
│   └── public/                # Navigation header & footer layouts
├── features/                  # Domain-driven features
│   └── configurator/          # Configurator components, state store, and helpers
│       ├── components/        # Wizard Form Stepper & SVG Blueprint visualizer
│       ├── config/            # Pricing guidelines, series lists, colours list
│       ├── lib/               # WhatsApp message builder & pricing estimator
│       └── types/             # Configurator domain typings
├── lib/                       # General utilities
│   ├── data/                  # Static business copy (projects, testimonials, FAQs)
│   └── utils.ts               # Formatting, tailwind-merge, clsx, formatINR helper
├── types/                     # Shared TypeScript typings
│   └── entities.ts            # Content entities types (Project, Testimonial, FAQ, Service)
└── docs/                      # Standard documentation files
    ├── README.md
    ├── PROJECT-ROADMAP.md
    ├── CONTENT-DATA-NEEDED.md
    ├── CHANGELOG.md
    └── TODO-BACKLOG.md
```

---

## 🛠️ Configurator Architecture

The estimator is divided into clean logical pieces:
1. **Catalog Config** (`features/configurator/config/data.ts`): Houses the items, base rates per square foot, thickness data, glass and mesh multipliers, and flat hardware charges.
2. **Estimator Engine** (`features/configurator/lib/estimator.ts`): Computes the square footage and applies:
   $$\text{UnitPrice} = \left((\text{BasePrice} + \text{SeriesModifier}) \times \text{ColorMultiplier} + \text{GlassModifier} + \text{MeshModifier}\right) \times \text{Area} + \text{HardwareModifier}$$
   Adds a professional installation charge if selected (₹60/sq.ft. or minimum ₹1,500/unit), and gives a 15% range for estimated min/max totals.
3. **WhatsApp Linker** (`features/configurator/lib/whatsapp.ts`): Combines the configuration selections and contact details into a structured, readable message and outputs a `wa.me` redirect link.

---

## 👨‍💻 Local Setup & Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to `http://localhost:3000` to preview the site.

---

## 🌿 Version Control & Branch Workflow

1. **Main Branch (`main`)**: Clean, tested, production-ready branch. Always deployable.
2. **Development Branch (`dev`)**: Ongoing integration branch.
3. **Feature Branches (`feature/name`)**: Where new features are built.
   - Example feature branches:
     - `feature/homepage-refinements`
     - `feature/configurator-3d`
     - `feature/pricing-rules`
4. **Workflow steps**:
   - Create feature: `git checkout -b feature/upvc-configurator dev`
   - Test locally: run `npm run build` and `npx tsc --noEmit`
   - Merge back: open a PR from `feature/upvc-configurator` into `dev`
   - Stable merge: Merge `dev` into `main` after verification.
