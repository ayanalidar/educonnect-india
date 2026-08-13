// Visa tracker view

"use client";

import { useEffect, useState } from "react";
import { Plane, Calendar, FileText, CheckCircle2, Loader2, Plus, X } from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, StatusBadge, Empty, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Visa = {
  id: string;
  country: string;
  visaType: string;
  status: string;
  appointmentDate: string | null;
  notes: string | null;
  createdAt: string;
  student: { firstName: string; lastName: string; email: string; phone: string };
};

const STAGES = ["DRAFT", "DOCS_READY", "SUBMITTED", "BIO_METRIC", "INTERVIEW", "APPROVED", "REJECTED"];

export default function VisaView() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/visa");
      setVisas(data.visas);
    } catch (e) {
      toast({ title: "Failed to load visas", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="py-16 flex items-center justify-center gap-2 text-[#7a6a5d]"><Spinner /> Loading…</div>;
  if (visas.length === 0) return <Empty title="No visa applications yet" hint="Add a visa application for an offered student." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[#7a6a5d]">
          <strong className="text-[#1c1410]">{visas.length}</strong> visa applications in flight
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white px-4 h-9 text-sm font-semibold shadow-lg shadow-orange-300/40">
          <Plus className="h-4 w-4" /> Add visa
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {visas.map((v) => {
          const stageIdx = STAGES.indexOf(v.status);
          const pct = stageIdx >= 0 ? Math.round((stageIdx / (STAGES.length - 1)) * 100) : 0;
          return (
            <Card key={v.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#a855f7]/10 text-[#7e22ce]">
                    <Plane className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-[#1c1410]">{v.student.firstName} {v.student.lastName}</div>
                    <div className="text-[11px] text-[#7a6a5d]">{v.country} · {v.visaType}</div>
                  </div>
                </div>
                <StatusBadge status={v.status} />
              </div>

              {/* Stage progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[10px] text-[#7a6a5d] mb-1">
                  <span>Progress</span>
                  <span className="font-bold text-[#1c1410]">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#fff8f1] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: v.status === "APPROVED" ? "#22c55e" : v.status === "REJECTED" ? "#ef4444" : "linear-gradient(90deg, #a855f7, #7e22ce)",
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-[#fff8f1] p-3">
                  <div className="text-[10px] font-bold uppercase text-[#7a6a5d]">Appointment</div>
                  <div className="mt-0.5 font-semibold text-[#1c1410] flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {v.appointmentDate ? new Date(v.appointmentDate).toLocaleDateString() : "Not scheduled"}
                  </div>
                </div>
                <div className="rounded-xl bg-[#fff8f1] p-3">
                  <div className="text-[10px] font-bold uppercase text-[#7a6a5d]">Stage</div>
                  <div className="mt-0.5 font-semibold text-[#1c1410]">
                    {stageIdx + 1} / {STAGES.length}
                  </div>
                </div>
              </div>

              {v.notes && (
                <div className="mt-3 text-xs text-[#7a6a5d] flex items-start gap-1.5">
                  <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                  {v.notes}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {showAdd && <AddVisaModal onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} />}
    </div>
  );
}

function AddVisaModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);
  const [form, setForm] = useState({ studentId: "", country: "", visaType: "STUDENT", status: "DRAFT", appointmentDate: "", notes: "" });

  useEffect(() => {
    apiFetch("/api/students").then((d) => setStudents(d.students));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.country) {
      toast({ title: "Student and country required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await apiFetch("/api/visa", { method: "POST", body: JSON.stringify(form) });
      toast({ title: "Visa application created" });
      onCreated();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1c1410]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100">
        <div className="h-1.5 bg-gradient-to-r from-[#a855f7] to-[#7e22ce]" />
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-[#1c1410]">New visa application</h2>
            <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Student *</span>
              <select required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none">
                <option value="">Select student…</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Country *</span>
              <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="United Kingdom"
                className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Status</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none">
                  {STAGES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Appointment date</span>
                <input type="date" value={form.appointmentDate} onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                  className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none" />
              </label>
            </div>
            <button type="submit" disabled={saving}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#a855f7] to-[#7e22ce] text-white font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Create visa file"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
