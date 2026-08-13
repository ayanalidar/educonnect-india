// Overview dashboard view — KPIs + charts + recent activity

"use client";

import { useEffect, useState } from "react";
import {
  Users, FolderCheck, Award, GraduationCap, Plane, Wallet, TrendingUp, ArrowUpRight, Clock,
} from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { useI18n } from "@/context/i18n";
import { Card, SectionTitle, Avatar, Spinner, StatusBadge, Empty } from "@/components/dashboard/_ui";
import type { DashboardView } from "@/components/dashboard/sidebar";

type Stats = {
  kpis: {
    totalStudents: number;
    activeApplications: number;
    offeredApplications: number;
    enrolledCount: number;
    pendingVisas: number;
    paidInvoices: number;
    totalRevenue: number;
    communicationsThisWeek: number;
    successRate: number;
  };
  charts: {
    studentsByStatus: { label: string; value: number }[];
    applicationsByStatus: { label: string; value: number }[];
    studentsByCountry: { label: string; value: number }[];
    revenueTrend: { month: string; revenue: number; students: number }[];
  };
  recent: {
    students: Array<{ id: string; firstName: string; lastName: string; city: string; status: string; targetCountry: string; createdAt: string; _count: { applications: number } }>;
    communications: Array<{ id: string; channel: string; subject: string | null; body: string; createdAt: string; student: { firstName: string; lastName: string } | null }>;
  };
};

const PALETTE = ["#e85d2f", "#0f766e", "#f59e0b", "#a855f7", "#0ea5e9", "#22c55e"];

