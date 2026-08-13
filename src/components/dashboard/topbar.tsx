// Dashboard topbar — title, search, language switcher, notifications, user menu

"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, ChevronDown, Globe2, Check } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/context/i18n";
import { LANGUAGES } from "@/lib/i18n";
import type { DashboardView } from "@/components/dashboard/sidebar";

export default function Topbar({
  view,
  onOpenSidebar,
}: {
  view: DashboardView;
  onOpenSidebar: () => void;
}) {
  const { t } = useI18n();
  const { user, lang, setLang, logout, setView } = useAppStore();
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const titleKey = `nav.${view}`;
  const subtitleMap: Record<DashboardView, string> = {
    overview: "overview.subtitle",
    matcher: "matcher.subtitle",
    students: "students.subtitle",
    applications: "applications.subtitle",
    universities: "universities.subtitle",
    visa: "visa.subtitle",
    communication: "communication.subtitle",
    documents: "documents.subtitle",
    finance: "finance.subtitle",
    analytics: "analytics.subtitle",
    integrations: "integrations.subtitle",
    scholarships: "scholarships.subtitle",
    deadlines: "deadlines.subtitle",
    "visa-interview": "visa-interview.subtitle",
    mobile: "mobile.subtitle",
    calendar: "calendar.subtitle",
    referrals: "referrals.subtitle",
    "country-guides": "country-guides.subtitle",
    branches: "branches.subtitle",
    "lead-magnets": "lead-magnets.subtitle",
    "audit-logs": "audit-logs.subtitle",
    "content-editor": "content-editor.subtitle",
    "my-landing-page": "my-landing-page.subtitle",
    innovation: "innovation.subtitle",
    settings: "settings.subtitle",
  };

  return (
    <header className="sticky top-0 z-30 bg-[#fff8f1]/85 backdrop-blur-md border-b border-orange-100">
      <div className="px-4 sm:px-6 lg:px-8 h-[68px] flex items-center gap-4">
        {/* Mobile menu */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-orange-200 bg-white text-[#1c1410]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-extrabold text-[#1c1410] truncate">
            {t(titleKey)}
          </h1>
          <p className="text-xs text-[#7a6a5d] truncate hidden sm:block">
            {t(subtitleMap[view])}
          </p>
        </div>

        {/* Search (desktop) */}
        <div className="hidden md:flex items-center gap-2 rounded-full bg-white ring-1 ring-orange-200 px-3.5 h-10 w-64">
          <Search className="h-4 w-4 text-[#7a6a5d]" />
          <input
            placeholder={t("common.search")}
            className="flex-1 bg-transparent text-sm text-[#1c1410] placeholder:text-[#7a6a5d] focus:outline-none"
          />
        </div>

        {/* Language switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-orange-200 px-3 h-10 text-sm font-medium text-[#1c1410] hover:bg-orange-50 transition-colors"
          >
            <Globe2 className="h-4 w-4 text-[#e85d2f]" />
            <span className="hidden sm:inline">{currentLang.nativeLabel}</span>
            <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#7a6a5d]" />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl ring-1 ring-orange-100 overflow-hidden z-50">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#7a6a5d] bg-[#fff8f1]">
                Select Language / भाषा चुनें
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-orange-50 transition-colors ${
                      l.code === lang ? "text-[#e85d2f] font-semibold" : "text-[#1c1410]"
                    }`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="flex-1 text-left">
                      {l.nativeLabel}
                      <span className="block text-[10px] text-[#7a6a5d]">{l.label}</span>
                    </span>
                    {l.code === lang && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-orange-200 text-[#1c1410] hover:bg-orange-50 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#e85d2f]" />
        </button>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-orange-200 pl-1 pr-2.5 h-10 hover:bg-orange-50 transition-colors"
          >
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ background: user?.avatarColor || "#e85d2f" }}
            >
              {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "RM"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[#7a6a5d]" />
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-2xl ring-1 ring-orange-100 overflow-hidden z-50">
              <div className="px-4 py-3 bg-gradient-to-br from-[#fff8f1] to-white border-b border-orange-100">
                <div className="text-sm font-bold text-[#1c1410]">{user?.name}</div>
                <div className="text-xs text-[#7a6a5d] truncate">{user?.email}</div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#e85d2f]/10 px-2 py-0.5 text-[10px] font-semibold text-[#c8451a]">
                  {user?.role} · {user?.branch || "HQ"}
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setView("landing"); setUserOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-[#1c1410] hover:bg-orange-50"
                >
                  Back to website
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
