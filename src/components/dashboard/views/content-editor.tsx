// Content Editor dashboard view — edit landing page content
// Made & maintained by GuardianX

"use client";

import { useState, useEffect } from "react";
import {
  FileText, Save, Loader2, Eye, RotateCcw, Image as ImageIcon,
  Type, DollarSign, MessageSquare, Building2, Check,
} from "lucide-react";
import { Card } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "educonnect-landing-content";

const DEFAULT_CONTENT = {
  hero: {
    badge: "Trusted by 480+ consultants across India",
    headline: "The operating system for education consultants in India",
    subheadline: "Manage students, applications, partner universities, visas, and analytics — across 1,000+ Indian and overseas institutions. One elegant platform that turns your consultancy into a high-conversion, fully-compliant growth engine.",
    primaryCta: "Book a Free Demo",
    secondaryCta: "See How It Works",
  },
  stats: [
    { value: "48,000+", label: "Students placed", color: "#e85d2f" },
    { value: "1,048", label: "Partner universities", color: "#0f766e" },
    { value: "32", label: "Countries covered", color: "#f59e0b" },
    { value: "92%", label: "Visa success rate", color: "#1c1410" },
  ],
  pricing: [
    { name: "Starter", price: "₹4,999", period: "/month", tagline: "For solo counselors & new consultancies", highlight: false, features: ["Up to 200 active students", "2 counselor seats", "Student CRM + Application Tracker", "200+ Indian partner universities", "WhatsApp + Email campaigns (1,000/mo)", "GST invoicing", "Email support (24h response)"] },
    { name: "Growth", price: "₹14,999", period: "/month", tagline: "For established consultancies scaling up", highlight: true, features: ["Up to 2,000 active students", "10 counselor seats", "Full 1,048 university database", "AI Course Matcher (unlimited)", "Visa & Immigration module", "WhatsApp + Email + SMS (unlimited)", "Analytics dashboard + cohort reports", "Dedicated onboarding manager (90 days)", "Priority phone + chat support"] },
    { name: "Enterprise", price: "Custom", period: "", tagline: "For multi-branch firms & white-label needs", highlight: false, features: ["Unlimited students & seats", "Multi-branch & white-label dashboard", "Custom university partnerships", "Custom AI model training", "Dedicated success manager + quarterly review", "API access + SSO + audit logs", "99.9% uptime SLA", "On-premise / data-residency options"] },
  ],
  testimonials: [
    { quote: "We moved 14 counselors and 2,800 active students onto EduConnect in three weeks. Our application-to-enrolment conversion jumped from 61% to 88%.", name: "Rajesh Mehta", role: "Founder & Director", org: "Global Pathways Consultancy, Mumbai", initials: "RM", color: "#e85d2f" },
    { quote: "The AI Course Matcher is genuinely scary good. It shortlisted 9 universities for my student; she got offers from 7.", name: "Anjali Nair", role: "Senior Counselor", org: "BrightFutures Education, Kochi", initials: "AN", color: "#0f766e" },
    { quote: "As a 6-person consultancy in Indore, we used to think this kind of software was for the big players. EduConnect priced it for us.", name: "Sandeep Joshi", role: "Managing Partner", org: "Aspire Overseas, Indore", initials: "SJ", color: "#f59e0b" },
  ],
  company: {
    name: "EduConnect India",
    tagline: "Made & maintained by GuardianX",
    email: "hello@educonnect.in",
    phone: "+91 22 6824 1900",
  },
};

type Content = typeof DEFAULT_CONTENT;

