"use client";

import {
  Users, FolderCheck, Globe2, Plane, MessagesSquare,
  BarChart3, Award, Wallet, Sparkles, School,
  FileSearch, Bell, Mic, Calendar, Gift, Building2,
  Zap, Shield, Smartphone, Bot, TrendingUp,
} from "lucide-react";

const FEATURE_GROUPS = [
  {
    title: "AI-Powered Tools",
    subtitle: "5 intelligent modules that do the heavy lifting",
    color: "#a855f7",
    features: [
      { icon: Sparkles, name: "AI Course Matcher", desc: "ML scores 1,048 universities against student profile. LLM-generated explanations for top picks.", badge: "AI" },
      { icon: Mic, name: "AI Mock Visa Interviewer", desc: "Voice-based practice with TTS. 7 countries, 70+ real questions. LLM scores on clarity, conviction, language.", badge: "NEW" },
      { icon: Award, name: "Scholarship Finder Pro", desc: "Auto-matches students to 39+ scholarships (Chevening, Fulbright, DAAD, Vanier) with eligibility scoring.", badge: "NEW" },
      { icon: FileSearch, name: "Document OCR Engine", desc: "Vision AI extracts fields from passport, IELTS, transcripts, SOP, LOR, bank statements, resume.", badge: "OCR" },
      { icon: Bot, name: "Conversational AI Chatbot", desc: "Floating EduBot widget on every page. LLM-powered, trained on EduConnect context. Captures leads 24/7.", badge: "AI" },
    ],
  },
  {
    title: "Operations & Pipeline",
    subtitle: "End-to-end student journey management",
    color: "#e85d2f",
    features: [
      { icon: Users, name: "Student CRM", desc: "Pipeline with status filters, searchable table, add/edit modals, counselor assignment." },
      { icon: FolderCheck, name: "Application Tracker", desc: "Kanban board (DRAFT → SUBMITTED → OFFERED → ENROLLED) with one-click application drafting." },
      { icon: School, name: "University Database", desc: "59 real institutions across 13 countries with rankings, tuition, IELTS/TOEFL cutoffs, commissions." },
      { icon: Plane, name: "Visa Tracker", desc: "Stage-based visa workflow (DRAFT → APPROVED) with appointment dates and progress bars." },
      { icon: MessagesSquare, name: "Communication Hub", desc: "WhatsApp + Email + SMS in one inbox. Templates, bulk campaigns, auto-sequences." },
      { icon: Calendar, name: "Calendar & Booking", desc: "Auto-generates Meet links. WhatsApp + Email reminders. Google + Outlook sync.", badge: "NEW" },
      { icon: Bell, name: "Smart Deadline Engine", desc: "Auto-urgency (CRITICAL/HIGH/MEDIUM). Auto-escalates to counselor + manager + student + parent.", badge: "NEW" },
    ],
  },
  {
    title: "Growth & Marketing",
    subtitle: "Turn your network into a lead engine",
    color: "#22c55e",
    features: [
      { icon: Gift, name: "Referral & Affiliate Engine", desc: "Alumni/partner/affiliate referral codes. Auto-commission calc. RazorpayX payouts.", badge: "NEW" },
      { icon: Zap, name: "Lead Magnets Engine", desc: "6 embeddable tools (eligibility checker, scholarship quiz, university matcher). 25.9% avg conversion.", badge: "NEW" },
      { icon: Globe2, name: "Country Guides Library", desc: "12 SEO-optimized destination profiles with visa, costs, work rights, post-study visas.", badge: "NEW" },
    ],
  },
  {
    title: "Business & Compliance",
    subtitle: "Enterprise-grade tools for scaling consultancies",
    color: "#0f766e",
    features: [
      { icon: Wallet, name: "Finance & Invoicing", desc: "GST-ready invoices, commission tracking, installment plans, Razorpay collection." },
      { icon: BarChart3, name: "Analytics Dashboard", desc: "Conversion funnels, counselor scorecards, revenue trends, AI insights, destination mix." },
      { icon: Building2, name: "Multi-branch Management", desc: "6 branches with role-based permissions, per-branch performance, white-label dashboards.", badge: "NEW" },
      { icon: Shield, name: "Compliance Audit Trail", desc: "Tamper-evident logs. ISO 27001, DPDP Act 2023, GDPR ready. CSV export for audits.", badge: "NEW" },
      { icon: TrendingUp, name: "Integrations Hub", desc: "12 integrations: WhatsApp, Razorpay, Gmail, VFS Global, Slack, Zoom, GSTN, DocuSign, Zapier." },
      { icon: Smartphone, name: "Native Mobile Apps", desc: "iOS + Android preview. Offline mode, push notifications, document capture. Coming Q2 2027.", badge: "NEW" },
    ],
  },
  {
    title: "Portals & Access",
    subtitle: "Separate experiences for every stakeholder",
    color: "#0ea5e9",
    features: [
      { icon: Users, name: "Parent Portal", desc: "Separate login for parents. Track child's progress, applications, messages, payments." },
      { icon: Globe2, name: "Multi-language (10 Indian languages)", desc: "हिन्दी, தமிழ், తెలుగు, ಕನ್ನಡ, বাংলা, मराठी, ગુજરાતી, ਪੰਜਾਬੀ, മലയാളം, English." },
    ],
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-white via-[#fff8f1] to-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="reveal max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-xs font-semibold text-[#c8451a]">
            <Sparkles className="h-3.5 w-3.5" />
            23 Platform Features · 4 Categories
          </div>
          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1c1410]">
            Everything your consultancy needs,{" "}
            <span className="text-gradient-brand">in one platform</span>.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#4b3d33]">
            From AI-powered course matching to compliance audit trails — EduConnect India is the
            most comprehensive SaaS platform for Indian education consultants. 23 features across
            5 categories, all built natively, all branded GuardianX.
          </p>
        </div>

        {/* Feature groups */}
        <div className="mt-14 space-y-12">
          {FEATURE_GROUPS.map((group, gi) => (
            <div key={group.title} className="reveal">
              {/* Group header */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${group.color}, ${group.color}cc)` }}
                >
                  <span className="text-sm font-extrabold">{gi + 1}</span>
                </span>
                <div>
                  <h3 className="text-xl font-bold text-[#1c1410]">{group.title}</h3>
                  <p className="text-sm text-[#7a6a5d]">{group.subtitle}</p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
                <span className="text-xs font-bold text-[#7a6a5d]">{group.features.length} features</span>
              </div>

              {/* Feature cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.features.map((f, i) => (
                  <div
                    key={f.name}
                    className="group relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    style={{ transitionDelay: `${(i % 3) * 60}ms` }}
                  >
                    {/* Hover accent */}
                    <div
                      className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                      style={{ background: `${group.color}33` }}
                    />

                    <div className="flex items-start justify-between">
                      <div
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110"
                        style={{ background: `${group.color}1a`, color: group.color }}
                      >
                        <f.icon className="h-5 w-5" />
                      </div>
                      {f.badge && (
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            background: f.badge === "AI" ? "#a855f71a" : f.badge === "NEW" ? "#22c55e1a" : "#f59e0b1a",
                            color: f.badge === "AI" ? "#7e22ce" : f.badge === "NEW" ? "#15803d" : "#b45309",
                          }}
                        >
                          {f.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="mt-4 text-sm font-bold text-[#1c1410]">{f.name}</h4>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#4b3d33]">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats banner */}
        <div className="reveal mt-16 rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-8 sm:p-10 text-white relative overflow-hidden">
          <div aria-hidden className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#e85d2f]/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#0f766e]/30 blur-3xl" />
          <div className="relative grid sm:grid-cols-5 gap-6 text-center">
            <div>
              <div className="text-4xl font-extrabold text-[#f59e0b]">23</div>
              <div className="text-xs text-white/60 mt-1">Platform features</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#e85d2f]">19</div>
              <div className="text-xs text-white/60 mt-1">Database models</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#22c55e]">25+</div>
              <div className="text-xs text-white/60 mt-1">API endpoints</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#0ea5e9]">10</div>
              <div className="text-xs text-white/60 mt-1">Indian languages</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#a855f7]">1,048</div>
              <div className="text-xs text-white/60 mt-1">Partner universities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
