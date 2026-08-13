# EduConnect India — Production Readiness Checklist

**Made & maintained by GuardianX**

This document outlines what's needed to take EduConnect India from the current state (fully functional demo with seeded data) to a production-ready, publicly-deployed SaaS platform.

---

## ✅ What's Already Built (Current State)

### Backend
- 19 Prisma models (User, Student, University, Application, Visa, Communication, Invoice, Lead, Parent, ParentStudent, ParentMessage, DocumentRecord, Scholarship, Deadline, ChatConversation, ChatMessage, VisaInterviewSession, Appointment, Referral, CountryGuide, Branch, LeadMagnet, AuditLog)
- 30+ API routes with HMAC Bearer token auth
- SQLite database (dev) with 59 universities, 12 students, 39 scholarships, 12 country guides, 6 branches, 6 lead magnets, 12 audit logs seeded
- AI integrations: LLM (chatbot, course matcher explanations, visa interview eval), VLM (document OCR), TTS (visa interview voice)

### Frontend
- Stunning landing page with 8 sections (Hero, Company, Features, How It Works, Partners, Testimonials, Pricing, Contact)
- Full SaaS dashboard with 24 views across 4 sidebar sections
- Parent portal (separate login + UI)
- Floating AI chatbot widget
- 10 Indian languages with full i18n
- Full CRUD: Add/Edit/Delete for students, universities, branches, country guides + Add for appointments, referrals, applications, invoices, visa, documents
- Content Editor for landing page customization

### Auth
- Counselor auth (HMAC token-based, persisted in localStorage)
- Parent auth (separate token with `PARENT:` prefix)
- Demo accounts: `demo@educonnect.in` / `demo1234` (counselor), `parent@educonnect.in` / `parent1234` (parent)

---

## 🚧 What's Needed for Full Production

### 1. Database (Critical)
- [ ] **Migrate from SQLite to PostgreSQL** (or MySQL)
  - SQLite is file-based and doesn't support concurrent writes well
  - Update `prisma/schema.prisma` datasource provider
  - Set up managed PostgreSQL (AWS RDS, Supabase, Neon, or Railway)
  - Run `bun run db:migrate deploy` for production schema
- [ ] **Set up connection pooling** (PgBouncer or Prisma Accelerate)
- [ ] **Automated daily backups** with 30-day retention
- [ ] **Database monitoring** (Datadog, PlanetScale insights, or Supabase metrics)

### 2. Authentication & Security (Critical)
- [ ] **Replace HMAC tokens with JWT** (or use NextAuth.js / Auth0 / Clerk)
  - Current HMAC tokens don't expire — add 24h expiry + refresh tokens
- [ ] **Password hashing**: Switch from HMAC to `bcrypt` (10+ rounds)
- [ ] **Rate limiting**: Add to all auth endpoints (5 attempts / 15 min / IP)
- [ ] **CSRF protection**: Add to all form submissions
- [ ] **HTTPS enforcement**: Redirect all HTTP to HTTPS
- [ ] **Security headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- [ ] **OAuth providers**: Google, Microsoft (for counselor SSO)
- [ ] **2FA / OTP**: For admin accounts
- [ ] **Session management**: Server-side session store (Redis)

### 3. Environment Variables (Critical)
Create `.env.production` with:
```env
DATABASE_URL="postgresql://user:pass@host:5432/educonnect"
AUTH_SECRET="<64-char-random-string>"  # Used for HMAC/JWT signing
NEXTAUTH_URL="https://app.educonnect.in"
NEXTAUTH_SECRET="<different-64-char-string>"

# AI APIs (already using z-ai-web-dev-sdk — ensure API key is set)
ZAI_API_KEY="<your-z-ai-api-key>"

# Payment
RAZORPAY_KEY_ID="<rzp_live_...>"
RAZORPAY_KEY_SECRET="<...>"

# Communication
WHATSAPP_BUSINESS_API_TOKEN="<...>"
WHATSAPP_PHONE_NUMBER_ID="<...>"
TWILIO_ACCOUNT_SID="<AC...>"
TWILIO_AUTH_TOKEN="<...>"
RESEND_API_KEY="<re_...>"  # or SendGrid

# Storage (for document uploads)
S3_BUCKET="educonnect-documents"
S3_REGION="ap-south-1"
S3_ACCESS_KEY="<...>"
S3_SECRET_KEY="<...>"

# Analytics
POSTHOG_KEY="<phc_...>"
SENTRY_DSN="<https://...>@sentry.io/..."

# Calendar
GOOGLE_CALENDAR_CLIENT_ID="<...>"
GOOGLE_CALENDAR_CLIENT_SECRET="<...>"
ZOOM_API_KEY="<...>"
ZOOM_API_SECRET="<...>"
```

