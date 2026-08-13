// Country Guides Library dashboard view
// Made & maintained by GuardianX

"use client";

import { useEffect, useState } from "react";
import {
  Globe2, MapPin, DollarSign, Clock, Briefcase, GraduationCap,
  Plane, FileText, Search, X, ChevronRight, Sparkles,
} from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner } from "@/components/dashboard/_ui";

type Guide = {
  id: string;
  country: string;
  flag: string;
  capital: string;
  currency: string;
  language: string;
  visaType: string;
  visaProcessingTime: string;
  visaFee: string;
  intakeMonths: string;
  avgTuition: string;
  avgLivingCost: string;
  workWhileStudying: string;
  postStudyVisa: string;
  popularPrograms: string;
  topUniversities: string;
  description: string;
  heroColor: string;
};

export default function CountryGuidesView() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Guide | null>(null);

  useEffect(() => {
    apiFetch("/api/country-guides").then((d) => setGuides(d.guides)).finally(() => setLoading(false));
  }, []);

  const filtered = q
    ? guides.filter((g) => g.country.toLowerCase().includes(q.toLowerCase()) || g.popularPrograms.toLowerCase().includes(q.toLowerCase()))
    : guides;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#0f766e]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#0ea5e9]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f766e] via-[#0ea5e9] to-[#a855f7] shadow-xl">
            <Globe2 className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#14b8a6]">
              <Sparkles className="h-3 w-3" />
              Country Guides Library · SEO-optimized landing pages
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Everything about studying in {guides.length} countries</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Visa types, processing times, fees, intakes, tuition, living costs, work rights, post-study visas, top universities.
              Share these guides with students — each one is auto-published as an SEO landing page on your website.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-full bg-white ring-1 ring-orange-200 px-3.5 h-10 max-w-md">
        <Search className="h-4 w-4 text-[#7a6a5d]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by country or program…"
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <Card className="p-12 text-center"><Spinner className="mx-auto" /></Card>
      ) : filtered.length === 0 ? (
        <Empty title="No country guides" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelected(g)}
              className="text-left rounded-3xl bg-white ring-1 ring-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group"
            >
              {/* Hero strip */}
              <div
                className="h-24 relative flex items-end p-4"
                style={{ background: `linear-gradient(135deg, ${g.heroColor}, ${g.heroColor}cc)` }}
              >
                <div className="absolute top-3 right-3 text-4xl">{g.flag}</div>
                <div className="text-white">
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Study in</div>
                  <div className="text-lg font-extrabold leading-tight">{g.country}</div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <p className="text-xs text-[#7a6a5d] leading-relaxed line-clamp-2">{g.description}</p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#7a6a5d]" />
                    <span className="text-[#3a2e26]">{g.visaProcessingTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-[#7a6a5d]" />
                    <span className="text-[#3a2e26] truncate">{g.avgTuition.split("/")[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-[#7a6a5d]" />
                    <span className="text-[#3a2e26] truncate">{g.workWhileStudying.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Plane className="h-3 w-3 text-[#7a6a5d]" />
                    <span className="text-[#3a2e26]">{g.intakeMonths}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-orange-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f766e]">{g.visaType}</span>
                  <span className="text-[10px] font-semibold text-[#e85d2f] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    View guide <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && <GuideModal guide={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function GuideModal({ guide: g, onClose }: { guide: Guide; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1c1410]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100">
        {/* Hero */}
        <div
          className="h-32 relative flex items-end p-6"
          style={{ background: `linear-gradient(135deg, ${g.heroColor}, ${g.heroColor}cc)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute top-4 right-16 text-5xl">{g.flag}</div>
          <div className="text-white">
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Study in</div>
            <div className="text-2xl font-extrabold">{g.country}</div>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <p className="text-sm text-[#3a2e26] leading-relaxed">{g.description}</p>

          {/* Key facts grid */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Fact icon={MapPin} label="Capital" value={g.capital} color="#e85d2f" />
            <Fact icon={DollarSign} label="Currency" value={g.currency} color="#0f766e" />
            <Fact icon={Globe2} label="Language" value={g.language} color="#0ea5e9" />
            <Fact icon={Clock} label="Intakes" value={g.intakeMonths} color="#f59e0b" />
          </div>

          {/* Visa section */}
          <h3 className="mt-6 text-sm font-bold text-[#1c1410] flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#e85d2f]" /> Visa Requirements
          </h3>
          <div className="mt-2 space-y-2">
            <Row label="Visa type" value={g.visaType} />
            <Row label="Processing time" value={g.visaProcessingTime} />
            <Row label="Visa fee" value={g.visaFee} />
            <Row label="Post-study work visa" value={g.postStudyVisa} />
          </div>

          {/* Costs */}
          <h3 className="mt-5 text-sm font-bold text-[#1c1410] flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[#0f766e]" /> Costs & Work
          </h3>
          <div className="mt-2 space-y-2">
            <Row label="Avg tuition" value={g.avgTuition} />
            <Row label="Avg living cost" value={g.avgLivingCost} />
            <Row label="Work while studying" value={g.workWhileStudying} />
          </div>

          {/* Programs + Universities */}
          <h3 className="mt-5 text-sm font-bold text-[#1c1410] flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#a855f7]" /> Programs & Universities
          </h3>
          <div className="mt-2 space-y-2">
            <Row label="Popular programs" value={g.popularPrograms} />
            <Row label="Top universities" value={g.topUniversities} />
          </div>

          <div className="mt-6 flex gap-2">
            <a
              href={`https://educonnect.in/guides/${g.country.toLowerCase().replace(/\s+/g, "-")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-10 rounded-full bg-[#1c1410] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#e85d2f] transition-colors"
            >
              <Globe2 className="h-4 w-4" /> View live landing page
            </a>
            <button className="rounded-full bg-[#fff8f1] text-[#7a6a5d] px-4 h-10 text-sm font-semibold hover:bg-orange-100">
              Share with student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fact({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl bg-[#fff8f1] p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#7a6a5d]">
        <Icon className="h-3 w-3" style={{ color }} /> {label}
      </div>
      <div className="mt-1 text-sm font-bold text-[#1c1410]">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-orange-50 last:border-0">
      <span className="text-xs font-semibold text-[#7a6a5d]">{label}</span>
      <span className="text-xs text-[#1c1410] text-right max-w-[60%]">{value}</span>
    </div>
  );
}
