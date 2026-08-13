"use client";

import {
  GraduationCap,
  Shield,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Instagram,
  ArrowRight,
} from "lucide-react";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Features", page: "features" },
      { label: "Pricing", page: "pricing" },
      { label: "Partner Universities", page: "partners" },
      { label: "AI Course Matcher", page: "matcher" },
      { label: "Visa Tracker", page: "visa-tracker" },
      { label: "Integrations", page: "integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", page: "about" },
      { label: "Careers", page: "careers" },
      { label: "Press", page: "press" },
      { label: "Blog", page: "blog" },
      { label: "Customer Stories", page: "customer-stories" },
      { label: "Contact", page: "contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", page: "help-center" },
      { label: "Counselor Academy", page: "counselor-academy" },
      { label: "University Guide", page: "university-guide" },
      { label: "Visa Handbook", page: "visa-handbook" },
      { label: "API Docs", page: "api-docs" },
      { label: "Status", page: "status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", page: "privacy" },
      { label: "Terms of Service", page: "terms" },
      { label: "DPDP Compliance", page: "dpdp" },
      { label: "Cookie Policy", page: "cookie" },
      { label: "GDPR", page: "gdpr" },
      { label: "Security", page: "security" },
    ],
  },
];

const SOCIAL = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#1c1410] text-white">
      {/* Top accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#e85d2f] via-[#f59e0b] to-[#0f766e]" />

      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Ready to transform your consultancy?
            </h3>
            <p className="mt-2 text-white/70">
              Join 480+ Indian consultancies already growing with EduConnect.
            </p>
          </div>
          <a href="#contact" className="shrink-0">
            <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] px-6 h-12 font-semibold text-white shadow-lg shadow-orange-900/40 hover:-translate-y-0.5 transition-all">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </button>
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <a href="#home" className="flex items-center gap-2.5">
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white shadow-lg">
                <GraduationCap className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#0f766e] ring-2 ring-[#1c1410]" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[17px] font-extrabold tracking-tight">
                  EduConnect
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e85d2f]">
                  India
                </span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-sm">
              The all-in-one SaaS platform for Indian education consultants.
              Manage students, applications, partner universities, visas, and
              analytics — across 1,000+ Indian and overseas institutions.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Counselor newsletter
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-2 flex items-center gap-2"
              >
                <input
                  type="email"
                  placeholder="your@email.in"
                  className="h-11 flex-1 rounded-full bg-white/[0.06] border border-white/10 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#e85d2f]"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#e85d2f] hover:bg-[#c8451a] transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <div className="text-xs font-bold uppercase tracking-wider text-white/50">
                  {col.title}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.page}>
                      <a
                        href={`/?page=${l.page}`}
                        className="text-sm text-white/70 hover:text-[#f59e0b] transition-colors"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-7 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-xs text-white/50">
            © {new Date().getFullYear()} EduConnect India Technologies Pvt. Ltd.
            · Made with care in Mumbai 🇮🇳
            · Made & maintained by{" "}
            <a href="https://github.com/ayanalidar/educonnect-india" target="_blank" rel="noopener noreferrer" className="font-bold text-[#f59e0b] hover:underline">GuardianX</a>
          </div>

          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <a href="/?page=dpdp" className="inline-flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-3 h-7 text-[10px] font-bold text-[#0f766e] hover:bg-white/10 transition-colors">
              <Shield className="h-3 w-3" /> DPDP Compliant
            </a>
            <a href="/?page=security" className="inline-flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-3 h-7 text-[10px] font-bold text-[#22c55e] hover:bg-white/10 transition-colors">
              <Shield className="h-3 w-3" /> ISO 27001
            </a>
            <a href="/?page=gdpr" className="inline-flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-3 h-7 text-[10px] font-bold text-[#0ea5e9] hover:bg-white/10 transition-colors">
              <Shield className="h-3 w-3" /> GDPR
            </a>
          </div>

          <div className="flex items-center gap-2">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] hover:bg-[#e85d2f] transition-colors"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
