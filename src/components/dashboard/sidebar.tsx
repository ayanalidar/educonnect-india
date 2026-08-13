// Dashboard sidebar — navigation
// Made & maintained by GuardianX

"use client";

import {
  LayoutDashboard, Users, FolderCheck, School,
  Plane, MessagesSquare, Wallet, BarChart3,
  Plug, Settings, GraduationCap, LogOut, Globe,
  ChevronLeft, Shield, Sparkles, FileSearch, Beaker,
  Award, Bell, Mic, Smartphone, Calendar, Gift, Globe2,
  Building2, Zap,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/context/i18n";

export type DashboardView =
  | "overview"
  | "matcher"
  | "students"
  | "applications"
  | "universities"
  | "visa"
  | "communication"
  | "documents"
  | "finance"
  | "analytics"
  | "integrations"
  | "scholarships"
  | "deadlines"
  | "visa-interview"
  | "mobile"
  | "calendar"
  | "referrals"
  | "country-guides"
  | "branches"
  | "lead-magnets"
  | "audit-logs"
  | "innovation"
  | "settings";

const NAV_SECTIONS: { title: string; items: { key: DashboardView; icon: React.ElementType; tKey: string; badge?: string }[] }[] = [
  {
    title: "AI Tools",
    items: [
      { key: "overview", icon: LayoutDashboard, tKey: "nav.overview" },
      { key: "matcher", icon: Sparkles, tKey: "nav.matcher", badge: "AI" },
      { key: "visa-interview", icon: Mic, tKey: "nav.visa-interview", badge: "NEW" },
      { key: "scholarships", icon: Award, tKey: "nav.scholarships", badge: "NEW" },
      { key: "documents", icon: FileSearch, tKey: "nav.documents", badge: "OCR" },
    ],
  },
  {
    title: "Operations",
    items: [
      { key: "students", icon: Users, tKey: "nav.students" },
      { key: "applications", icon: FolderCheck, tKey: "nav.applications" },
      { key: "universities", icon: School, tKey: "nav.universities" },
      { key: "visa", icon: Plane, tKey: "nav.visa" },
      { key: "communication", icon: MessagesSquare, tKey: "nav.communication" },
      { key: "calendar", icon: Calendar, tKey: "nav.calendar", badge: "NEW" },
      { key: "deadlines", icon: Bell, tKey: "nav.deadlines", badge: "NEW" },
    ],
  },
  {
    title: "Growth",
    items: [
      { key: "referrals", icon: Gift, tKey: "nav.referrals", badge: "NEW" },
      { key: "lead-magnets", icon: Zap, tKey: "nav.lead-magnets", badge: "NEW" },
      { key: "country-guides", icon: Globe2, tKey: "nav.country-guides", badge: "NEW" },
    ],
  },
  {
    title: "Business",
    items: [
      { key: "finance", icon: Wallet, tKey: "nav.finance" },
      { key: "analytics", icon: BarChart3, tKey: "nav.analytics" },
      { key: "branches", icon: Building2, tKey: "nav.branches", badge: "NEW" },
      { key: "audit-logs", icon: Shield, tKey: "nav.audit-logs", badge: "NEW" },
      { key: "integrations", icon: Plug, tKey: "nav.integrations" },
      { key: "mobile", icon: Smartphone, tKey: "nav.mobile", badge: "NEW" },
      { key: "innovation", icon: Beaker, tKey: "nav.innovation", badge: "NEW" },
      { key: "settings", icon: Settings, tKey: "nav.settings" },
    ],
  },
];

export default function Sidebar({
  active,
  setActive,
  mobileOpen,
  setMobileOpen,
}: {
  active: DashboardView;
  setActive: (v: DashboardView) => void;
  mobileOpen: boolean;
  setMobileOpen: (b: boolean) => void;
}) {
  const { user, logout, setView } = useAppStore();
  const { t } = useI18n();

  const goLanding = () => {
    setView("landing");
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1c1410]/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 z-50 lg:z-10 h-screen w-[260px] shrink-0 bg-[#1c1410] text-white flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-5 h-[68px] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] shadow-lg">
              <GraduationCap className="h-4.5 w-4.5" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#0f766e] ring-2 ring-[#1c1410]" />
            </span>
            <div className="leading-none">
              <div className="text-[15px] font-extrabold tracking-tight">EduConnect</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e85d2f]">
                India
              </div>
            </div>
          </div>
          <button
            className="lg:hidden text-white/60 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((n) => {
                  const isActive = active === n.key;
                  return (
                    <button
                      key={n.key}
                      onClick={() => {
                        setActive(n.key);
                        setMobileOpen(false);
                      }}
                      className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-[#e85d2f]/20 to-transparent text-white"
                          : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                          isActive
                            ? "bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white shadow-md"
                            : "bg-white/[0.06] text-white/70 group-hover:text-white"
                        }`}
                      >
                        <n.icon className="h-4 w-4" />
                      </span>
                      {t(n.tKey)}
                      {n.badge && (
                        <span
                          className={`ml-auto text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                            isActive ? "bg-[#f59e0b] text-white" : "bg-[#e85d2f]/20 text-[#f59e0b]"
                          }`}
                        >
                          {n.badge}
                        </span>
                      )}
                      {isActive && !n.badge && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom block */}
        <div className="px-3 pb-3 space-y-2">
          {/* Branch card */}
          <div className="rounded-xl bg-white/[0.04] ring-1 ring-white/10 p-3">
            <div className="flex items-center gap-2">
              <div
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white text-xs font-bold"
                style={{ background: user?.avatarColor || "#e85d2f" }}
              >
                {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "RM"}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                <div className="text-[10px] text-white/60 truncate">
                  {user?.role} · {user?.branch || "HQ"}
                </div>
              </div>
            </div>
          </div>

          {/* Back to website */}
          <button
            onClick={goLanding}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <Globe className="h-4 w-4" />
            {t("common.back")}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-white/60 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>

          {/* GuardianX credit */}
          <div className="pt-1.5 px-3 flex items-center justify-center gap-1.5 text-[10px] text-white/40">
            <Shield className="h-3 w-3" />
            {t("brand.madeBy")} <strong className="text-white/70">GuardianX</strong>
          </div>
        </div>
      </aside>
    </>
  );
}