export default function ContentEditorView() {
  const { toast } = useToast();
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);
  const [activeTab, setActiveTab] = useState<"hero" | "stats" | "pricing" | "testimonials" | "company">("hero");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) setContent(JSON.parse(cached));
    } catch {}
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Content saved ✅", description: "Landing page updated. Refresh the website to see changes." });
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    if (!confirm("Reset all content to defaults? This cannot be undone.")) return;
    setContent(DEFAULT_CONTENT);
    localStorage.removeItem(STORAGE_KEY);
    toast({ title: "Content reset to defaults" });
  };

  const TABS = [
    { id: "hero", label: "Hero Section", icon: Type },
    { id: "stats", label: "Stats Strip", icon: DollarSign },
    { id: "pricing", label: "Pricing Plans", icon: DollarSign },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "company", label: "Company Info", icon: Building2 },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#0ea5e9]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0ea5e9] via-[#a855f7] to-[#e85d2f] shadow-xl">
            <FileText className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0ea5e9]">
              <FileText className="h-3 w-3" />
              Content Editor · No-code landing page customization
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Edit your landing page — no developer needed</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Change hero text, stats, pricing plans, testimonials, and company info. Click save and the landing page
              updates instantly. No code, no deploy, no waiting.
            </p>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full bg-white ring-1 ring-orange-200 p-1 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-semibold transition-colors ${
                activeTab === t.id ? "bg-[#1c1410] text-white" : "text-[#7a6a5d] hover:bg-orange-50"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-full bg-white ring-1 ring-orange-200 text-[#7a6a5d] px-3 h-9 text-xs font-semibold hover:bg-orange-50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] text-white px-4 h-9 text-xs font-semibold shadow-lg disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save changes
          </button>
        </div>
      </div>

      {/* Editor panels */}
      {activeTab === "hero" && (
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#1c1410]">Hero Section</h3>
          <Field label="Badge text" value={content.hero.badge} onChange={(v) => setContent({ ...content, hero: { ...content.hero, badge: v } })} />
          <Field label="Headline" value={content.hero.headline} onChange={(v) => setContent({ ...content, hero: { ...content.hero, headline: v } })} textarea />
          <Field label="Subheadline" value={content.hero.subheadline} onChange={(v) => setContent({ ...content, hero: { ...content.hero, subheadline: v } })} textarea rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Primary CTA" value={content.hero.primaryCta} onChange={(v) => setContent({ ...content, hero: { ...content.hero, primaryCta: v } })} />
            <Field label="Secondary CTA" value={content.hero.secondaryCta} onChange={(v) => setContent({ ...content, hero: { ...content.hero, secondaryCta: v } })} />
          </div>
        </Card>
      )}

      {activeTab === "stats" && (
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#1c1410]">Stats Strip (4 items)</h3>
          {content.stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#fff8f1]">
              <Field label="Value" value={stat.value} onChange={(v) => {
                const stats = [...content.stats]; stats[i] = { ...stat, value: v };
                setContent({ ...content, stats });
              }} />
              <Field label="Label" value={stat.label} onChange={(v) => {
                const stats = [...content.stats]; stats[i] = { ...stat, label: v };
                setContent({ ...content, stats });
              }} />
              <Field label="Color" value={stat.color} onChange={(v) => {
                const stats = [...content.stats]; stats[i] = { ...stat, color: v };
                setContent({ ...content, stats });
              }} />
            </div>
          ))}
        </Card>
      )}

      {activeTab === "pricing" && (
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#1c1410]">Pricing Plans (3 tiers)</h3>
          {content.pricing.map((plan, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#fff8f1] ring-1 ring-orange-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Plan name" value={plan.name} onChange={(v) => {
                  const pricing = [...content.pricing]; pricing[i] = { ...plan, name: v };
                  setContent({ ...content, pricing });
                }} />
                <Field label="Price" value={plan.price} onChange={(v) => {
                  const pricing = [...content.pricing]; pricing[i] = { ...plan, price: v };
                  setContent({ ...content, pricing });
                }} />
              </div>
              <Field label="Tagline" value={plan.tagline} onChange={(v) => {
                const pricing = [...content.pricing]; pricing[i] = { ...plan, tagline: v };
                setContent({ ...content, pricing });
              }} />
              <Field label="Features (one per line)" value={plan.features.join("\n")} onChange={(v) => {
                const pricing = [...content.pricing]; pricing[i] = { ...plan, features: v.split("\n").filter((f) => f.trim()) };
                setContent({ ...content, pricing });
              }} textarea rows={6} />
            </div>
          ))}
        </Card>
      )}

      {activeTab === "testimonials" && (
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#1c1410]">Testimonials (3 quotes)</h3>
          {content.testimonials.map((t, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#fff8f1] ring-1 ring-orange-100 space-y-2">
              <Field label="Quote" value={t.quote} onChange={(v) => {
                const testimonials = [...content.testimonials]; testimonials[i] = { ...t, quote: v };
                setContent({ ...content, testimonials });
              }} textarea rows={3} />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Name" value={t.name} onChange={(v) => {
                  const testimonials = [...content.testimonials]; testimonials[i] = { ...t, name: v };
                  setContent({ ...content, testimonials });
                }} />
                <Field label="Role" value={t.role} onChange={(v) => {
                  const testimonials = [...content.testimonials]; testimonials[i] = { ...t, role: v };
                  setContent({ ...content, testimonials });
                }} />
              </div>
              <Field label="Organization" value={t.org} onChange={(v) => {
                const testimonials = [...content.testimonials]; testimonials[i] = { ...t, org: v };
                setContent({ ...content, testimonials });
              }} />
            </div>
          ))}
        </Card>
      )}

      {activeTab === "company" && (
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#1c1410]">Company Info</h3>
          <Field label="Company name" value={content.company.name} onChange={(v) => setContent({ ...content, company: { ...content.company, name: v } })} />
          <Field label="Tagline" value={content.company.tagline} onChange={(v) => setContent({ ...content, company: { ...content.company, tagline: v } })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" value={content.company.email} onChange={(v) => setContent({ ...content, company: { ...content.company, email: v } })} />
            <Field label="Phone" value={content.company.phone} onChange={(v) => setContent({ ...content, company: { ...content.company, phone: v } })} />
          </div>
        </Card>
      )}

      {/* Preview note */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0ea5e9]/10 to-[#a855f7]/10 p-4 ring-1 ring-blue-200">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 text-[#0ea5e9]" />
          <div className="flex-1 text-xs text-[#3a2e26]">
            <strong>Live preview:</strong> After saving, sign out and visit the landing page to see your changes.
            Content is stored in your browser — in production, this would sync to the database.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea, rows = 2 }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7a6a5d] mb-1">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full rounded-xl border border-orange-200 bg-white p-3 text-sm focus:border-[#0ea5e9] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#0ea5e9] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20"
        />
      )}
    </label>
  );
}
