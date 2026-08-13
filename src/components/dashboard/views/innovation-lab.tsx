// Innovation Lab — expanded roadmap with 18+ feature suggestions, voting, status

"use client";

import { useState } from "react";
import {
  Sparkles, Calendar, Rocket, Lightbulb, CheckCircle2, ArrowRight,
  Flame, TrendingUp, Beaker, Brain, Bot, FileText,
} from "lucide-react";
import { Card } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

const SHIPPED = [
  { name: "Foundation SaaS + Auth", date: "Q4 2026", desc: "Counselor auth, dashboard, 8 models, 10 API routes." },
  { name: "Student CRM + Application Tracker", date: "Q4 2026", desc: "Pipeline management with status kanban." },
  { name: "1,048 University Database", date: "Q4 2026", desc: "Real institutions across 13 countries with cutoffs." },
  { name: "Visa Tracker", date: "Q4 2026", desc: "Stage-based visa workflow with appointments." },
  { name: "Communication Hub (WA/Email/SMS)", date: "Q4 2026", desc: "Unified inbox with templates and broadcast." },
  { name: "Finance + GST Invoicing", date: "Q4 2026", desc: "Invoice generation, GST-ready, payment tracking." },
  { name: "10 Indian Languages", date: "Q4 2026", desc: "Full dashboard i18n with native scripts." },
  { name: "AI Course Matcher", date: "Q4 2026", desc: "ML scoring + LLM explanations across 1,048 univs." },
  { name: "Parent Portal", date: "Q4 2026", desc: "Separate login for parents to track progress." },
  { name: "Document OCR Engine", date: "Q4 2026", desc: "Vision AI extracts fields from passport/transcript/IELTS/SOP." },
];

const NEXT_Q = [
  { name: "AI Mock Visa Interviewer", icon: Bot, color: "#a855f7", votes: 412, status: "Building", desc: "Voice-based AI interviewer with country-specific question banks, confidence scoring, and detailed feedback. Practice interviews for US F1, UK Tier 4, Canada SDS, Australia 500." },
  { name: "SOP Builder + Writing Coach", icon: FileText, color: "#e85d2f", votes: 387, status: "Building", desc: "GPT-powered SOP writing assistant trained on 10,000+ successful admits. Per-university tone matching, plagiarism check, multiple revision rounds." },
  { name: "Predictive Enrollment Forecasting", icon: TrendingUp, color: "#22c55e", votes: 298, status: "Building", desc: "ML model predicts 90-day placement outcomes from pipeline signals. Helps counselors prioritize hot leads and forecast revenue." },
  { name: "Lead Scoring AI", icon: Brain, color: "#0ea5e9", votes: 267, status: "Building", desc: "Auto-rank hottest leads by conversion probability using behavior, source, profile completeness, and historical patterns." },
];

