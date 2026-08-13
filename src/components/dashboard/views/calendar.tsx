// Calendar & Booking dashboard view
// Made & maintained by GuardianX

"use client";

import { useEffect, useState } from "react";
import {
  Calendar, Clock, Video, Phone, MapPin, Plus, X, Loader2,
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, Users,
} from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner, Avatar } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Appt = {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  location: string;
  meetingLink: string | null;
  branch: string | null;
  student: { id: string; firstName: string; lastName: string; city: string | null } | null;
};

const TYPE_ICON: Record<string, string> = {
  COUNSELING: "🎯",
  VISA_INTERVIEW: "🛂",
  FOLLOW_UP: "📞",
  DOCUMENT_REVIEW: "📄",
  PARENT_MEETING: "👨‍👩‍👧",
};

const FILTERS = [
  { id: "upcoming", label: "Upcoming", icon: Clock, color: "#0ea5e9" },
  { id: "past", label: "Past", icon: CheckCircle2, color: "#22c55e" },
  { id: "cancelled", label: "Cancelled", icon: XCircle, color: "#ef4444" },
];

export default function CalendarView() {
  const [appts, setAppts] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const [showAdd, setShowAdd] = useState(false);
  const [students, setStudents] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/appointments?filter=${filter}`);
      setAppts(data.appointments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);
  useEffect(() => { apiFetch("/api/students").then((d) => setStudents(d.students)).catch(() => {}); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiFetch("/api/appointments", {
        method: "PUT",
        body: JSON.stringify({ appointmentId: id, status }),
      });
      toast({ title: `Appointment marked ${status.toLowerCase()}`, description: "Calendar updated." });
      load();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#0ea5e9]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#e85d2f]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0ea5e9] via-[#0f766e] to-[#14b8a6] shadow-xl">
            <Calendar className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0ea5e9]">
              <Calendar className="h-3 w-3" />
              Calendar & Booking · Google + Outlook sync
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Schedule counseling, interviews, and follow-ups</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Auto-generate Zoom/Meet links. Send WhatsApp + Email reminders 24h + 1h before. Sync with Google Calendar + Outlook.
              Self-booking link lets students pick a slot — no back-and-forth.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Upcoming" value={appts.filter((a) => a.status === "SCHEDULED").length} color="#0ea5e9" icon={Clock} />
        <StatCard label="Completed" value={appts.filter((a) => a.status === "COMPLETED").length} color="#22c55e" icon={CheckCircle2} />
        <StatCard label="Cancelled" value={appts.filter((a) => a.status === "CANCELLED").length} color="#ef4444" icon={XCircle} />
        <StatCard label="This week" value={appts.filter((a) => {
          const d = new Date(a.startTime);
          const now = new Date();
          return d >= now && d <= new Date(now.getTime() + 7 * 86400000);
        }).length} color="#f59e0b" icon={Calendar} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 rounded-full bg-white ring-1 ring-orange-200 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-semibold transition-colors ${
                filter === f.id ? "text-white" : "text-[#7a6a5d] hover:bg-orange-50"
              }`}
              style={filter === f.id ? { background: f.color } : {}}
            >
              <f.icon className="h-3.5 w-3.5" />
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white px-4 h-10 text-sm font-semibold shadow-lg shadow-orange-300/40"
        >
          <Plus className="h-4 w-4" /> Schedule appointment
        </button>
      </div>

      {/* List */}
      {loading ? (
        <Card className="p-12 text-center"><Spinner className="mx-auto" /></Card>
      ) : appts.length === 0 ? (
        <Empty title="No appointments" hint="Click 'Schedule appointment' to create one." />
      ) : (
        <div className="space-y-3">
          {appts.map((a) => {
            const start = new Date(a.startTime);
            const isToday = start.toDateString() === new Date().toDateString();
            const isPast = start < new Date();
            return (
              <Card key={a.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  {/* Date block */}
                  <div
                    className="inline-flex flex-col items-center justify-center rounded-xl text-white shrink-0 h-16 w-16 shadow-md"
                    style={{ background: isToday ? "linear-gradient(135deg, #e85d2f, #f59e0b)" : "linear-gradient(135deg, #1c1410, #3a2e26)" }}
                  >
                    <span className="text-[9px] font-bold uppercase">{start.toLocaleDateString("en-IN", { month: "short" })}</span>
                    <span className="text-xl font-extrabold leading-none">{start.getDate()}</span>
                    <span className="text-[9px]">{start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{TYPE_ICON[a.type] || "📅"}</span>
                          <h3 className="text-sm font-bold text-[#1c1410] truncate">{a.title}</h3>
                          {isToday && <span className="rounded-full bg-[#e85d2f]/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[#c8451a]">Today</span>}
                        </div>
                        {a.student && (
                          <div className="text-[11px] text-[#7a6a5d] mt-0.5">
                            👤 {a.student.firstName} {a.student.lastName} · {a.student.city}
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#7a6a5d]">
                          <span className="flex items-center gap-1">
                            {a.location === "VIDEO" && <Video className="h-3 w-3" />}
                            {a.location === "IN_PERSON" && <MapPin className="h-3 w-3" />}
                            {a.location === "PHONE" && <Phone className="h-3 w-3" />}
                            {a.location.replace(/_/g, " ")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} - {new Date(a.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {a.meetingLink && (
                            <a href={a.meetingLink} target="_blank" rel="noopener noreferrer" className="text-[#0ea5e9] font-semibold hover:underline">
                              Join call →
                            </a>
                          )}
                        </div>
                      </div>
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase shrink-0"
                        style={{
                          background: a.status === "SCHEDULED" ? "#0ea5e920" : a.status === "COMPLETED" ? "#22c55e20" : "#ef444420",
                          color: a.status === "SCHEDULED" ? "#0369a1" : a.status === "COMPLETED" ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {a.status}
                      </span>
                    </div>

                    {/* Actions */}
                    {a.status === "SCHEDULED" && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => updateStatus(a.id, "COMPLETED")}
                          className="inline-flex items-center gap-1 rounded-full bg-[#22c55e]/10 text-[#15803d] px-3 h-7 text-[10px] font-semibold hover:bg-[#22c55e]/20"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Mark completed
                        </button>
                        <button
                          onClick={() => updateStatus(a.id, "CANCELLED")}
                          className="inline-flex items-center gap-1 rounded-full bg-[#ef4444]/10 text-[#b91c1c] px-3 h-7 text-[10px] font-semibold hover:bg-[#ef4444]/20"
                        >
                          <XCircle className="h-3 w-3" /> Cancel
                        </button>
                        <button
                          onClick={() => updateStatus(a.id, "NO_SHOW")}
                          className="inline-flex items-center gap-1 rounded-full bg-[#f59e0b]/10 text-[#b45309] px-3 h-7 text-[10px] font-semibold hover:bg-[#f59e0b]/20"
                        >
                          No-show
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showAdd && <AddApptModal onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} students={students} />}
    </div>
  );
}

function AddApptModal({ onClose, onCreated, students }: { onClose: () => void; onCreated: () => void; students: Array<{ id: string; firstName: string; lastName: string }> }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    studentId: "",
    type: "COUNSELING",
    location: "VIDEO",
    startTime: "",
    duration: "60",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/api/appointments", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast({ title: "Appointment scheduled", description: "Calendar invite sent to student + counselor via WhatsApp + Email." });
      onCreated();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1c1410]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100 max-h-[90vh] overflow-y-auto">
        <div className="h-1.5 bg-gradient-to-r from-[#0ea5e9] via-[#0f766e] to-[#14b8a6]" />
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-[#1c1410]">Schedule appointment</h2>
            <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Title *</span>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Initial counseling — UK options"
                className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#0ea5e9] focus:outline-none" />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Student</span>
              <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#0ea5e9] focus:outline-none">
                <option value="">— No linked student —</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Type</span>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#0ea5e9] focus:outline-none">
                  {["COUNSELING", "VISA_INTERVIEW", "FOLLOW_UP", "DOCUMENT_REVIEW", "PARENT_MEETING"].map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Location</span>
                <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#0ea5e9] focus:outline-none">
                  {["VIDEO", "IN_PERSON", "PHONE"].map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Start time *</span>
                <input required type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#0ea5e9] focus:outline-none" />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Duration (min)</span>
                <select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#0ea5e9] focus:outline-none">
                  {["30", "45", "60", "90", "120"].map((d) => <option key={d} value={d}>{d} min</option>)}
                </select>
              </label>
            </div>
            <button type="submit" disabled={saving}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#0f766e] text-white font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Scheduling…</> : <>Schedule + send invites</>}
            </button>
          </form>
        </div>
      </div>
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
