"use client";

import { useEffect, useState } from "react";
import { Menu, X, GraduationCap, ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#company", label: "Company" },
  { href: "#features", label: "Features" },
  { href: "#partners", label: "Partners" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, openAuthModal, setView } = useAppStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav shadow-[0_4px_24px_-12px_rgba(232,93,47,0.25)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white shadow-lg shadow-orange-300/40 transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#0f766e] ring-2 ring-white" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[17px] font-extrabold tracking-tight text-[#1c1410]">
                EduConnect
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e85d2f]">
                India
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative px-4 py-2 text-sm font-medium text-[#3a2e26] hover:text-[#e85d2f] transition-colors after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:scale-x-0 after:rounded-full after:bg-[#e85d2f] after:transition-transform hover:after:scale-x-100"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <button
                onClick={() => setView("dashboard")}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1c1410] hover:bg-[#e85d2f] text-white px-5 h-10 font-semibold shadow-lg transition-all hover:-translate-y-0.5"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal("signin")}
                  className="text-sm font-semibold text-[#1c1410] hover:text-[#e85d2f] transition-colors"
                >
                  Sign in
                </button>
                <Button
                  onClick={() => openAuthModal("signup")}
                  className="bg-[#e85d2f] hover:bg-[#c8451a] text-white rounded-full px-5 h-10 font-semibold shadow-lg shadow-orange-300/40 transition-all hover:shadow-orange-400/60 hover:-translate-y-0.5"
                >
                  Start free trial
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-orange-200 bg-white/70 text-[#1c1410]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden pb-5 pt-1">
            <div className="flex flex-col gap-1 rounded-2xl bg-white/95 p-3 shadow-xl ring-1 ring-orange-100">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-[#3a2e26] hover:bg-orange-50 hover:text-[#e85d2f] transition-colors"
                >
                  {l.label}
                </a>
              ))}
              {user ? (
                <button
                  onClick={() => { setView("dashboard"); setOpen(false); }}
                  className="mt-2 w-full bg-[#1c1410] text-white rounded-full h-11 font-semibold"
                >
                  <LayoutDashboard className="inline h-4 w-4 mr-1.5" />
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={() => { openAuthModal("signup"); setOpen(false); }}
                  className="mt-2 w-full bg-[#e85d2f] hover:bg-[#c8451a] text-white rounded-full h-11 font-semibold"
                >
                  Start free trial
                  <ArrowRight className="ml-1.5 h-4 w-4 inline" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
