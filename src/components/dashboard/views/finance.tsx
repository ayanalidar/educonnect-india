// Finance & invoicing view
// Made & maintained by GuardianX

"use client";

import { useEffect, useState } from "react";
import { Wallet, Download, Loader2, Plus, X, IndianRupee, FileText, Clock, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, StatusBadge, Empty, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Invoice = {
  id: string;
  number: string;
  studentName: string;
  amount: number;
  gst: number;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
  application: { university: { name: string; logoColor: string } } | null;
};

const FILTERS = ["all", "DRAFT", "SENT", "PAID", "OVERDUE"];

export default function FinanceView() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/invoices?status=${filter}`);
      setInvoices(data.invoices);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const total = invoices.reduce((sum, i) => sum + i.amount, 0);
  const paid = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
  const outstanding = total - paid;

  return (
    <div className="space-y-5">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total invoiced" value={`₹${(total / 100000).toFixed(1)}L`} icon={Wallet} color="#e85d2f" />
        <Stat label="Collected" value={`₹${(paid / 100000).toFixed(1)}L`} icon={CheckCircle2} color="#22c55e" />
        <Stat label="Outstanding" value={`₹${(outstanding / 100000).toFixed(1)}L`} icon={Clock} color="#f59e0b" />
        <Stat label="Avg invoice" value={`₹${invoices.length ? Math.round(total / invoices.length).toLocaleString() : 0}`} icon={FileText} color="#0f766e" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-full bg-white ring-1 ring-orange-200 p-1">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full px-3 h-8 text-xs font-semibold transition-colors ${filter === f ? "bg-[#e85d2f] text-white" : "text-[#7a6a5d] hover:bg-orange-50"}`}>
              {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white px-4 h-10 text-sm font-semibold shadow-lg shadow-orange-300/40">
          <Plus className="h-4 w-4" /> New invoice
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-4 h-10 text-sm font-semibold text-[#3a2e26] hover:bg-orange-50">
          <Download className="h-4 w-4" /> Export GST
        </button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-[#7a6a5d]"><Spinner /> Loading…</div>
        ) : invoices.length === 0 ? (
          <Empty title="No invoices" hint="Create your first invoice for a placed student." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#fff8f1] text-[10px] uppercase tracking-wider text-[#7a6a5d]">
                <tr>
                  <th className="text-left font-bold px-4 py-3">Invoice #</th>
                  <th className="text-left font-bold px-4 py-3">Student</th>
                  <th className="text-left font-bold px-4 py-3 hidden md:table-cell">University</th>
                  <th className="text-right font-bold px-4 py-3">Amount</th>
                  <th className="text-right font-bold px-4 py-3 hidden lg:table-cell">GST</th>
                  <th className="text-left font-bold px-4 py-3 hidden lg:table-cell">Due</th>
                  <th className="text-left font-bold px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-orange-50 hover:bg-[#fff8f1]/50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#1c1410]">{inv.number}</td>
                    <td className="px-4 py-3 text-xs font-medium text-[#3a2e26]">{inv.studentName}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {inv.application ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded text-white text-[9px] font-bold"
                            style={{ background: inv.application.university.logoColor }}>
                            {inv.application.university.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </span>
                          <span className="text-xs text-[#3a2e26] truncate max-w-[160px]">{inv.application.university.name}</span>
                        </div>
                      ) : <span className="text-xs text-[#7a6a5d]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#1c1410]">₹{inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-xs text-[#7a6a5d] hidden lg:table-cell">{inv.gst}%</td>
                    <td className="px-4 py-3 text-xs text-[#7a6a5d] hidden lg:table-cell">
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showAdd && <AddInvoiceModal onClose={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} />}
    </div>
  );
}

function Stat({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}1a`, color }}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 text-2xl font-extrabold text-[#1c1410] leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-[#7a6a5d]">{label}</div>
    </Card>
  );
}

function AddInvoiceModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ studentName: "", amount: "", gst: "18", status: "DRAFT", dueDate: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/api/invoices", { method: "POST", body: JSON.stringify(form) });
      toast({ title: "Invoice created" });
      onCreated();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1c1410]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100">
        <div className="h-1.5 bg-gradient-to-r from-[#e85d2f] to-[#f59e0b]" />
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-[#1c1410]">New invoice</h2>
            <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Student name *</span>
              <input required value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Amount ₹ *</span>
                <input required type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none" />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">GST %</span>
                <input value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value })}
                  className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Status</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none">
                  {["DRAFT", "SENT", "PAID", "OVERDUE"].map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Due date</span>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none" />
              </label>
            </div>
            <button type="submit" disabled={saving}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : "Create invoice"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
