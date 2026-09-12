# 🚀 Portfolio v3.0 — Md. Jasim

<div align="center">

<img src="./public/person-vector.png" alt="Md. Jasim" width="160" height="160" style="border: 3px solid #01B4BA; border-radius: 50%; display: inline-block; margin-bottom: 16px; object-fit: cover;" />

### Full Stack Developer & Software Instructor

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Portfolio-00d4ff?style=for-the-badge)](https://ismailjosim.com)
[![GitHub](https://img.shields.io/badge/GitHub-ismailjosim-181717?style=for-the-badge&logo=github)](https://github.com/ismailjosim)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A high-performance, full-stack personal portfolio and admin management platform built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and MongoDB.**

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Public Portfolio Showcase](#-public-portfolio-showcase)
- [Admin Command Center (Dashboard)](#-admin-command-center-dashboard)
- [Featured Projects](#-featured-projects)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Contact](#-contact)
- [License](#-license)

---

## 🧑‍💻 About The Project

**Portfolio v3.0** is an enterprise-grade personal developer platform designed to highlight real-world engineering work, technical writing, interactive skills, and professional experience.

Unlike traditional static portfolios, this application is backed by a full **Next.js 16 App Router** backend and a **MongoDB** database, featuring a dedicated **Admin Command Center** (`/dashboard`) for dynamic content management, real-time analytics, article authoring with Markdown, and project showcase management.

> *"Passionate Full Stack Developer focused on building efficient, scalable, and engaging digital experiences."*

---

## ✨ Key Features

- 🎨 **Multi-Palette Theme Engine**: 5 dynamic dark theme palettes (Electric Cyan, Neon Indigo, Emerald Matrix, Sunset Amber, Cyberpunk Purple) with smooth theme persistence via `next-themes`.
- 📱 **100% Pixel-Perfect Responsive Design**: Fluid mobile-first layouts with zero overflow, optimized touch targets, and responsive table pagination.
- ⚡ **High-Performance Architecture**: Next.js 16 Server Components, Streaming SSR with Suspense, and instant Skeleton loading states across all routes.
- 🛡️ **Protected Admin Dashboard**: Complete CRUD command center with role-based auth, metrics calculation, and collapsible rail navigation.
- ✍️ **Markdown Article Hub**: Live Markdown editor (`@uiw/react-md-editor`), slug generation, tag categorization, view tracking, like counters, and moderated comment threads.
- 🖼️ **Media Pipeline**: Cloudinary integration for cloud-optimized project demos, blog cover images, and asset delivery.
- 📬 **Transactional Messaging**: Contact inquiries delivered directly to inbox via Resend API with server action validation.
- 📊 **Dynamic GitHub & Stat Visualizers**: Real-time contribution heatmap, interactive metrics, and animated experience timeline.

---

## 🌐 Public Portfolio Showcase

| Section | Description |
|---|---|
| **Hero / Home** | Dynamic headline with `react-typed` animation, morphing avatar card, and quick social links. |
| **About Me** | Background story, teaching philosophy, and core focus areas. |
| **Featured Projects** | Handcrafted project showcase with tech pills, live deployment links, GitHub repositories, and interactive case study modals (`/projects/[slug]`, `/all-projects`). |
| **Technical Skills** | Categorized arsenal (Frontend, Backend, Database, Cloud & DevOps, Tools) with visual proficiency ratings. |
| **Work Experience** | Chronological career timeline as instructor, developer, and team lead. |
| **Working Areas** | Specialized focus areas: Full Stack Web, Architecture, Database Engineering, and UI/UX systems. |
| **Education & Certifications** | Academic degree milestones and verified professional certifications. |
| **Articles & Insights** | Published technical blogs with real-time reading metrics, category filters, and interactive comment sections (`/blogs/[slug]`). |
| **Contact Form** | Validated direct contact form with server actions and Resend email delivery. |

---

## 🎛️ Admin Command Center (`/dashboard`)

The dashboard provides full content and telemetry management:

- **Command Center Overview (`/dashboard/overview`)**:
  - Live KPI bento grid: Total articles, aggregate readership views, showcase projects, and technical skills.
  - Content & Engagement Intelligence card with like/comment ratios and recent post monitoring.
  - Skills distribution matrix and category breakdown bars.
- **Blog Hub (`/dashboard/blog`)**: Full authoring suite with status lifecycle (`draft`, `review`, `scheduled`, `published`, `archived`), tag management, and search filters.
- **Projects Management (`/dashboard/projects`)**: Create, update, feature, and showcase engineering projects with multiple screenshots.
- **Skills Matrix (`/dashboard/skills`)**: Manage technical competencies, categories, and proficiency levels.
- **Comment Moderation (`/dashboard/comments`)**: Moderate user comments, toggle visibility, and mark spam.
- **Experiences Management (`/dashboard/experiences`)**: Maintain professional timeline entries.

---

## 🖼️ Featured Projects

The portfolio dynamically showcases real-world applications engineered by Md. Jasim:

### 1. 🎯 Habitix — Student Productivity & Collaboration Platform
- **Type**: Full Stack Web Application & SaaS
- **Tech Stack**: Next.js, TypeScript, Prisma, Cloudinary, Shadcn UI, Tailwind CSS, Zod, Radix UI, next-themes
- **Highlights**:
  - Focus Mode with persistent timer, daily streak tracking, and productivity analytics.
  - Interactive Kanban board for task, subtask, and deadline management.
  - Peer Coding Help Desk with mentor assistance and contribution reward mechanics.
  - Real-time productivity heatmaps, weekly/monthly leaderboards, and automated badge recognition.
- **Live Demo**: [habitix.ismailjosim.com](https://habitix.ismailjosim.com) • **Source**: [GitHub](https://github.com/ismailjosim/habitix.git)

### 2. 🔐 DevVault — Developer Vault & Secret Toolkit
- **Type**: Full Stack SaaS Tooling Platform
- **Tech Stack**: Next.js, React.js, TypeScript, MongoDB, Tailwind CSS, Better Auth, Shadcn UI, Zod, React Hook Form
- **Highlights**:
  - Encrypted environment variable vault with one-click copy and `.env` file import/export.
  - Cryptographic password, JWT secret, and secure random token generator.
  - Categorized code snippet manager with syntax highlighting and instant fuzzy search.
  - Project-level credentials organization with protected authentication.
- **Live Demo**: [devault.ismailjosim.com](https://devault.ismailjosim.com) • **Source**: [GitHub](https://github.com/ismailjosim/dev-vault.git)

### 3. 🗺️ Traveler — Tour Management & Booking System
- **Type**: Full Stack Travel Platform
- **Tech Stack**: Next.js, React, Node.js, Express, MongoDB, Leaflet, Recharts, Cloudinary, Redis, PDFKit
- **Highlights**:
  - End-to-end tour booking workflow with automated PDF invoice generation.
  - Interactive map routing with Leaflet and performance metrics with Recharts.
  - Guide dashboard for managing itineraries and tracking earnings.
  - Redis caching layer for high-throughput tour queries and Cloudinary image pipelines.
- **Live Demo**: [traveler.ismailjosim.com](https://traveler.ismailjosim.com) • **Source**: [GitHub](https://github.com/ismailjosim/tour-management-system-client.git)

### 4. 🍽️ Bistro Boss — Restaurant Web Application
- **Type**: Full Stack Food Ordering Platform
- **Tech Stack**: React.js, Node.js, Express.js, MongoDB, Firebase, Stripe, JWT, Tailwind CSS, DaisyUI
- **Highlights**:
  - Role-based authorization separating Admin capabilities from customer accounts.
  - Dynamic shopping cart checkout powered by the Stripe payment gateway.
  - Administrative menu item CRUD, reservation management, and sales reporting.
- **Live Demo**: [bistro-boss-restarunt.web.app](https://bistro-boss-restarunt.web.app/) • **Source**: [GitHub](https://github.com/ismailjosim/bistro-boss-client)

### 5. 💎 Glassmorphism & Responsive Web Showcase
- **Type**: Modern Frontend UI/UX Architecture
- **Tech Stack**: HTML5, CSS3, JavaScript, Backdrop Filter Effects, CSS Gradients, Flexbox/Grid
- **Highlights**: Real-time frosted glass UI elements, fluid responsive breakpoints, and tactile CSS micro-interactions.
- **Live Demo**: [glassmorphism-website-design.netlify.app](https://glassmorphism-website-design.netlify.app) • **Source**: [GitHub](https://github.com/ismailjosim/Glassmorphism-website-design)

---

## 🛠️ Tech Stack

### Frontend & UI
- **Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19.2.3](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & `tw-animate-css`
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/) primitives
- **Motion**: [Motion 12](https://motion.dev/) (framer-motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Management**: `react-hook-form`, `@hookform/resolvers`, `zod`
- **Notifications**: `sonner` toasts

### Backend & Database
- **Runtime**: Next.js Server Actions & Route Handlers
- **Database**: [MongoDB](https://www.mongodb.com/)
- **ODM**: [Mongoose 9.3.3](https://mongoosejs.com/)
- **Cloud Media**: [Cloudinary](https://cloudinary.com/) (`next-cloudinary`) & [Uploadthing](https://uploadthing.com/)
- **Email Delivery**: [Resend](https://resend.com/)

---

## 📁 Project Architecture

```
portfolio-project/
├── public/                     # Static assets (images, icons, vector profile)
├── scripts/
│   └── migrate-add-fields.mjs  # Idempotent Mongoose database migration script
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public pages)      # /, /blogs, /blogs/[slug], /all-projects, /projects/[slug]
│   │   ├── api/                # Route handlers (blogs, projects, skills, comments, analytics)
│   │   ├── dashboard/          # Protected Admin Dashboard
│   │   │   ├── overview/       # Command center analytics & KPI metrics
│   │   │   ├── blog/           # Blog CRUD & Markdown authoring
│   │   │   ├── projects/       # Projects management
│   │   │   ├── skills/         # Skills matrix management
│   │   │   ├── comments/       # Comment moderation & spam filter
│   │   │   └── experiences/    # Career timeline management
│   │   ├── globals.css         # Tailwind v4 tokens, 5 palettes, sleek scrollbar
│   │   └── layout.tsx          # Root layout with ThemeProvider & fonts
│   ├── components/
│   │   ├── dashboard/          # Dashboard analytics cards, overview skeleton, breadcrumbs
│   │   ├── modules/            # Domain-specific management tables, filters, and dialogs
│   │   ├── projects/           # Public project showcase cards & details dialogs
│   │   ├── blog/               # Article renderers, markdown parser, comment lists
│   │   ├── sections/           # Modular homepage sections (Hero, About, Projects, Skills, etc.)
│   │   ├── shared/             # Reusable UI (Navbar, Footer, TablePagination, SearchFilter, Skeletons)
│   │   └── ui/                 # Shadcn primitives (Button, Dialog, Dropdown, Table, Tooltip, etc.)
│   ├── models/                 # Mongoose schemas (Blog, Project, Skill, Comment, Experience)
│   ├── services/               # Server-side business logic & database queries
│   ├── types/                  # TypeScript domain interfaces and declarations
│   └── lib/                    # Shared utilities (db connect, formatters, server-fetch)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `pnpm` (recommended), `npm`, or `yarn`
- **MongoDB**: A local or cloud [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI
- **Cloudinary Account**: For media uploads
- **Resend API Key**: For contact form email delivery

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ismailjosim/portfolio-v2.0.git
   cd portfolio-project
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Database Connection
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/Portfolio"
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"

   # Admin Authentication
   DASHBOARD_EMAIL="admin@yourdomain.com"
   DASHBOARD_PASSWORD="YourSecurePasswordHere"

   # Cloudinary Media Storage
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   NEXT_PUBLIC_CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"

   # Email Service (Resend)
   RESEND_API_KEY="re_your_resend_key_here"
   CONTACT_EMAIL="your_email@domain.com"
   ```

4. **Run Database Migrations** (Idempotent schema initialization):
   ```bash
   pnpm migrate
   ```

5. **Start Development Server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Starts the Next.js development server with Turbopack |
| `pnpm build` | Compiles and optimizes the production build |
| `pnpm start` | Runs the compiled production server |
| `pnpm lint` | Runs ESLint 9 checks across the codebase |
| `pnpm format` | Formats all files with Prettier |
| `pnpm migrate` | Executes idempotent database migrations for missing document fields |

---

## 📬 Contact & Connect

**Md. Jasim** — Full Stack Developer & Instructor

- 🌐 **Portfolio**: [ismailjosim.com](https://ismailjosim.com)
- 🐙 **GitHub**: [@ismailjosim](https://github.com/ismailjosim)
- 💼 **LinkedIn**: [linkedin.com/in/ismailjosim](https://linkedin.com/in/ismailjosim)
- ✉️ **Email**: [ismailjosim@gmail.com](mailto:ismailjosim@gmail.com)

---

<div align="center">

Made with ❤️ by **Md. Jasim** • Star ⭐ this repository if you find it helpful!

</div>
