# ALDR (Advanced Laboratory Durable Reliable)

[![Astro](https://img.shields.io/badge/Astro-5.0-orange?style=flat-square&logo=astro)](https://astro.build/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

A premium corporate and product showcase website built for **ALDR**. Engineered
for high performance, SEO, and rich interactivity.

🔗 **Live Site:** [www.aldreme.com](https://www.aldreme.com)

---

## ✨ Features

- **🚀 High Performance:** Built with Astro 5 for optimal server-side rendering
  and static generation.
- **💎 Premium Design:** Luxurious UI built with **HeroUI** and **Framer
  Motion**.
- **📦 Product Catalog:** Comprehensive product showcase with technical
  specifications.
- **📨 RFQ System:** Integrated Global Request for Quote system powered by
  **Supabase Edge Functions**.
- **🌍 Internationalization:** Robust i18n support for global reach.
- **🌙 Dark Mode:** Full support for sleek, high-end dark aesthetics.

---

## 🛠️ Tech Stack

- **Framework:** [Astro 5](https://astro.build/)
- **Interactivity:** [React 18](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) +
  [HeroUI](https://heroui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) +
  `tailwindcss-animate`
- **Backend:** [Supabase](https://supabase.com/) (PostgreSQL, Edge Functions)
- **CMS/Content:** MDX + Astro Content Collections

---

## 📂 Project Structure

```text
/
├── public/                 # Static assets (favicons, robots.txt)
├── src/
│   ├── assets/             # Images, JSON data, i18n dictionaries
│   ├── components/         # React & Astro components
│   ├── content/            # MDX Content Collections (News, Products)
│   ├── layouts/            # Global page layouts
│   ├── lib/                # Shared utilities & Supabase client
│   ├── pages/              # File-based routing
│   └── styles/             # Global CSS & Tailwind configuration
├── supabase/
│   ├── functions/          # Deno Edge Functions (cx_rfq, location)
│   └── migrations/         # Database schema migrations
├── astro.config.mjs        # Astro configuration
└── package.json            # Scripts & Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS)
- [`pnpm`](https://pnpm.io/) (Strictly enforced)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The site will be available at `http://localhost:4321`.

### Production Build

```bash
pnpm build
pnpm preview
```

---

## 👷 Development Workflow

### Supabase Integration

The project uses Supabase for backend logic (Edge Functions).

- **Local Development:** Ensure `.env.local` is configured with
  `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_KEY`.
- **Edge Functions:** Managed via `supabase/functions`.
- **Deployment:** `pnpm supabase functions deploy`

---

## ⚖️ License

© 2026 ALDR (Advanced Laboratory Durable Reliable). All rights Reserved.