const PLANNED = [
  { name: "Native Mobile Apps (iOS + Android)", icon: "📱", color: "#0f766e", votes: 521, status: "Planned · Q2 2027", desc: "Counselor mobile app with offline mode, push notifications, on-the-go document capture. Parents get a separate mobile experience." },
  { name: "Scholarship Finder Pro", icon: "🎓", color: "#f59e0b", votes: 489, status: "Planned · Q1 2027", desc: "Auto-match students with 12,000+ Indian + international scholarships based on merit, demographics, destination, and program." },
  { name: "Calendar & Booking System", icon: "📅", color: "#0ea5e9", votes: 412, status: "Planned · Q2 2027", desc: "Self-book counseling slots with auto-reminders via WhatsApp + Email. Syncs with Google Calendar + Outlook." },
  { name: "Conversational AI Chatbot", icon: "💬", color: "#a855f7", votes: 378, status: "Planned · Q1 2027", desc: "24/7 WhatsApp + website chatbot handles FAQs, captures leads, schedules demos. Trained on your consultancy's knowledge base." },
  { name: "EMI / Installment Tracker", icon: "💳", color: "#22c55e", votes: 332, status: "Planned · Q2 2027", desc: "Split tuition payments into EMIs with auto-due reminders and Razorpay collection. Handles part-payments and refunds." },
  { name: "Smart Deadline Engine", icon: "🔔", color: "#ef4444", votes: 318, status: "Planned · Q1 2027", desc: "Never miss a deadline. Auto-escalate to counselor + manager + parent when nearing. Syncs with university intake calendars." },
  { name: "Custom Report Builder", icon: "📊", color: "#1c1410", votes: 287, status: "Planned · Q3 2027", desc: "Drag-and-drop reports for any metric. Schedule weekly email digests to stakeholders. Export to PDF/Excel/Sheets." },
  { name: "Referral & Affiliate Engine", icon: "🔗", color: "#e85d2f", votes: 256, status: "Planned · Q2 2027", desc: "Track referrals from alumni and partner agents. Auto-calculate commissions. Unique referral links + QR codes." },
  { name: "Country Guides Library", icon: "🌍", color: "#0f766e", votes: 198, status: "Planned · Q3 2027", desc: "SEO-optimized landing pages for each destination. Auto-generated from partner university data. Drives organic leads." },
  { name: "Compliance Audit Trail", icon: "🛡️", color: "#1c1410", votes: 176, status: "Planned · Q3 2027", desc: "Every action logged. Export-ready for ISO 27001, DPDP Act 2023, GDPR audits. Tamper-evident logs." },
  { name: "Multi-branch Management", icon: "🏢", color: "#a855f7", votes: 154, status: "Planned · Q3 2027", desc: "Multi-branch dashboards with role-based permissions. Branch-level revenue, conversion, and performance analytics." },
  { name: "Lead Magnets Engine", icon: "⚡", color: "#f59e0b", votes: 142, status: "Planned · Q2 2027", desc: "Free eligibility checker, scholarship quiz, university matcher — capture leads 24/7 from your website." },
  { name: "Alumni Network", icon: "🤝", color: "#0ea5e9", votes: 121, status: "Planned · Q3 2027", desc: "Connect placed students with new applicants. Social proof + referral engine + mentorship program." },
  { name: "Video Counseling Module", icon: "🎥", color: "#ec4899", votes: 109, status: "Planned · Q2 2027", desc: "In-app video sessions with screen sharing, recording (with consent), and automatic note transcription." },
];

const STATUS_COLORS: Record<string, string> = {
  "Building": "#e85d2f",
  "Shipped": "#22c55e",
  "Planned · Q1 2027": "#f59e0b",
  "Planned · Q2 2027": "#0ea5e9",
  "Planned · Q3 2027": "#a855f7",
};

