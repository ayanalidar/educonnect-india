# EduConnect India 🇮🇳🎓

> The all-in-one SaaS platform for Indian education consultants — manage students, applications, partner universities, visas, and analytics across 1,000+ Indian and overseas institutions.

**Made & maintained by [GuardianX](https://github.com/guardianx)**

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6-indigo)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Demo Accounts](#demo-accounts)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Production Checklist](#production-checklist)
- [License](#license)

---

## Overview

EduConnect India is a comprehensive SaaS platform built for Indian education consultants who have tie-ups with multiple Indian and overseas educational institutes, colleges, and universities. It includes:

- **Stunning landing page** with 8 sections (Home, Company, Features, Partners, Pricing, Testimonials, Contact, Footer)
- **Full SaaS dashboard** with 24 views across 4 sidebar sections (AI Tools, Operations, Growth, Business)
- **Parent Portal** — separate login for parents to track their child's progress
- **Conversational AI Chatbot** — floating widget on every page, LLM-powered
- **10 Indian languages** with full i18n support
- **Full CRUD** — add, edit, delete for all major entities
- **Content Editor** — edit landing page content without code

---

## Features

### AI-Powered Tools (5)
- 🤖 **AI Course Matcher** — ML scores 1,048 universities against student profile
- 🎤 **AI Mock Visa Interviewer** — voice-based practice with TTS, 7 countries, LLM scoring
- 🎓 **Scholarship Finder Pro** — auto-matches students to 39+ scholarships
- 🔍 **Document OCR Engine** — Vision AI extracts fields from passport, IELTS, transcripts, SOP
- 💬 **Conversational AI Chatbot** — floating EduBot widget, LLM-powered, 24/7 lead capture

### Operations (7)
- 👥 **Student CRM** — pipeline with status filters, full CRUD
- 📋 **Application Tracker** — kanban board (DRAFT → ENROLLED)
- 🏫 **University Database** — 59 real institutions across 13 countries, full CRUD
- ✈️ **Visa Tracker** — stage-based workflow with progress bars
- 📨 **Communication Hub** — WhatsApp + Email + SMS unified inbox
- 📅 **Calendar & Booking** — auto-generates Meet links, Google + Outlook sync
- 🔔 **Smart Deadline Engine** — auto-urgency + auto-escalation

### Growth (3)
- 🎁 **Referral & Affiliate Engine** — referral codes, commission tracking, RazorpayX payouts
- ⚡ **Lead Magnets Engine** — 6 embeddable tools (eligibility checker, scholarship quiz, etc.)
- 🌍 **Country Guides Library** — 12 SEO destination profiles with full CRUD

### Business (8)
- 💰 **Finance & Invoicing** — GST-ready, commission tracking
- 📊 **Analytics Dashboard** — conversion funnels, counselor scorecards, AI insights
- 🏢 **Multi-branch Management** — 6 branches, role-based permissions, full CRUD
- 🛡️ **Compliance Audit Trail** — ISO 27001, DPDP, GDPR ready, CSV export
- 📝 **Content Editor** — edit landing page content without code
- 🔌 **Integrations Hub** — 12 integrations (WhatsApp, Razorpay, Gmail, VFS, Slack, Zoom, etc.)
- 📱 **Mobile App Preview** — interactive iOS/Android simulator
- 🧪 **Innovation Lab** — vote on what we build next

### Portals
- 👨‍👩‍👧 **Parent Portal** — separate login, track child's progress, messages, payments
- 🌐 **Multi-language** — 10 Indian languages (हिन्दी, தமிழ், తెలుగు, ಕನ್ನಡ, বাংলা, मराठी, ગુજરાતી, ਪੰਜਾਬੀ, മലയാളം, English)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) + TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York) |
| **Database** | Prisma ORM 6 + SQLite (dev) / PostgreSQL (prod) |
| **State** | Zustand (client) + TanStack Query (server) |
| **Auth** | Custom HMAC token (dev) → NextAuth.js / JWT (prod) |
| **AI** | z-ai-web-dev-sdk (LLM + VLM + TTS) |
| **Icons** | Lucide React |
| **Animations** | CSS animations + Framer Motion patterns |
| **Validation** | Zod |
| **Forms** | React Hook Form |

---

## Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Counselor | `demo@educonnect.in` | `demo1234` | Full dashboard (24 views) |
| Parent | `parent@educonnect.in` | `parent1234` | Parent Portal (tracks Aarav Sharma) |

---

## Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Set up environment
cp .env.example .env
# Edit .env with your values (DATABASE_URL, AUTH_SECRET, ZAI_API_KEY)

# 3. Set up database
bun run db:push

# 4. Seed demo data
bun run scripts/seed.ts

# 5. Start dev server
bun run dev
# → Open http://localhost:3000

