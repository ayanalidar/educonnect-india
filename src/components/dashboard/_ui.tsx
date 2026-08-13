// Shared dashboard UI helpers

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl bg-white ring-1 ring-orange-100 shadow-sm", className)}
      {...props}
    />
  );
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="text-base font-bold text-[#1c1410]">{title}</h3>
        {subtitle && <p className="text-xs text-[#7a6a5d] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    LEAD:        { bg: "#f59e0b20", fg: "#b45309" },
    SHORTLISTED: { bg: "#0ea5e920", fg: "#0369a1" },
    APPLIED:     { bg: "#e85d2f20", fg: "#c8451a" },
    OFFERED:     { bg: "#22c55e20", fg: "#15803d" },
    ENROLLED:    { bg: "#0f766e20", fg: "#0f766e" },
    REJECTED:    { bg: "#ef444420", fg: "#b91c1c" },
    DRAFT:       { bg: "#94a3b820", fg: "#475569" },
    SUBMITTED:   { bg: "#e85d2f20", fg: "#c8451a" },
    UNDER_REVIEW:{ bg: "#a855f720", fg: "#7e22ce" },
    ACCEPTED:    { bg: "#22c55e20", fg: "#15803d" },
    PAID:        { bg: "#22c55e20", fg: "#15803d" },
    SENT:        { bg: "#0ea5e920", fg: "#0369a1" },
    OVERDUE:     { bg: "#ef444420", fg: "#b91c1c" },
    APPROVED:    { bg: "#22c55e20", fg: "#15803d" },
    DOCS_READY:  { bg: "#f59e0b20", fg: "#b45309" },
    BIO_METRIC:  { bg: "#a855f720", fg: "#7e22ce" },
    INTERVIEW:   { bg: "#0ea5e920", fg: "#0369a1" },
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

export function Avatar({ name, color }: { name: string; color?: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
      style={{ background: color || "#e85d2f" }}
    >
      {initials}
    </span>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin",
        className
      )}
    />
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="py-12 text-center">
      <div className="text-sm font-semibold text-[#7a6a5d]">{title}</div>
      {hint && <div className="mt-1 text-xs text-[#7a6a5d]">{hint}</div>}
    </div>
  );
}