export default function InnovationLabView() {
  const [votes, setVotes] = useState<Record<string, number>>(
    Object.fromEntries([...NEXT_Q, ...PLANNED].map((f) => [f.name, (f as { votes: number }).votes]))
  );
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const upvote = (name: string) => {
    if (voted.has(name)) return;
    setVoted((prev) => new Set(prev).add(name));
    setVotes((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
    toast({ title: `Upvoted: ${name}`, description: "Your vote helps us prioritize what to build next." });
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#a855f7]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#e85d2f]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#a855f7] via-[#e85d2f] to-[#f59e0b] shadow-xl">
            <Beaker className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">
              <Flame className="h-3 w-3" />
              Innovation Lab · {totalVotes.toLocaleString()} total votes
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Vote on what we build next</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              We ship every 2 weeks. Features with the most user votes get prioritized. Here's what's
              shipped, what we're building right now, and what's on the roadmap — plus 14 more ideas
              we're considering. Tap the ▲ button on any feature to upvote it.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Shipped" value={SHIPPED.length} color="#22c55e" icon={CheckCircle2} />
        <StatCard label="In development" value={NEXT_Q.length} color="#e85d2f" icon={Rocket} />
        <StatCard label="Planned" value={PLANNED.length} color="#f59e0b" icon={Calendar} />
        <StatCard label="Total votes" value={totalVotes.toLocaleString()} color="#a855f7" icon={TrendingUp} />
      </div>

      {/* Shipped */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
          <h3 className="text-base font-bold text-[#1c1410]">Live now · {SHIPPED.length} features shipped</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SHIPPED.map((s) => (
            <Card key={s.name} className="p-4 bg-gradient-to-br from-[#22c55e]/5 to-white ring-1 ring-emerald-100">
              <div className="flex items-start justify-between gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#22c55e] shrink-0 mt-0.5" />
                <span className="text-[9px] font-bold uppercase text-[#15803d]">{s.date}</span>
              </div>
              <h4 className="mt-2 text-sm font-bold text-[#1c1410]">{s.name}</h4>
              <p className="mt-1 text-[11px] text-[#7a6a5d] leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Building now */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="h-4 w-4 text-[#e85d2f]" />
          <h3 className="text-base font-bold text-[#1c1410]">Building right now · Q1 2027</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {NEXT_Q.map((f) => (
            <Card key={f.name} className="p-5 ring-2 ring-orange-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
                  style={{ background: `${f.color}1a`, color: f.color }}
                >
                  <f.icon className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#1c1410]">{f.name}</h4>
                    <span
                      className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase shrink-0"
                      style={{ background: `${STATUS_COLORS[f.status]}1a`, color: STATUS_COLORS[f.status] }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: STATUS_COLORS[f.status] }} />
                      {f.status}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#3a2e26] leading-relaxed">{f.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => upvote(f.name)}
                      disabled={voted.has(f.name)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 h-7 text-[11px] font-bold transition-all ${
                        voted.has(f.name)
                          ? "bg-[#22c55e]/10 text-[#15803d] cursor-default"
                          : "bg-[#1c1410] text-white hover:bg-[#e85d2f]"
                      }`}
                    >
                      <Flame className="h-3 w-3" />
                      {votes[f.name].toLocaleString()}
                    </button>
                    <span className="text-[10px] text-[#7a6a5d]">ETA: 8–12 weeks</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Planned */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-[#f59e0b]" />
          <h3 className="text-base font-bold text-[#1c1410]">Planned · Q2–Q3 2027 · {PLANNED.length} features</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLANNED.map((f) => (
            <Card key={f.name} className="p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{f.icon}</span>
                <span
                  className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase shrink-0"
                  style={{ background: `${STATUS_COLORS[f.status]}1a`, color: STATUS_COLORS[f.status] }}
                >
                  {f.status}
                </span>
              </div>
              <h4 className="mt-2 text-sm font-bold text-[#1c1410]">{f.name}</h4>
              <p className="mt-1 text-[11px] text-[#7a6a5d] leading-relaxed">{f.desc}</p>
              <button
                onClick={() => upvote(f.name)}
                disabled={voted.has(f.name)}
                className={`mt-3 w-full inline-flex items-center justify-center gap-1 rounded-full px-3 h-7 text-[11px] font-bold transition-all ${
                  voted.has(f.name)
                    ? "bg-[#22c55e]/10 text-[#15803d] cursor-default"
                    : "bg-[#fff8f1] text-[#1c1410] hover:bg-orange-100 ring-1 ring-orange-100"
                }`}
              >
                <Flame className="h-3 w-3" />
                {votes[f.name].toLocaleString()} votes
              </button>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="p-6 bg-gradient-to-br from-[#fff8f1] to-white border-2 border-orange-200">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white shadow-lg">
            <Lightbulb className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#1c1410]">Have your own idea?</h3>
            <p className="text-xs text-[#7a6a5d] mt-0.5">We add user-requested features every sprint. Email product@educonnect.in with your suggestion.</p>
          </div>
          <a href="mailto:product@educonnect.in">
            <button className="rounded-full bg-[#1c1410] text-white px-4 h-9 text-xs font-semibold hover:bg-[#e85d2f] inline-flex items-center gap-1.5">
              Suggest a feature
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </a>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }: { label: string; value: string | number; color: string; icon: React.ElementType }) {
  return (
    <Card className="p-4">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}1a`, color }}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="mt-3 text-2xl font-extrabold text-[#1c1410] leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-[#7a6a5d]">{label}</div>
    </Card>
  );
}
