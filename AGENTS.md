# Project Context: aldr-site-astro

## Overview

`aldr-site-astro` is a premium corporate and product showcase website built for
**ALDR (Advanced Laboratory Durable Reliable)**. The site is engineered with
**Astro** for high performance and SEO, leveraging **React** for rich
interactivity.

The design philosophy prioritizes a "Premium" and "High Quality" aesthetic,
reflecting the company's status as a Fortune Global 500 Vendor.

## Tech Stack

### Core

- **Framework:** [Astro 5](https://astro.build/) (Server-first, Content
  Collections)
- **UI Library:** [React 18](https://react.dev/)
- **Language:** TypeScript
- **Package Manager:** `pnpm` (Strictly enforced)

### Styling & Design System

- **Tailwind CSS 3.4**: Utility-first styling.
- **Component Library:** [@heroui/react](https://heroui.com/) (formerly NextUI)
  for accessible, beautiful UI components.
- **Primitives:** [Radix UI](https://www.radix-ui.com/) for unstyled, accessible
  interactive primitives.
- **Animation:** `tailwindcss-animate`, `framer-motion` for complex
  interactions.
- **Icons:** `lucide-react`.
- **Utils:** `clsx` and `tailwind-merge` for safe class composition.

### Backend & Data

- **Backend:** [Supabase](https://supabase.com/)
  - **Database:** PostgreSQL
  - **Auth:** Supabase Auth (if applicable)
  - **Edge Functions:** for dynamic logic (`cx_rfq`, `location`)
- **Content:**
  - **Static:** MDX via Astro Content Collections, loaded from
    `src/assets/data/` (`news`, `services`) via glob loader (see
    `src/content.config.ts`).
  - **Internationalization:** JSON dictionaries in `src/assets/i18n/`
    (`ar_sa.json`, `en_us.json`, `es_es.json`, `fr_fr.json`, `zh_cn.json`).
    Locales: `en`, `zh`, `fr`, `es`, `ar`.

## Key Directory Structure

```text
/
├── public/                 # Static assets (favicons, robots.txt)
├── scripts/                # Maintenance scripts (inspect-products.ts, etc.)
├── src/
│   ├── assets/             #
│   │   ├── data/           # mdx files and translated pages (news, pages, services)
│   │   ├── i18n/           # Translation files (ar_sa.json, en_us.json, es_es.json, fr_fr.json, zh_cn.json)
│   │   └── images/         # Optimized images
│   ├── components/
│   │   ├── ui/             # Shared UI components (Buttons, Inputs - often wrapping Radix/HeroUI)
│   │   ├── products/       # Product catalog specific components
│   │   └── ...
│   ├── i18n/               # i18n utilities (ui.ts, utils.ts)
│   ├── layouts/            # Global layouts (PageLayout.astro, BaseLayout.astro)
│   ├── lib/                # Core utilities
│   │   ├── api/            # API helpers
│   │   ├── types/          # Shared TypeScript types
│   │   └── supabase.ts     # Supabase client initialization
│   ├── pages/              # File-based routing (Astro)
│   ├── store/              # Client state (cart.ts, admin-ui.ts, product-translations.ts)
│   ├── styles/             # Global CSS (globals.css)
│   ├── config.ts           # App configuration
│   ├── content.config.ts   # Astro Content Collections config
│   ├── env.d.ts            # ImportMetaEnv types
│   └── middleware.ts       # Astro middleware
├── supabase/
│   ├── functions/          # Deno Edge Functions
│   ├── migrations/         # SQL Schema migrations
│   └── seed.sql            # Local dev data
├── astro.config.mjs        # Astro configuration
├── tailwind.config.js      # Tailwind & HeroUI config
└── package.json            # Scripts & Dependencies
```

## Development Workflow

### Commands

| Command        | Description                                |
| :------------- | :----------------------------------------- |
| `pnpm install` | Install dependencies (Strictly use pnpm)   |
| `pnpm dev`     | Start local server (http://localhost:4321) |
| `pnpm build`   | Production build                           |
| `pnpm preview` | Preview production build                   |

### Conventions & Best Practices

#### 1. Coding Style

- **Type Safety:** All code must be strongly typed with TypeScript. Use
  `interface` for object definitions.
- **Imports:** Use absolute imports where configured, or consistent relative
  imports.
- **File Naming:**
  - React Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
  - Astro Components: `PascalCase.astro` (e.g., `HeroSection.astro`)
  - Utilities: `camelCase.ts` (e.g., `formatDate.ts`)

#### 2. Styling (Critical)

- **Aesthetics:** The user expects a "WOW" factor. Use gradients, subtle shadows
  (`box-shadow`), and smooth transitions. Avoid flat, boring colors.
- **Composition:** ALWAYS use `cn()` (utility wrapping `clsx` +
  `tailwind-merge`) when merging classes.
  ```tsx
  // Good
  <div className={cn("bg-white p-4 rounded-lg", className)}>...</div>;
  ```
- **Dark Mode:** Ensure all components support dark mode via `dark:` variants.

#### 3. Data Fetching & Supabase

- **Client-side:** Use the exported `supabase` client from `@/lib/supabase`.
- **Server-side (Astro):** Prefer fetching data in the Astro frontmatter (Server
  Islands) for SEO-critical content.
- **Environment:** Use `import.meta.env.PUBLIC_SUPABASE_URL` and
  `import.meta.env.PUBLIC_SUPABASE_KEY`.

#### 4. Internationalization (i18n)

- All text visible to users must be tokenized and pulled from `src/assets/i18n`.
- Do not hardcode strings in components.