### 4. File Storage (Critical for Document OCR)
- [ ] **Replace base64 OCR with S3 upload flow**
  - Currently documents are sent as base64 to the VLM API (max 4MB)
  - Production: upload to S3 → generate presigned URL → send URL to VLM
- [ ] **Virus scanning** on all uploaded files (ClamAV or AWS GuardDuty)
- [ ] **File retention policies** (auto-delete after 7 years per DPDP Act)
- [ ] **Encryption at rest** (S3 server-side encryption)

### 5. Payment Integration
- [ ] **Razorpay live keys** for fee collection
- [ ] **RazorpayX** for referral commission payouts
- [ ] **Webhook handlers** for payment status updates
- [ ] **GST e-invoice API** integration (for auto-filing)
- [ ] **Refund workflow**

### 6. Communication Integrations
- [ ] **WhatsApp Business API**: Apply for WhatsApp Business account, verify template messages, get phone number
- [ ] **Email service**: Resend, SendGrid, or Amazon SES (current email is mock)
- [ ] **SMS**: Twilio or MSG91 (current SMS is mock)
- [ ] **Template approval**: All WhatsApp/SMS templates need DLT approval (India)

### 7. AI API Limits & Costs
- [ ] **Monitor z-ai-web-dev-sdk usage** — LLM calls for chatbot, matcher explanations, visa interview eval, OCR
- [ ] **Set spending alerts** (e.g., $100/day cap)
- [ ] **Cache LLM responses** for common questions (Redis cache, 1h TTL)
- [ ] **Fallback strategy** when AI APIs are down (already implemented for chatbot + matcher)

### 8. Deployment
- [ ] **Hosting**: Vercel (recommended for Next.js) or AWS ECS / Railway / Render
- [ ] **Custom domain**: `app.educonnect.in` (dashboard) + `educonnect.in` (landing)
- [ ] **CDN**: Vercel Edge Network or Cloudflare (for static assets)
- [ ] **SSL certificate**: Auto-renewed via Vercel/Let's Encrypt
- [ ] **Environment management**: Separate staging + production environments

### 9. Monitoring & Observability
- [ ] **Error tracking**: Sentry (frontend + backend)
- [ ] **Uptime monitoring**: Better Uptime or Pingdom (99.9% SLA)
- [ ] **Analytics**: PostHog or Mixpanel (user behavior, conversion funnels)
- [ ] **Logging**: structured JSON logs → Logtail or Datadog
- [ ] **APM**: Application performance monitoring (New Relic or Datadog)

### 10. Testing
- [ ] **Unit tests**: Jest + React Testing Library (target 70%+ coverage)
- [ ] **Integration tests**: Playwright or Cypress (critical user flows)
- [ ] **API tests**: Test all 30+ endpoints with different auth states
- [ ] **Load testing**: k6 or Artillery (target 1000 concurrent users)
- [ ] **Security testing**: OWASP ZAP scan, dependency audit (`bun audit`)

### 11. Compliance & Legal
- [ ] **DPDP Act 2023 registration**: Register as Data Fiduciary with MeitY
- [ ] **Privacy Policy**: Drafted by lawyer, hosted at `/privacy`
- [ ] **Terms of Service**: Drafted by lawyer, hosted at `/terms`
- [ ] **Data Processing Agreement**: For B2B customers
- [ ] **GDPR compliance**: EU user data export + deletion endpoints
- [ ] **ISO 27001 certification**: (Optional, for enterprise sales)
- [ ] **SOC 2 Type II audit**: (Optional, for enterprise sales)

