"use client";

import { useEffect, useState } from "react";
import {
  Globe2, Save, Loader2, Eye, User, Star, MapPin, Phone, Mail,
  MessageCircle, Award, TrendingUp, ExternalLink,
} from "lucide-react";
import { apiFetch, useAppStore } from "@/store/app-store";
import { Card, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Profile = {
  id: string;
  slug: string;
  tagline: string;
  bio: string;
  specialization: string;
  yearsExperience: number;
  studentsPlaced: number;
  successRate: number;
  rating: number;
  photoColor: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  heroHeadline: string;
  heroSubtext: string;
  primaryCta: string;
  isActive: boolean;
};

export default function MyLandingPageView() {
  const { user } = useAppStore();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch("/api/consultant-profiles/me")
      .then((d) => setProfile(d.profile))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await apiFetch("/api/consultant-profiles/me", {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      toast({ title: "Landing page saved ✅", description: `Live at educonnect.in/?consultant=${profile.slug}` });
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-16 flex items-center justify-center gap-2 text-[#7a6a5d]"><Spinner /> Loading…</div>;
  if (!profile) return <div className="text-center py-16 text-[#7a6a5d]">No profile found.</div>;

  const update = (field: string, value: string | number | boolean) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#e85d2f]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e85d2f] via-[#f59e0b] to-[#0f766e] shadow-xl">
            <Globe2 className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">
              <Globe2 className="h-3 w-3" />
              My Landing Page · Personalized consultant page
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Your personal landing page</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Each counselor gets their own shareable landing page at{" "}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#f59e0b]">educonnect.in/?consultant={profile.slug}</code>
              . Edit your headline, bio, stats, and contact info — then share the link with prospective students.
            </p>
          </div>
        </div>
      </div>

      {/* Preview link */}
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f766e]/10 text-[#0f766e]">
            <ExternalLink className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-bold text-[#1c1410]">Your public landing page</div>
            <div className="text-xs text-[#7a6a5d]">Share this link with students</div>
          </div>
        </div>
        <a
          href={`/?consultant=${profile.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0f766e] text-white px-4 h-9 text-xs font-semibold hover:bg-[#0b5750]"
        >
          <Eye className="h-3.5 w-3.5" /> Preview page
        </a>
      </Card>

      {/* Editor */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left: Profile info */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#1c1410]">Profile Information</h3>

          <Field label="URL slug" value={profile.slug} onChange={(v) => update("slug", v)} hint="Lowercase, hyphens only. e.g. rajesh-mehta" />
          <Field label="Tagline" value={profile.tagline} onChange={(v) => update("tagline", v)} />
          <Field label="Bio" value={profile.bio} onChange={(v) => update("bio", v)} textarea rows={4} />
          <Field label="Specialization" value={profile.specialization} onChange={(v) => update("specialization", v)} hint="e.g. UK, Canada, Australia" />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Years of experience" value={profile.yearsExperience.toString()} onChange={(v) => update("yearsExperience", parseInt(v) || 0)} type="number" />
            <Field label="Students placed" value={profile.studentsPlaced.toString()} onChange={(v) => update("studentsPlaced", parseInt(v) || 0)} type="number" />
            <Field label="Success rate (%)" value={profile.successRate.toString()} onChange={(v) => update("successRate", parseInt(v) || 0)} type="number" />
            <Field label="Rating (1-5)" value={profile.rating.toString()} onChange={(v) => update("rating", parseFloat(v) || 5)} type="number" />
          </div>
        </Card>

        {/* Right: Landing page content + contact */}
        <div className="space-y-5">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#1c1410]">Landing Page Content</h3>

            <Field label="Hero headline" value={profile.heroHeadline} onChange={(v) => update("heroHeadline", v)} />
            <Field label="Hero subtext" value={profile.heroSubtext} onChange={(v) => update("heroSubtext", v)} textarea rows={3} />
            <Field label="Primary CTA button" value={profile.primaryCta} onChange={(v) => update("primaryCta", v)} />
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#1c1410]">Contact Information</h3>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" value={profile.phone || ""} onChange={(v) => update("phone", v)} />
              <Field label="WhatsApp" value={profile.whatsapp || ""} onChange={(v) => update("whatsapp", v)} />
              <Field label="Email" value={profile.email || ""} onChange={(v) => update("email", v)} />
              <Field label="City" value={profile.city || ""} onChange={(v) => update("city", v)} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-[#3a2e26]">Page is live</span>
              <button
                onClick={() => update("isActive", !profile.isActive)}
                className={`relative h-6 w-11 rounded-full transition-colors ${profile.isActive ? "bg-[#22c55e]" : "bg-[#e5e7eb]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${profile.isActive ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white px-6 h-12 font-semibold shadow-lg shadow-orange-300/40 disabled:opacity-60 hover:-translate-y-0.5 transition-all"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save landing page</>}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea, rows = 2, type = "text", hint }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number; type?: string; hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full rounded-xl border border-orange-200 bg-white p-3 text-sm focus:border-[#e85d2f] focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20"
        />
      )}
      {hint && <span className="block text-[10px] text-[#7a6a5d] mt-1">{hint}</span>}
    </label>
  );
}
