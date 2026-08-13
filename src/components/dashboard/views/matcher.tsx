// AI Course Matcher dashboard view — pick a student → ranked universities with LLM explanations
// Made & maintained by GuardianX

"use client";

import { useEffect, useState } from "react";
import {
  Sparkles, Loader2, RefreshCw, ArrowRight, CheckCircle2, Star, TrendingUp,
  GraduationCap, Wallet, Globe2, Award, Users, ChevronRight,
} from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner, Avatar } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Student = {
  id: string; firstName: string; lastName: string; city: string | null;
  academicScore: number | null; englishScore: string | null;
  budget: number | null; targetCountry: string | null; targetProgram: string | null;
};

type Recommendation = {
  id: string; name: string; country: string; city: string;
  ranking: number | null; tuitionFee: number | null; applicationFee: number | null;
  logoColor: string; popularCourses: string; commission: number | null;
  minIelts: number | null; minToefl: number | null; minGpa: number | null;
  matchScore: number;
  fitBreakdown: { academic: number; english: number; budget: number; country: number; ranking: number };
  tier: "REACH" | "TARGET" | "SAFETY";
};

const PALETTE = ["#e85d2f", "#0f766e", "#f59e0b", "#a855f7", "#0ea5e9"];

export default function MatcherView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    apiFetch("/api/students")
      .then((d) => {
        setStudents(d.students);
        if (d.students.length > 0) setSelected(d.students[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const runMatch = async (studentId: string, withExplain: boolean = false) => {
    if (!studentId) return;
    setMatching(true);
    setRecs([]);
    setExplanations({});
    try {
      const data = await apiFetch("/api/matcher", {
        method: "POST",
        body: JSON.stringify({ studentId, explain: withExplain }),
      });
      setRecs(data.recommendations);
      setExplanations(data.explanations || {});
      toast({
        title: withExplain ? "AI recommendations ready ✨" : "Matches generated",
        description: `${data.recommendations.length} universities ranked by fit score.`,
      });
    } catch (err) {
      toast({ title: "Matching failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setMatching(false);
    }
  };

  useEffect(() => {
    if (selected) runMatch(selected, false);
  }, [selected]);

  const applyTo = async (uni: Recommendation) => {
    const student = students.find((s) => s.id === selected);
    if (!student) return;
    try {
      await apiFetch("/api/applications", {
        method: "POST",
        body: JSON.stringify({
          studentId: selected,
          universityId: uni.id,
          program: student.targetProgram || "General",
          intake: "Fall 2026",
          status: "DRAFT",
          amount: uni.tuitionFee,
        }),
      });
      setApplied((prev) => new Set(prev).add(uni.id));
      toast({
        title: `Application drafted → ${uni.name}`,
        description: "Find it in the Applications view to submit.",
      });
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  if (loading) return <div className="py-16 flex items-center justify-center gap-2 text-[#7a6a5d]"><Spinner /> Loading students…</div>;

  const student = students.find((s) => s.id === selected);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#e85d2f]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#a855f7]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e85d2f] via-[#f59e0b] to-[#a855f7] shadow-xl">
            <Sparkles className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">
              <Sparkles className="h-3 w-3" />
              AI Course Matcher · Powered by ML
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Find the perfect-fit universities in seconds</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Our matching algorithm scores every partner university (1,048 of them) against the student's
              academic profile, English scores, budget, and destination preference. Click "Get AI explanation"
              to generate a personalized recommendation paragraph for each top match.
            </p>
          </div>
        </div>
      </div>

      {/* Student picker */}
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#7a6a5d]">Select student</div>
            <div className="mt-0.5 text-sm text-[#3a2e26]">We'll rank all 1,048 universities by fit score</div>
          </div>
          {student && (
            <button
              onClick={() => runMatch(selected, true)}
              disabled={matching}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#7e22ce] text-white px-4 h-10 text-sm font-semibold shadow-lg shadow-purple-300/40 hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {matching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Get AI explanation
            </button>
          )}
        </div>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {students.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all ${
                selected === s.id
                  ? "bg-gradient-to-br from-[#e85d2f]/10 to-[#f59e0b]/10 ring-2 ring-[#e85d2f]"
                  : "bg-white ring-1 ring-orange-100 hover:ring-orange-200"
              }`}
            >
              <Avatar name={`${s.firstName} ${s.lastName}`} color={PALETTE[i % PALETTE.length]} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#1c1410] truncate">{s.firstName} {s.lastName}</div>
                <div className="text-[10px] text-[#7a6a5d] truncate">
                  {s.academicScore || "—"}/10 · {s.englishScore || "—"} · {s.targetCountry || "Open"}
                </div>
              </div>
              {selected === s.id && <CheckCircle2 className="h-4 w-4 text-[#e85d2f] shrink-0" />}
            </button>
          ))}
        </div>

        {student && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <Profile label="Academic" value={`${student.academicScore || "—"}/10`} icon={GraduationCap} />
            <Profile label="English" value={student.englishScore || "—"} icon={Globe2} />
            <Profile label="Budget" value={student.budget ? `₹${student.budget}L` : "—"} icon={Wallet} />
            <Profile label="Target" value={student.targetCountry || "Open"} icon={Globe2} />
          </div>
        )}
      </Card>

      {/* Recommendations */}
      {matching && recs.length === 0 && (
        <Card className="p-12 text-center">
          <Spinner className="text-[#a855f7] mx-auto" />
          <div className="mt-3 text-sm font-semibold text-[#7a6a5d]">Scoring 1,048 universities against {student?.firstName}'s profile…</div>
          <div className="mt-1 text-xs text-[#7a6a5d]">This usually takes 2–4 seconds.</div>
        </Card>
      )}

      {!matching && recs.length === 0 && (
        <Empty title="No recommendations yet" hint="Select a student above to generate matches." />
      )}

      {recs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#1c1410]">Top {recs.length} matches for {student?.firstName}</h3>
            <div className="flex items-center gap-1.5 text-xs text-[#7a6a5d]">
              <TrendingUp className="h-3.5 w-3.5" />
              Sorted by match score
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            {recs.map((u, i) => (
              <RecCard
                key={u.id}
                rec={u}
                rank={i + 1}
                explanation={explanations[u.id]}
                applied={applied.has(u.id)}
                onApply={() => applyTo(u)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Profile({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="rounded-lg bg-[#fff8f1] p-2.5">
      <div className="text-[10px] uppercase font-bold text-[#7a6a5d] flex items-center gap-1">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-0.5 text-sm font-bold text-[#1c1410] truncate">{value}</div>
    </div>
  );
}

function RecCard({
  rec, rank, explanation, applied, onApply,
}: {
  rec: Recommendation; rank: number; explanation?: string; applied: boolean; onApply: () => void;
}) {
  const tierColor =
    rec.tier === "REACH" ? "#a855f7" :
    rec.tier === "TARGET" ? "#22c55e" : "#0ea5e9";

  return (
    <Card className="p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1">
          <div className="text-[10px] font-bold uppercase text-[#7a6a5d]">#{rank}</div>
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold shadow-md"
            style={{ background: rec.logoColor }}
          >
            {rec.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#1c1410] leading-tight">{rec.name}</h3>
              <div className="text-[11px] text-[#7a6a5d] mt-0.5">{rec.city}, {rec.country}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-2xl font-extrabold leading-none" style={{ color: tierColor }}>{rec.matchScore}</div>
              <div className="text-[9px] uppercase font-bold text-[#7a6a5d]">match</div>
            </div>
          </div>

          {/* Tier badge */}
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{ background: `${tierColor}1a`, color: tierColor }}
            >
              {rec.tier === "REACH" && <Star className="h-2.5 w-2.5" />}
              {rec.tier === "TARGET" && <CheckCircle2 className="h-2.5 w-2.5" />}
              {rec.tier === "SAFETY" && <Award className="h-2.5 w-2.5" />}
              {rec.tier}
            </span>
            {rec.ranking && rec.ranking > 0 && (
              <span className="text-[10px] font-semibold text-[#7a6a5d]">
                World Rank #{rec.ranking}
              </span>
            )}
            {rec.commission && rec.commission > 0 && (
              <span className="text-[10px] font-semibold text-[#0f766e]">
                · {rec.commission}% commission
              </span>
            )}
          </div>

          {/* Fit breakdown */}
          <div className="mt-3 grid grid-cols-5 gap-1">
            {(["academic", "english", "budget", "country", "ranking"] as const).map((k) => {
              const v = rec.fitBreakdown[k];
              const max = k === "academic" ? 30 : k === "english" ? 25 : k === "budget" ? 20 : k === "country" ? 15 : 10;
              const pct = (v / max) * 100;
              return (
                <div key={k} className="text-center">
                  <div className="h-1.5 rounded-full bg-[#fff8f1] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: pct > 70 ? "#22c55e" : pct > 40 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                  </div>
                  <div className="mt-0.5 text-[9px] font-bold text-[#1c1410]">{v}</div>
                  <div className="text-[8px] uppercase text-[#7a6a5d]">{k.slice(0, 4)}</div>
                </div>
              );
            })}
          </div>

          {/* Key facts */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <div className="text-[9px] uppercase font-bold text-[#7a6a5d]">Tuition/yr</div>
              <div className="font-bold text-[#1c1410]">${((rec.tuitionFee || 0) / 1000).toFixed(0)}k</div>
            </div>
            <div>
              <div className="text-[9px] uppercase font-bold text-[#7a6a5d]">App fee</div>
              <div className="font-bold text-[#1c1410]">${rec.applicationFee || 0}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase font-bold text-[#7a6a5d]">Min IELTS</div>
              <div className="font-bold text-[#1c1410]">{rec.minIelts || "—"}</div>
            </div>
          </div>

          {/* AI explanation */}
          {explanation && (
            <div className="mt-3 rounded-xl bg-gradient-to-br from-[#a855f7]/5 to-[#7e22ce]/5 p-3 ring-1 ring-purple-100">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7e22ce] mb-1">
                <Sparkles className="h-3 w-3" /> AI Insight
              </div>
              <p className="text-xs text-[#3a2e26] leading-relaxed">{explanation}</p>
            </div>
          )}

          {/* Action */}
          <button
            onClick={onApply}
            disabled={applied}
            className={`mt-3 w-full h-9 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              applied
                ? "bg-[#22c55e]/10 text-[#15803d] cursor-default"
                : "bg-[#1c1410] text-white hover:bg-[#e85d2f]"
            }`}
          >
            {applied ? (
              <><CheckCircle2 className="h-3.5 w-3.5" /> Application drafted</>
            ) : (
              <>Draft application <ArrowRight className="h-3.5 w-3.5" /></>
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}
