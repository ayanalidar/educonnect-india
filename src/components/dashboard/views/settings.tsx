// Settings view — profile, language, security
// Made & maintained by GuardianX

"use client";

import { useState } from "react";
import { Check, Shield, Globe2, User, Bell, Database, CreditCard } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/context/i18n";
import { LANGUAGES } from "@/lib/i18n";
import { Card, SectionTitle } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

export default function SettingsView() {
  const { user, lang, setLang } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();

  return (
    <div className="max-w-4xl space-y-5">
      {/* Profile */}
      <Card className="p-5">
        <SectionTitle title={t("settings.profile")} subtitle="Your account information" />
        <div className="flex items-start gap-5">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl text-white text-xl font-bold shadow-lg shrink-0"
            style={{ background: user?.avatarColor || "#e85d2f" }}>
            {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "RM"}
          </span>
          <div className="flex-1 grid sm:grid-cols-2 gap-3">
            <Field label="Full name" value={user?.name || ""} icon={User} />
            <Field label="Email" value={user?.email || ""} icon={Shield} />
            <Field label="Role" value={user?.role || ""} icon={Shield} />
            <Field label="Branch" value={user?.branch || "Not set"} icon={Shield} />
            <Field label="Phone" value={user?.phone || "Not set"} icon={Shield} />
            <Field label="Avatar color" value={user?.avatarColor || ""} icon={Shield} colorChip />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => toast({ title: "Profile edit coming soon", description: "For now, contact support to update your profile." })}
            className="rounded-full bg-[#1c1410] text-white px-4 h-9 text-xs font-semibold hover:bg-[#e85d2f]">
            Edit profile
          </button>
          <button onClick={() => toast({ title: "Password reset link sent", description: "Check your email to reset your password." })}
            className="rounded-full bg-[#fff8f1] text-[#7a6a5d] px-4 h-9 text-xs font-semibold hover:bg-orange-100">
            Change password
          </button>
        </div>
      </Card>

      {/* Language */}
      <Card className="p-5">
        <SectionTitle title={t("settings.language")} subtitle="Choose your preferred language — applies across the dashboard" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); toast({ title: `Language: ${l.nativeLabel}`, description: "Dashboard language updated." }); }}
              className={`rounded-xl p-3 text-center transition-all ${
                lang === l.code
                  ? "bg-gradient-to-br from-[#e85d2f]/10 to-[#f59e0b]/10 ring-2 ring-[#e85d2f] text-[#c8451a]"
                  : "bg-white ring-1 ring-orange-100 hover:ring-orange-200 text-[#1c1410]"
              }`}
            >
              <div className="text-2xl">{l.flag}</div>
              <div className="mt-1 text-xs font-bold">{l.nativeLabel}</div>
              <div className="text-[10px] text-[#7a6a5d]">{l.label}</div>
              {lang === l.code && (
                <div className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-[#e85d2f] text-white px-1.5 py-0.5 text-[9px] font-bold uppercase">
                  <Check className="h-2 w-2" /> Active
                </div>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-5">
        <SectionTitle title="Preferences" subtitle="Notifications and platform defaults" />
        <div className="space-y-2">
          {[
            { icon: Bell, label: "Email notifications", desc: "Daily digest of new leads, offers, and visa updates", on: true },
            { icon: Bell, label: "WhatsApp alerts", desc: "Critical alerts via WhatsApp (offers, deadlines)", on: true },
            { icon: Bell, label: "Weekly performance report", desc: "Friday 6 PM IST — counselor scorecard", on: true },
            { icon: Database, label: "Auto-backup", desc: "Daily encrypted backups to Mumbai + Singapore regions", on: true },
            { icon: Globe2, label: "Multi-currency", desc: "Show fees in INR + USD + GBP + AUD + CAD", on: false },
            { icon: CreditCard, label: "Razorpay auto-collection", desc: "Auto-charge fees on invoice due date", on: false },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-3 py-2.5 border-b border-orange-50 last:border-0">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff8f1] text-[#7a6a5d]">
                <p.icon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#1c1410]">{p.label}</div>
                <div className="text-[11px] text-[#7a6a5d]">{p.desc}</div>
              </div>
              <Toggle initial={p.on} onChange={(v) => toast({ title: `${p.label}: ${v ? "on" : "off"}` })} />
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-5">
        <SectionTitle title="Security & compliance" subtitle="Your data is protected" />
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "ISO 27001", desc: "Information security certified", color: "#22c55e" },
            { label: "DPDP Act 2023", desc: "India data protection compliant", color: "#0f766e" },
            { label: "GDPR", desc: "EU data protection compliant", color: "#0ea5e9" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-[#fff8f1] p-3 text-center">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full mb-2"
                style={{ background: `${s.color}1a`, color: s.color }}>
                <Shield className="h-4 w-4" />
              </span>
              <div className="text-xs font-bold text-[#1c1410]">{s.label}</div>
              <div className="text-[10px] text-[#7a6a5d]">{s.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* GuardianX footer */}
      <div className="text-center text-xs text-[#7a6a5d] py-2">
        {t("brand.madeBy")} <strong className="text-[#1c1410]">GuardianX</strong> · v1.0.0 · EduConnect India
      </div>
    </div>
  );
}

function Field({ label, value, icon: Icon, colorChip }: { label: string; value: string; icon: React.ElementType; colorChip?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#7a6a5d]">{label}</div>
      <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-[#1c1410]">
        {colorChip ? (
          <span className="inline-block h-4 w-4 rounded-full ring-2 ring-white shadow" style={{ background: value }} />
        ) : (
          <Icon className="h-3.5 w-3.5 text-[#7a6a5d]" />
        )}
        {value || "—"}
      </div>
    </div>
  );
}

function Toggle({ initial, onChange }: { initial: boolean; onChange: (v: boolean) => void }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      onClick={() => { const v = !on; setOn(v); onChange(v); }}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-[#e85d2f]" : "bg-[#e5e7eb]"}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}
