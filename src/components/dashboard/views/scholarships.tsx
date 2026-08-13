// Scholarship Finder dashboard view

"use client";

import { useEffect, useState } from "react";
import { Award, Loader2, ExternalLink, Sparkles, GraduationCap, Globe2, Wallet, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner, Avatar } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Scholarship = {
  id: string; name: string; provider: string; country: string;
  amount: number; amountLabel: string; level: string; categories: string;
  minScore: number | null; minIelts: number | null; minToefl: number | null;
  deadline: string | null; intake: string | null; fields: string;
  website: string | null; logoColor: string; description: string;
  matchScore: number; eligible: boolean; reasons: string[];
};

const PALETTE = ["#e85d2f", "#0f766e", "#f59e0b", "#a855f7", "#0ea5e9"];

export default function ScholarshipsView() {
  const [students, setStudents] = useState<Array<{ id: string; firstName: string; lastName: string; city: string | null; academicScore: number | null; englishScore: string | null; targetCountry: string | null; targetProgram: string | null }>>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  useEffect(() => {
    apiFetch("/api/students").then((d) => {
      setStudents(d.students);
      if (d.students.length > 0) setSelected(d.students[0].id);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    apiFetch("/api/scholarships/match", {
      method: "POST",
      body: JSON.stringify({ studentId: selected }),
    }).then((d) => {
      if (!cancelled) {
        setScholarships(d.scholarships);
        setMatching(false);
      }
    }).catch(() => {
      if (!cancelled) setMatching(false);
    });
    // Set matching via microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => {
      if (!cancelled) {
        setScholarships([]);
        setMatching(true);
      }
    });
    return () => { cancelled = true; };
  }, [selected]);

  if (loading) return <div className="py-16 flex items-center justify-center gap-2 text-[#7a6a5d]"><Spinner /> Loading…</div>;

  const student = students.find((s) => s.id === selected);
  const eligible = scholarships.filter((s) => s.eligible);
  const totalAmount = eligible.reduce((s, sc) => s + sc.amount, 0);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#f59e0b]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#22c55e]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] via-[#22c55e] to-[#0f766e] shadow-xl">
            <Award className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">
              <Sparkles className="h-3 w-3" />
              Scholarship Finder Pro · 39+ awards
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Auto-match your students to 39+ scholarships</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              From Chevening (UK) to Fulbright (US), DAAD (Germany) to Vanier (Canada) — our engine scores every scholarship
              against the student's academic profile, English scores, destination, and level.
            </p>
          </div>
        </div>
      </div>

      {/* Student picker */}
      <Card className="p-5">
        <div className="text-xs font-bold uppercase tracking-wider text-[#7a6a5d] mb-3">Select student</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {students.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all ${
                selected === s.id
                  ? "bg-gradient-to-br from-[#f59e0b]/10 to-[#22c55e]/10 ring-2 ring-[#f59e0b]"
                  : "bg-white ring-1 ring-orange-100 hover:ring-orange-200"
              }`}
            >
              <Avatar name={`${s.firstName} ${s.lastName}`} color={PALETTE[i % PALETTE.length]} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#1c1410] truncate">{s.firstName} {s.lastName}</div>
                <div className="text-[10px] text-[#7a6a5d] truncate">
                  {s.academicScore || "—"}/10 · {s.targetCountry || "Open"}
                </div>
              </div>
              {selected === s.id && <CheckCircle2 className="h-4 w-4 text-[#f59e0b] shrink-0" />}
            </button>
          ))}
        </div>
      </Card>

      {/* Stats */}
      {scholarships.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="Total awards" value={scholarships.length} color="#0ea5e9" icon={Award} />
          <StatBox label="Eligible" value={eligible.length} color="#22c55e" icon={CheckCircle2} />
          <StatBox label="Total value" value={`₹${(totalAmount / 100000).toFixed(0)}L`} color="#f59e0b" icon={Wallet} />
          <StatBox label="Top match" value={scholarships[0] ? `${scholarships[0].matchScore}%` : "—"} color="#a855f7" icon={Sparkles} />
        </div>
      )}

      {/* Scholarships list */}
      {matching ? (
        <Card className="p-12 text-center">
          <Spinner className="text-[#f59e0b] mx-auto" />
          <div className="mt-3 text-sm font-semibold text-[#7a6a5d]">Matching {student?.firstName} against 39 scholarships…</div>
        </Card>
      ) : scholarships.length === 0 ? (
        <Empty title="No scholarships" hint="Select a student to see matches." />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {scholarships.slice(0, 12).map((s, i) => (
            <Card key={s.id} className={`p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all ${s.eligible ? "ring-1 ring-emerald-200" : "opacity-75"}`}>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="text-[10px] font-bold uppercase text-[#7a6a5d]">#{i + 1}</div>
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                    style={{ background: s.logoColor }}
                  >
                    <Award className="h-5 w-5" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#1c1410] leading-tight">{s.name}</h3>
                      <div className="text-[11px] text-[#7a6a5d] mt-0.5">{s.provider} · {s.country}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div
                        className="text-2xl font-extrabold leading-none"
                        style={{ color: s.eligible ? "#22c55e" : "#94a3b8" }}
                      >
                        {s.matchScore}
                      </div>
                      <div className="text-[9px] uppercase font-bold text-[#7a6a5d]">match</div>
                    </div>
                  </div>

                  {/* Eligible badge */}
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    {s.eligible ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#22c55e]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#15803d]">
                        <CheckCircle2 className="h-2.5 w-2.5" /> ELIGIBLE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#94a3b8]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#64748b]">
                        STRETCH
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-[#7a6a5d]">{s.level} · {s.categories.split(",").slice(0, 2).join(", ")}</span>
                  </div>

                  {/* Amount */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <div className="text-[9px] uppercase font-bold text-[#7a6a5d]">Award</div>
                      <div className="font-bold text-[#1c1410]">{s.amountLabel}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-bold text-[#7a6a5d]">Deadline</div>
                      <div className="font-bold text-[#1c1410]">{s.deadline || "Rolling"}</div>
                    </div>
                  </div>

                  {/* Reasons */}
                  {s.reasons.length > 0 && (
                    <div className="mt-2 text-[10px] text-[#3a2e26]">
                      {s.reasons.slice(0, 2).map((r, idx) => (
                        <div key={idx} className="flex items-start gap-1">
                          <span className="text-[#22c55e] mt-0.5">✓</span> {r}
                        </div>
                      ))}
                    </div>
                  )}

                  <a
                    href={s.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-[#e85d2f] hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> Apply / Learn more
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color, icon: Icon }: { label: string; value: string | number; color: string; icon: React.ElementType }) {
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
