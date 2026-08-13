// Parent Portal — separate view for parents to track their child's progress
// Made & maintained by GuardianX

"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap, LogOut, Globe2, Bell, Send, Loader2,
  TrendingUp, FileCheck2, Award, Plane, Clock, CheckCircle2,
  ChevronLeft, MessageCircle, Wallet, Shield,
} from "lucide-react";
import { useAppStore, parentApiFetch } from "@/store/app-store";
import { useToast } from "@/hooks/use-toast";

type StudentApp = {
  id: string;
  program: string;
  intake: string;
  status: string;
  university: { name: string; country: string; logoColor: string };
};

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  targetCountry: string | null;
  targetProgram: string | null;
  intake: string | null;
  status: string;
  academicScore: number | null;
  englishScore: string | null;
  applications: StudentApp[];
  visas: Array<{ id: string; country: string; status: string }>;
};

type Message = {
  id: string;
  body: string;
  fromRole: string;
  readAt: string | null;
  createdAt: string;
  studentId: string | null;
};

const PALETTE = ["#e85d2f", "#0f766e", "#f59e0b", "#a855f7"];

export default function ParentPortal() {
  const { parent, logoutParent, setView } = useAppStore();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "messages" | "payments">("overview");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Fetch messages + students via API (students come from /api/parent/messages GET response)
    parentApiFetch("/api/parent/messages")
      .then((data) => {
        setMessages(data.messages || []);
        if (data.students && data.students.length > 0) {
          setStudents(data.students);
          // Cache to sessionStorage as backup
          try {
            sessionStorage.setItem("educonnect-parent-students", JSON.stringify(data.students));
          } catch {}
        }
      })
      .catch(() => {
        // Fallback: try sessionStorage if API failed
        try {
          const cached = sessionStorage.getItem("educonnect-parent-students");
          if (cached) setStudents(JSON.parse(cached));
        } catch {}
      })
      .finally(() => setLoading(false));
  }, []);

  if (!parent) return null;

  const totalApps = students.reduce((s, st) => s + st.applications.length, 0);
  const offered = students.reduce((s, st) => s + st.applications.filter((a) => a.status === "OFFERED" || a.status === "ACCEPTED" || a.status === "ENROLLED").length, 0);
  const pending = students.reduce((s, st) => s + st.applications.filter((a) => a.status === "SUBMITTED" || a.status === "UNDER_REVIEW").length, 0);
  const visas = students.reduce((s, st) => s + st.visas.length, 0);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const data = await parentApiFetch("/api/parent/messages", {
        method: "POST",
        body: JSON.stringify({ body: newMessage }),
      });
      setMessages((prev) => [data.message, ...prev]);
      setNewMessage("");
      toast({ title: "Message sent", description: "Your counselor will respond within 24 hours." });
    } catch (err) {
      toast({ title: "Failed to send", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8f1] via-[#fefaf3] to-[#f0fdfa]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-[68px] flex items-center gap-4">
          <button
            onClick={() => setView("landing")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7a6a5d] hover:text-[#0f766e]"
          >
            <ChevronLeft className="h-4 w-4" />
            Website
          </button>

          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f766e] to-[#14b8a6] text-white shadow-lg">
              <GraduationCap className="h-4.5 w-4.5" />
            </span>
            <div className="leading-none">
              <div className="text-[14px] font-extrabold tracking-tight text-[#1c1410]">EduConnect</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f766e]">Parent Portal</div>
            </div>
          </div>

          <div className="flex-1" />

          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-emerald-200 text-[#1c1410] hover:bg-emerald-50">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#0f766e]" />
          </button>

          <div className="flex items-center gap-2 rounded-full bg-white ring-1 ring-emerald-200 pl-1 pr-3 h-10">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ background: parent.avatarColor }}
            >
              {parent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
            <div className="leading-none">
              <div className="text-xs font-bold text-[#1c1410]">{parent.name}</div>
              <div className="text-[10px] text-[#7a6a5d]">Parent</div>
            </div>
          </div>

          <button
            onClick={logoutParent}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-emerald-200 text-[#7a6a5d] hover:bg-red-50 hover:text-red-600"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Welcome */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0f766e] via-[#0b5750] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
          <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#14b8a6]/40 blur-3xl" />
          <div aria-hidden className="absolute -bottom-16 left-1/4 h-40 w-40 rounded-full bg-[#e85d2f]/20 blur-3xl" />
          <div className="relative">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#f59e0b]">
              Welcome back
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold">
              Hi {parent.name.split(" ").slice(0, 2).join(" ")}, here's your child's progress 🎓
            </h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              You're tracking <strong className="text-white">{students.length}</strong> student(s).
              Stay informed about applications, offers, visa status, and counselor messages — all in one place.
            </p>
          </div>
        </div>

        {/* KPI strip */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Kpi icon={FileCheck2} label="Total applications" value={totalApps} color="#e85d2f" />
          <Kpi icon={Award} label="Offers received" value={offered} color="#22c55e" />
          <Kpi icon={Clock} label="In review" value={pending} color="#f59e0b" />
          <Kpi icon={Plane} label="Visa applications" value={visas} color="#a855f7" />
        </div>

        {/* Tabs */}
        <div className="mt-6 flex items-center gap-1 rounded-full bg-white ring-1 ring-emerald-200 p-1 max-w-md">
          {[
            { key: "overview", label: "Overview", icon: TrendingUp },
            { key: "applications", label: "Applications", icon: FileCheck2 },
            { key: "messages", label: "Messages", icon: MessageCircle },
            { key: "payments", label: "Payments", icon: Wallet },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as "overview" | "applications" | "messages" | "payments")}
              className={`flex-1 rounded-full px-3 h-9 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === t.key ? "bg-[#0f766e] text-white" : "text-[#7a6a5d] hover:bg-emerald-50"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-5">
          {activeTab === "overview" && <OverviewTab students={students} />}
          {activeTab === "applications" && <ApplicationsTab students={students} />}
          {activeTab === "messages" && (
            <MessagesTab messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} sending={sending} onSend={sendMessage} />
          )}
          {activeTab === "payments" && <PaymentsTab students={students} />}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-emerald-100 text-center text-xs text-[#7a6a5d]">
          <Shield className="inline h-3 w-3 mr-1" />
          Made & maintained by <strong className="text-[#1c1410]">GuardianX</strong> · EduConnect India Parent Portal
        </div>
      </main>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100 shadow-sm">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}1a`, color }}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="mt-3 text-2xl font-extrabold text-[#1c1410] leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-[#7a6a5d]">{label}</div>
    </div>
  );
}

function OverviewTab({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#7a6a5d]">No students linked to your account yet.</div>;
  }
  return (
    <div className="space-y-4">
      {students.map((s, i) => {
        const offers = s.applications.filter((a) => ["OFFERED", "ACCEPTED", "ENROLLED"].includes(a.status));
        const progress = s.status === "ENROLLED" ? 100 : s.status === "OFFERED" ? 85 : s.status === "APPLIED" ? 60 : s.status === "SHORTLISTED" ? 35 : 15;
        return (
          <div key={s.id} className="rounded-2xl bg-white p-5 ring-1 ring-emerald-100 shadow-sm">
            <div className="flex items-start gap-4">
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white text-base font-bold shrink-0"
                style={{ background: PALETTE[i % PALETTE.length] }}
              >
                {s.firstName[0]}{s.lastName[0]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-[#1c1410]">{s.firstName} {s.lastName}</h3>
                  <StatusBadge status={s.status} />
                </div>
                <div className="text-xs text-[#7a6a5d] mt-0.5">
                  {s.city} · Target: {s.targetCountry || "—"} · {s.targetProgram || "—"}
                </div>
                <div className="text-xs text-[#3a2e26] mt-1">
                  Academic: <strong>{s.academicScore || "—"}/10</strong> · English: <strong>{s.englishScore || "—"}</strong> · Intake: <strong>{s.intake || "—"}</strong>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-[#7a6a5d] mb-1">
                    <span>Enrolment progress</span>
                    <span className="font-bold text-[#1c1410]">{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#fff8f1] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, #0f766e, #14b8a6)",
                      }}
                    />
                  </div>
                </div>

                {/* Mini stats */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <Stat label="Applications" value={s.applications.length} />
                  <Stat label="Offers" value={offers.length} />
                  <Stat label="Visas" value={s.visas.length} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ApplicationsTab({ students }: { students: Student[] }) {
  const apps = students.flatMap((s) => s.applications.map((a) => ({ ...a, student: s })));
  if (apps.length === 0) {
    return <div className="rounded-2xl bg-white p-8 text-center text-sm text-[#7a6a5d]">No applications submitted yet.</div>;
  }
  return (
    <div className="space-y-3">
      {apps.map((a) => (
        <div key={a.id} className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100 shadow-sm">
          <div className="flex items-start gap-3">
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white text-xs font-bold shrink-0"
              style={{ background: a.university.logoColor }}
            >
              {a.university.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold text-[#1c1410] truncate">{a.university.name}</div>
                <StatusBadge status={a.status} />
              </div>
              <div className="text-xs text-[#7a6a5d] mt-0.5">
                {a.program} · {a.intake} · {a.university.country}
              </div>
              <div className="text-[11px] text-[#3a2e26] mt-0.5">
                Student: <strong>{a.student.firstName} {a.student.lastName}</strong>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesTab({
  messages, newMessage, setNewMessage, sending, onSend,
}: {
  messages: Message[]; newMessage: string; setNewMessage: (v: string) => void; sending: boolean; onSend: () => void;
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 rounded-2xl bg-white p-4 ring-1 ring-emerald-100 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-[#7a6a5d] mb-3">Conversation with counselor</div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <div className="py-8 text-center text-sm text-[#7a6a5d]">No messages yet. Start the conversation below 👇</div>
          )}
          {messages.map((m) => {
            const fromParent = m.fromRole === "PARENT";
            return (
              <div key={m.id} className={`flex ${fromParent ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    fromParent
                      ? "bg-[#0f766e] text-white rounded-br-md"
                      : "bg-[#fff8f1] text-[#1c1410] rounded-bl-md ring-1 ring-orange-100"
                  }`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-0.5">
                    {fromParent ? "You" : "Counselor"} · {new Date(m.createdAt).toLocaleString([], { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                  </div>
                  {m.body}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-end gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message to your counselor…"
            rows={2}
            className="flex-1 rounded-xl border border-emerald-200 bg-white p-3 text-sm focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 resize-none"
          />
          <button
            onClick={onSend}
            disabled={sending || !newMessage.trim()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f766e] text-white hover:bg-[#0b5750] disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-[#7a6a5d] mb-2">Counselor</div>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white font-bold">
            RM
          </span>
          <div>
            <div className="text-sm font-bold text-[#1c1410]">Rajesh Mehta</div>
            <div className="text-[11px] text-[#7a6a5d]">Senior Counselor</div>
            <div className="text-[10px] text-[#22c55e] mt-0.5">● Online now</div>
          </div>
        </div>
        <div className="mt-4 text-xs text-[#7a6a5d] leading-relaxed">
          Typically responds within <strong className="text-[#1c1410]">2 hours</strong> during business hours (9:30 AM – 7:00 PM IST).
        </div>
      </div>
    </div>
  );
}

function PaymentsTab({ students }: { students: Student[] }) {
  // Mock payment data (in real app, would come from /api/parent/payments)
  const mockPayments = students.length > 0 ? [
    { id: "p1", student: students[0], description: "Counseling fee — Q1", amount: 25000, status: "PAID", date: "2026-01-15" },
    { id: "p2", student: students[0], description: "Application processing — Manchester", amount: 15000, status: "PAID", date: "2026-02-10" },
    { id: "p3", student: students[0], description: "Visa processing fee", amount: 18000, status: "PENDING", date: "2026-03-01" },
    { id: "p4", student: students[0], description: "Tuition advance — Manchester", amount: 150000, status: "UPCOMING", date: "2026-06-15" },
  ] : [];

  const total = mockPayments.reduce((s, p) => s + p.amount, 0);
  const paid = mockPayments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100">
          <div className="text-xs text-[#7a6a5d]">Total billed</div>
          <div className="mt-1 text-xl font-extrabold text-[#1c1410]">₹{total.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100">
          <div className="text-xs text-[#7a6a5d]">Paid</div>
          <div className="mt-1 text-xl font-extrabold text-[#22c55e]">₹{paid.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100">
          <div className="text-xs text-[#7a6a5d]">Pending</div>
          <div className="mt-1 text-xl font-extrabold text-[#f59e0b]">₹{(total - paid).toLocaleString()}</div>
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-emerald-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#fff8f1] text-[10px] uppercase tracking-wider text-[#7a6a5d]">
            <tr>
              <th className="text-left font-bold px-4 py-3">Description</th>
              <th className="text-left font-bold px-4 py-3 hidden sm:table-cell">Date</th>
              <th className="text-right font-bold px-4 py-3">Amount</th>
              <th className="text-left font-bold px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockPayments.map((p) => (
              <tr key={p.id} className="border-t border-emerald-50">
                <td className="px-4 py-3 text-xs text-[#1c1410]">{p.description}</td>
                <td className="px-4 py-3 text-xs text-[#7a6a5d] hidden sm:table-cell">{new Date(p.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right font-bold text-[#1c1410]">₹{p.amount.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[#0f766e]/10 to-[#14b8a6]/10 p-5 ring-1 ring-emerald-200">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f766e] text-white">
            <Wallet className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <div className="text-sm font-bold text-[#1c1410]">Pay via Razorpay</div>
            <div className="text-xs text-[#7a6a5d]">UPI · Cards · Net banking · EMI options available</div>
          </div>
          <button className="rounded-full bg-[#0f766e] text-white px-4 h-9 text-xs font-semibold hover:bg-[#0b5750]">
            Pay now
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-[#fff8f1] p-2 text-center">
      <div className="text-sm font-extrabold text-[#1c1410]">{value}</div>
      <div className="text-[10px] text-[#7a6a5d]">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    LEAD:        { bg: "#f59e0b20", fg: "#b45309" },
    SHORTLISTED: { bg: "#0ea5e920", fg: "#0369a1" },
    APPLIED:     { bg: "#e85d2f20", fg: "#c8451a" },
    OFFERED:     { bg: "#22c55e20", fg: "#15803d" },
    ENROLLED:    { bg: "#0f766e20", fg: "#0f766e" },
    ACCEPTED:    { bg: "#22c55e20", fg: "#15803d" },
    SUBMITTED:   { bg: "#e85d2f20", fg: "#c8451a" },
    UNDER_REVIEW:{ bg: "#a855f720", fg: "#7e22ce" },
    PAID:        { bg: "#22c55e20", fg: "#15803d" },
    PENDING:     { bg: "#f59e0b20", fg: "#b45309" },
    UPCOMING:    { bg: "#0ea5e920", fg: "#0369a1" },
    APPROVED:    { bg: "#22c55e20", fg: "#15803d" },
  };
  const c = map[status] || { bg: "#94a3b820", fg: "#475569" };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ background: c.bg, color: c.fg }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
