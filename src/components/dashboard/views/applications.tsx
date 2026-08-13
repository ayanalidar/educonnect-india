// Applications kanban view
// Made & maintained by GuardianX

"use client";

import { useEffect, useState } from "react";
import { FolderCheck, Loader2, Plus, X } from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, StatusBadge, Avatar, Empty, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type App = {
  id: string;
  program: string;
  intake: string;
  status: string;
  amount: number | null;
  createdAt: string;
  student: { id: string; firstName: string; lastName: string; city: string | null };
  university: { id: string; name: string; country: string; city: string; logoColor: string };
};

const COLUMNS = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "OFFERED", "ACCEPTED", "ENROLLED", "REJECTED"];

export default function ApplicationsView() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/applications?status=all");
      setApps(data.applications);
    } catch (e) {
      toast({ title: "Failed to load applications", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="py-16 flex items-center justify-center gap-2 text-[#7a6a5d]"><Spinner /> Loading…</div>;
  if (apps.length === 0) return <Empty title="No applications yet" hint="Submit applications from the Students view." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[#7a6a5d]">
          <strong className="text-[#1c1410]">{apps.length}</strong> total applications · drag-to-reorder coming soon
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white px-4 h-9 text-sm font-semibold shadow-lg shadow-orange-300/40"
        >
          <Plus className="h-4 w-4" /> New application
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {COLUMNS.map((col) => {
            const list = apps.filter((a) => a.status === col);
            return (
              <div key={col} className="w-72 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3a2e26]">{col.replace(/_/g, " ")}</span>
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e85d2f]/10 px-1.5 text-[10px] font-bold text-[#c8451a]">
                      {list.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {list.map((a) => (
                    <Card key={a.id} className="p-3 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                      <div className="flex items-start gap-2.5">
                        <span
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white text-[10px] font-bold shrink-0"
                          style={{ background: a.university.logoColor }}
                        >
                          {a.university.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#1c1410] truncate">{a.student.firstName} {a.student.lastName}</div>
                          <div className="text-[11px] text-[#7a6a5d] truncate">{a.university.name}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="text-[#7a6a5d] truncate max-w-[140px]">{a.program}</span>
                        <span className="font-bold text-[#0f766e]">${((a.amount || 0) / 1000).toFixed(0)}k</span>
                      </div>
                    </Card>
                  ))}
                  {list.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-orange-100 py-6 text-center text-[10px] text-[#7a6a5d]">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAdd && <AddAppModal onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} />}
    </div>
  );
}

function AddAppModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);
  const [unis, setUnis] = useState<Array<{ id: string; name: string; tuitionFee: number | null }>>([]);
  const [form, setForm] = useState({ studentId: "", universityId: "", program: "", intake: "Fall 2026", status: "DRAFT" });

  useEffect(() => {
    apiFetch("/api/students").then((d) => setStudents(d.students.map((s: { id: string; firstName: string; lastName: string }) => ({ id: s.id, firstName: s.firstName, lastName: s.lastName }))));
    apiFetch("/api/universities").then((d) => setUnis(d.universities));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.universityId || !form.program) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const uni = unis.find((u) => u.id === form.universityId);
      await apiFetch("/api/applications", {
        method: "POST",
        body: JSON.stringify({ ...form, amount: uni?.tuitionFee || null }),
      });
      toast({ title: "Application created" });
      onCreated();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1c1410]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100">
        <div className="h-1.5 bg-gradient-to-r from-[#e85d2f] via-[#f59e0b] to-[#0f766e]" />
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-[#1c1410]">New application</h2>
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
              <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">University *</span>
              <select required value={form.universityId} onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none">
                <option value="">Select university…</option>
                {unis.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Program *</span>
              <input required value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })}
                placeholder="M.Sc Computer Science"
                className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none" />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none">
                {["DRAFT", "SUBMITTED", "UNDER_REVIEW", "OFFERED", "ACCEPTED", "ENROLLED", "REJECTED"].map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </label>
            <button type="submit" disabled={saving}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white font-semibold shadow-lg shadow-orange-300/40 flex items-center justify-center gap-2 disabled:opacity-70">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : "Create application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
