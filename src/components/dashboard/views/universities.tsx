// Universities explorer — searchable + filterable grid
// Made & maintained by GuardianX

"use client";

import { useEffect, useState } from "react";
import { Search, Globe2, MapPin, DollarSign, Star, GraduationCap, Plus, X, Loader2, Pencil, Trash2 } from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Uni = {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: number | null;
  type: string;
  qsStars: number | null;
  applicationFee: number | null;
  tuitionFee: number | null;
  popularCourses: string;
  intakeMonths: string;
  minIelts: number | null;
  minToefl: number | null;
  minGpa: number | null;
  logoColor: string;
  partnerStatus: string;
  commission: number | null;
};

const COUNTRIES = ["all", "India", "United Kingdom", "United States", "Canada", "Australia", "Ireland", "Germany", "Singapore", "New Zealand", "Netherlands", "France", "United Arab Emirates"];

export default function UniversitiesView() {
  const [unis, setUnis] = useState<Uni[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("all");
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Uni | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (country !== "all") params.set("country", country);
      const data = await apiFetch(`/api/universities?${params.toString()}`);
      setUnis(data.universities);
    } catch (e) {
      toast({ title: "Failed to load universities", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [country]);
  useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [q]);

  const deleteUni = async (u: Uni) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    setDeleting(u.id);
    try {
      await apiFetch(`/api/universities/${u.id}`, { method: "DELETE" });
      toast({ title: "University deleted", description: `${u.name} removed from database.` });
      load();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-white ring-1 ring-orange-200 px-3.5 h-10 flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-[#7a6a5d]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search universities, courses, cities…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="h-10 rounded-full bg-white ring-1 ring-orange-200 px-3 text-sm focus:outline-none"
        >
          {COUNTRIES.map((c) => <option key={c} value={c}>{c === "all" ? "All countries" : c}</option>)}
        </select>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white px-4 h-10 text-sm font-semibold shadow-lg shadow-orange-300/40"
        >
          <Plus className="h-4 w-4" /> Add university
        </button>
      </div>

      <div className="text-xs text-[#7a6a5d]">
        Showing <strong className="text-[#1c1410]">{unis.length}</strong> partner institutions
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 flex items-center justify-center gap-2 text-[#7a6a5d]"><Spinner /> Loading…</div>
      ) : unis.length === 0 ? (
        <Empty title="No universities match" hint="Try a different search or country filter." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {unis.map((u) => (
            <Card key={u.id} className="p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="flex items-start gap-3">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold shrink-0 shadow-md"
                  style={{ background: u.logoColor }}
                >
                  {u.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#1c1410] leading-tight">{u.name}</div>
                  <div className="text-[11px] text-[#7a6a5d] flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" /> {u.city}, {u.country}
                  </div>
                </div>
                {u.ranking && u.ranking > 0 && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[#f59e0b]/10 px-2 py-0.5 text-[10px] font-bold text-[#b45309]">
                    <Star className="h-2.5 w-2.5 fill-[#f59e0b]" /> #{u.ranking}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {u.popularCourses.split(",").slice(0, 3).map((c) => (
                  <span key={c} className="rounded-full bg-[#fff8f1] px-2 py-0.5 text-[10px] font-medium text-[#7a6a5d] ring-1 ring-orange-100">
                    {c.trim()}
                  </span>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                <div>
                  <div className="text-[9px] uppercase font-bold text-[#7a6a5d]">Tuition/yr</div>
                  <div className="font-bold text-[#1c1410]">${(u.tuitionFee || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-[#7a6a5d]">App fee</div>
                  <div className="font-bold text-[#1c1410]">${u.applicationFee || 0}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-[#7a6a5d]">Commission</div>
                  <div className="font-bold text-[#0f766e]">{u.commission || 0}%</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-orange-50 flex items-center justify-between text-[10px]">
                <span className="text-[#7a6a5d]">IELTS {u.minIelts || "—"} · TOEFL {u.minToefl || "—"}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0f766e]/10 px-2 py-0.5 font-semibold text-[#0f766e]">
                  <Globe2 className="h-2.5 w-2.5" /> {u.partnerStatus}
                </span>
              </div>

              {/* Edit + Delete actions */}
              <div className="mt-2 flex items-center gap-1.5">
                <button
                  onClick={() => setEditing(u)}
                  className="inline-flex items-center gap-1 rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100 hover:text-[#e85d2f] px-2.5 h-7 text-[10px] font-semibold"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => deleteUni(u)}
                  disabled={deleting === u.id}
                  className="inline-flex items-center gap-1 rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-red-50 hover:text-red-600 px-2.5 h-7 text-[10px] font-semibold disabled:opacity-50"
                >
                  {deleting === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />} Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAdd && <AddUniModal onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} />}
      {editing && <AddUniModal uni={editing} onClose={() => setEditing(null)} onCreated={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function AddUniModal({ onClose, onCreated, uni }: { onClose: () => void; onCreated: () => void; uni?: Uni | null }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: uni?.name || "", country: uni?.country || "United Kingdom", city: uni?.city || "",
    type: uni?.type || "PUBLIC", applicationFee: uni?.applicationFee?.toString() || "", tuitionFee: uni?.tuitionFee?.toString() || "",
    popularCourses: uni?.popularCourses || "", intakeMonths: uni?.intakeMonths || "Sep",
    minIelts: uni?.minIelts?.toString() || "6.5", minToefl: uni?.minToefl?.toString() || "90", minGpa: uni?.minGpa?.toString() || "3.4",
    website: uni?.website || "", logoColor: uni?.logoColor || "#e85d2f", partnerStatus: uni?.partnerStatus || "PROSPECT", commission: uni?.commission?.toString() || "10",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (uni) {
        await apiFetch(`/api/universities/${uni.id}`, { method: "PUT", body: JSON.stringify(form) });
        toast({ title: "University updated" });
      } else {
        await apiFetch("/api/universities", { method: "POST", body: JSON.stringify(form) });
        toast({ title: "University added" });
      }
      onCreated();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1c1410]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100">
        <div className="h-1.5 bg-gradient-to-r from-[#e85d2f] via-[#f59e0b] to-[#0f766e]" />
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-[#1c1410]">{uni ? "Edit university" : "Add partner university"}</h2>
            <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <In label="Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <div className="grid grid-cols-2 gap-3">
              <In label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
              <In label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <In label="App fee $" value={form.applicationFee} onChange={(v) => setForm({ ...form, applicationFee: v })} type="number" />
              <In label="Tuition $/yr" value={form.tuitionFee} onChange={(v) => setForm({ ...form, tuitionFee: v })} type="number" />
              <In label="Commission %" value={form.commission} onChange={(v) => setForm({ ...form, commission: v })} type="number" />
            </div>
            <In label="Popular courses" value={form.popularCourses} onChange={(v) => setForm({ ...form, popularCourses: v })} placeholder="MBA, M.Sc, B.Eng" />
            <div className="grid grid-cols-3 gap-3">
              <In label="Min IELTS" value={form.minIelts} onChange={(v) => setForm({ ...form, minIelts: v })} />
              <In label="Min TOEFL" value={form.minToefl} onChange={(v) => setForm({ ...form, minToefl: v })} />
              <In label="Min GPA" value={form.minGpa} onChange={(v) => setForm({ ...form, minGpa: v })} />
            </div>
            <button type="submit" disabled={saving}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white font-semibold shadow-lg shadow-orange-300/40 flex items-center justify-center gap-2 disabled:opacity-70">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : uni ? "Save changes" : "Add to partner network"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function In({ label, value, onChange, required, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20" />
    </label>
  );
}