export default function OverviewView({ onNavigate }: { onNavigate: (v: DashboardView) => void }) {
  const { t } = useI18n();
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/api/dashboard").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <Empty title="Failed to load dashboard" hint={error} />;
  if (!data) return <LoadingGrid />;

  const k = data.kpis;
  const kpis = [
    { label: t("kpi.totalStudents"), value: k.totalStudents, icon: Users, color: "#e85d2f", delta: "+12%", view: "students" as DashboardView },
    { label: t("kpi.applications"), value: k.activeApplications, icon: FolderCheck, color: "#f59e0b", delta: "+8%", view: "applications" as DashboardView },
    { label: t("kpi.offers"), value: k.offeredApplications, icon: Award, color: "#22c55e", delta: "+4", view: "applications" as DashboardView },
    { label: t("kpi.enrolled"), value: k.enrolledCount, icon: GraduationCap, color: "#0f766e", delta: "+2", view: "applications" as DashboardView },
    { label: t("kpi.visa"), value: k.pendingVisas, icon: Plane, color: "#a855f7", delta: "3 due", view: "visa" as DashboardView },
    { label: t("kpi.revenue"), value: `₹${(k.totalRevenue / 100000).toFixed(1)}L`, icon: Wallet, color: "#1c1410", delta: "+22%", view: "finance" as DashboardView },
    { label: t("kpi.success"), value: `${k.successRate}%`, icon: TrendingUp, color: "#e85d2f", delta: "+4%", view: "analytics" as DashboardView },
    { label: "Comms this week", value: k.communicationsThisWeek, icon: Clock, color: "#0ea5e9", delta: "+18", view: "communication" as DashboardView },
  ];

  const maxStudents = Math.max(...data.charts.studentsByStatus.map((s) => s.value), 1);
  const maxRevenue = Math.max(...data.charts.revenueTrend.map((r) => r.revenue), 1);
  const maxCountry = Math.max(...data.charts.studentsByCountry.map((c) => c.value), 1);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#e85d2f]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#0f766e]/30 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#f59e0b]">
              {t("common.welcome")}
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold">Rajesh, your consultancy is up 22% MoM 🎉</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-xl">
              You closed 4 offers this week. 3 visa appointments are due in the next 14 days.
            </p>
          </div>
          <button
            onClick={() => onNavigate("students")}
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#1c1410] px-4 h-10 text-sm font-semibold hover:bg-orange-50 transition-colors"
          >
            Add student
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => onNavigate(kpi.view)}
            className="text-left rounded-2xl bg-white p-4 ring-1 ring-orange-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `${kpi.color}1a`, color: kpi.color }}
              >
                <kpi.icon className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide rounded-full px-1.5 py-0.5" style={{ background: `${kpi.color}1a`, color: kpi.color }}>
                {kpi.delta}
              </span>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[#1c1410] leading-none">{kpi.value}</div>
            <div className="mt-1 text-[11px] text-[#7a6a5d]">{kpi.label}</div>
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Students by status */}
        <Card className="p-5">
          <SectionTitle title={t("overview.studentsByStatus")} subtitle="Distribution across pipeline stages" />
          <div className="space-y-2.5">
            {data.charts.studentsByStatus.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-24 text-xs font-medium text-[#3a2e26] capitalize">{s.label.replace(/_/g, " ").toLowerCase()}</div>
                <div className="flex-1 h-7 rounded-lg bg-[#fff8f1] overflow-hidden">
                  <div
                    className="h-full rounded-lg flex items-center justify-end px-2 transition-all"
                    style={{
                      width: `${(s.value / maxStudents) * 100}%`,
                      background: `${PALETTE[i % PALETTE.length]}cc`,
                    }}
                  >
                    <span className="text-[10px] font-bold text-white">{s.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Applications by status */}
        <Card className="p-5">
          <SectionTitle title={t("overview.applicationsByStatus")} subtitle="Where applications are stuck" />
          <div className="grid grid-cols-2 gap-3">
            {data.charts.applicationsByStatus.map((s, i) => (
              <div key={s.label} className="rounded-xl border border-orange-100 p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#7a6a5d]">{s.label.replace(/_/g, " ")}</span>
                </div>
                <div className="mt-1.5 text-xl font-extrabold text-[#1c1410]">{s.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Revenue trend + Top countries */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle title={t("overview.revenueTrend")} subtitle="Last 6 months · revenue in ₹ lakhs" />
          <div className="flex items-end gap-3 h-44 px-2">
            {data.charts.revenueTrend.map((r, i) => (
              <div key={r.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[10px] font-bold text-[#1c1410]">{r.revenue}L</div>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#e85d2f] to-[#f59e0b] transition-all hover:from-[#c8451a]"
                    style={{ height: `${(r.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#7a6a5d]">{r.month}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title={t("overview.topCountries")} subtitle="Student destinations" />
          <div className="space-y-3">
            {data.charts.studentsByCountry.map((c, i) => (
              <div key={c.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-[#3a2e26]">{c.label}</span>
                  <span className="font-bold text-[#1c1410]">{c.value}</span>
                </div>
                <div className="h-2 rounded-full bg-[#fff8f1] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(c.value / maxCountry) * 100}%`,
                      background: PALETTE[i % PALETTE.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent students + activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <SectionTitle
            title={t("overview.recent")}
            action={
              <button onClick={() => onNavigate("students")} className="text-xs font-semibold text-[#e85d2f] hover:underline">
                View all →
              </button>
            }
          />
          <div className="space-y-2.5">
            {data.recent.students.map((s) => (
              <div key={s.id} className="flex items-center gap-3 py-2 border-b border-orange-50 last:border-0">
                <Avatar name={`${s.firstName} ${s.lastName}`} color={PALETTE[Math.floor(Math.random() * PALETTE.length)]} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#1c1410] truncate">{s.firstName} {s.lastName}</div>
                  <div className="text-[11px] text-[#7a6a5d]">{s.city} → {s.targetCountry || "—"}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle
            title={t("overview.activity")}
            action={
              <button onClick={() => onNavigate("communication")} className="text-xs font-semibold text-[#e85d2f] hover:underline">
                View all →
              </button>
            }
          />
          <div className="space-y-2.5">
            {data.recent.communications.map((c) => (
              <div key={c.id} className="flex items-start gap-3 py-2 border-b border-orange-50 last:border-0">
                <span
                  className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold"
                  style={{
                    background: c.channel === "WHATSAPP" ? "#22c55e20" : c.channel === "EMAIL" ? "#0ea5e920" : "#f59e0b20",
                    color: c.channel === "WHATSAPP" ? "#15803d" : c.channel === "EMAIL" ? "#0369a1" : "#b45309",
                  }}
                >
                  {c.channel === "WHATSAPP" ? "WA" : c.channel === "EMAIL" ? "EM" : "SM"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#1c1410] truncate">{c.subject || c.body.slice(0, 50)}</div>
                  <div className="text-[11px] text-[#7a6a5d] truncate">
                    {c.student ? `${c.student.firstName} ${c.student.lastName}` : "—"} · {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function LoadingGrid() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#1c1410] p-7 flex items-center gap-3 text-white">
        <Spinner className="text-[#f59e0b]" />
        <span className="text-sm">{t("common.welcome")}…</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white ring-1 ring-orange-100 animate-pulse" />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="h-64 rounded-2xl bg-white ring-1 ring-orange-100 animate-pulse" />
        <div className="h-64 rounded-2xl bg-white ring-1 ring-orange-100 animate-pulse" />
      </div>
    </div>
  );
}
