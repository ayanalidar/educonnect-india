// Smart Deadline Engine dashboard view

"use client";

import { useEffect, useState } from "react";
import {
  Bell, Clock, AlertTriangle, Flame, Calendar, CheckCircle2, X,
  ChevronRight, Zap, Mail, MessageCircle, Loader2,
} from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Deadline = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  daysLeft: number;
  priority: string;
  category: string;
  country: string | null;
  status: string;
  urgency: "OVERDUE" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  urgencyColor: string;
  escalatedTo: string[];
  student: { id: string; name: string; city: string | null; targetCountry: string | null } | null;
};

const FILTERS = [
  { id: "all", label: "All", icon: Calendar, color: "#1c1410" },
  { id: "urgent", label: "Urgent", icon: Flame, color: "#dc2626" },
  { id: "week", label: "This week", icon: Clock, color: "#f59e0b" },
  { id: "overdue", label: "Overdue", icon: AlertTriangle, color: "#dc2626" },
];

const CATEGORY_ICON: Record<string, string> = {
  APPLICATION: "📋",
  VISA: "✈️",
  DOCUMENT: "📄",
  PAYMENT: "💳",
  INTERVIEW: "🎤",
  SCHOLARSHIP: "🎓",
};

export default function DeadlinesView() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [stats, setStats] = useState({ total: 0, overdue: 0, critical: 0, high: 0, week: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [escalating, setEscalating] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/deadlines?filter=${filter}`);
      setDeadlines(data.deadlines);
      setStats(data.stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const escalate = async (id: string, title: string) => {
    setEscalating(id);
    try {
      await apiFetch("/api/deadlines", {
        method: "POST",
        body: JSON.stringify({ deadlineId: id, action: "escalate" }),
      });
      toast({
        title: "Escalation triggered 🔔",
        description: `"${title}" — notified counselor + manager + student + parent via WhatsApp + Email.`,
      });
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setEscalating(null);
    }
  };

  const markDone = async (id: string, title: string) => {
    setCompleting(id);
    try {
      await apiFetch("/api/deadlines", {
        method: "POST",
        body: JSON.stringify({ deadlineId: id, action: "done" }),
      });
      toast({ title: `Marked done: "${title}"`, description: "Great work — one less deadline to worry about." });
      load();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setCompleting(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#dc2626]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#f59e0b]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#dc2626] via-[#f59e0b] to-[#22c55e] shadow-xl">
            <Bell className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">
              <Zap className="h-3 w-3" />
              Smart Deadline Engine · Auto-escalation
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Never miss a deadline again</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Every deadline auto-flagged by urgency. CRITICAL (≤2 days) escalates to counselor + manager + student + parent
              via WhatsApp + Email automatically. Click "Escalate now" to manually trigger.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Total active" value={stats.total} color="#0ea5e9" icon={Calendar} />
        <StatCard label="Overdue" value={stats.overdue} color="#dc2626" icon={AlertTriangle} />
        <StatCard label="Critical (≤2d)" value={stats.critical} color="#dc2626" icon={Flame} />
        <StatCard label="High (≤5d)" value={stats.high} color="#ea580c" icon={Clock} />
        <StatCard label="This week" value={stats.week} color="#f59e0b" icon={Bell} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 h-9 text-xs font-semibold transition-colors ${
              filter === f.id ? "text-white" : "bg-white ring-1 ring-orange-200 text-[#7a6a5d] hover:bg-orange-50"
            }`}
            style={filter === f.id ? { background: f.color } : {}}
          >
            <f.icon className="h-3.5 w-3.5" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Deadlines list */}
      {loading ? (
        <Card className="p-12 text-center">
          <Spinner className="mx-auto" />
        </Card>
      ) : deadlines.length === 0 ? (
        <Empty title="No deadlines in this view" hint="Try a different filter." />
      ) : (
        <div className="space-y-3">
          {deadlines.map((d) => (
            <Card key={d.id} className="p-4 hover:shadow-md transition-shadow" style={{ borderLeft: `4px solid ${d.urgencyColor}` }}>
              <div className="flex items-start gap-3">
                {/* Category icon */}
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-lg shrink-0"
                  style={{ background: `${d.urgencyColor}1a` }}
                >
                  {CATEGORY_ICON[d.category] || "📌"}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[#1c1410]">{d.title}</h3>
                      {d.student && (
                        <div className="text-[11px] text-[#7a6a5d] mt-0.5">
                          👤 {d.student.name} · {d.student.city} → {d.country || d.student.targetCountry || "—"}
                        </div>
                      )}
                      {d.description && (
                        <div className="text-[11px] text-[#7a6a5d] mt-1">{d.description}</div>
                      )}
                    </div>

                    {/* Urgency badge */}
                    <div className="shrink-0 flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
                        style={{ background: `${d.urgencyColor}1a`, color: d.urgencyColor }}
                      >
                        {d.urgency === "OVERDUE" && <AlertTriangle className="h-2.5 w-2.5" />}
                        {d.urgency === "CRITICAL" && <Flame className="h-2.5 w-2.5" />}
                        {d.urgency === "HIGH" && <Clock className="h-2.5 w-2.5" />}
                        {d.urgency === "MEDIUM" && <Clock className="h-2.5 w-2.5" />}
                        {d.urgency === "LOW" && <CheckCircle2 className="h-2.5 w-2.5" />}
                        {d.daysLeft < 0 ? `${Math.abs(d.daysLeft)}d overdue` : d.daysLeft === 0 ? "Today!" : `${d.daysLeft}d left`}
                      </span>
                    </div>
                  </div>

                  {/* Escalated to */}
                  {d.escalatedTo.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-bold uppercase text-[#7a6a5d]">Notified:</span>
                      {d.escalatedTo.map((p) => (
                        <span key={p} className="inline-flex items-center gap-0.5 rounded-full bg-[#fff8f1] px-2 py-0.5 text-[9px] font-semibold text-[#3a2e26] ring-1 ring-orange-100">
                          {p === "Counselor" && <Mail className="h-2 w-2" />}
                          {p === "Student" && <MessageCircle className="h-2 w-2" />}
                          {p === "Parent" && <MessageCircle className="h-2 w-2" />}
                          {p === "Manager" && <Bell className="h-2 w-2" />}
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => escalate(d.id, d.title)}
                      disabled={escalating === d.id}
                      className="inline-flex items-center gap-1 rounded-full bg-[#1c1410] hover:bg-[#e85d2f] text-white px-3 h-7 text-[10px] font-semibold transition-colors disabled:opacity-60"
                    >
                      {escalating === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bell className="h-3 w-3" />}
                      Escalate now
                    </button>
                    <button
                      onClick={() => markDone(d.id, d.title)}
                      disabled={completing === d.id}
                      className="inline-flex items-center gap-1 rounded-full bg-[#22c55e]/10 hover:bg-[#22c55e]/20 text-[#15803d] px-3 h-7 text-[10px] font-semibold transition-colors disabled:opacity-60"
                    >
                      {completing === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                      Mark done
                    </button>
                    <div className="ml-auto text-[10px] font-semibold text-[#7a6a5d]">
                      Due: {new Date(d.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: React.ElementType }) {
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
