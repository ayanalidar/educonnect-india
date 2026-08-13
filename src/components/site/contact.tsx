"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const OFFICES = [
  {
    city: "Mumbai",
    address: "5th Floor, Trade Centre, Bandra Kurla Complex, Mumbai 400051",
    phone: "+91 22 6824 1900",
    hours: "Mon–Sat · 9:30 AM – 7:00 PM IST",
    color: "#e85d2f",
  },
  {
    city: "Delhi NCR",
    address: "Tower B, Cyberhub, Sector 24, Gurugram 122002",
    phone: "+91 124 468 2200",
    hours: "Mon–Sat · 9:30 AM – 7:00 PM IST",
    color: "#0f766e",
  },
  {
    city: "Bengaluru",
    address: "Prestige Atlanta, 80 Feet Road, Koramangala, Bengaluru 560095",
    phone: "+91 80 4665 8800",
    hours: "Mon–Sat · 9:30 AM – 7:00 PM IST",
    color: "#f59e0b",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formEl = e.target as HTMLFormElement;
    const fd = new FormData(formEl);
    const payload = {
      fullName: fd.get("fullName") as string,
      consultancy: fd.get("consultancy") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      studentCount: fd.get("studentCount") as string,
      interest: fd.get("interest") as string,
    };

    try {
      // Persist to backend (Lead model)
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => null); // don't block UX if it fails

      await new Promise((r) => setTimeout(r, 600));

      setSubmitted(true);
      toast({
        title: "Thank you — we'll be in touch!",
        description:
          "An EduConnect specialist will reach out within 1 business hour to schedule your demo.",
      });
      formEl.reset();
      setTimeout(() => setSubmitted(false), 6000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-16 sm:py-22 bg-brand-cream">
      <div aria-hidden className="absolute inset-0 bg-dot-grid opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: copy + offices */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#c8451a]">
              <Mail className="h-3.5 w-3.5" />
              Contact Us
            </div>
            <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1c1410]">
              Let's get your consultancy{" "}
              <span className="text-gradient-brand">on EduConnect</span>.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#4b3d33]">
              Book a personalized 30-minute demo, ask about partner
              universities, or just say hello. Our team responds within one
              business hour — and yes, a real human reads every message.
            </p>

            {/* Quick contact rows */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <a
                href="mailto:hello@educonnect.in"
                className="rounded-2xl bg-white p-4 ring-1 ring-orange-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Mail className="h-5 w-5 text-[#e85d2f]" />
                <div className="mt-2 text-xs font-semibold text-[#7a6a5d]">
                  Email us
                </div>
                <div className="text-sm font-bold text-[#1c1410]">
                  hello@educonnect.in
                </div>
              </a>
              <a
                href="tel:+912268241900"
                className="rounded-2xl bg-white p-4 ring-1 ring-orange-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Phone className="h-5 w-5 text-[#0f766e]" />
                <div className="mt-2 text-xs font-semibold text-[#7a6a5d]">
                  Call us
                </div>
                <div className="text-sm font-bold text-[#1c1410]">
                  +91 22 6824 1900
                </div>
              </a>
            </div>

            {/* Offices */}
            <div className="mt-8 space-y-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a6a5d]">
                Our Offices
              </div>
              {OFFICES.map((o) => (
                <div
                  key={o.city}
                  className="rounded-2xl bg-white p-5 ring-1 ring-orange-100 shadow-sm flex gap-4"
                >
                  <div
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white font-bold"
                    style={{ background: o.color }}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-base font-bold text-[#1c1410]">
                        {o.city}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#7a6a5d]">
                        <Clock className="h-3 w-3" />
                        {o.hours}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-[#3a2e26]">{o.address}</div>
                    <div className="mt-1 text-sm font-semibold text-[#e85d2f]">
                      {o.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="reveal lg:sticky lg:top-28">
            <div className="rounded-3xl bg-white p-7 sm:p-8 shadow-2xl shadow-orange-900/10 ring-1 ring-orange-100">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white shadow-lg">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1c1410]">
                    Book a free demo
                  </h3>
                  <p className="text-sm text-[#7a6a5d]">
                    30 min · No commitment · Real product walkthrough
                  </p>
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name" required>
                    <Input
                      name="fullName"
                      required
                      placeholder="Aarav Sharma"
                      className="h-11 rounded-xl border-orange-200 focus-visible:ring-[#e85d2f]"
                    />
                  </Field>
                  <Field label="Consultancy name" required>
                    <Input
                      name="consultancy"
                      required
                      placeholder="Global Pathways"
                      className="h-11 rounded-xl border-orange-200 focus-visible:ring-[#e85d2f]"
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Work email" required>
                    <Input
                      type="email"
                      name="email"
                      required
                      placeholder="aarav@globalpathways.in"
                      className="h-11 rounded-xl border-orange-200 focus-visible:ring-[#e85d2f]"
                    />
                  </Field>
                  <Field label="Phone (WhatsApp)" required>
                    <Input
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      className="h-11 rounded-xl border-orange-200 focus-visible:ring-[#e85d2f]"
                    />
                  </Field>
                </div>

                <Field label="How many students do you manage annually?">
                  <Input
                    name="studentCount"
                    placeholder="e.g. 200–500"
                    className="h-11 rounded-xl border-orange-200 focus-visible:ring-[#e85d2f]"
                  />
                </Field>

                <Field label="What are you most interested in?">
                  <Textarea
                    name="interest"
                    placeholder="AI Course Matcher, Visa module, partner universities in UK/Canada…"
                    className="rounded-xl border-orange-200 focus-visible:ring-[#e85d2f] min-h-[96px]"
                  />
                </Field>

                <Button
                  type="submit"
                  disabled={submitting || submitted}
                  className="w-full h-12 rounded-full bg-[#e85d2f] hover:bg-[#c8451a] text-white text-base font-semibold shadow-lg shadow-orange-300/40 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Sending…
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Request received!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Book My Demo
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-[#7a6a5d]">
                  By submitting, you agree to our privacy policy. We never share
                  your data — and never spam.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">
        {label}
        {required && <span className="text-[#e85d2f]"> *</span>}
      </span>
      {children}
    </label>
  );
}
