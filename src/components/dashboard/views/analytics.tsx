// Analytics view — funnel + counselor performance + insights

"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/store/app-store";
import { Card, SectionTitle, Empty, Spinner } from "@/components/dashboard/_ui";

type Stats = {
  kpis: {
    totalStudents: number; activeApplications: number; offeredApplications: number;
    enrolledCount: number; successRate: number;
  };
  charts: {
    studentsByStatus: { label: string; value: number }[];
    applicationsByStatus: { label: string; value: number }[];
    studentsByCountry: { label: string; value: number }[];
    revenueTrend: { month: string; revenue: number; students: number }[];
  };
};

const FUNNEL = [
  { stage: "Leads captured", key: "totalStudents", color: "#f59e0b" },
  { stage: "Shortlisted", key: "SHORTLISTED", color: "#0ea5e9" },
  { stage: "Applications submitted", key: "SUBMITTED", color: "#e85d2f" },
  { stage: "Offers received", key: "offeredApplications", color: "#22c55e" },
  { stage: "Enrolled", key: "enrolledCount", color: "#0f766e" },
];

const COUNSELORS = [
  { name: "Rajesh Mehta", placed: 42, offers: 56, conversion: 75, color: "#e85d2f" },
  { name: "Anjali Nair", placed: 38, offers: 48, conversion: 79, color: "#0f766e" },
  { name: "Sandeep Joshi", placed: 31, offers: 41, conversion: 76, color: "#f59e0b" },
  { name: "Priya Reddy", placed: 27, offers: 35, conversion: 77, color: "#a855f7" },
  { name: "Meera Krishnan", placed: 22, offers: 30, conversion: 73, color: "#0ea5e9" },
];

export default function AnalyticsView() {
  const [data, setData] = useState<Stats | null>(null);

  useEffect(() => { apiFetch("/api/dashboard").then(setData).catch(() => {}); }, []);

  if (!data) return <div className="py-16 flex items-center justify-center gap-2 text-[#7a6a5d]"><Spinner /> Loading…</div>;

  const maxCounselor = Math.max(...COUNSELORS.map((c) => c.placed));
  const maxRevenue = Math.max(...data.charts.revenueTrend.map((r) => r.revenue), 1);
  const maxCountry = Math.max(...data.charts.studentsByCountry.map((c) => c.value), 1);

  // Build funnel values
  const statusMap = Object.fromEntries(data.charts.studentsByStatus.map((s) => [s.label, s.value]));
  const funnelValues = [
    data.kpis.totalStudents,
    statusMap["SHORTLISTED"] || 0,
    (statusMap["APPLIED"] || 0),
    data.kpis.offeredApplications,
    data.kpis.enrolledCount,
  ];
  const maxFunnel = Math.max(...funnelValues, 1);

  return (
    <div className="space-y-5">
      {/* Conversion funnel */}
      <Card className="p-5">
        <SectionTitle title="Conversion funnel" subtitle="From lead to enrolment — current pipeline" />
        <div className="space-y-2">
          {FUNNEL.map((stage, i) => {
            const v = funnelValues[i];
            const pct = Math.round((v / maxFunnel) * 100);
            const conv = i === 0 ? 100 : Math.round((v / funnelValues[0]) * 100);
            return (
              <div key={stage.stage} className="flex items-center gap-3">
                <div className="w-44 text-xs font-medium text-[#3a2e26]">{stage.stage}</div>
                <div className="flex-1 h-9 rounded-lg bg-[#fff8f1] overflow-hidden relative">
                  <div
                    className="h-full rounded-lg flex items-center justify-between px-3 transition-all"
                    style={{ width: `${pct}%`, background: `${stage.color}dd` }}
                  >
                    <span className="text-[11px] font-bold text-white">{v}</span>
                    {i > 0 && <span className="text-[10px] font-bold text-white/90">{conv}% conv.</span>}
                  </div>
                </div>
                <div className="w-12 text-right text-xs font-bold text-[#1c1410]">{v}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Counselor performance */}
        <Card className="p-5">
          <SectionTitle title="Counselor scorecard" subtitle="Placements this quarter" />
          <div className="space-y-3">
            {COUNSELORS.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white text-[9px] font-bold"
                      style={{ background: c.color }}>
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                    <span className="font-medium text-[#1c1410]">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-[#7a6a5d]">{c.offers} offers</span>
                    <span className="font-bold text-[#0f766e]">{c.placed} placed</span>
                    <span className="text-[#e85d2f] font-bold">{c.conversion}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[#fff8f1] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(c.placed / maxCounselor) * 100}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue trend */}
        <Card className="p-5">
          <SectionTitle title="Revenue vs students" subtitle="6-month trend" />
          <div className="flex items-end gap-3 h-44">
            {data.charts.revenueTrend.map((r) => (
              <div key={r.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[10px] font-bold text-[#1c1410]">{r.students}🎓</div>
                <div className="w-full flex-1 flex items-end">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-[#e85d2f] to-[#f59e0b]"
                    style={{ height: `${(r.revenue / maxRevenue) * 100}%` }} />
                </div>
                <div className="text-[11px] font-bold text-[#1c1410]">₹{r.revenue}L</div>
                <div className="text-[10px] text-[#7a6a5d]">{r.month}</div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Top countries + insights */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5">
          <SectionTitle title="Destination mix" subtitle="Where students are going" />
          <div className="space-y-2.5">
            {data.charts.studentsByCountry.map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-[#3a2e26]">{c.label}</span>
                  <span className="font-bold text-[#1c1410]">{c.value}</span>
                </div>
                <div className="h-2 rounded-full bg-[#fff8f1] overflow-hidden">
                  <div className="h-full rounded-full bg-[#e85d2f]" style={{ width: `${(c.value / maxCountry) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2 bg-gradient-to-br from-[#1c1410] to-[#2a1d15] text-white">
          <SectionTitle title={<span className="text-white">AI insights</span>} subtitle={<span className="text-white/60">Auto-generated weekly</span>} />
          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">↑ Conversion up</div>
              <div className="mt-1 text-white/85">UK applications converted at <strong className="text-white">88%</strong> this month — 12 points above your 6-month average.</div>
            </div>
            <div className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">★ Best partner</div>
              <div className="mt-1 text-white/85"><strong className="text-white">Monash University</strong> approved 4 of 5 applications this quarter — keep pushing volume.</div>
            </div>
            <div className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#0ea5e9]">⚠ Action needed</div>
              <div className="mt-1 text-white/85">3 visa appointments due in 14 days — assign a visa specialist today.</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
