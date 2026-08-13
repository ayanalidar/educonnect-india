// Referral & Affiliate Engine dashboard view
// Made & maintained by GuardianX

"use client";

import { useEffect, useState } from "react";
import {
  Users, Gift, Copy, Check, Loader2, Plus, X, TrendingUp,
  Wallet, Award, UserCheck, Share2,
} from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner, StatusBadge } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Referral = {
  id: string;
  code: string;
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string | null;
  referrerType: string;
  refereeName: string | null;
  status: string;
  commissionAmount: number;
  commissionStatus: string;
  notes: string | null;
  createdAt: string;
  convertedAt: string | null;
};

const TYPE_ICON: Record<string, string> = {
  ALUMNI: "🎓",
  PARTNER: "🤝",
  STUDENT: "📚",
  AFFILIATE: "💼",
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "CONTACTED", label: "Contacted" },
  { id: "CONVERTED", label: "Converted" },
  { id: "PAID", label: "Paid" },
];

export default function ReferralsView() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState({ total: 0, converted: 0, pending: 0, totalCommission: 0, paidCommission: 0, dueCommission: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/referrals?status=${filter}`);
      setReferrals(data.referrals);
      setStats(data.stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const copyCode = (code: string) => {
    const url = `https://educonnect.in/r/${code}`;
    navigator.clipboard?.writeText(url);
    setCopiedCode(code);
    toast({ title: "Referral link copied!", description: url });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const convertRef = async (id: string, name: string) => {
    try {
      await apiFetch("/api/referrals", {
        method: "PUT",
        body: JSON.stringify({ referralId: id, status: "CONVERTED", commissionAmount: 15000, commissionStatus: "DUE" }),
      });
      toast({ title: `${name} converted! 🎉`, description: "₹15,000 commission marked as DUE." });
      load();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  const payCommission = async (id: string, name: string) => {
    try {
      await apiFetch("/api/referrals", {
        method: "PUT",
        body: JSON.stringify({ referralId: id, commissionStatus: "PAID" }),
      });
      toast({ title: `Commission paid to ${name}`, description: "Payout processed via RazorpayX." });
      load();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#22c55e]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#f59e0b]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22c55e] via-[#0f766e] to-[#0ea5e9] shadow-xl">
            <Gift className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">
              <Share2 className="h-3 w-3" />
              Referral & Affiliate Engine · Auto-commission
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Turn your network into a growth engine</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Alumni, partner agents, students, and affiliates share unique referral links. Track conversions, auto-calculate
              commissions, and pay out via RazorpayX — all from one dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total referrals" value={stats.total} color="#0ea5e9" icon={Users} />
        <StatCard label="Converted" value={stats.converted} color="#22c55e" icon={UserCheck} />
        <StatCard label="Commission paid" value={`₹${(stats.paidCommission / 1000).toFixed(0)}k`} color="#0f766e" icon={Wallet} />
        <StatCard label="Due to pay" value={`₹${(stats.dueCommission / 1000).toFixed(0)}k`} color="#f59e0b" icon={Award} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 rounded-full bg-white ring-1 ring-orange-200 p-1 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 h-8 text-xs font-semibold transition-colors ${
                filter === f.id ? "bg-[#1c1410] text-white" : "text-[#7a6a5d] hover:bg-orange-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#22c55e] to-[#0f766e] text-white px-4 h-10 text-sm font-semibold shadow-lg shadow-emerald-300/40"
        >
          <Plus className="h-4 w-4" /> New referral partner
        </button>
      </div>

      {/* List */}
      {loading ? (
        <Card className="p-12 text-center"><Spinner className="mx-auto" /></Card>
      ) : referrals.length === 0 ? (
        <Empty title="No referrals yet" hint="Add referral partners to start growing." />
      ) : (
        <div className="grid lg:grid-cols-2 gap-3">
          {referrals.map((r) => (
            <Card key={r.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-lg shrink-0 bg-[#fff8f1]">
                  {TYPE_ICON[r.referrerType] || "👤"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#1c1410] truncate">{r.referrerName}</h3>
                      <div className="text-[11px] text-[#7a6a5d] truncate">{r.referrerEmail}</div>
                      <div className="text-[10px] font-semibold text-[#0f766e] mt-0.5 uppercase">{r.referrerType}</div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>

                  {/* Referral code */}
                  <button
                    onClick={() => copyCode(r.code)}
                    className="mt-2 w-full flex items-center justify-between rounded-lg bg-[#fff8f1] px-3 py-2 text-xs font-mono hover:bg-orange-100 transition-colors"
                  >
                    <span className="truncate">educonnect.in/r/{r.code}</span>
                    {copiedCode === r.code ? <Check className="h-3.5 w-3.5 text-[#22c55e]" /> : <Copy className="h-3.5 w-3.5 text-[#7a6a5d]" />}
                  </button>

                  {/* Commission */}
                  {r.commissionAmount > 0 && (
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-[#7a6a5d]">Commission: <strong className="text-[#1c1410]">₹{r.commissionAmount.toLocaleString()}</strong></span>
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                        style={{
                          background: r.commissionStatus === "PAID" ? "#22c55e20" : r.commissionStatus === "DUE" ? "#f59e0b20" : "#94a3b820",
                          color: r.commissionStatus === "PAID" ? "#15803d" : r.commissionStatus === "DUE" ? "#b45309" : "#475569",
                        }}
                      >
                        {r.commissionStatus}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-2 flex items-center gap-2">
                    {r.status === "PENDING" && (
                      <button
                        onClick={() => convertRef(r.id, r.referrerName)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#22c55e]/10 text-[#15803d] px-3 h-7 text-[10px] font-semibold hover:bg-[#22c55e]/20"
                      >
                        <UserCheck className="h-3 w-3" /> Mark converted
                      </button>
                    )}
                    {r.commissionStatus === "DUE" && (
                      <button
                        onClick={() => payCommission(r.id, r.referrerName)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#0f766e] text-white px-3 h-7 text-[10px] font-semibold hover:bg-[#0b5750]"
                      >
                        <Wallet className="h-3 w-3" /> Pay commission
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAdd && <AddReferralModal onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} />}
    </div>
  );
}

function AddReferralModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    referrerName: "",
    referrerEmail: "",
    referrerPhone: "",
    referrerType: "ALUMNI",
    refereeName: "",
    refereeEmail: "",
    notes: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await apiFetch("/api/referrals", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast({ title: "Referral partner added", description: `Code: ${data.referral.code}` });
      onCreated();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1c1410]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100 max-h-[90vh] overflow-y-auto">
        <div className="h-1.5 bg-gradient-to-r from-[#22c55e] to-[#0f766e]" />
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-[#1c1410]">New referral partner</h2>
            <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <In label="Name *" value={form.referrerName} onChange={(v) => setForm({ ...form, referrerName: v })} required />
              <label className="block">
                <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Type</span>
                <select value={form.referrerType} onChange={(e) => setForm({ ...form, referrerType: e.target.value })}
                  className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#22c55e] focus:outline-none">
                  {["ALUMNI", "PARTNER", "STUDENT", "AFFILIATE"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>
            <In label="Email *" type="email" value={form.referrerEmail} onChange={(v) => setForm({ ...form, referrerEmail: v })} required />
            <In label="Phone" value={form.referrerPhone} onChange={(v) => setForm({ ...form, referrerPhone: v })} />
            <In label="Referee name (optional)" value={form.refereeName} onChange={(v) => setForm({ ...form, refereeName: v })} />
            <button type="submit" disabled={saving}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#22c55e] to-[#0f766e] text-white font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : <>Generate referral link</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function In({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#22c55e] focus:outline-none" />
    </label>
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
