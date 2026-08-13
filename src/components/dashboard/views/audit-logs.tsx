// Compliance Audit Trail dashboard view

"use client";

import { useEffect, useState } from "react";
import {
  Shield, FileText, Download, Filter, Info, AlertTriangle, AlertCircle,
  User, Clock, Search, ChevronDown,
} from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Log = {
  id: string;
  userEmail: string | null;
  userName: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  details: string;
  ipAddress: string | null;
  severity: string;
  createdAt: string;
};

const ACTIONS = ["all", "LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "EXPORT", "VIEW", "ESCALATE"];
const RESOURCES = ["all", "USER", "STUDENT", "APPLICATION", "VISA", "INVOICE", "DOCUMENT", "SETTINGS", "DEADLINE"];
const SEVERITIES = ["all", "INFO", "WARNING", "CRITICAL"];

const SEVERITY_CONFIG: Record<string, { color: string; icon: React.ElementType; bg: string }> = {
  INFO: { color: "#0ea5e9", icon: Info, bg: "#0ea5e920" },
  WARNING: { color: "#f59e0b", icon: AlertTriangle, bg: "#f59e0b20" },
  CRITICAL: { color: "#dc2626", icon: AlertCircle, bg: "#dc262620" },
};

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "#22c55e",
  LOGOUT: "#7a6a5d",
  CREATE: "#0ea5e9",
  UPDATE: "#f59e0b",
  DELETE: "#dc2626",
  EXPORT: "#a855f7",
  VIEW: "#0f766e",
  ESCALATE: "#e85d2f",
};

export default function AuditLogsView() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState({ total: 0, info: 0, warning: 0, critical: 0 });
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("all");
  const [resource, setResource] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [q, setQ] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (action !== "all") params.set("action", action);
      if (resource !== "all") params.set("resource", resource);
      if (severity !== "all") params.set("severity", severity);
      const data = await apiFetch(`/api/audit-logs?${params.toString()}`);
      setLogs(data.logs);
      setStats(data.stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [action, resource, severity]);

  const filtered = q
    ? logs.filter((l) =>
        l.details.toLowerCase().includes(q.toLowerCase()) ||
        (l.userName || "").toLowerCase().includes(q.toLowerCase()) ||
        (l.userEmail || "").toLowerCase().includes(q.toLowerCase())
      )
    : logs;

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "User", "Email", "Action", "Resource", "Severity", "IP", "Details"].join(","),
      ...filtered.map((l) => [
        new Date(l.createdAt).toISOString(),
        l.userName || "",
        l.userEmail || "",
        l.action,
        l.resource,
        l.severity,
        l.ipAddress || "",
        `"${l.details.replace(/"/g, '""')}"`,
      ].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Audit log exported", description: `${filtered.length} entries → CSV` });
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#1c1410]/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#dc2626]/20 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1c1410] via-[#3a2e26] to-[#dc2626] shadow-xl ring-1 ring-white/10">
            <Shield className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">
              <Shield className="h-3 w-3" />
              Compliance Audit Trail · ISO 27001 · DPDP · GDPR
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Every action. Every user. Every timestamp.</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Tamper-evident audit logs capture every action across the platform — logins, creates, updates, deletes, exports,
              escalations. Export-ready for ISO 27001, DPDP Act 2023, and GDPR compliance audits.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total events" value={stats.total} color="#0ea5e9" icon={FileText} />
        <StatCard label="Info" value={stats.info} color="#0ea5e9" icon={Info} />
        <StatCard label="Warnings" value={stats.warning} color="#f59e0b" icon={AlertTriangle} />
        <StatCard label="Critical" value={stats.critical} color="#dc2626" icon={AlertCircle} />
      </div>

      {/* Compliance badges */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "ISO 27001", desc: "Information security certified", color: "#22c55e" },
          { label: "DPDP Act 2023", desc: "India data protection compliant", color: "#0f766e" },
          { label: "GDPR", desc: "EU data protection compliant", color: "#0ea5e9" },
        ].map((b) => (
          <Card key={b.label} className="p-4 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${b.color}1a`, color: b.color }}>
              <Shield className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-[#1c1410]">{b.label}</div>
              <div className="text-[10px] text-[#7a6a5d]">{b.desc}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 rounded-full bg-white ring-1 ring-orange-200 px-3 h-10 flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-[#7a6a5d]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by user, email, or details…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>

        <select value={action} onChange={(e) => setAction(e.target.value)} className="h-10 rounded-full bg-white ring-1 ring-orange-200 px-3 text-xs font-semibold">
          {ACTIONS.map((a) => <option key={a} value={a}>{a === "all" ? "All actions" : a}</option>)}
        </select>
        <select value={resource} onChange={(e) => setResource(e.target.value)} className="h-10 rounded-full bg-white ring-1 ring-orange-200 px-3 text-xs font-semibold">
          {RESOURCES.map((r) => <option key={r} value={r}>{r === "all" ? "All resources" : r}</option>)}
        </select>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="h-10 rounded-full bg-white ring-1 ring-orange-200 px-3 text-xs font-semibold">
          {SEVERITIES.map((s) => <option key={s} value={s}>{s === "all" ? "All severities" : s}</option>)}
        </select>

        <button
          onClick={exportLogs}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1c1410] text-white px-4 h-10 text-xs font-semibold hover:bg-[#e85d2f]"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {/* Logs table */}
      {loading ? (
        <Card className="p-12 text-center"><Spinner className="mx-auto" /></Card>
      ) : filtered.length === 0 ? (
        <Empty title="No audit logs match" hint="Try adjusting filters." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#fff8f1] text-[10px] uppercase tracking-wider text-[#7a6a5d]">
                <tr>
                  <th className="text-left font-bold px-4 py-3">Severity</th>
                  <th className="text-left font-bold px-4 py-3">Action</th>
                  <th className="text-left font-bold px-4 py-3 hidden md:table-cell">User</th>
                  <th className="text-left font-bold px-4 py-3">Details</th>
                  <th className="text-left font-bold px-4 py-3 hidden lg:table-cell">Resource</th>
                  <th className="text-left font-bold px-4 py-3 hidden lg:table-cell">IP</th>
                  <th className="text-left font-bold px-4 py-3">When</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 50).map((l) => {
                  const sev = SEVERITY_CONFIG[l.severity] || SEVERITY_CONFIG.INFO;
                  const actColor = ACTION_COLORS[l.action] || "#7a6a5d";
                  return (
                    <tr key={l.id} className="border-t border-orange-50 hover:bg-[#fff8f1]/50">
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                          style={{ background: sev.bg, color: sev.color }}
                        >
                          <sev.icon className="h-2.5 w-2.5" />
                          {l.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                          style={{ background: `${actColor}1a`, color: actColor }}
                        >
                          {l.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1c1410] text-white text-[9px] font-bold">
                            {(l.userName || "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-[#1c1410] truncate">{l.userName || "—"}</div>
                            <div className="text-[10px] text-[#7a6a5d] truncate">{l.userEmail || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#3a2e26] max-w-xs">{l.details}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs font-semibold text-[#7a6a5d]">{l.resource}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-[10px] text-[#7a6a5d] font-mono">{l.ipAddress || "—"}</td>
                      <td className="px-4 py-3 text-[10px] text-[#7a6a5d] whitespace-nowrap">
                        {new Date(l.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length > 50 && (
            <div className="px-4 py-3 bg-[#fff8f1] text-center text-xs text-[#7a6a5d]">
              Showing 50 of {filtered.length} logs. Export CSV for full list.
            </div>
          )}
        </Card>
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
