"use client";

import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "We moved 14 counselors and 2,800 active students onto EduConnect in three weeks. Our application-to-enrolment conversion jumped from 61% to 88% in the first intake cycle. The WhatsApp integration alone saves my team 30 hours a week.",
    name: "Rajesh Mehta",
    role: "Founder & Director",
    org: "Global Pathways Consultancy, Mumbai",
    initials: "RM",
    color: "#e85d2f",
  },
  {
    quote:
      "The AI Course Matcher is genuinely scary good. It shortlisted 9 universities for my student; she got offers from 7. We've never had that hit rate. The partner university database being kept current is what makes it work.",
    name: "Anjali Nair",
    role: "Senior Counselor",
    org: "BrightFutures Education, Kochi",
    initials: "AN",
    color: "#0f766e",
  },
  {
    quote:
      "As a 6-person consultancy in Indore, we used to think this kind of software was for the big players. EduConnect priced it for us, onboarded us in a week, and now we run like a 60-person firm. The GST invoicing module is a godsend.",
    name: "Sandeep Joshi",
    role: "Managing Partner",
    org: "Aspire Overseas, Indore",
    initials: "SJ",
    color: "#f59e0b",
  },
  {
    quote:
      "The visa module caught a missing financial-document issue 11 days before my student's UK visa appointment. That one save paid for the entire year's subscription. The dedicated onboarding manager actually picks up the phone.",
    name: "Priya Reddy",
    role: "Visa Head",
    org: "Hyderabad Global Edutech",
    initials: "PR",
    color: "#e85d2f",
  },
  {
    quote:
      "I run a small boutique consultancy and was skeptical about platform lock-in. The data export is clean, the API is well-documented, and support actually answers within hours. This is how SaaS should feel.",
    name: "Imran Sheikh",
    role: "Director",
    org: "FutureFound, Bengaluru",
    initials: "IS",
    color: "#0f766e",
  },
  {
    quote:
      "Our partner universities love the portal. They can review applications and issue offer letters without emailing back and forth. Three new UK partners signed with us this year just because our process looked more professional.",
    name: "Meera Krishnan",
    role: "Partnerships Lead",
    org: "Sterling Education, Chennai",
    initials: "MK",
    color: "#f59e0b",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-white via-[#fff8f1] to-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-xs font-semibold text-[#c8451a]">
            <Star className="h-3.5 w-3.5 fill-[#e85d2f] text-[#e85d2f]" />
            Loved by Consultants
          </div>
          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1c1410]">
            480+ consultancies.{" "}
            <span className="text-gradient-brand">48,000+ students placed.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#4b3d33]">
            From solo counselors in Tier-3 cities to 200-seat enterprises in
            Mumbai — EduConnect India powers the full spectrum of the Indian
            education consulting market. Here's what they say.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              className="reveal relative rounded-3xl bg-white p-7 ring-1 ring-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
            >
              <Quote
                className="absolute top-5 right-5 h-9 w-9 opacity-10"
                style={{ color: t.color }}
              />
              <div className="flex items-center gap-1 text-[#f59e0b]">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-[#f59e0b]" />
                ))}
              </div>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-[#3a2e26]">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white text-sm font-bold shadow-sm"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1c1410]">{t.name}</div>
                  <div className="text-xs text-[#7a6a5d]">
                    {t.role} · {t.org}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
