// Multi-branch Management dashboard view

"use client";

import { useEffect, useState } from "react";
import {
  Building2, Users, Phone, Mail, MapPin, TrendingUp, Award,
  FolderCheck, Target, ChevronRight, Shield, X, Pencil, Trash2, Plus, Loader2,
} from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type BranchMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
};

type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string | null;
  email: string | null;
  managerName: string | null;
  memberCount: number;
  members: BranchMember[];
  studentCount: number;
  applicationCount: number;
  offerCount: number;
  conversionRate: number;
};

export default function BranchesView() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Branch | null>(null);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/branches");
      setBranches(data.branches);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const deleteBranch = async (b: Branch) => {
    if (!confirm(`Delete ${b.name}? This cannot be undone.`)) return;
    setDeleting(b.id);
    try {
      await apiFetch(`/api/branches/${b.id}`, { method: "DELETE" });
      toast({ title: "Branch deleted", description: `${b.name} removed.` });
      load();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const totalMembers = branches.reduce((s, b) => s + b.memberCount, 0);
  const totalStudents = branches.reduce((s, b) => s + b.studentCount, 0);
  const totalApps = branches.reduce((s, b) => s + b.applicationCount, 0);
  const totalOffers = branches.reduce((s, b) => s + b.offerCount, 0);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#a855f7]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#e85d2f]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#a855f7] via-[#e85d2f] to-[#f59e0b] shadow-xl">
            <Building2 className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a855f7]">
              <Building2 className="h-3 w-3" />
              Multi-branch Management · Role-based permissions
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Manage {branches.length} branches from one dashboard</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Branch-level revenue, conversion, and counselor performance. Role-based access — branch managers see only their
              branch, HQ admins see everything. White-label dashboards for partner consultancies.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total branches" value={branches.length} color="#a855f7" icon={Building2} />
        <StatCard label="Total members" value={totalMembers} color="#0ea5e9" icon={Users} />
        <StatCard label="Total students" value={totalStudents} color="#e85d2f" icon={Target} />
        <StatCard label="Conversion rate" value={`${totalApps > 0 ? Math.round((totalOffers / totalApps) * 100) : 0}%`} color="#22c55e" icon={TrendingUp} />
      </div>

      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#e85d2f] text-white px-4 h-10 text-sm font-semibold shadow-lg shadow-purple-300/40"
        >
          <Plus className="h-4 w-4" /> Add branch
        </button>
      </div>

      {/* Branch grid */}
      {loading ? (
        <Card className="p-12 text-center"><Spinner className="mx-auto" /></Card>
      ) : branches.length === 0 ? (
        <Empty title="No branches yet" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((b) => (
            <Card key={b.id} className="p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
              <button onClick={() => setSelected(b)} className="text-left w-full">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#a855f7] to-[#e85d2f] text-white shadow-md">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#7a6a5d]" />
                </div>
                <h3 className="mt-3 text-base font-bold text-[#1c1410]">{b.name}</h3>
                <div className="text-[11px] text-[#7a6a5d] flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" /> {b.city}
                </div>
                <div className="text-[10px] text-[#7a6a5d] mt-0.5 truncate">{b.address}</div>

                {/* Manager */}
                {b.managerName && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#fff8f1] p-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1c1410] text-white text-[10px] font-bold">
                      {b.managerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                    <div>
                      <div className="text-[10px] font-bold text-[#1c1410]">{b.managerName}</div>
                      <div className="text-[9px] text-[#7a6a5d]">Branch Manager</div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-3 grid grid-cols-4 gap-1 text-center">
                  <Stat label="Members" value={b.memberCount} color="#0ea5e9" />
                  <Stat label="Students" value={b.studentCount} color="#e85d2f" />
                  <Stat label="Apps" value={b.applicationCount} color="#f59e0b" />
                  <Stat label="Conv" value={`${b.conversionRate}%`} color="#22c55e" />
                </div>
              </button>

              {/* Edit + Delete */}
              <div className="mt-2 flex items-center gap-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditing(b); }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100 hover:text-[#e85d2f] px-2.5 h-7 text-[10px] font-semibold"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteBranch(b); }}
                  disabled={deleting === b.id}
                  className="inline-flex items-center gap-1 rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-red-50 hover:text-red-600 px-2.5 h-7 text-[10px] font-semibold disabled:opacity-50"
                >
                  {deleting === b.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />} Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selected && <BranchModal branch={selected} onClose={() => setSelected(null)} />}
      {showAdd && <BranchEditModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
      {editing && <BranchEditModal branch={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function BranchEditModal({ branch, onClose, onSaved }: { branch?: Branch | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: branch?.name || "",
    city: branch?.city || "",
    address: branch?.address || "",
    phone: branch?.phone || "",
    email: branch?.email || "",
    managerName: branch?.managerName || "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (branch) {
        await apiFetch(`/api/branches/${branch.id}`, { method: "PUT", body: JSON.stringify(form) });
        toast({ title: "Branch updated" });
      } else {
        await apiFetch("/api/branches/create", { method: "POST", body: JSON.stringify(form) });
        toast({ title: "Branch added" });
      }
      onSaved();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1c1410]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100 max-h-[90vh] overflow-y-auto">
        <div className="h-1.5 bg-gradient-to-r from-[#a855f7] to-[#e85d2f]" />
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-[#1c1410]">{branch ? "Edit branch" : "Add branch"}</h2>
            <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <In label="Branch name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <In label="City *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
            <In label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <div className="grid grid-cols-2 gap-3">
              <In label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <In label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            </div>
            <In label="Manager name" value={form.managerName} onChange={(v) => setForm({ ...form, managerName: v })} />
            <button type="submit" disabled={saving}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#a855f7] to-[#e85d2f] text-white font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : branch ? "Save changes" : "Add branch"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function In({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#a855f7] focus:outline-none" />
    </label>
  );
}

function BranchModal({ branch: b, onClose }: { branch: Branch; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1c1410]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100">
        {/* Header */}
        <div className="h-2 bg-gradient-to-r from-[#a855f7] via-[#e85d2f] to-[#f59e0b]" />
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#a855f7] to-[#e85d2f] text-white shadow-md">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-[#1c1410]">{b.name}</h2>
                <div className="text-xs text-[#7a6a5d]">{b.city} · Manager: {b.managerName || "—"}</div>
              </div>
            </div>
            <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Contact */}
          <div className="mt-4 grid sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#3a2e26]">
              <MapPin className="h-3.5 w-3.5 text-[#7a6a5d]" /> {b.address}
            </div>
            <div className="flex items-center gap-2 text-[#3a2e26]">
              <Phone className="h-3.5 w-3.5 text-[#7a6a5d]" /> {b.phone || "—"}
            </div>
            <div className="flex items-center gap-2 text-[#3a2e26]">
              <Mail className="h-3.5 w-3.5 text-[#7a6a5d]" /> {b.email || "—"}
            </div>
          </div>

          {/* Stats grid */}
          <div className="mt-5 grid grid-cols-4 gap-2">
            <BigStat label="Members" value={b.memberCount} color="#0ea5e9" icon={Users} />
            <BigStat label="Students" value={b.studentCount} color="#e85d2f" icon={Target} />
            <BigStat label="Apps" value={b.applicationCount} color="#f59e0b" icon={FolderCheck} />
            <BigStat label="Offers" value={b.offerCount} color="#22c55e" icon={Award} />
          </div>

          {/* Conversion */}
          <div className="mt-4 rounded-xl bg-gradient-to-br from-[#0f766e]/10 to-[#14b8a6]/10 p-4 ring-1 ring-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-[#0f766e]">Conversion rate</div>
                <div className="text-3xl font-extrabold text-[#1c1410]">{b.conversionRate}%</div>
              </div>
              <TrendingUp className="h-8 w-8 text-[#0f766e]" />
            </div>
          </div>

          {/* Members */}
          <h3 className="mt-5 text-sm font-bold text-[#1c1410]">Team members ({b.members.length})</h3>
          <div className="mt-2 space-y-2">
            {b.members.length === 0 ? (
              <div className="text-xs text-[#7a6a5d] py-3 text-center">No members assigned to this branch yet.</div>
            ) : (
              b.members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl bg-[#fff8f1] p-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold" style={{ background: m.avatarColor }}>
                    {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#1c1410] truncate">{m.name}</div>
                    <div className="text-[10px] text-[#7a6a5d] truncate">{m.email}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-bold uppercase text-[#3a2e26] ring-1 ring-orange-100">
                    <Shield className="h-2.5 w-2.5" />
                    {m.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-lg bg-[#fff8f1] p-1.5">
      <div className="text-sm font-extrabold leading-none" style={{ color }}>{value}</div>
      <div className="text-[8px] text-[#7a6a5d] mt-0.5">{label}</div>
    </div>
  );
}

function BigStat({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: React.ElementType }) {
  return (
    <div className="rounded-xl bg-[#fff8f1] p-3 text-center">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${color}1a`, color }}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="mt-2 text-lg font-extrabold text-[#1c1410] leading-none">{value}</div>
      <div className="text-[10px] text-[#7a6a5d]">{label}</div>
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }: { label: string; value: string | number; color: string; icon: React.ElementType }) {
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