### 12. Performance
- [ ] **Database indexing**: Add indexes on frequently-queried fields (studentId, counselorId, status, createdAt)
- [ ] **API response caching**: Redis cache for dashboard stats (5min TTL)
- [ ] **Image optimization**: `next/image` for all partner university logos
- [ ] **Code splitting**: Lazy-load dashboard views (already done via dynamic imports)
- [ ] **Bundle analysis**: `@next/bundle-analyzer` — keep main bundle < 200KB

### 13. Mobile Apps (Q2 2027 roadmap)
- [ ] **React Native app**: Reuse dashboard API endpoints
- [ ] **Push notifications**: Firebase Cloud Messaging (Android) + APNs (iOS)
- [ ] **Offline mode**: SQLite local cache + sync when online
- [ ] **App Store + Play Store**: Developer accounts ($99/yr + $25 one-time)
- [ ] **App Review**: Apple may reject if "reads" too much from web — package as hybrid

### 14. Customer Support
- [ ] **In-app help center**: Intercom or Crisp or self-hosted
- [ ] **Ticketing system**: Linear or Jira Service Desk
- [ ] **Onboarding flow**: Interactive product tour (Appcues or self-built)
- [ ] **Status page**: status.educonnect.in (Better Uptime Status Page)
- [ ] **SLA**: Define uptime + response time guarantees

### 15. Business Operations
- [ ] **Stripe / Razorpay** for subscription billing (Starter/Growth/Enterprise)
- [ ] **Invoice generation**: Auto-send GST invoices on payment
- [ ] **Dunning management**: Handle failed payments gracefully
- [ ] **Customer success**: Dedicated onboarding manager for Growth+ plans
- [ ] **Analytics dashboard**: Track MRR, churn, LTV, CAC

---

## 🚀 Deployment Steps (Quick Start)

### Option A: Vercel (Recommended)
```bash
# 1. Push to GitHub (see GITHUB_SETUP.md)
# 2. Go to vercel.com → New Project → Import from GitHub
# 3. Add all environment variables (see section 3 above)
# 4. Set build command: bun run build
# 5. Set output directory: .next
# 6. Add custom domain: app.educonnect.in
# 7. Deploy!
```

### Option B: Self-hosted (Docker)
```bash
# 1. Build Docker image
docker build -t educonnect-india .

# 2. Run with env file
docker run -d --name educonnect \
  --env-file .env.production \
  -p 3000:3000 \
  educonnect-india

# 3. Set up Nginx reverse proxy + Let's Encrypt SSL
```

---

## 📊 Estimated Costs (Monthly)

| Item | Starter (1-50 users) | Growth (50-500 users) | Enterprise (500+) |
|------|---------------------|---------------------|-------------------|
| **Hosting** (Vercel Pro) | $20 | $20 | $20 |
| **Database** (Supabase/RDS) | $25 | $50 | $100+ |
| **AI APIs** (z-ai-sdk) | $50 | $200 | $500+ |
| **WhatsApp Business** | $15 | $50 | $100+ |
| **Email** (Resend) | $20 | $50 | $100+ |
| **SMS** (Twilio) | $30 | $100 | $300+ |
| **Storage** (S3) | $5 | $20 | $50+ |
| **Monitoring** (Sentry) | $26 | $80 | $200+ |
| **Total** | **~$191/mo** | **~$570/mo** | **~$1,370+/mo** |

---

## 🔐 Security Audit Checklist

Before going live:
- [ ] Run `bun audit` and fix all vulnerabilities
- [ ] Penetration test by external firm (recommended: ₹2-5L one-time)
- [ ] Remove all `console.log` statements with sensitive data
- [ ] Ensure no API keys in client-side code
- [ ] Verify all API routes check auth
- [ ] Test SQL injection protection (Prisma handles this)
- [ ] Test XSS protection (React handles this, but verify user input rendering)
- [ ] Verify CORS configuration
- [ ] Set up DDoS protection (Cloudflare or AWS Shield)

---

## 📞 Support

- **Technical issues**: engineering@educonnect.in
- **Security incidents**: security@educonnect.in (PGP key on /security)
- **Customer support**: support@educonnect.in

**Made & maintained by GuardianX**
