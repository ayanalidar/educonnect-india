"use client";

import { Check, Sparkles, ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    tagline: "For solo counselors & new consultancies",
    price: "₹4,999",
    period: "/month",
    cta: "Start free trial",
    highlight: false,
    color: "#0f766e",
    features: [
      "Up to 200 active students",
      "2 counselor seats",
      "Student CRM + Application Tracker",
      "200+ Indian partner universities",
      "WhatsApp + Email campaigns (1,000/mo)",
      "GST invoicing",
      "Email support (24h response)",
    ],
  },
  {
    name: "Growth",
    tagline: "For established consultancies scaling up",
    price: "₹14,999",
    period: "/month",
    cta: "Book a demo",
    highlight: true,
    color: "#e85d2f",
    features: [
      "Up to 2,000 active students",
      "10 counselor seats",
      "Full 1,048 university database",
      "AI Course Matcher (unlimited)",
      "Visa & Immigration module",
      "WhatsApp + Email + SMS (unlimited)",
      "Analytics dashboard + cohort reports",
      "Dedicated onboarding manager (90 days)",
      "Priority phone + chat support",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For multi-branch firms & white-label needs",
    price: "Custom",
    period: "",
    cta: "Talk to sales",
    highlight: false,
    color: "#1c1410",
    features: [
      "Unlimited students & seats",
      "Multi-branch & white-label dashboard",
      "Custom university partnerships",
      "Custom AI model training",
      "Dedicated success manager + quarterly review",
      "API access + SSO + audit logs",
      "99.9% uptime SLA",
      "On-premise / data-residency options",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-16 sm:py-22">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-xs font-semibold text-[#c8451a]">
            <Sparkles className="h-3.5 w-3.5" />
            Simple Pricing
          </div>
          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1c1410]">
            Pricing that scales with{" "}
            <span className="text-gradient-brand">your consultancy</span>.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#4b3d33]">
            No setup fees. No per-application charges. No commissions on your
            hard-earned university partnerships. Cancel anytime — your data is
            always exportable.
          </p>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((p, i) => (
            <div
              key={p.name}
              className={`reveal relative rounded-3xl p-7 sm:p-8 flex flex-col transition-all duration-300 ${
                p.highlight
                  ? "bg-[#1c1410] text-white ring-2 ring-[#e85d2f] shadow-2xl lg:-translate-y-4 lg:scale-[1.03]"
                  : "bg-white ring-1 ring-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background: p.highlight ? `${p.color}33` : `${p.color}1a`,
                    color: p.highlight ? "#f59e0b" : p.color,
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                </span>
                <h3
                  className={`text-xl font-bold ${
                    p.highlight ? "text-white" : "text-[#1c1410]"
                  }`}
                >
                  {p.name}
                </h3>
              </div>

              <p
                className={`mt-2 text-sm ${
                  p.highlight ? "text-white/70" : "text-[#7a6a5d]"
                }`}
              >
                {p.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-extrabold ${
                    p.highlight ? "text-white" : "text-[#1c1410]"
                  }`}
                >
                  {p.price}
                </span>
                <span
                  className={`text-sm ${
                    p.highlight ? "text-white/60" : "text-[#7a6a5d]"
                  }`}
                >
                  {p.period}
                </span>
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-2.5 text-sm ${
                      p.highlight ? "text-white/85" : "text-[#3a2e26]"
                    }`}
                  >
                    <span
                      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: p.highlight ? "#e85d2f33" : `${p.color}1a`,
                        color: p.highlight ? "#f59e0b" : p.color,
                      }}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#contact" className="mt-8 block">
                <button
                  className={`w-full h-12 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                    p.highlight
                      ? "bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5"
                      : "bg-[#1c1410] text-white hover:bg-[#e85d2f]"
                  }`}
                >
                  {p.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </a>
            </div>
          ))}
        </div>

        <p className="reveal mt-8 text-center text-sm text-[#7a6a5d]">
          All plans include unlimited partner universities access, free data
          migration, and a 14-day money-back guarantee.
        </p>
      </div>
    </section>
  );
}
