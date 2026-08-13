// Lead Magnets Engine dashboard view
// Made & maintained by GuardianX

"use client";

import { useEffect, useState } from "react";
import {
  Zap, Eye, MousePointerClick, TrendingUp, Copy, Check, Code,
  Power, ExternalLink, Loader2,
} from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Magnet = {
  id: string;
  name: string;
  type: string;
  slug: string;
  description: string;
  ctaText: string;
  isActive: boolean;
  views: number;
  conversions: number;
  embedCode: string | null;
};

const TYPE_ICON: Record<string, string> = {
  ELIGIBILITY_CHECKER: "✅",
  SCHOLARSHIP_QUIZ: "🎓",
  UNIVERSITY_MATCHER: "🎯",
  COUNTRY_QUIZ: "🌍",
  VISA_ELIGIBILITY: "🛂",
};

const TYPE_COLOR: Record<string, string> = {
  ELIGIBILITY_CHECKER: "#22c55e",
  SCHOLARSHIP_QUIZ: "#f59e0b",
  UNIVERSITY_MATCHER: "#e85d2f",
  COUNTRY_QUIZ: "#0ea5e9",
  VISA_ELIGIBILITY: "#a855f7",
};

export default function LeadMagnetsView() {
  const [magnets, setMagnets] = useState<Magnet[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, totalViews: 0, totalConversions: 0, avgConversionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState<Magnet | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/lead-magnets");
      setMagnets(data.magnets);
      setStats(data.stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const copyEmbed = (m: Magnet) => {
    navigator.clipboard?.writeText(m.embedCode || "");
    setCopiedSlug(m.slug);
    toast({ title: "Embed code copied!", description: "Paste it into your website HTML." });
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const toggle = async (m: Magnet) => {
    try {
      await apiFetch("/api/lead-magnets", {
        method: "POST",
        body: JSON.stringify({ magnetId: m.id, action: "toggle" }),
      });
      toast({ title: `${m.name} ${m.isActive ? "deactivated" : "activated"}` });
      load();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#f59e0b]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#e85d2f]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] via-[#e85d2f] to-[#dc2626] shadow-xl">
            <Zap className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">
              <Zap className="h-3 w-3" />
              Lead Magnets Engine · Capture leads 24/7
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Free tools that turn visitors into leads</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Embeddable eligibility checkers, scholarship quizzes, university matchers, and visa eligibility tools on your
              website. Every visitor who completes a quiz becomes a lead in your CRM — automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total magnets" value={stats.total} color="#f59e0b" icon={Zap} />
        <StatCard label="Active" value={stats.active} color="#22c55e" icon={Power} />
        <StatCard label="Total views" value={stats.totalViews.toLocaleString()} color="#0ea5e9" icon={Eye} />
        <StatCard label="Conversions" value={stats.totalConversions.toLocaleString()} color="#e85d2f" icon={MousePointerClick} />
      </div>

      {/* Conversion funnel */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#1c1410]">Overall conversion funnel</h3>
          <span className="text-xs text-[#7a6a5d]">Avg conversion rate: <strong className="text-[#1c1410]">{stats.avgConversionRate}%</strong></span>
        </div>
        <div className="space-y-2">
          <FunnelBar label="Quiz views" value={stats.totalViews} max={stats.totalViews} color="#0ea5e9" />
          <FunnelBar label="Quiz completions" value={stats.totalConversions} max={stats.totalViews} color="#f59e0b" />
          <FunnelBar label="Lead → student" value={Math.round(stats.totalConversions * 0.35)} max={stats.totalViews} color="#e85d2f" />
          <FunnelBar label="Student → enrolled" value={Math.round(stats.totalConversions * 0.18)} max={stats.totalViews} color="#22c55e" />
        </div>
      </Card>

      {/* Magnets grid */}
      {loading ? (
        <Card className="p-12 text-center"><Spinner className="mx-auto" /></Card>
      ) : magnets.length === 0 ? (
        <Empty title="No lead magnets" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {magnets.map((m) => {
            const convRate = m.views > 0 ? Math.round((m.conversions / m.views) * 100) : 0;
            const color = TYPE_COLOR[m.type] || "#7a6a5d";
            return (
              <Card key={m.id} className="p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg shrink-0" style={{ background: `${color}1a` }}>
                    {TYPE_ICON[m.type] || "⚡"}
                  </span>
                  <button
                    onClick={() => toggle(m)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${m.isActive ? "bg-[#22c55e]" : "bg-[#e5e7eb]"}`}
                    aria-label="Toggle active"
                  >
                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${m.isActive ? "translate-x-5" : ""}`} />
                  </button>
                </div>

                <h3 className="mt-3 text-sm font-bold text-[#1c1410]">{m.name}</h3>
                <p className="mt-1 text-xs text-[#7a6a5d] leading-relaxed">{m.description}</p>

                {/* Stats */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-[#fff8f1] p-2">
                    <div className="text-sm font-extrabold text-[#0ea5e9]">{m.views.toLocaleString()}</div>
                    <div className="text-[9px] text-[#7a6a5d]">Views</div>
                  </div>
                  <div className="rounded-lg bg-[#fff8f1] p-2">
                    <div className="text-sm font-extrabold text-[#e85d2f]">{m.conversions.toLocaleString()}</div>
                    <div className="text-[9px] text-[#7a6a5d]">Conv.</div>
                  </div>
                  <div className="rounded-lg bg-[#fff8f1] p-2">
                    <div className="text-sm font-extrabold text-[#22c55e]">{convRate}%</div>
                    <div className="text-[9px] text-[#7a6a5d]">Rate</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-3 rounded-lg bg-gradient-to-br from-[#f59e0b]/10 to-[#e85d2f]/10 px-3 py-2 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c8451a]">{m.ctaText}</span>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => copyEmbed(m)}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-[#1c1410] text-white px-3 h-8 text-[10px] font-semibold hover:bg-[#e85d2f] transition-colors"
                  >
                    {copiedSlug === m.slug ? <><Check className="h-3 w-3" /> Copied!</> : <><Code className="h-3 w-3" /> Get embed</>}
                  </button>
                  <a
                    href={`https://educonnect.in/lm/${m.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-xs font-medium text-[#3a2e26]">{label}</div>
      <div className="flex-1 h-7 rounded-lg bg-[#fff8f1] overflow-hidden relative">
        <div className="h-full rounded-lg flex items-center justify-end px-2 transition-all" style={{ width: `${pct}%`, background: `${color}cc` }}>
          <span className="text-[10px] font-bold text-white">{value.toLocaleString()}</span>
        </div>
      </div>
      <div className="w-10 text-right text-xs font-bold text-[#1c1410]">{pct}%</div>
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
