"use client";

import {
  ArrowRight,
  PlayCircle,
  Star,
  ShieldCheck,
  Globe2,
  Users,
  FileCheck2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-[84px] pb-14 sm:pt-[98px] sm:pb-20"
    >
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-brand-cream" />
        <div className="absolute inset-0 bg-dot-grid opacity-60" />
        <div className="absolute -top-32 -right-24 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-[#f59e0b]/40 to-[#e85d2f]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-[#0f766e]/25 to-[#5eead4]/10 blur-3xl" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40 L40 0" stroke="#1c1410" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left copy */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-[#c8451a] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#e85d2f] opacity-75 pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e85d2f]" />
              </span>
              Trusted by 480+ consultants across India
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[58px] font-extrabold leading-[1.05] tracking-tight text-[#1c1410]">
              The operating system for{" "}
              <span className="text-gradient-brand">education consultants</span>{" "}
              in India
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[#4b3d33] max-w-xl">
              Manage students, applications, partner universities, visas, and
              analytics — across <strong className="text-[#1c1410]">1,000+ Indian
              and overseas institutions</strong>. One elegant platform that turns
              your consultancy into a high-conversion, fully-compliant growth
              engine.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#contact">
                <Button className="h-12 px-6 rounded-full bg-[#e85d2f] hover:bg-[#c8451a] text-white text-base font-semibold shadow-xl shadow-orange-300/40 transition-all hover:-translate-y-0.5">
                  Book a Free Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#features">
                <Button
                  variant="outline"
                  className="h-12 px-6 rounded-full border-2 border-[#0f766e]/30 bg-white text-[#0f766e] hover:bg-[#0f766e] hover:text-white text-base font-semibold transition-all"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Trust row */}
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-[#4b3d33]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#0f766e]" />
                <span>ISO 27001 secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-[#f59e0b] fill-[#f59e0b]" />
                <span>
                  <strong className="text-[#1c1410]">4.9/5</strong> from 1,200+ users
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-[#e85d2f]" />
                <span>32 countries supported</span>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main dashboard mock */}
              <div className="relative rounded-3xl bg-white shadow-2xl shadow-orange-900/10 ring-1 ring-orange-100 p-5 sm:p-6">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] flex items-center justify-center">
                      <GraduationCapSmall />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1c1410]">Counselor Dashboard</div>
                      <div className="text-[10px] text-[#7a6a5d]">Mumbai Central Branch</div>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {["#e85d2f", "#0f766e", "#f59e0b"].map((c) => (
                      <div
                        key={c}
                        className="h-7 w-7 rounded-full ring-2 ring-white"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* KPI cards */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <KpiCard
                    icon={<Users className="h-4 w-4" />}
                    value="1,284"
                    label="Active students"
                    trend="+12%"
                    color="saffron"
                  />
                  <KpiCard
                    icon={<FileCheck2 className="h-4 w-4" />}
                    value="326"
                    label="Applications"
                    trend="+8%"
                    color="emerald"
                  />
                  <KpiCard
                    icon={<TrendingUp className="h-4 w-4" />}
                    value="92%"
                    label="Success rate"
                    trend="+4%"
                    color="amber"
                  />
                </div>

                {/* Mini chart */}
                <div className="mt-4 rounded-2xl bg-[#fff8f1] p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-[#1c1410]">
                      Admissions pipeline
                    </div>
                    <div className="text-[10px] text-[#7a6a5d]">Last 6 months</div>
                  </div>
                  <div className="mt-3 flex items-end gap-2 h-24">
                    {[40, 55, 48, 70, 62, 88].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-[#e85d2f] to-[#f59e0b]"
                          style={{ height: `${h}%` }}
                        />
                        <div className="text-[9px] text-[#7a6a5d]">
                          {["Apr", "May", "Jun", "Jul", "Aug", "Sep"][i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent row */}
                <div className="mt-4 space-y-2">
                  {[
                    { n: "Aarav Sharma", c: "→ Univ. of Toronto", s: "Visa approved", color: "#0f766e" },
                    { n: "Diya Patel", c: "→ IIT Bombay", s: "Doc submitted", color: "#f59e0b" },
                    { n: "Ishaan Reddy", c: "→ Monash Univ.", s: "Offer received", color: "#e85d2f" },
                  ].map((r) => (
                    <div
                      key={r.n}
                      className="flex items-center justify-between rounded-xl border border-orange-100 bg-white px-3 py-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-7 w-7 rounded-full"
                          style={{ background: r.color }}
                        />
                        <div>
                          <div className="text-[11px] font-semibold text-[#1c1410]">{r.n}</div>
                          <div className="text-[10px] text-[#7a6a5d]">{r.c}</div>
                        </div>
                      </div>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          background: `${r.color}1a`,
                          color: r.color,
                        }}
                      >
                        {r.s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating stat card top-right */}
              <div className="absolute -top-6 -right-3 sm:-right-6 animate-floaty">
                <div className="rounded-2xl bg-white shadow-xl ring-1 ring-orange-100 p-4 w-44">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-[#0f766e]/10 flex items-center justify-center">
                      <Globe2 className="h-4 w-4 text-[#0f766e]" />
                    </div>
                    <div className="text-[10px] font-semibold text-[#7a6a5d]">Partner univs</div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-[#1c1410]">1,048</div>
                  <div className="text-[10px] text-[#0f766e] font-semibold">+ 32 added this quarter</div>
                </div>
              </div>

              {/* Floating stat card bottom-left */}
              <div
                className="absolute -bottom-7 -left-3 sm:-left-7 animate-floaty"
                style={{ animationDelay: "1.2s" }}
              >
                <div className="rounded-2xl bg-[#1c1410] text-white shadow-xl p-4 w-48">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-[#e85d2f]/20 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-[#f59e0b]" />
                    </div>
                    <div className="text-[10px] font-semibold text-white/70">Revenue / month</div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold">₹38.6L</div>
                  <div className="text-[10px] text-[#f59e0b] font-semibold">+22% vs last month</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-12 sm:py-16 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-3xl overflow-hidden ring-1 ring-orange-100 bg-orange-100">
          {[
            { v: "48,000+", l: "Students placed", c: "text-[#e85d2f]" },
            { v: "1,048", l: "Partner universities", c: "text-[#0f766e]" },
            { v: "32", l: "Countries covered", c: "text-[#f59e0b]" },
            { v: "92%", l: "Visa success rate", c: "text-[#1c1410]" },
          ].map((s) => (
            <div key={s.l} className="bg-brand-cream px-5 py-7 text-center">
              <div className={`text-3xl sm:text-4xl font-extrabold ${s.c}`}>{s.v}</div>
              <div className="mt-1 text-xs sm:text-sm font-medium text-[#4b3d33]">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function KpiCard({
  icon,
  value,
  label,
  trend,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: string;
  color: "saffron" | "emerald" | "amber";
}) {
  const map = {
    saffron: { bg: "bg-[#e85d2f]/10", fg: "text-[#e85d2f]" },
    emerald: { bg: "bg-[#0f766e]/10", fg: "text-[#0f766e]" },
    amber: { bg: "bg-[#f59e0b]/10", fg: "text-[#f59e0b]" },
  }[color];
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-3">
      <div className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${map.bg} ${map.fg}`}>
        {icon}
      </div>
      <div className="mt-2 text-lg font-extrabold text-[#1c1410] leading-none">{value}</div>
      <div className="mt-0.5 text-[10px] text-[#7a6a5d]">{label}</div>
      <div className={`mt-1 text-[10px] font-semibold ${map.fg}`}>{trend}</div>
    </div>
  );
}

function GraduationCapSmall() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
