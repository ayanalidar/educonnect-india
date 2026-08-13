"use client";

import { Target, HeartHandshake, Sparkles, Building2 } from "lucide-react";

const MILESTONES = [
  {
    year: "2019",
    title: "Founded in Mumbai",
    desc: "Started as a 4-person team helping local counselors digitize paper files.",
  },
  {
    year: "2021",
    title: "First 100 partner universities",
    desc: "Signed direct partnerships across India, UK, Australia, and Canada.",
  },
  {
    year: "2023",
    title: "Launched Visa & Compliance module",
    desc: "End-to-end visa tracker with interview prep and document checklist engine.",
  },
  {
    year: "2024",
    title: "Crossed 1,000 partner universities",
    desc: "Now serving 480+ consultancies with 48,000+ student placements.",
  },
  {
    year: "2026",
    title: "AI Course Matcher goes live",
    desc: "ML model recommends best-fit programs from student profile, scores, and budget.",
  },
];

const VALUES = [
  {
    icon: Target,
    title: "Mission",
    desc: "Empower every Indian education consultant — from a 2-person office in Tier-3 cities to a 200-counselor enterprise — to operate with the rigor, data, and reach of a global firm.",
    color: "#e85d2f",
  },
  {
    icon: HeartHandshake,
    title: "Values",
    desc: "Student outcomes above all. We obsess over the moment a student gets an offer letter, and build every feature backwards from that moment of joy.",
    color: "#0f766e",
  },
  {
    icon: Sparkles,
    title: "Promise",
    desc: "Software that feels light, support that feels personal. Every customer gets a dedicated onboarding manager for the first 90 days — no exceptions.",
    color: "#f59e0b",
  },
];

export default function Company() {
  return (
    <section id="company" className="relative py-16 sm:py-22">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="reveal max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-[#0f766e]">
            <Building2 className="h-3.5 w-3.5" />
            Our Company
          </div>
          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1c1410]">
            Built by educators, for educators —{" "}
            <span className="text-gradient-brand">rooted in India</span>, ready for
            the world.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#4b3d33]">
            EduConnect India was founded in 2019 by a team of former counselors,
            university admissions officers, and product engineers who lived the
            pain of running a consultancy on spreadsheets and WhatsApp. We
            believed Indian students deserved a smarter, more transparent path to
            global education — and that the consultants who guide them deserved
            better tools. Today we power 480+ consultancies, 48,000+ student
            placements, and partnerships with 1,048 universities across 32
            countries.
          </p>
        </div>

        {/* Values grid */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="reveal group rounded-3xl bg-white p-7 ring-1 ring-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ transitionDelay: "60ms" }}
            >
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: `${v.color}1a`, color: v.color }}
              >
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1c1410]">{v.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[#4b3d33]">
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mt-14 reveal">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e85d2f]">
              Our Journey
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
          </div>

          <div className="relative">
            {/* horizontal line */}
            <div className="absolute left-0 right-0 top-[26px] hidden md:block h-0.5 bg-gradient-to-r from-[#e85d2f]/30 via-[#f59e0b]/40 to-[#0f766e]/30" />

            <div className="grid md:grid-cols-5 gap-8 md:gap-4">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="relative">
                  <div className="flex md:flex-col md:items-center gap-4 md:gap-0 md:text-center">
                    <div
                      className="relative z-10 inline-flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-white ring-4 ring-white shadow-md"
                      style={{
                        background:
                          i % 2 === 0
                            ? "linear-gradient(135deg, #e85d2f, #f59e0b)"
                            : "linear-gradient(135deg, #0f766e, #14b8a6)",
                      }}
                    >
                      <span className="text-white text-[11px] font-extrabold">
                        {m.year.slice(2)}
                      </span>
                    </div>
                    <div className="md:mt-5">
                      <div className="text-xs font-bold uppercase tracking-wide text-[#7a6a5d]">
                        {m.year}
                      </div>
                      <div className="mt-0.5 text-[15px] font-bold text-[#1c1410]">
                        {m.title}
                      </div>
                      <div className="mt-1.5 text-[13px] leading-snug text-[#4b3d33] md:px-1">
                        {m.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
