"use client";

import { UserPlus, ClipboardList, Send, GraduationCap } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: UserPlus,
    title: "Onboard students",
    desc: "Capture student profile, academic history, target destination, and budget in under 3 minutes. Auto-create a counselor workspace and parent portal.",
    color: "#e85d2f",
  },
  {
    n: "02",
    icon: ClipboardList,
    title: "Match & shortlist",
    desc: "AI Course Matcher suggests 8–12 best-fit universities across India and overseas. Counselor reviews, student approves — all in-platform.",
    color: "#f59e0b",
  },
  {
    n: "03",
    icon: Send,
    title: "Apply & track",
    desc: "Auto-generated document checklists, SOP builder, and one-click application submission to partner universities. Status updates in real time.",
    color: "#0f766e",
  },
  {
    n: "04",
    icon: GraduationCap,
    title: "Offer, visa, fly",
    desc: "Receive offers, accept online, file visa with the immigration module, and track the student through to enrolment day — all from one dashboard.",
    color: "#1c1410",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="relative py-16 sm:py-22 bg-[#1c1410] overflow-hidden"
    >
      {/* Decorative */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-[#e85d2f]/20 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-[#0f766e]/25 blur-3xl" />
        <div className="absolute inset-0 bg-grid-faint opacity-[0.08]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-semibold text-[#f59e0b]">
            How It Works
          </div>
          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            From inquiry to enrolment in{" "}
            <span className="text-gradient-brand">four elegant steps</span>.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            The average consultant juggles 14 tools to move one student through
            the funnel. EduConnect India compresses that into a single, beautiful
            workflow — so your team can spend time on students, not on software.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="reveal relative rounded-3xl bg-white/[0.04] backdrop-blur ring-1 ring-white/10 p-7 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl font-extrabold text-white/10">{s.n}</span>
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: `${s.color}26`, color: s.color }}
                >
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/65">
                {s.desc}
              </p>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 z-10 h-6 w-6 -translate-y-1/2">
                  <div className="h-px w-6 bg-gradient-to-r from-white/40 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