# 6. Lint
bun run lint
```

---

## Project Structure

```
educonnect-india/
├── prisma/
│   └── schema.prisma              # 19 database models
├── scripts/
│   └── seed.ts                    # Seed 59 universities, 12 students, 39 scholarships, etc.
├── src/
│   ├── app/
│   │   ├── page.tsx               # Main page (landing + dashboard + parent portal)
│   │   ├── layout.tsx             # Root layout with metadata
│   │   ├── globals.css            # Brand styling + animations
│   │   └── api/                   # 30+ API routes
│   │       ├── auth/              # login, register, parent-login
│   │       ├── students/          # CRUD
│   │       ├── universities/      # CRUD
│   │       ├── matcher/           # AI Course Matcher
│   │       ├── scholarships/      # Scholarship Finder
│   │       ├── visa-interview/    # AI Mock Interview (start, evaluate, TTS)
│   │       ├── documents/         # OCR
│   │       ├── chat/              # Conversational AI
│   │       ├── deadlines/         # Smart Deadline Engine
│   │       ├── appointments/      # Calendar
│   │       ├── referrals/         # Referral Engine
│   │       ├── country-guides/    # Country Guides
│   │       ├── branches/          # Multi-branch
│   │       ├── lead-magnets/      # Lead Magnets
│   │       ├── audit-logs/        # Compliance
│   │       └── ...                # + 15 more endpoints
│   ├── components/
│   │   ├── site/                  # Landing page (navbar, hero, features, etc.)
│   │   ├── dashboard/             # Dashboard shell + 24 views
│   │   └── ui/                    # shadcn/ui components
│   ├── lib/                       # auth, db, i18n, utils
│   ├── store/                     # Zustand store
│   ├── context/                   # i18n React context
│   └── hooks/                     # Custom hooks
├── PRODUCTION_CHECKLIST.md        # What's needed for full production
└── README.md                      # This file
```

---

## API Reference

### Auth
- `POST /api/auth/login` — counselor login
- `POST /api/auth/register` — counselor signup
- `POST /api/auth/parent-login` — parent login

### Students (CRUD)
- `GET /api/students?q=&status=` — list with filters
- `POST /api/students` — create
- `PUT /api/students/[id]` — update
- `DELETE /api/students/[id]` — delete

### Universities (CRUD)
- `GET /api/universities?q=&country=` — list
- `POST /api/universities` — create
- `PUT /api/universities/[id]` — update
- `DELETE /api/universities/[id]` — delete

### AI Endpoints
- `POST /api/matcher` — AI Course Matcher (studentId → ranked universities + LLM explanations)
- `POST /api/visa-interview/start` — start mock interview session
- `POST /api/visa-interview/evaluate` — LLM scores answer
- `POST /api/visa-interview/tts` — TTS voice synthesis
- `POST /api/documents/ocr` — VLM extracts fields from document image
- `POST /api/chat` — conversational AI chatbot
- `POST /api/scholarships/match` — match student to scholarships

### Operations
- `GET/POST/PUT /api/appointments` — calendar management
- `GET/POST/PUT /api/referrals` — referral engine
- `GET /api/country-guides` — country guide library
- `GET/POST/PUT/DELETE /api/branches` + `/api/branches/create` — multi-branch
- `GET/POST /api/lead-magnets` — lead magnets
- `GET/POST /api/audit-logs` — compliance audit trail
- `GET/POST/PUT /api/deadlines` — smart deadline engine
- `GET /api/dashboard` — aggregated dashboard stats

All endpoints (except auth) require `Authorization: Bearer <token>` header.

---

## Database Schema

19 Prisma models:
- **Auth**: User
- **Students**: Student, Application, VisaApplication, Communication, DocumentRecord, Appointment, Deadline, VisaInterviewSession
- **Universities**: University, CountryGuide
- **Finance**: Invoice, Referral
- **Parent Portal**: Parent, ParentStudent, ParentMessage
- **Growth**: LeadMagnet, Scholarship
- **Organization**: Branch, AuditLog
- **Chatbot**: ChatConversation, ChatMessage

See `prisma/schema.prisma` for full schema.

---

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import at vercel.com
3. Add environment variables (see PRODUCTION_CHECKLIST.md)
4. Deploy

### Self-hosted
```bash
docker build -t educonnect-india .
docker run -d --env-file .env.production -p 3000:3000 educonnect-india
```

See `PRODUCTION_CHECKLIST.md` for detailed deployment + production readiness guide.

---

## Production Checklist

See **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** for the full list of what's needed to go live — including database migration, security hardening, payment integration, compliance, and monitoring.

---

## License

MIT License — see [LICENSE](./LICENSE) file.

---

**Made & maintained by [GuardianX](https://github.com/guardianx)**

🇮🇳 Built with care in Mumbai
