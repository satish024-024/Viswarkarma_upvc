# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-06-21

### Added
- Next.js App Router workspace project initialized with TypeScript and Tailwind CSS v4.0.
- Installed `framer-motion` and `lucide-react` for premium layout transitions and iconography.
- Set up custom theme configuration in `app/globals.css` with a premium neutral base and cool blue/steel-blue accent colors.
- Created `types/entities.ts` defining data schemas for services, projects, testimonials, FAQs, and service areas.
- Formulated static database configurations in `lib/data/business.ts` representing Peenya fabrication workflows and project portfolios.
- Created `components/ui/` containing premium minimalist component sashes: `Button`, `Card`, `Input`, and `Select`.
- Created responsive global layout shell `components/public/Header.tsx` (sticky navigation drawer) and `components/public/Footer.tsx` (complete contact details & disclaimers).
- Structured customer-facing pages:
  - Homepage (`/`): with Hero, Trust metrics, uPVC, Aluminium, Projects slider, Configurator teaser, and Mosquito Mesh/Glass railings sections.
  - Subpages (`/about`, `/projects`, `/testimonials`, `/faq`, `/contact`, `/service-areas`).
  - System Overviews and details (`/upvc`, `/upvc/windows`, `/upvc/doors`, `/aluminium`, `/aluminium/windows`, `/aluminium/doors`, `/mesh/mosquito-mesh`, `/glass-railing`, `/elevation-work`).
  - Custom premium `404` Not Found page (`app/not-found.tsx`).
- Created the **Price Estimator Configurator Engine** (`features/configurator/`):
  - Catalog specifications in `config/data.ts`.
  - Realistic calculation formulas in `lib/estimator.ts` yielding estimated price guide ranges.
  - WhatsApp redirect compiler in `lib/whatsapp.ts` capturing preferred callback time, city, installation requirements, and unit counts.
  - Configurator Wizard Component (`components/Configurator.tsx`) with a dynamic live SVG blueprint preview.
  - Created configurator templates for `/quote` (universal), `/upvc/configurator`, and `/aluminium/configurator`.
- Added standard project documents: `README.md`, `PROJECT-ROADMAP.md`, `CONTENT-DATA-NEEDED.md`, `CHANGELOG.md`, and `TODO-BACKLOG.md`.
