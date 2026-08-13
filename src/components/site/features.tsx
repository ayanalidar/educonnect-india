"use client";

import {
  Users,
  FolderCheck,
  Globe2,
  Plane,
  MessagesSquare,
  BarChart3,
  Award,
  Wallet,
  Sparkles,
  School,
  FileText,
  BellRing,
} from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "Student CRM",
    desc: "Capture leads from your website, walk-ins, and referrals. Assign counselors, track every interaction, and never lose a hot lead again.",
    color: "#e85d2f",
    tags: ["Lead capture", "Counselor assignment", "Pipeline view"],
  },
  {
    icon: School,
    title: "University Database",
    desc: "1,000+ Indian and overseas institutions with courses, fees, eligibility, deadlines, and intake calendars — updated weekly.",
    color: "#0f766e",
    tags: ["1,048 univs", "Live intakes", "Eligibility matrix"],
  },
  {
    icon: FolderCheck,
    title: "Application Tracker",
    desc: "End-to-end pipeline from inquiry to enrolment. Auto-checklists, document vault, deadline reminders, and one-click status updates.",
    color: "#f59e0b",
    tags: ["Document vault", "Smart checklists", "Deadline alerts"],
  },
  {
    icon: Sparkles,
    title: "AI Course Matcher",
    desc: "ML model recommends best-fit programs based on student profile, academic scores, budget, and destination preference.",
    color: "#e85d2f",
    tags: ["ML ranking", "Budget-aware", "Explainable picks"],
  },
  {
    icon: Plane,
    title: "Visa & Immigration",
    desc: "Country-wise visa tracker with SOP builder, interview prep modules, and real-time status sync with embassies.",
    color: "#0f766e",
    tags: ["SOP builder", "Mock interviews", "Embassy sync"],
  },
  {
    icon: MessagesSquare,
    title: "Communication Hub",
    desc: "Email, SMS, and WhatsApp from one inbox. Templates, bulk campaigns, and auto-triggered sequences for every milestone.",
    color: "#f59e0b",
    tags: ["WhatsApp API", "Bulk campaigns", "Auto sequences"],
  },
  {
    icon: Wallet,
    title: "Finance & Invoicing",
    desc: "GST-ready invoices, installments, scholarship tracking, and counselor commission calculations — all on autopilot.",
    color: "#e85d2f",
    tags: ["GST invoices", "Installments", "Commission calc"],
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Conversion funnels, counselor performance, revenue cohorts, and partner-wise acceptance rates — exported in one click.",
    color: "#0f766e",
    tags: ["Live funnels", "Counselor scorecard", "Cohort analysis"],
  },
  {
    icon: Award,
    title: "Scholarship Finder",
    desc: "Auto-match students with 12,000+ Indian and international scholarships based on merit, demographics, and destination.",
    color: "#f59e0b",
    tags: ["12,000+ awards", "Auto-match", "Deadline tracker"],
  },
];

const SECONDARY = [
  { icon: FileText, label: "Document OCR & verification" },
  { icon: BellRing, label: "Smart deadline reminders" },
  { icon: Globe2, label: "Multi-language (Hindi + 8 regional)" },
  { icon: Users, label: "Counselor performance scorecard" },
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
            Platform Features
          </div>
          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1c1410]">
            Everything your consultancy needs,{" "}
            <span className="text-gradient-brand">in one platform</span>.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#4b3d33]">
            Stop juggling 7 different tools. EduConnect India brings your student
            pipeline, applications, partner network, visa workflow, finance, and
            analytics under one beautiful, secure roof — built specifically for
            the Indian education consulting market.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="reveal group relative overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-orange-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
            >
              {/* Hover accent */}
              <div
                className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                style={{ background: `${f.color}33` }}
              />

              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3"
                style={{ background: `${f.color}1a`, color: f.color }}
              >
                <f.icon className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#1c1410]">{f.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[#4b3d33]">
                {f.desc}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {f.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#fff8f1] px-2.5 py-1 text-[11px] font-semibold text-[#7a6a5d] ring-1 ring-orange-100"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary chips */}
        <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-3">
          {SECONDARY.map((s) => (
            <div
              key={s.label}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-[#3a2e26] shadow-sm"
            >
              <s.icon className="h-4 w-4 text-[#e85d2f]" />
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
