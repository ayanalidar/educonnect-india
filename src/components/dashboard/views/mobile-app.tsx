// Mobile App Preview — simulated iOS/Android app screens

"use client";

import { useState } from "react";
import {
  Smartphone, Bell, Users, MessageCircle, FolderCheck, GraduationCap,
  ArrowRight, Sparkles, FileSearch, Plane, Wallet, Settings, LogOut,
  TrendingUp, ChevronLeft, Search,
} from "lucide-react";
import { Card } from "@/components/dashboard/_ui";

type Screen = "home" | "students" | "applications" | "chat" | "documents";

export default function MobileAppView() {
  const [device, setDevice] = useState<"iphone" | "android">("iphone");
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#0f766e]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#e85d2f]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f766e] via-[#14b8a6] to-[#0ea5e9] shadow-xl">
            <Smartphone className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#14b8a6]">
              <Sparkles className="h-3 w-3" />
              Mobile Apps · iOS + Android · Coming Q2 2027
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">EduConnect India in your pocket</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Counselors get a native iOS + Android app with offline mode, push notifications, and on-the-go document
              capture. Parents get a separate experience. Below is a live preview — tap around!
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Phone preview */}
        <div className="lg:col-span-7">
          <Card className="p-6 flex flex-col items-center">
            {/* Device toggle */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setDevice("iphone")}
                className={`rounded-full px-4 h-9 text-xs font-semibold transition-colors ${
                  device === "iphone" ? "bg-[#1c1410] text-white" : "bg-white ring-1 ring-orange-200 text-[#7a6a5d]"
                }`}
              >
                📱 iPhone
              </button>
              <button
                onClick={() => setDevice("android")}
                className={`rounded-full px-4 h-9 text-xs font-semibold transition-colors ${
                  device === "android" ? "bg-[#1c1410] text-white" : "bg-white ring-1 ring-orange-200 text-[#7a6a5d]"
                }`}
              >
                🤖 Android
              </button>
            </div>

            {/* Phone frame */}
            <div
              className={`relative ${
                device === "iphone" ? "rounded-[3rem] border-[14px] border-[#1c1410]" : "rounded-[2rem] border-[10px] border-[#1c1410]"
              } bg-[#1c1410] shadow-2xl w-[340px] h-[680px] overflow-hidden`}
            >
              {/* Notch (iPhone) */}
              {device === "iphone" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1c1410] rounded-b-2xl z-30" />
              )}
              {/* Status bar */}
              <div className="absolute top-0 inset-x-0 h-8 bg-[#1c1410] text-white text-[10px] flex items-center justify-between px-6 z-20">
                <span>9:41</span>
                <span>● ● ●  100%</span>
              </div>

              {/* Screen content */}
              <div className="absolute top-8 inset-x-0 bottom-0 bg-[#fff8f1] overflow-hidden flex flex-col">
                <PhoneScreen screen={screen} setScreen={setScreen} />
              </div>
            </div>

            {/* Screen selector */}
            <div className="mt-6 flex items-center gap-2 flex-wrap justify-center">
              {[
                { id: "home", label: "Home", icon: TrendingUp },
                { id: "students", label: "Students", icon: Users },
                { id: "applications", label: "Applications", icon: FolderCheck },
                { id: "chat", label: "Messages", icon: MessageCircle },
                { id: "documents", label: "Documents", icon: FileSearch },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScreen(s.id as Screen)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-[11px] font-semibold transition-colors ${
                    screen === s.id ? "bg-[#e85d2f] text-white" : "bg-white ring-1 ring-orange-200 text-[#7a6a5d] hover:bg-orange-50"
                  }`}
                >
                  <s.icon className="h-3 w-3" />
                  {s.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Features list */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5">
            <h3 className="text-base font-bold text-[#1c1410] mb-3">App features</h3>
            <div className="space-y-3">
              {[
                { icon: Users, color: "#e85d2f", title: "Student CRM on the go", desc: "View leads, assign counselors, update status — anywhere, anytime." },
                { icon: FileSearch, color: "#0ea5e9", title: "Document capture", desc: "Snap a photo of any document → OCR auto-extracts fields → saves to student." },
                { icon: Bell, color: "#f59e0b", title: "Push notifications", desc: "Instant alerts for new leads, offers, deadline escalations, parent messages." },
                { icon: MessageCircle, color: "#22c55e", title: "WhatsApp + Email in-app", desc: "Reply to students without leaving the app. Templates + voice notes." },
                { icon: Plane, color: "#a855f7", title: "Visa tracker", desc: "Track every visa stage. Upload docs. Get notified before appointments." },
                { icon: Sparkles, color: "#0f766e", title: "AI Course Matcher", desc: "Pull out your phone during a walk-in → instant university recommendations." },
                { icon: Wallet, color: "#ec4899", title: "Razorpay payments", desc: "Collect fees via UPI, share invoices, track commissions from phone." },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                    style={{ background: `${f.color}1a`, color: f.color }}
                  >
                    <f.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-[#1c1410]">{f.title}</div>
                    <div className="text-[11px] text-[#7a6a5d] leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-[#0f766e]/10 to-[#14b8a6]/10 ring-1 ring-emerald-200">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f766e] text-white">
                <Smartphone className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-[#1c1410]">Get early access</div>
                <div className="text-[11px] text-[#7a6a5d]">Beta launching Q2 2027. Join the waitlist today.</div>
              </div>
            </div>
            <button className="mt-3 w-full h-10 rounded-full bg-[#0f766e] text-white text-xs font-semibold hover:bg-[#0b5750] flex items-center justify-center gap-2">
              Join the waitlist <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PhoneScreen({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  if (screen === "home") {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1c1410] to-[#2a1d15] text-white p-4 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#f59e0b]">Welcome back</div>
              <div className="text-sm font-bold">Rajesh Mehta</div>
            </div>
            <div className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#e85d2f] ring-2 ring-[#1c1410]" />
            </div>
          </div>
          <div className="text-[11px] text-white/70">Mumbai Central Branch</div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-2">
            <MiniKpi label="Students" value="13" color="#e85d2f" />
            <MiniKpi label="Offers" value="2" color="#22c55e" />
            <MiniKpi label="Visas" value="3" color="#a855f7" />
            <MiniKpi label="Revenue" value="₹38L" color="#0f766e" />
          </div>

          {/* Today's tasks */}
          <div className="bg-white rounded-xl p-3 ring-1 ring-orange-100">
            <div className="text-[10px] font-bold uppercase text-[#7a6a5d] mb-2">Today's tasks</div>
            {[
              { t: "Manchester application deadline", c: "#dc2626", d: "1d left" },
              { t: "Visa interview — Monash", c: "#f59e0b", d: "5d left" },
              { t: "Submit SOP — TUM Munich", c: "#0ea5e9", d: "9d left" },
            ].map((task) => (
              <div key={task.t} className="flex items-center gap-2 py-1.5 border-t border-orange-50 first:border-0">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: task.c }} />
                <div className="flex-1 text-[10px] font-medium text-[#1c1410] truncate">{task.t}</div>
                <div className="text-[9px] font-bold text-[#7a6a5d]">{task.d}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Users, label: "Add", color: "#e85d2f" },
              { icon: MessageCircle, label: "Chat", color: "#22c55e" },
              { icon: FileSearch, label: "Scan", color: "#0ea5e9" },
              { icon: Sparkles, label: "Match", color: "#a855f7" },
            ].map((a) => (
              <button key={a.label} className="bg-white rounded-xl p-2 ring-1 ring-orange-100 flex flex-col items-center gap-1">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${a.color}1a`, color: a.color }}>
                  <a.icon className="h-4 w-4" />
                </span>
                <span className="text-[9px] font-semibold text-[#3a2e26]">{a.label}</span>
              </button>
            ))}
          </div>

          {/* Recent */}
          <div className="bg-white rounded-xl p-3 ring-1 ring-orange-100">
            <div className="text-[10px] font-bold uppercase text-[#7a6a5d] mb-2">Recent activity</div>
            {[
              { n: "Aarav Sharma", s: "Manchester — OFFERED", c: "#22c55e" },
              { n: "Diya Patel", s: "IIT Bombay — DRAFT", c: "#f59e0b" },
              { n: "Kavya Krishnan", s: "Warwick — SUBMITTED", c: "#0ea5e9" },
            ].map((r) => (
              <div key={r.n} className="flex items-center gap-2 py-1.5 border-t border-orange-50 first:border-0">
                <span className="h-7 w-7 rounded-full shrink-0" style={{ background: r.c }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-[#1c1410] truncate">{r.n}</div>
                  <div className="text-[9px] text-[#7a6a5d] truncate">{r.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <PhoneNav screen={screen} setScreen={setScreen} />
      </div>
    );
  }

  if (screen === "students") {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white p-3 ring-1 ring-orange-100">
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-[#7a6a5d]" />
            <div className="text-sm font-bold text-[#1c1410]">Students</div>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-full bg-[#fff8f1] px-3 h-8">
            <Search className="h-3.5 w-3.5 text-[#7a6a5d]" />
            <input placeholder="Search…" className="flex-1 bg-transparent text-[11px] focus:outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {[
            { n: "Aarav Sharma", c: "Mumbai → UK", s: "APPLIED", color: "#e85d2f" },
            { n: "Diya Patel", c: "Ahmedabad → India", s: "SHORTLISTED", color: "#0ea5e9" },
            { n: "Ishaan Reddy", c: "Hyderabad → AU", s: "OFFERED", color: "#22c55e" },
            { n: "Ananya Iyer", c: "Chennai → CA", s: "APPLIED", color: "#e85d2f" },
            { n: "Vikram Nair", c: "Bengaluru → US", s: "APPLIED", color: "#e85d2f" },
            { n: "Sneha Gupta", c: "Delhi → DE", s: "SHORTLISTED", color: "#0ea5e9" },
            { n: "Rohan Desai", c: "Pune → IE", s: "ENROLLED", color: "#0f766e" },
          ].map((s, i) => (
            <div key={s.n} className="bg-white rounded-xl p-2.5 ring-1 ring-orange-100 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white text-[10px] font-bold shrink-0" style={{ background: ["#e85d2f", "#0f766e", "#f59e0b", "#a855f7", "#0ea5e9"][i % 5] }}>
                {s.n.split(" ").map((w) => w[0]).join("")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-[#1c1410] truncate">{s.n}</div>
                <div className="text-[9px] text-[#7a6a5d] truncate">{s.c}</div>
              </div>
              <span className="text-[8px] font-bold uppercase rounded-full px-1.5 py-0.5" style={{ background: `${s.color}20`, color: s.color }}>
                {s.s}
              </span>
            </div>
          ))}
        </div>
        <PhoneNav screen={screen} setScreen={setScreen} />
      </div>
    );
  }

  if (screen === "applications") {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white p-3 ring-1 ring-orange-100">
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-[#7a6a5d]" />
            <div className="text-sm font-bold text-[#1c1410]">Applications</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {[
            { u: "University of Oxford", s: "Aarav Sharma", st: "SUBMITTED", c: "#0f766e" },
            { u: "University of Cambridge", s: "Aarav Sharma", st: "DRAFT", c: "#94a3b8" },
            { u: "University of Manchester", s: "Aarav Sharma", st: "OFFERED", c: "#22c55e" },
            { u: "Purdue University", s: "Meera Joshi", st: "SUBMITTED", c: "#e85d2f" },
            { u: "Arizona State University", s: "Meera Joshi", st: "UNDER_REVIEW", c: "#a855f7" },
            { u: "Monash University", s: "Ishaan Reddy", st: "OFFERED", c: "#22c55e" },
          ].map((a, i) => (
            <div key={i} className="bg-white rounded-xl p-3 ring-1 ring-orange-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white text-[9px] font-bold" style={{ background: a.c }}>
                  {a.u.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-[#1c1410] truncate">{a.u}</div>
                  <div className="text-[9px] text-[#7a6a5d]">{a.s}</div>
                </div>
                <span className="text-[8px] font-bold uppercase rounded-full px-1.5 py-0.5" style={{ background: `${a.c}20`, color: a.c }}>
                  {a.st}
                </span>
              </div>
            </div>
          ))}
        </div>
        <PhoneNav screen={screen} setScreen={setScreen} />
      </div>
    );
  }

  if (screen === "chat") {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white p-3 ring-1 ring-orange-100">
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-[#7a6a5d]" />
            <div className="text-sm font-bold text-[#1c1410]">Messages</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {[
            { from: "them", text: "Hi Rajesh, just checking on Aarav's Manchester application status?" },
            { from: "me", text: "Hi Mr. Sharma! Just submitted yesterday. Should hear back in 2-3 weeks." },
            { from: "them", text: "Wonderful! When do we start the visa process?" },
            { from: "me", text: "Once we have the offer letter. I'll schedule a visa prep call this week." },
            { from: "them", text: "Perfect, thank you. Also, did you receive the bank statement I uploaded?" },
          ].map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-[10px] ${
                  m.from === "me"
                    ? "bg-[#e85d2f] text-white rounded-br-md"
                    : "bg-white text-[#1c1410] rounded-bl-md ring-1 ring-orange-100"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 bg-white ring-1 ring-orange-100 flex items-center gap-2">
          <input placeholder="Type a message…" className="flex-1 bg-[#fff8f1] rounded-full px-3 h-8 text-[10px] focus:outline-none" />
          <button className="h-8 w-8 rounded-full bg-[#e85d2f] text-white flex items-center justify-center">
            <MessageCircle className="h-3.5 w-3.5" />
          </button>
        </div>
        <PhoneNav screen={screen} setScreen={setScreen} />
      </div>
    );
  }

  if (screen === "documents") {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white p-3 ring-1 ring-orange-100">
          <div className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4 text-[#7a6a5d]" />
            <div className="text-sm font-bold text-[#1c1410]">Documents</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Scan CTA */}
          <button className="w-full bg-gradient-to-br from-[#0ea5e9] to-[#a855f7] text-white rounded-xl p-4 flex items-center gap-3">
            <FileSearch className="h-6 w-6" />
            <div className="text-left">
              <div className="text-xs font-bold">Scan a document</div>
              <div className="text-[9px] text-white/80">OCR auto-extracts fields in seconds</div>
            </div>
          </button>

          <div className="text-[10px] font-bold uppercase text-[#7a6a5d]">Recent documents</div>
          {[
            { n: "passport_aarav.pdf", t: "Passport", c: 98, color: "#e85d2f" },
            { n: "ielts_aarav.pdf", t: "IELTS Cert", c: 95, color: "#f59e0b" },
            { n: "transcript_diya.pdf", t: "Transcript", c: 87, color: "#0f766e" },
            { n: "sop_meera.docx", t: "SOP", c: 78, color: "#a855f7" },
            { n: "bank_statement.pdf", t: "Bank Statement", c: 92, color: "#22c55e" },
          ].map((d) => (
            <div key={d.n} className="bg-white rounded-xl p-2.5 ring-1 ring-orange-100">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs" style={{ background: `${d.color}1a` }}>
                  📄
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-[#1c1410] truncate">{d.n}</div>
                  <div className="text-[9px] text-[#7a6a5d]">{d.t} · {d.c}% confidence</div>
                </div>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-[#fff8f1] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${d.c}%`, background: d.c > 70 ? "#22c55e" : "#f59e0b" }} />
              </div>
            </div>
          ))}
        </div>
        <PhoneNav screen={screen} setScreen={setScreen} />
      </div>
    );
  }

  return null;
}

function PhoneNav({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const items: { id: Screen; icon: React.ElementType; label: string }[] = [
    { id: "home", icon: TrendingUp, label: "Home" },
    { id: "students", icon: Users, label: "Students" },
    { id: "applications", icon: FolderCheck, label: "Apps" },
    { id: "chat", icon: MessageCircle, label: "Chat" },
    { id: "documents", icon: FileSearch, label: "Docs" },
  ];
  return (
    <div className="bg-white border-t border-orange-100 flex items-center justify-around py-2">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => setScreen(it.id)}
          className={`flex flex-col items-center gap-0.5 px-2 ${screen === it.id ? "text-[#e85d2f]" : "text-[#7a6a5d]"}`}
        >
          <it.icon className="h-4 w-4" />
          <span className="text-[8px] font-semibold">{it.label}</span>
        </button>
      ))}
    </div>
  );
}

function MiniKpi({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-2.5 ring-1 ring-orange-100">
      <div className="text-[9px] font-bold uppercase text-[#7a6a5d]">{label}</div>
      <div className="text-base font-extrabold leading-none mt-1" style={{ color }}>{value}</div>
    </div>
  );
}
