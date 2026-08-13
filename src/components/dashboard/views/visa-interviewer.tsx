// AI Mock Visa Interviewer dashboard view — voice-based practice
// Made & maintained by GuardianX

"use client";

import { useEffect, useState, useRef } from "react";
import {
  Mic, Bot, Loader2, Volume2, VolumeX, ChevronRight, Sparkles,
  CheckCircle2, AlertCircle, Award, RotateCcw, ChevronLeft, Star,
} from "lucide-react";
import { apiFetch, useAppStore } from "@/store/app-store";
import { Card, Empty, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

const COUNTRIES = [
  { code: "United Kingdom", flag: "🇬🇧", visa: "Tier 4", color: "#0f766e" },
  { code: "United States", flag: "🇺🇸", visa: "F-1", color: "#e85d2f" },
  { code: "Canada", flag: "🇨🇦", visa: "Study Permit", color: "#f59e0b" },
  { code: "Australia", flag: "🇦🇺", visa: "Subclass 500", color: "#a855f7" },
  { code: "Ireland", flag: "🇮🇪", visa: "Long Stay D", color: "#0ea5e9" },
  { code: "Germany", flag: "🇩🇪", visa: "Student Visa", color: "#22c55e" },
  { code: "Singapore", flag: "🇸🇬", visa: "Student Pass", color: "#ec4899" },
];

type Phase = "setup" | "interview" | "results";

type Answer = {
  question: string;
  answer: string | null;
  score: number | null;
  feedback: string | null;
  strengths: string[];
  improvements: string[];
};

export default function VisaInterviewerView() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [country, setCountry] = useState("United Kingdom");
  const [studentId, setStudentId] = useState("");
  const [students, setStudents] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);
  const [sessionId, setSessionId] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [overall, setOverall] = useState<{ score: number; recommendation: string; totalAnswered: number; totalQuestions: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    apiFetch("/api/students").then((d) => {
      setStudents(d.students);
      if (d.students.length > 0) setStudentId(d.students[0].id);
    }).catch(() => {});
  }, []);

  const start = async () => {
    setStarting(true);
    try {
      const data = await apiFetch("/api/visa-interview/start", {
        method: "POST",
        body: JSON.stringify({ studentId: studentId || null, country }),
      });
      setSessionId(data.sessionId);
      setQuestions(data.questions);
      setAnswers(data.questions.map((q: string) => ({ question: q, answer: null, score: null, feedback: null, strengths: [], improvements: [] })));
      setCurrentIdx(0);
      setAnswer("");
      setPhase("interview");
      toast({ title: `Mock interview started — ${country} ${data.visaType}`, description: `${data.questions.length} questions. Speak naturally and confidently.` });
    } catch (err) {
      toast({ title: "Failed to start", description: (err as Error).message, variant: "destructive" });
    } finally {
      setStarting(false);
    }
  };

  const playQuestion = async (q: string) => {
    if (!voiceEnabled) return;
    setPlayingAudio(true);
    try {
      const token = useAppStore.getState().token;
      const res = await fetch("/api/visa-interview/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text: q }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (err) {
      console.error("[tts]", err);
    } finally {
      setPlayingAudio(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const data = await apiFetch("/api/visa-interview/evaluate", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          questionIndex: currentIdx,
          question: questions[currentIdx],
          answer,
        }),
      });
      const updated = [...answers];
      updated[currentIdx] = {
        question: questions[currentIdx],
        answer,
        score: data.score,
        feedback: data.feedback,
        strengths: data.strengths || [],
        improvements: data.improvements || [],
      };
      setAnswers(updated);
      setAnswer("");
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        // Finish
        const result = await apiFetch("/api/visa-interview/evaluate", {
          method: "PUT",
          body: JSON.stringify({ sessionId }),
        });
        setOverall(result);
        setPhase("results");
      }
    } catch (err) {
      toast({ title: "Evaluation failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const skip = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setAnswer("");
    } else {
      // Finish with unanswered
      apiFetch("/api/visa-interview/evaluate", {
        method: "PUT",
        body: JSON.stringify({ sessionId }),
      }).then((r) => {
        setOverall(r);
        setPhase("results");
      });
    }
  };

  const restart = () => {
    setPhase("setup");
    setSessionId("");
    setQuestions([]);
    setAnswers([]);
    setCurrentIdx(0);
    setAnswer("");
    setOverall(null);
  };

  // SETUP PHASE
  if (phase === "setup") {
    return (
      <div className="space-y-5">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
          <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#a855f7]/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#0ea5e9]/30 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#a855f7] via-[#0ea5e9] to-[#22c55e] shadow-xl">
              <Mic className="h-7 w-7" />
            </span>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a855f7]">
                <Sparkles className="h-3 w-3" />
                AI Mock Visa Interviewer · Voice AI
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Practice your visa interview — out loud, with AI</h2>
              <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
                Our AI interviewer asks real visa officer questions, listens to your answers, and scores them on clarity,
                specificity, conviction, and language. Get personalized feedback before the real thing.
              </p>
            </div>
          </div>
        </div>

        {/* Setup card */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-[#1c1410] mb-4">Configure your mock interview</h3>

          <div className="text-xs font-semibold text-[#3a2e26] mb-2">1. Select destination country</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-5">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCountry(c.code)}
                className={`rounded-xl p-3 text-center transition-all ${
                  country === c.code ? "ring-2 ring-[#a855f7] bg-[#a855f7]/5" : "bg-white ring-1 ring-orange-100 hover:ring-orange-200"
                }`}
              >
                <div className="text-2xl">{c.flag}</div>
                <div className="text-[10px] font-bold text-[#1c1410] mt-1 leading-tight">{c.code}</div>
                <div className="text-[9px] text-[#7a6a5d]">{c.visa}</div>
              </button>
            ))}
          </div>

          <div className="text-xs font-semibold text-[#3a2e26] mb-2">2. Link to student (optional)</div>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#a855f7] focus:outline-none mb-3"
          >
            <option value="">— No linked student (guest practice) —</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
            ))}
          </select>

          <div className="rounded-xl bg-[#fff8f1] p-3 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {voiceEnabled ? <Volume2 className="h-4 w-4 text-[#a855f7]" /> : <VolumeX className="h-4 w-4 text-[#7a6a5d]" />}
                <div>
                  <div className="text-sm font-bold text-[#1c1410]">Voice questions</div>
                  <div className="text-[10px] text-[#7a6a5d]">AI speaks each question out loud — like a real interview</div>
                </div>
              </div>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`relative h-6 w-11 rounded-full transition-colors ${voiceEnabled ? "bg-[#a855f7]" : "bg-[#e5e7eb]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${voiceEnabled ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>

          <button
            onClick={start}
            disabled={starting}
            className="w-full h-12 rounded-full bg-gradient-to-r from-[#a855f7] via-[#0ea5e9] to-[#22c55e] text-white font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 hover:-translate-y-0.5 transition-all"
          >
            {starting ? <><Loader2 className="h-4 w-4 animate-spin" /> Starting interview…</> : <><Mic className="h-4 w-4" /> Start mock interview</>}
          </button>
        </Card>
      </div>
    );
  }

  // INTERVIEW PHASE
  if (phase === "interview") {
    const q = questions[currentIdx];
    const a = answers[currentIdx];
    const hasFeedback = a && a.score !== null;
    return (
      <div className="space-y-5 max-w-3xl mx-auto">
        {/* Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#a855f7] to-[#0ea5e9] text-white">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-bold text-[#1c1410]">AI Visa Officer · {country}</div>
                <div className="text-[10px] text-[#7a6a5d]">Question {currentIdx + 1} of {questions.length}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase text-[#7a6a5d]">Progress</div>
              <div className="text-sm font-extrabold text-[#1c1410]">{Math.round(((currentIdx) / questions.length) * 100)}%</div>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-[#fff8f1] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#a855f7] to-[#0ea5e9] transition-all"
              style={{ width: `${(currentIdx / questions.length) * 100}%` }}
            />
          </div>
        </Card>

        {/* Question */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#a855f7] to-[#0ea5e9] text-white shrink-0">
              <Bot className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#a855f7] mb-1">Question {currentIdx + 1}</div>
              <p className="text-base font-semibold text-[#1c1410] leading-snug">{q}</p>
              {voiceEnabled && (
                <button
                  onClick={() => playQuestion(q)}
                  disabled={playingAudio}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#a855f7]/10 text-[#a855f7] px-3 h-8 text-xs font-semibold hover:bg-[#a855f7]/20 transition-colors disabled:opacity-60"
                >
                  {playingAudio ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Volume2 className="h-3.5 w-3.5" />}
                  {playingAudio ? "Speaking…" : "Play voice"}
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Answer textarea or feedback */}
        {!hasFeedback ? (
          <Card className="p-6">
            <div className="text-xs font-semibold text-[#3a2e26] mb-2">Your answer (type or paste your spoken answer)</div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your response as you would speak it…"
              rows={5}
              className="w-full rounded-xl border border-orange-200 bg-white p-3 text-sm focus:border-[#a855f7] focus:outline-none focus:ring-2 focus:ring-[#a855f7]/20 resize-none"
            />
            <div className="mt-2 flex items-center justify-between text-[10px] text-[#7a6a5d]">
              <span>{answer.split(/\s+/).filter(Boolean).length} words</span>
              <span>Aim for 50-100 words</span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={submitAnswer}
                disabled={!answer.trim() || submitting}
                className="flex-1 h-11 rounded-full bg-gradient-to-r from-[#a855f7] to-[#0ea5e9] text-white font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating…</> : <>Submit answer <ChevronRight className="h-4 w-4" /></>}
              </button>
              <button
                onClick={skip}
                className="rounded-full bg-[#fff8f1] text-[#7a6a5d] px-5 h-11 text-sm font-semibold hover:bg-orange-100"
              >
                Skip
              </button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#7a6a5d]">AI Feedback</div>
              <div
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-extrabold"
                style={{
                  background: (a.score || 0) >= 70 ? "#22c55e20" : (a.score || 0) >= 50 ? "#f59e0b20" : "#ef444420",
                  color: (a.score || 0) >= 70 ? "#15803d" : (a.score || 0) >= 50 ? "#b45309" : "#b91c1c",
                }}
              >
                <Star className="h-3 w-3" />
                {a.score}/100
              </div>
            </div>

            <p className="text-sm text-[#1c1410] mb-4">{a.feedback}</p>

            {a.strengths.length > 0 && (
              <div className="mb-3">
                <div className="text-[10px] font-bold uppercase text-[#15803d] mb-1.5">✓ Strengths</div>
                <ul className="space-y-1">
                  {a.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-[#3a2e26] flex items-start gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-[#22c55e] mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {a.improvements.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase text-[#b45309] mb-1.5">↑ Improve</div>
                <ul className="space-y-1">
                  {a.improvements.map((s, i) => (
                    <li key={i} className="text-xs text-[#3a2e26] flex items-start gap-1.5">
                      <AlertCircle className="h-3 w-3 text-[#f59e0b] mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => {
                if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
                else {
                  apiFetch("/api/visa-interview/evaluate", { method: "PUT", body: JSON.stringify({ sessionId }) })
                    .then((r) => { setOverall(r); setPhase("results"); });
                }
              }}
              className="w-full h-11 rounded-full bg-[#1c1410] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#a855f7] transition-colors"
            >
              {currentIdx < questions.length - 1 ? <>Next question <ChevronRight className="h-4 w-4" /></> : <>See results <Award className="h-4 w-4" /></>}
            </button>
          </Card>
        )}

        <audio ref={audioRef} className="hidden" />
      </div>
    );
  }

  // RESULTS PHASE
  if (phase === "results" && overall) {
    const score = overall.score;
    const color = score >= 85 ? "#22c55e" : score >= 70 ? "#0ea5e9" : score >= 50 ? "#f59e0b" : "#ef4444";
    return (
      <div className="space-y-5 max-w-3xl mx-auto">
        <Card className="p-8 text-center">
          <div
            className="inline-flex h-24 w-24 items-center justify-center rounded-full text-white shadow-xl mx-auto"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
          >
            <div>
              <div className="text-3xl font-extrabold leading-none">{score}</div>
              <div className="text-[10px] font-bold uppercase">/ 100</div>
            </div>
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#1c1410]">
            {score >= 85 && "Excellent preparation! 🎉"}
            {score >= 70 && score < 85 && "Good preparation! 👍"}
            {score >= 50 && score < 70 && "Needs more practice 📚"}
            {score < 50 && "Significant improvement needed 💪"}
          </h2>
          <p className="mt-2 text-sm text-[#7a6a5d] max-w-md mx-auto">{overall.recommendation}</p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-[#fff8f1] p-3">
              <div className="text-xl font-extrabold text-[#1c1410]">{overall.totalAnswered}</div>
              <div className="text-[10px] text-[#7a6a5d]">Answered</div>
            </div>
            <div className="rounded-xl bg-[#fff8f1] p-3">
              <div className="text-xl font-extrabold text-[#1c1410]">{overall.totalQuestions - overall.totalAnswered}</div>
              <div className="text-[10px] text-[#7a6a5d]">Skipped</div>
            </div>
            <div className="rounded-xl bg-[#fff8f1] p-3">
              <div className="text-xl font-extrabold text-[#1c1410]">{overall.totalQuestions}</div>
              <div className="text-[10px] text-[#7a6a5d]">Total</div>
            </div>
          </div>

          <button
            onClick={restart}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1c1410] text-white px-6 h-11 font-semibold hover:bg-[#a855f7] transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Practice again
          </button>
        </Card>

        {/* Per-question breakdown */}
        <div>
          <h3 className="text-base font-bold text-[#1c1410] mb-3">Question-by-question breakdown</h3>
          <div className="space-y-3">
            {answers.filter((a) => a.answer).map((a, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
                    style={{ background: (a.score || 0) >= 70 ? "#22c55e" : (a.score || 0) >= 50 ? "#f59e0b" : "#ef4444" }}
                  >
                    {a.score}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#1c1410]">{a.question}</div>
                    <div className="text-[11px] text-[#7a6a5d] mt-1 italic">"{a.answer}"</div>
                    <div className="text-[11px] text-[#3a2e26] mt-2">{a.feedback}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
