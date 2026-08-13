"use client";

import { Globe2, MapPin, ArrowUpRight } from "lucide-react";

const COUNTRIES = [
  {
    flag: "🇮🇳",
    name: "India",
    count: 312,
    accent: "#e85d2f",
    univs: [
      "IIT Bombay",
      "IIM Ahmedabad",
      "BITS Pilani",
      "Delhi University",
      "Christ University",
      "Symbiosis Pune",
      "VIT Vellore",
      "Amrita Coimbatore",
    ],
  },
  {
    flag: "🇬🇧",
    name: "United Kingdom",
    count: 184,
    accent: "#0f766e",
    univs: [
      "University of Oxford",
      "UCL London",
      "University of Manchester",
      "University of Edinburgh",
      "King's College London",
      "University of Warwick",
    ],
  },
  {
    flag: "🇺🇸",
    name: "United States",
    count: 226,
    accent: "#f59e0b",
    univs: [
      "MIT",
      "Stanford University",
      "Carnegie Mellon",
      "Purdue University",
      "Arizona State University",
      "Northeastern University",
    ],
  },
  {
    flag: "🇨🇦",
    name: "Canada",
    count: 142,
    accent: "#e85d2f",
    univs: [
      "University of Toronto",
      "UBC Vancouver",
      "McGill University",
      "University of Waterloo",
      "Western University",
      "York University",
    ],
  },
  {
    flag: "🇦🇺",
    name: "Australia",
    count: 118,
    accent: "#0f766e",
    univs: [
      "University of Melbourne",
      "Monash University",
      "UNSW Sydney",
      "University of Queensland",
      "University of Adelaide",
      "RMIT",
    ],
  },
  {
    flag: "🇮🇪",
    name: "Ireland",
    count: 38,
    accent: "#f59e0b",
    univs: [
      "Trinity College Dublin",
      "University College Dublin",
      "Dublin City University",
      "University of Galway",
    ],
  },
  {
    flag: "🇩🇪",
    name: "Germany",
    count: 28,
    accent: "#e85d2f",
    univs: [
      "TU Munich",
      "RWTH Aachen",
      "Heidelberg University",
      "Humboldt University Berlin",
    ],
  },
  {
    flag: "🇸🇬",
    name: "Singapore",
    count: 0,
    accent: "#0f766e",
    univs: [],
  },
];

export default function Partners() {
  return (
    <section
      id="partners"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="reveal max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-[#0f766e]">
            <Globe2 className="h-3.5 w-3.5" />
            Partner Universities
          </div>
          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1c1410]">
            1,048 partner institutions across{" "}
            <span className="text-gradient-brand">32 countries</span>.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#4b3d33]">
            From the IITs and IIMs at home to Oxford, MIT, Toronto, and Monash
            abroad — EduConnect India has direct commission agreements and
            application integrations with the institutions your students
            actually want to attend. New partnerships are added every quarter.
          </p>
        </div>

        {/* Country cards */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {COUNTRIES.filter((c) => c.univs.length > 0).map((c, i) => (
            <div
              key={c.name}
              className="reveal group relative overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ transitionDelay: `${(i % 4) * 60}ms` }}
            >
              {/* Top: flag + count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl leading-none">{c.flag}</span>
                  <div>
                    <div className="text-base font-bold text-[#1c1410]">{c.name}</div>
                    <div className="text-xs text-[#7a6a5d]">{c.count} partners</div>
                  </div>
                </div>
                <ArrowUpRight
                  className="h-5 w-5 text-[#7a6a5d] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: c.accent }}
                />
              </div>

              {/* Divider */}
              <div
                className="mt-4 h-1 w-12 rounded-full"
                style={{ background: c.accent }}
              />

              {/* University list */}
              <ul className="mt-4 space-y-2">
                {c.univs.slice(0, 5).map((u) => (
                  <li
                    key={u}
                    className="flex items-center gap-2 text-[13px] text-[#3a2e26]"
                  >
                    <span
                      className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: c.accent }}
                    />
                    {u}
                  </li>
                ))}
                {c.univs.length > 5 && (
                  <li className="text-[12px] font-semibold text-[#7a6a5d] pl-3.5">
                    + {c.univs.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Become a partner banner */}
        <div className="reveal mt-10 rounded-3xl bg-gradient-to-r from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-8 sm:p-10 ring-1 ring-white/10 overflow-hidden relative">
          <div aria-hidden className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#e85d2f]/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#0f766e]/30 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#f59e0b]">
                <MapPin className="h-3.5 w-3.5" />
                For Universities
              </div>
              <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white">
                Are you a university looking to recruit Indian students?
              </h3>
              <p className="mt-2 text-white/70 max-w-2xl">
                Join our partner network and get direct access to 48,000+
                pre-qualified Indian applicants every year. Manage applications,
                issue offer letters, and track enrolment — all from a free
                partner portal.
              </p>
            </div>
            <a href="#contact">
              <button className="shrink-0 rounded-full bg-white px-6 h-12 text-[#1c1410] font-semibold hover:bg-orange-50 transition-colors shadow-lg">
                Become a Partner
                <ArrowUpRight className="inline ml-2 h-4 w-4" />
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
