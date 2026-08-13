// Roadmap view — what's coming next + suggestions for user
// Made & maintained by GuardianX

"use client";

import { Sparkles, Calendar, Rocket, Lightbulb, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/dashboard/_ui";

const ROADMAP = [
  {
    quarter: "Q4 2026", status: "shipped", color: "#22c55e", icon: CheckCircle2,
    title: "Foundation + Auth + Dashboard",
    items: [
      "Student CRM with full pipeline",
      "Application tracker with status kanban",
      "1,048 partner university database",
      "Visa tracker with stage progression",
      "Communication hub (WhatsApp/Email/SMS)",
      "Finance + GST invoicing",
      "Multi-language support (10 Indian languages)",
    ],
  },
  {
    quarter: "Q1 2027", status: "next", color: "#e85d2f", icon: Rocket,
    title: "AI-powered student experience",
    items: [
      "AI Course Matcher with explainable ML ranking",
      "SOP builder with GPT-4 powered writing coach",
      "Document OCR & auto-verification",
      "Predictive enrollment forecasting (90-day horizon)",
      "Lead scoring AI — auto-rank hottest leads",
      "Conversational AI chatbot for website + WhatsApp",
    ],
  },
  {
    quarter: "Q2 2027", status: "planned", color: "#f59e0b", icon: Calendar,
    title: "Multi-channel growth & mobile",
    items: [
      "Native mobile apps (iOS + Android) for counselors",
      "Parent portal — track your child's application",
      "Student self-service portal",
      "Video counseling module (Zoom + in-app)",
      "Referral & affiliate tracking with auto-commission",
      "Bulk WhatsApp campaigns with smart segmentation",
    ],
  },
  {
    quarter: "Q3 2027", status: "planned", color: "#0f766e", icon: Calendar,
    title: "Enterprise + Marketplace",
    items: [
      "Multi-branch management with role-based permissions",
      "White-label dashboard for partner consultancies",
      "Custom report builder + scheduled email digests",
      "Audit logs + SSO (SAML, OIDC) + data residency",
      "University marketplace — apply to new partners in-app",
      "Open API + Zapier/Make.com integration",
    ],
  },
];

const SUGGESTIONS = [
  { icon: "🎓", title: "Scholarship Finder Pro", desc: "Auto-match students with 12,000+ scholarships based on merit, demographics, and destination.", impact: "High" },
  { icon: "🤖", title: "AI Mock Visa Interviewer", desc: "Voice-based AI interviewer with country-specific question banks and confidence scoring.", impact: "High" },
  { icon: "📅", title: "Calendar & Booking System", desc: "Let students self-book counseling slots with auto-reminders via WhatsApp + Email.", impact: "Medium" },
  { icon: "💳", title: "EMI / Installment Tracker", desc: "Split tuition payments into EMIs with auto-due reminders and Razorpay collection.", impact: "Medium" },
  { icon: "📊", title: "Custom Report Builder", desc: "Drag-and-drop reports for any metric — schedule weekly email digests to stakeholders.", impact: "Medium" },
  { icon: "🔔", title: "Smart Deadline Engine", desc: "Never miss a deadline — auto-escalate to counselor + manager + student when nearing.", impact: "High" },
  { icon: "🌍", title: "Country Guides Library", desc: "SEO-optimized landing pages for each destination — auto-generated from partner data.", impact: "Low" },
  { icon: "📚", title: "SOP & Essay Library", desc: "Successful SOP samples by program + AI essay reviewer trained on admits data.", impact: "Medium" },
  { icon: "👥", title: "Parent Portal", desc: "Separate login for parents to track progress, pay fees, and chat with counselor.", impact: "High" },
  { icon: "🔗", title: "Alumni Network", desc: "Connect placed students with new applicants — social proof + referral engine.", impact: "Medium" },
  { icon: "🛡️", title: "Compliance Audit Trail", desc: "Every action logged. Export-ready for ISO 27001, DPDP, GDPR audits.", impact: "Medium" },
  { icon: "🚀", title: "Lead Magnets Engine", desc: "Free eligibility checker, scholarship quiz, university matcher — capture leads 24/7.", impact: "High" },
];

export default function RoadmapView() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#e85d2f]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#0f766e]/30 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#f59e0b]">
            <Sparkles className="h-3.5 w-3.5" />
            Product Roadmap
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold">What we're building next</h2>
          <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
            We ship every 2 weeks. Here's what's live, what's next, and what's on the horizon —
            plus 12 features we're considering. Vote for your favorites via your account manager.
          </p>
        </div>
      </div>

      {/* Roadmap timeline */}
      <div className="space-y-4">
        {ROADMAP.map((r) => (
          <Card key={r.quarter} className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl shrink-0"
                style={{ background: `${r.color}1a`, color: r.color }}>
                <r.icon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: r.color }}>{r.quarter}</span>
                  <span className="text-[10px] font-bold uppercase rounded-full px-2 py-0.5"
                    style={{ background: `${r.color}1a`, color: r.color }}>
                    {r.status === "shipped" ? "Live now" : r.status === "next" ? "Up next" : "Planned"}
                  </span>
                </div>
                <h3 className="mt-1 text-base font-bold text-[#1c1410]">{r.title}</h3>
                <div className="mt-3 grid sm:grid-cols-2 gap-1.5">
                  {r.items.map((it) => (
                    <div key={it} className="flex items-start gap-2 text-xs text-[#3a2e26]">
                      {r.status === "shipped"
                        ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#22c55e]" />
                        : <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#7a6a5d]" />}
                      {it}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-[#f59e0b]" />
          <h3 className="text-base font-bold text-[#1c1410]">12 more ideas we're considering</h3>
        </div>
        <p className="text-xs text-[#7a6a5d] mb-4">
          These are suggestions from real consultants (and our product team). Tell your account manager which ones matter to you — we prioritize by user demand.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUGGESTIONS.map((s) => (
            <Card key={s.title} className="p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between">
                <span className="text-2xl">{s.icon}</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  s.impact === "High" ? "bg-[#22c55e]/10 text-[#15803d]" :
                  s.impact === "Medium" ? "bg-[#f59e0b]/10 text-[#b45309]" :
                  "bg-[#0ea5e9]/10 text-[#0369a1]"
                }`}>
                  {s.impact} impact
                </span>
              </div>
              <h4 className="mt-2 text-sm font-bold text-[#1c1410]">{s.title}</h4>
              <p className="mt-1 text-xs text-[#7a6a5d] leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="p-6 bg-gradient-to-br from-[#fff8f1] to-white border-2 border-orange-200">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white shadow-lg">
            <ArrowRight className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#1c1410]">Have your own idea?</h3>
            <p className="text-xs text-[#7a6a5d] mt-0.5">We add user-requested features every sprint. Email product@educonnect.in with your suggestion.</p>
          </div>
          <a href="mailto:product@educonnect.in">
            <button className="rounded-full bg-[#1c1410] text-white px-4 h-9 text-xs font-semibold hover:bg-[#e85d2f]">
              Suggest a feature
            </button>
          </a>
        </div>
      </Card>
    </div>
  );
}
