// Students CRM view — searchable table + add student modal

"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Mail, Phone, MapPin, X, Loader2, Users, Pencil, Trash2 } from "lucide-react";
import { apiFetch, useAppStore } from "@/store/app-store";
import { Card, StatusBadge, Avatar, Empty, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string | null;
  targetCountry: string | null;
  targetProgram: string | null;
  intake: string | null;
  budget: number | null;
  academicScore: number | null;
  englishScore: string | null;
  status: string;
  source: string | null;
  createdAt: string;
  _count: { applications: number };
};

const STATUS_FILTERS = ["all", "LEAD", "SHORTLISTED", "APPLIED", "OFFERED", "ENROLLED"];
const SOURCES = ["Website", "Walk-in", "Referral", "Manual", "Social Media"];

const PALETTE = ["#e85d2f", "#0f766e", "#f59e0b", "#a855f7", "#0ea5e9"];

export default function StudentsView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status !== "all") params.set("status", status);
      const data = await apiFetch(`/api/students?${params.toString()}`);
      setStudents(data.students);
    } catch (e) {
      toast({ title: "Failed to load students", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status]);
  useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [q]);

  const deleteStudent = async (s: Student) => {
    if (!confirm(`Delete ${s.firstName} ${s.lastName}? This cannot be undone.`)) return;
    setDeleting(s.id);
    try {
      await apiFetch(`/api/students/${s.id}`, { method: "DELETE" });
      toast({ title: "Student deleted", description: `${s.firstName} ${s.lastName} removed.` });
      load();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-white ring-1 ring-orange-200 px-3.5 h-10 flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-[#7a6a5d]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, city…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 rounded-full bg-white ring-1 ring-orange-200 p-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 h-8 text-xs font-semibold transition-colors ${
                status === s ? "bg-[#e85d2f] text-white" : "text-[#7a6a5d] hover:bg-orange-50"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white px-4 h-10 text-sm font-semibold shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-[#7a6a5d]">
            <Spinner /> Loading students…
          </div>
        ) : students.length === 0 ? (
          <Empty title="No students found" hint="Try adjusting filters or add a new student." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#fff8f1] text-[10px] uppercase tracking-wider text-[#7a6a5d]">
                <tr>
                  <th className="text-left font-bold px-4 py-3">Student</th>
                  <th className="text-left font-bold px-4 py-3 hidden md:table-cell">Contact</th>
                  <th className="text-left font-bold px-4 py-3 hidden lg:table-cell">Target</th>
                  <th className="text-left font-bold px-4 py-3 hidden lg:table-cell">Academic</th>
                  <th className="text-left font-bold px-4 py-3 hidden xl:table-cell">Apps</th>
                  <th className="text-left font-bold px-4 py-3">Status</th>
                  <th className="text-right font-bold px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id} className="border-t border-orange-50 hover:bg-[#fff8f1]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={`${s.firstName} ${s.lastName}`} color={PALETTE[i % PALETTE.length]} />
                        <div className="min-w-0">
                          <div className="font-semibold text-[#1c1410] truncate">{s.firstName} {s.lastName}</div>
                          <div className="text-[11px] text-[#7a6a5d] flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {s.city || "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-xs text-[#3a2e26]">{s.email}</div>
                      <div className="text-[11px] text-[#7a6a5d]">{s.phone}</div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-xs font-medium text-[#1c1410]">{s.targetCountry || "—"}</div>
                      <div className="text-[11px] text-[#7a6a5d] truncate max-w-[160px]">{s.targetProgram || "—"}</div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-xs font-bold text-[#1c1410]">{s.academicScore || "—"}%</div>
                      <div className="text-[10px] text-[#7a6a5d]">{s.englishScore || "—"}</div>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#0f766e]/10 px-2 py-0.5 text-[11px] font-semibold text-[#0f766e]">
                        <Users className="h-3 w-3" />
                        {s._count.applications}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditing(s)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100 hover:text-[#e85d2f]"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteStudent(s)}
                          disabled={deleting === s.id}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff8f1] text-[#7a6a5d] hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} />}
      {editing && <AddStudentModal student={editing} onClose={() => setEditing(null)} onCreated={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function AddStudentModal({ onClose, onCreated, student }: { onClose: () => void; onCreated: () => void; student?: Student | null }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    email: student?.email || "",
    phone: student?.phone || "",
    city: student?.city || "",
    targetCountry: student?.targetCountry || "",
    targetProgram: student?.targetProgram || "",
    intake: student?.intake || "Fall 2026",
    budget: student?.budget?.toString() || "",
    academicScore: student?.academicScore?.toString() || "",
    englishScore: student?.englishScore || "",
    status: student?.status || "LEAD",
    source: student?.source || "Website",
    notes: student?.notes || "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (student) {
        await apiFetch(`/api/students/${student.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast({ title: "Student updated", description: `${form.firstName} ${form.lastName} saved.` });
      } else {
        await apiFetch("/api/students", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast({ title: "Student added", description: `${form.firstName} ${form.lastName} is now in your pipeline.` });
      }
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
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100">
        <div className="h-1.5 bg-gradient-to-r from-[#e85d2f] via-[#f59e0b] to-[#0f766e]" />
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-extrabold text-[#1c1410]">{student ? "Edit student" : "Add new student"}</h2>
              <p className="text-xs text-[#7a6a5d]">Capture profile, target destination, and academic info.</p>
            </div>
            <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="First name" required value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} placeholder="Aarav" />
              <Input label="Last name" required value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} placeholder="Sharma" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="aarav@gmail.com" />
              <Input label="Phone" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} placeholder="Mumbai" />
              <Input label="Target country" value={form.targetCountry} onChange={(v) => setForm({ ...form, targetCountry: v })} placeholder="United Kingdom" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Target program" value={form.targetProgram} onChange={(v) => setForm({ ...form, targetProgram: v })} placeholder="M.Sc Computer Science" />
              <Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={["LEAD", "SHORTLISTED", "APPLIED", "OFFERED", "ENROLLED"]} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Academic %" type="number" value={form.academicScore} onChange={(v) => setForm({ ...form, academicScore: v })} placeholder="8.4" />
              <Input label="Budget (₹L)" type="number" value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} placeholder="35" />
              <Input label="English score" value={form.englishScore} onChange={(v) => setForm({ ...form, englishScore: v })} placeholder="IELTS 7.5" />
            </div>
            <Select label="Source" value={form.source} onChange={(v) => setForm({ ...form, source: v })} options={SOURCES} />

            <div className="pt-3 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 h-11 rounded-full bg-[#fff8f1] text-[#7a6a5d] font-semibold hover:bg-orange-100">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 h-11 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white font-semibold shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : student ? "Save changes" : "Add Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({
  label, value, onChange, required, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; type?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">{label}{required && <span className="text-[#e85d2f]"> *</span>}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20"
      />
    </label>
  );
}

function Select({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o.charAt(0) + o.slice(1).toLowerCase().replace(/_/g, " ")}</option>
        ))}
      </select>
    </label>
  );
}
