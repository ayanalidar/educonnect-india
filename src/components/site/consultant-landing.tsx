"use client";

import { useEffect, useState } from "react";
import {
  Star, MapPin, Phone, Mail, MessageCircle, Award, TrendingUp,
  Users, CheckCircle2, ArrowRight, GraduationCap, ChevronLeft,
  Calendar, Globe2, Shield,
} from "lucide-react";

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
  user: { name: string; avatarColor: string };
};

export default function ConsultantLandingPage({ slug, onBack }: { slug: string; onBack: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/consultant-profiles/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) setProfile(d.profile);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff8f1]">
        <div className="text-[#7a6a5d] text-sm">Loading consultant page…</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8f1] gap-4">
        <div className="text-2xl font-bold text-[#1c1410]">Consultant not found</div>
        <button onClick={onBack} className="rounded-full bg-[#1c1410] text-white px-5 h-10 text-sm font-semibold">
          Back to EduConnect
        </button>
      </div>
    );
  }

  const initials = profile.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen bg-[#fff8f1]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-[60px] flex items-center justify-between">
          <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7a6a5d] hover:text-[#e85d2f]">
            <ChevronLeft className="h-4 w-4" /> EduConnect India
          </button>
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="text-sm font-extrabold text-[#1c1410]">EduConnect</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-brand-cream" />
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-to-br from-[#f59e0b]/30 to-[#e85d2f]/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-[#0f766e]/20 to-[#14b8a6]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-semibold text-[#c8451a]">
                <span className="flex items-center gap-0.5 text-[#f59e0b]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < Math.floor(profile.rating) ? "fill-[#f59e0b]" : "fill-none"}`} />
                  ))}
                </span>
                {profile.rating} · {profile.studentsPlaced}+ students placed
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1c1410]">
                {profile.heroHeadline}
              </h1>
              <p className="mt-3 text-base text-[#4b3d33] leading-relaxed">{profile.heroSubtext}</p>

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white px-6 h-12 font-semibold shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 transition-all"
                >
                  {profile.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </button>
                {profile.whatsapp && (
                  <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#22c55e] text-white px-5 h-12 font-semibold shadow-lg hover:-translate-y-0.5 transition-all">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                )}
              </div>
            </div>

            {/* Right: counselor card */}
            <div className="relative">
              <div className="rounded-3xl bg-white shadow-2xl shadow-orange-900/10 ring-1 ring-orange-100 p-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <span
                    className="inline-flex h-20 w-20 items-center justify-center rounded-2xl text-white text-2xl font-bold shadow-lg"
                    style={{ background: profile.photoColor }}
                  >
                    {initials}
                  </span>
                  <div>
                    <div className="text-lg font-extrabold text-[#1c1410]">{profile.user.name}</div>
                    <div className="text-sm text-[#7a6a5d]">{profile.tagline}</div>
                    {profile.city && (
                      <div className="text-xs text-[#7a6a5d] flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {profile.city}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <Stat icon={Users} value={`${profile.studentsPlaced}+`} label="Placed" color="#e85d2f" />
                  <Stat icon={Award} value={`${profile.successRate}%`} label="Success" color="#22c55e" />
                  <Stat icon={TrendingUp} value={`${profile.yearsExperience}y`} label="Experience" color="#0f766e" />
                </div>

                {/* Specialization */}
                <div className="mt-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#7a6a5d]">Specializes in</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {profile.specialization.split(",").map((s, i) => (
                      <span key={i} className="rounded-full bg-[#fff8f1] px-2.5 py-1 text-[11px] font-semibold text-[#3a2e26] ring-1 ring-orange-100">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#1c1410] text-center">About {profile.user.name.split(" ")[0]}</h2>
          <p className="mt-4 text-base text-[#4b3d33] leading-relaxed text-center">{profile.bio}</p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { icon: CheckCircle2, title: "Free consultation", desc: "30-minute first session at no cost" },
              { icon: Globe2, title: "1,048 universities", desc: "Direct partnerships across 32 countries" },
              { icon: Shield, title: "92% visa success", desc: "End-to-end visa guidance" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-[#fff8f1] p-4 text-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e85d2f]/10 text-[#e85d2f] mx-auto">
                  <f.icon className="h-5 w-5" />
                </span>
                <div className="mt-2 text-sm font-bold text-[#1c1410]">{f.title}</div>
                <div className="text-xs text-[#7a6a5d]">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section id="contact-section" className="py-12 bg-gradient-to-b from-[#fff8f1] to-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] to-[#2a1d15] p-8 text-white relative overflow-hidden">
            <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#e85d2f]/30 blur-3xl" />
            <div className="relative text-center">
              <h2 className="text-2xl font-bold">Ready to start your journey?</h2>
              <p className="mt-2 text-sm text-white/70">Book a free consultation with {profile.user.name.split(" ")[0]} today.</p>

              <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} className="inline-flex items-center gap-2 rounded-full bg-white text-[#1c1410] px-5 h-11 font-semibold">
                    <Phone className="h-4 w-4" /> {profile.phone}
                  </a>
                )}
                {profile.whatsapp && (
                  <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#22c55e] text-white px-5 h-11 font-semibold">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white px-5 h-11 font-semibold ring-1 ring-white/20">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                )}
              </div>

              <div className="mt-6 text-xs text-white/50">
                Powered by EduConnect India · Made & maintained by{" "}
                <a href="https://github.com/ayanalidar/educonnect-india" target="_blank" rel="noopener noreferrer" className="font-bold text-[#f59e0b] hover:underline">GuardianX</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, value, label, color }: { icon: React.ElementType; value: string; label: string; color: string }) {
  return (
    <div className="rounded-xl bg-[#fff8f1] p-3 text-center">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${color}1a`, color }}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="mt-2 text-lg font-extrabold text-[#1c1410] leading-none">{value}</div>
      <div className="text-[10px] text-[#7a6a5d]">{label}</div>
    </div>
  );
}
