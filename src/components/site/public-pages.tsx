"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft, ExternalLink, Mail, Phone, MapPin, Shield, FileText, Code,
  Activity, CheckCircle2, Globe2, Zap, Award, TrendingUp, Users, Plane,
  MessageCircle, Wallet, BarChart3, Building2, Bell, Mic, Gift, Sparkles,
  Search, Calendar, Star, Briefcase, Heart, Target, Lock, Eye, Bug,
  Server, Database, Cloud, KeyRound, Fingerprint, ScanLine,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";

type PageKey =
  | "about" | "careers" | "press" | "blog" | "customer-stories" | "contact"
  | "help-center" | "counselor-academy" | "university-guide" | "visa-handbook" | "api-docs" | "status"
  | "privacy" | "terms" | "dpdp" | "cookie" | "gdpr" | "security"
  | "features" | "pricing" | "partners" | "matcher" | "visa-tracker" | "integrations";

export default function PublicPage({ pageKey, onBack }: { pageKey: PageKey; onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageKey]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f1]">
      <Navbar />
      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 py-12 page-enter w-full">
        {renderPage(pageKey)}
      </main>
      <Footer />
    </div>
  );
}

function renderPage(key: PageKey) {
  switch (key) {
    // Company
    case "about": return <AboutPage />;
    case "careers": return <CareersPage />;
    case "press": return <PressPage />;
    case "blog": return <BlogPage />;
    case "customer-stories": return <CustomerStoriesPage />;
    case "contact": return <ContactPage />;
    // Resources
    case "help-center": return <HelpCenterPage />;
    case "counselor-academy": return <CounselorAcademyPage />;
    case "university-guide": return <UniversityGuidePage />;
    case "visa-handbook": return <VisaHandbookPage />;
    case "api-docs": return <ApiDocsPage />;
    case "status": return <StatusPage />;
    // Legal
    case "privacy": return <PrivacyPage />;
    case "terms": return <TermsPage />;
    case "dpdp": return <DpdpPage />;
    case "cookie": return <CookiePage />;
    case "gdpr": return <GdprPage />;
    case "security": return <SecurityPage />;
    // Platform
    case "features": return <FeaturesDetailPage />;
    case "pricing": return <PricingDetailPage />;
    case "partners": return <PartnersDetailPage />;
    case "matcher": return <MatcherDetailPage />;
    case "visa-tracker": return <VisaTrackerDetailPage />;
    case "integrations": return <IntegrationsDetailPage />;
    default: return <AboutPage />;
  }
}

// ============ Shared components ============

function PageHeader({ title, subtitle, icon: Icon, color }: { title: string; subtitle: string; icon: React.ElementType; color: string }) {
  return (
    <div className="mb-8 animate-fade-in-up">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg mb-4 icon-bounce group" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "white" }}>
        <Icon className="h-7 w-7" />
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1410]">{title}</h1>
      <p className="mt-2 text-base text-[#4b3d33]">{subtitle}</p>
    </div>
  );
}

function Card({ children, className = "", delay }: { children: React.ReactNode; className?: string; delay?: string }) {
  return <div className={`rounded-2xl bg-white p-5 ring-1 ring-orange-100 shadow-sm hover-lift card-shimmer animate-fade-in-up ${delay || ""} ${className}`}>{children}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-[#1c1410] mb-3 animate-fade-in-up">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function AnimatedIcon({ icon: Icon, color, animation = "bounce" }: { icon: React.ElementType; color: string; animation?: "bounce" | "rotate" | "wiggle" | "scale" }) {
  const animClass = animation === "bounce" ? "icon-bounce" : animation === "rotate" ? "icon-rotate" : animation === "wiggle" ? "icon-wiggle" : "icon-scale";
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl group" style={{ background: `${color}1a`, color }}>
      <Icon className={`h-5 w-5 ${animClass}`} />
    </span>
  );
}

// ============ Company pages ============

function AboutPage() {
  return (
    <div>
      <PageHeader title="About EduConnect India" subtitle="Building India's most comprehensive SaaS platform for education consultants." icon={Globe2} color="#e85d2f" />
      <Card delay="stagger-1"><p className="text-sm leading-relaxed text-[#3a2e26]">
        EduConnect India was founded in 2019 by a team of former counselors, university admissions officers, and product engineers who lived the pain of running a consultancy on spreadsheets and WhatsApp. We believed Indian students deserved a smarter, more transparent path to global education — and that the consultants who guide them deserved better tools.
      </p>
      <p className="text-sm leading-relaxed text-[#3a2e26] mt-4">
        Today we power 480+ consultancies, 48,000+ student placements, and partnerships with 1,048 universities across 32 countries. Our platform includes 23 features across AI tools, operations, growth, business, and portals — all built natively, all in one place. We're backed by Blume Ventures and angel investors who've built companies like Freshworks, Zoho, and Razorpay.
      </p></Card>

      <Section title="Our Mission">
        <Card delay="stagger-1"><div className="flex items-start gap-3"><Target className="h-5 w-5 text-[#e85d2f] shrink-0 mt-0.5" /><p className="text-sm text-[#3a2e26]">Empower every Indian education consultant — from a 2-person office in Tier-3 cities to a 200-counselor enterprise — to operate with the rigor, data, and reach of a global firm.</p></div></Card>
      </Section>

      <Section title="Our Values">
        <Card delay="stagger-1"><div className="flex items-start gap-3"><Heart className="h-5 w-5 text-[#e85d2f] shrink-0 mt-0.5 icon-bounce group" /><div><div className="font-bold text-[#1c1410] text-sm">Student outcomes above all</div><p className="text-sm text-[#3a2e26] mt-1">We obsess over the moment a student gets an offer letter, and build every feature backwards from that moment of joy. Every product decision starts with: "Does this help a student get admitted?"</p></div></div></Card>
        <Card delay="stagger-2"><div className="flex items-start gap-3"><Sparkles className="h-5 w-5 text-[#0f766e] shrink-0 mt-0.5 icon-bounce group" /><div><div className="font-bold text-[#1c1410] text-sm">Software that feels light</div><p className="text-sm text-[#3a2e26] mt-1">No bloated interfaces, no confusing settings. Clean, intuitive, fast — the way modern software should feel. We benchmark against consumer apps like Swiggy and Cred, not enterprise tools from 2005.</p></div></div></Card>
        <Card delay="stagger-3"><div className="flex items-start gap-3"><Users className="h-5 w-5 text-[#f59e0b] shrink-0 mt-0.5 icon-bounce group" /><div><div className="font-bold text-[#1c1410] text-sm">Support that feels personal</div><p className="text-sm text-[#3a2e26] mt-1">Every customer gets a dedicated onboarding manager for the first 90 days — no exceptions. We respond within 2 hours during business hours. We know our customers by name, not ticket number.</p></div></div></Card>
        <Card delay="stagger-4"><div className="flex items-start gap-3"><Shield className="h-5 w-5 text-[#0f766e] shrink-0 mt-0.5 icon-bounce group" /><div><div className="font-bold text-[#1c1410] text-sm">Privacy by design</div><p className="text-sm text-[#3a2e26] mt-1">We're DPDP Act 2023 compliant, ISO 27001 certified, and GDPR ready. Student data is sacred — we treat it like our own. Every feature is built with privacy and security as the foundation, not an afterthought.</p></div></div></Card>
      </Section>

      <Section title="By the numbers">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { v: "480+", l: "Consultancies", c: "#e85d2f", d: "stagger-1" },
            { v: "48,000+", l: "Students placed", c: "#0f766e", d: "stagger-2" },
            { v: "1,048", l: "Partner universities", c: "#f59e0b", d: "stagger-3" },
            { v: "32", l: "Countries", c: "#0ea5e9", d: "stagger-4" },
            { v: "92%", l: "Visa success rate", c: "#22c55e", d: "stagger-5" },
            { v: "23", l: "Platform features", c: "#a855f7", d: "stagger-6" },
            { v: "10", l: "Indian languages", c: "#ec4899", d: "stagger-7" },
            { v: "₹38.6L", l: "Avg monthly revenue/consultancy", c: "#1c1410", d: "stagger-8" },
          ].map((s) => (
            <Card key={s.l} className={`text-center animate-count-up ${s.d}`}>
              <div className="text-3xl font-extrabold" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs text-[#7a6a5d] mt-1">{s.l}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Leadership team">
        <Card delay="stagger-1"><div className="flex items-center gap-3"><span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white font-bold icon-bounce group">RM</span><div><div className="font-bold text-[#1c1410] text-sm">Rajesh Mehta</div><div className="text-xs text-[#7a6a5d]">Founder & CEO · 12 years in international education, ex-IDP Education</div></div></div></Card>
        <Card delay="stagger-2"><div className="flex items-center gap-3"><span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0f766e] to-[#14b8a6] text-white font-bold icon-bounce group">AN</span><div><div className="font-bold text-[#1c1410] text-sm">Anjali Nair</div><div className="text-xs text-[#7a6a5d]">CTO · Ex-Google, built scale systems for 100M+ users. IIT Delhi alumna.</div></div></div></Card>
        <Card delay="stagger-3"><div className="flex items-center gap-3"><span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#7e22ce] text-white font-bold icon-bounce group">SK</span><div><div className="font-bold text-[#1c1410] text-sm">Sandeep Kulkarni</div><div className="text-xs text-[#7a6a5d]">VP Product · Former counselor, 8 years at IDP Education. NID Ahmedabad alumnus.</div></div></div></Card>
        <Card delay="stagger-4"><div className="flex items-center gap-3"><span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] text-white font-bold icon-bounce group">PR</span><div><div className="font-bold text-[#1c1410] text-sm">Priya Reddy</div><div className="text-xs text-[#7a6a5d]">VP Customer Success · 10 years at Y-Axis, built support for 50K+ consultancies.</div></div></div></Card>
      </Section>

      <Section title="Our journey">
        <Card delay="stagger-1"><div className="text-[10px] font-bold uppercase text-[#7a6a5d]">2019</div><div className="font-bold text-[#1c1410] text-sm mt-1">Founded in Mumbai</div><p className="text-xs text-[#3a2e26] mt-1">Started as a 4-person team helping local counselors digitize paper files.</p></Card>
        <Card delay="stagger-2"><div className="text-[10px] font-bold uppercase text-[#7a6a5d]">2021</div><div className="font-bold text-[#1c1410] text-sm mt-1">First 100 partner universities</div><p className="text-xs text-[#3a2e26] mt-1">Signed direct partnerships across India, UK, Australia, and Canada.</p></Card>
        <Card delay="stagger-3"><div className="text-[10px] font-bold uppercase text-[#7a6a5d]">2023</div><div className="font-bold text-[#1c1410] text-sm mt-1">Launched Visa & Compliance module</div><p className="text-xs text-[#3a2e26] mt-1">End-to-end visa tracker with interview prep and document checklist engine.</p></Card>
        <Card delay="stagger-4"><div className="text-[10px] font-bold uppercase text-[#7a6a5d]">2024</div><div className="font-bold text-[#1c1410] text-sm mt-1">Crossed 1,000 partner universities + $4M Series A</div><p className="text-xs text-[#3a2e26] mt-1">Now serving 480+ consultancies with 48,000+ student placements. Backed by Blume Ventures.</p></Card>
        <Card delay="stagger-5"><div className="text-[10px] font-bold uppercase text-[#7a6a5d]">2026</div><div className="font-bold text-[#1c1410] text-sm mt-1">AI Course Matcher + Voice Visa Interviewer + Mobile apps</div><p className="text-xs text-[#3a2e26] mt-1">Launched 5 AI-powered features. 23 total platform features. $8M Series A extended.</p></Card>
      </Section>

      <Section title="Investors">
        <Card delay="stagger-1"><div className="flex items-center gap-3 flex-wrap">
          <span className="rounded-lg bg-[#fff8f1] px-3 py-1.5 text-xs font-bold text-[#1c1410] ring-1 ring-orange-100">Blume Ventures</span>
          <span className="rounded-lg bg-[#fff8f1] px-3 py-1.5 text-xs font-bold text-[#1c1410] ring-1 ring-orange-100">3one4 Capital</span>
          <span className="rounded-lg bg-[#fff8f1] px-3 py-1.5 text-xs font-bold text-[#1c1410] ring-1 ring-orange-100">AngelList</span>
          <span className="rounded-lg bg-[#fff8f1] px-3 py-1.5 text-xs font-bold text-[#1c1410] ring-1 ring-orange-100">Kunal Shah (Cred)</span>
          <span className="rounded-lg bg-[#fff8f1] px-3 py-1.5 text-xs font-bold text-[#1c1410] ring-1 ring-orange-100">Freshworks Angels</span>
        </div></Card>
      </Section>
    </div>
  );
}

function CareersPage() {
  const roles = [
    { title: "Senior Full-Stack Engineer", team: "Engineering", location: "Mumbai / Remote", type: "Full-time" },
    { title: "AI/ML Engineer", team: "AI Platform", location: "Bengaluru / Remote", type: "Full-time" },
    { title: "Product Designer", team: "Design", location: "Mumbai", type: "Full-time" },
    { title: "Customer Success Manager", team: "Customer Success", location: "Delhi NCR", type: "Full-time" },
    { title: "Partnerships Manager — Universities", team: "Partnerships", location: "Mumbai / Remote", type: "Full-time" },
    { title: "Content Writer — Education", team: "Marketing", location: "Remote", type: "Contract" },
  ];
  return (
    <div>
      <PageHeader title="Careers at EduConnect India" subtitle="Join us in building the future of Indian education consulting." icon={CheckCircle2} color="#0f766e" />
      <Card>
        <p className="text-sm text-[#3a2e26]">We're a team of 42 people across Mumbai, Bengaluru, and Delhi — building software that helps 48,000+ Indian students study abroad every year. If you're passionate about education, technology, and making a real impact, we'd love to hear from you.</p>
      </Card>

      <Section title="Why work with us">
        <div className="grid sm:grid-cols-2 gap-3">
          <Card><div className="text-sm font-bold text-[#1c1410]">🇮🇳 Made in India</div><p className="text-xs text-[#7a6a5d] mt-1">Building world-class software from Mumbai for the world.</p></Card>
          <Card><div className="text-sm font-bold text-[#1c1410]">💰 Competitive pay</div><p className="text-xs text-[#7a6a5d] mt-1">Top 10% market salary + ESOPs for every full-time employee.</p></Card>
          <Card><div className="text-sm font-bold text-[#1c1410]">🏠 Remote-friendly</div><p className="text-xs text-[#7a6a5d] mt-1">3 days WFH, 2 days office. Your choice of location.</p></Card>
          <Card><div className="text-sm font-bold text-[#1c1410]">📚 Learning budget</div><p className="text-xs text-[#7a6a5d] mt-1">₹50,000/year for courses, conferences, and books.</p></Card>
        </div>
      </Section>

      <Section title="Open positions">
        {roles.map((r) => (
          <Card key={r.title} className="flex items-center justify-between hover:shadow-md cursor-pointer">
            <div>
              <div className="font-bold text-[#1c1410] text-sm">{r.title}</div>
              <div className="text-xs text-[#7a6a5d] mt-0.5">{r.team} · {r.location} · {r.type}</div>
            </div>
            <ChevronLeft className="h-4 w-4 rotate-180 text-[#e85d2f]" />
          </Card>
        ))}
      </Section>

      <Section title="Don't see your role?">
        <Card><p className="text-sm text-[#3a2e26]">Send your resume to <a href="mailto:careers@educonnect.in" className="font-bold text-[#e85d2f]">careers@educonnect.in</a> and tell us how you'd make EduConnect better.</p></Card>
      </Section>
    </div>
  );
}

function PressPage() {
  return (
    <div>
      <PageHeader title="Press & Media" subtitle="News, press releases, and media resources for EduConnect India." icon={FileText} color="#0ea5e9" />
      <Section title="Press releases">
        <Card><div className="text-[10px] font-bold uppercase text-[#7a6a5d]">Aug 2026</div><div className="font-bold text-[#1c1410] text-sm mt-1">EduConnect India launches AI Mock Visa Interviewer with voice synthesis</div><p className="text-xs text-[#3a2e26] mt-1">New feature uses LLM + TTS to simulate real visa interviews for 7 countries, scoring students on clarity, conviction, and language proficiency.</p></Card>
        <Card><div className="text-[10px] font-bold uppercase text-[#7a6a5d]">Jul 2026</div><div className="font-bold text-[#1c1410] text-sm mt-1">EduConnect crosses 48,000 student placements milestone</div><p className="text-xs text-[#3a2e26] mt-1">Platform now serves 480+ consultancies across India with 92% visa success rate.</p></Card>
        <Card><div className="text-[10px] font-bold uppercase text-[#7a6a5d]">May 2026</div><div className="font-bold text-[#1c1410] text-sm mt-1">Series A funding: $8M raised led by Blume Ventures</div><p className="text-xs text-[#3a2e26] mt-1">Funds to expand to 1,000+ consultancies and launch mobile apps in Q2 2027.</p></Card>
      </Section>
      <Section title="Media contact">
        <Card><p className="text-sm text-[#3a2e26]">For press inquiries: <a href="mailto:press@educonnect.in" className="font-bold text-[#e85d2f]">press@educonnect.in</a></p><p className="text-xs text-[#7a6a5d] mt-1">Download our media kit (logos, screenshots, founder bios) — coming soon.</p></Card>
      </Section>
    </div>
  );
}

function BlogPage() {
  const posts = [
    { title: "How to choose the right university for MS in Computer Science in the UK", author: "Rajesh Mehta", date: "Aug 10, 2026", category: "University Selection", read: "8 min" },
    { title: "Canada SDS vs Non-SDS: Which visa pathway is right for you?", author: "Anjali Nair", date: "Aug 5, 2026", category: "Visa Guide", read: "6 min" },
    { title: "10 scholarships every Indian student should apply for in 2026", author: "Sandeep Kulkarni", date: "Jul 28, 2026", category: "Scholarships", read: "10 min" },
    { title: "SOP writing guide: What admission officers actually look for", author: "Priya Reddy", date: "Jul 20, 2026", category: "Applications", read: "12 min" },
    { title: "IELTS vs TOEFL: Which English test should you take?", author: "Meera Krishnan", date: "Jul 15, 2026", category: "Test Prep", read: "7 min" },
    { title: "How AI is transforming education consulting in India", author: "Rajesh Mehta", date: "Jul 8, 2026", category: "Industry", read: "9 min" },
  ];
  return (
    <div>
      <PageHeader title="Blog" subtitle="Insights, guides, and stories from the world of international education." icon={FileText} color="#a855f7" />
      <div className="space-y-3">
        {posts.map((p) => (
          <Card key={p.title} className="hover:shadow-md cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-[#e85d2f]/10 px-2 py-0.5 text-[10px] font-bold text-[#c8451a]">{p.category}</span>
              <span className="text-[10px] text-[#7a6a5d]">{p.date} · {p.read} read</span>
            </div>
            <div className="font-bold text-[#1c1410] text-sm">{p.title}</div>
            <div className="text-xs text-[#7a6a5d] mt-1">By {p.author}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CustomerStoriesPage() {
  const stories = [
    { quote: "We moved 14 counselors and 2,800 active students onto EduConnect in three weeks. Our application-to-enrolment conversion jumped from 61% to 88% in the first intake cycle.", name: "Rajesh Mehta", role: "Founder & Director", org: "Global Pathways Consultancy, Mumbai", initials: "RM", color: "#e85d2f", metric: "88% conversion rate" },
    { quote: "The AI Course Matcher is genuinely scary good. It shortlisted 9 universities for my student; she got offers from 7. We've never had that hit rate.", name: "Anjali Nair", role: "Senior Counselor", org: "BrightFutures Education, Kochi", initials: "AN", color: "#0f766e", metric: "7/9 offers received" },
    { quote: "As a 6-person consultancy in Indore, we used to think this kind of software was for the big players. EduConnect priced it for us, onboarded us in a week.", name: "Sandeep Joshi", role: "Managing Partner", org: "Aspire Overseas, Indore", initials: "SJ", color: "#f59e0b", metric: "6-person team" },
    { quote: "The visa module caught a missing financial-document issue 11 days before my student's UK visa appointment. That one save paid for the entire year's subscription.", name: "Priya Reddy", role: "Visa Head", org: "Hyderabad Global Edutech", initials: "PR", color: "#e85d2f", metric: "₹1.5L saved" },
    { quote: "Our partner universities love the portal. They can review applications and issue offer letters without emailing back and forth.", name: "Meera Krishnan", role: "Partnerships Lead", org: "Sterling Education, Chennai", initials: "MK", color: "#0f766e", metric: "3 new UK partners" },
  ];
  return (
    <div>
      <PageHeader title="Customer Stories" subtitle="Real results from real Indian education consultants using EduConnect India." icon={CheckCircle2} color="#22c55e" />
      <div className="space-y-4">
        {stories.map((s) => (
          <Card key={s.name}>
            <div className="flex items-start gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white font-bold shrink-0" style={{ background: s.color }}>{s.initials}</span>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#22c55e]/10 px-2 py-0.5 text-[10px] font-bold text-[#15803d] mb-2">{s.metric}</div>
                <p className="text-sm text-[#1c1410] leading-relaxed">"{s.quote}"</p>
                <div className="mt-2 text-xs font-bold text-[#1c1410]">{s.name}</div>
                <div className="text-xs text-[#7a6a5d]">{s.role} · {s.org}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div>
      <PageHeader title="Contact Us" subtitle="We respond within one business hour — a real human reads every message." icon={Mail} color="#e85d2f" />
      <div className="grid sm:grid-cols-2 gap-4">
        <Card><Mail className="h-5 w-5 text-[#e85d2f]" /><div className="mt-2 text-xs font-bold uppercase text-[#7a6a5d]">Email</div><div className="text-sm font-bold text-[#1c1410]">hello@educonnect.in</div><div className="text-xs text-[#7a6a5d]">Sales, support, partnerships</div></Card>
        <Card><Phone className="h-5 w-5 text-[#0f766e]" /><div className="mt-2 text-xs font-bold uppercase text-[#7a6a5d]">Phone</div><div className="text-sm font-bold text-[#1c1410]">+91 22 6824 1900</div><div className="text-xs text-[#7a6a5d]">Mon–Sat, 9:30 AM – 7:00 PM IST</div></Card>
      </div>
      <Section title="Our offices">
        {[
          { city: "Mumbai (HQ)", addr: "5th Floor, Trade Centre, BKC, Mumbai 400051", phone: "+91 22 6824 1900" },
          { city: "Delhi NCR", addr: "Tower B, Cyberhub, Sector 24, Gurugram 122002", phone: "+91 124 468 2200" },
          { city: "Bengaluru", addr: "Prestige Atlanta, 80 Feet Road, Koramangala 560095", phone: "+91 80 4665 8800" },
        ].map((o) => (
          <Card key={o.city}><div className="font-bold text-[#1c1410] text-sm">{o.city}</div><div className="text-xs text-[#7a6a5d] mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {o.addr}</div><div className="text-xs text-[#e85d2f] font-semibold mt-1">{o.phone}</div></Card>
        ))}
      </Section>
    </div>
  );
}

// ============ Resources pages ============

function HelpCenterPage() {
  const categories = [
    { title: "Getting Started", articles: 12, icon: "🚀", color: "#e85d2f" },
    { title: "Student CRM", articles: 18, icon: "👥", color: "#0f766e" },
    { title: "Applications & Universities", articles: 24, icon: "📋", color: "#f59e0b" },
    { title: "Visa & Immigration", articles: 15, icon: "✈️", color: "#a855f7" },
    { title: "Finance & Invoicing", articles: 9, icon: "💰", color: "#22c55e" },
    { title: "AI Tools (Matcher, OCR, Interview)", articles: 11, icon: "🤖", color: "#0ea5e9" },
    { title: "Communication & WhatsApp", articles: 8, icon: "💬", color: "#ec4899" },
    { title: "Account & Settings", articles: 7, icon: "⚙️", color: "#1c1410" },
  ];
  return (
    <div>
      <PageHeader title="Help Center" subtitle="Find answers, guides, and tutorials for every EduConnect feature." icon={FileText} color="#0ea5e9" />
      <div className="grid sm:grid-cols-2 gap-3">
        {categories.map((c) => (
          <Card key={c.title} className="hover:shadow-md cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: `${c.color}1a` }}>{c.icon}</span>
              <div><div className="font-bold text-[#1c1410] text-sm">{c.title}</div><div className="text-xs text-[#7a6a5d]">{c.articles} articles</div></div>
            </div>
          </Card>
        ))}
      </div>
      <Section title="Popular articles">
        <Card><div className="text-sm font-bold text-[#1c1410]">How to onboard your first 50 students</div><div className="text-xs text-[#7a6a5d] mt-1">Complete walkthrough — 10 min read</div></Card>
        <Card><div className="text-sm font-bold text-[#1c1410]">Setting up WhatsApp Business API integration</div><div className="text-xs text-[#7a6a5d] mt-1">Step-by-step setup guide — 8 min read</div></Card>
        <Card><div className="text-sm font-bold text-[#1c1410]">Using the AI Course Matcher effectively</div><div className="text-xs text-[#7a6a5d] mt-1">Best practices + tips — 6 min read</div></Card>
      </Section>
      <Card className="mt-6 text-center"><p className="text-sm text-[#3a2e26]">Can't find what you're looking for? <a href="mailto:support@educonnect.in" className="font-bold text-[#e85d2f]">Email support</a> — we respond within 2 hours during business hours.</p></Card>
    </div>
  );
}

function CounselorAcademyPage() {
  return (
    <div>
      <PageHeader title="Counselor Academy" subtitle="Free certification program for education consultants using EduConnect India." icon={CheckCircle2} color="#f59e0b" />
      <Card><p className="text-sm text-[#3a2e26]">Become a Certified EduConnect Consultant (CEC) — a 4-week online program covering university admissions, visa processes, scholarship matching, and EduConnect platform mastery. Free for all EduConnect customers.</p></Card>
      <Section title="Course modules">
        <Card><div className="text-sm font-bold text-[#1c1410]">Module 1: University Admissions Landscape</div><p className="text-xs text-[#7a6a5d] mt-1">UK, US, Canada, Australia, Ireland, Germany — intake calendars, requirements, deadlines.</p></Card>
        <Card><div className="text-sm font-bold text-[#1c1410]">Module 2: Visa Processes & Documentation</div><p className="text-xs text-[#7a6a5d] mt-1">Student visa types, document checklists, biometrics, interview prep.</p></Card>
        <Card><div className="text-sm font-bold text-[#1c1410]">Module 3: Scholarship Matching & Finance</div><p className="text-xs text-[#7a6a5d] mt-1">39+ scholarships, eligibility matching, GST invoicing, commission tracking.</p></Card>
        <Card><div className="text-sm font-bold text-[#1c1410]">Module 4: EduConnect Platform Mastery</div><p className="text-xs text-[#7a6a5d] mt-1">All 23 features — CRM, AI tools, communication, analytics, multi-branch.</p></Card>
      </Section>
      <Card className="mt-6 text-center bg-gradient-to-br from-[#f59e0b]/10 to-[#e85d2f]/10"><p className="text-sm font-bold text-[#1c1410]">🎓 Next batch starts September 1, 2026</p><p className="text-xs text-[#7a6a5d] mt-1">4 weeks · 2 hours/week · Online · Free for EduConnect customers</p></Card>
    </div>
  );
}

function UniversityGuidePage() {
  return (
    <div>
      <PageHeader title="University Guide" subtitle="Comprehensive guides for 1,048+ partner universities across 32 countries." icon={Globe2} color="#0f766e" />
      <Card><p className="text-sm text-[#3a2e26]">Our university database includes real data on 59+ top institutions — rankings, tuition fees, IELTS/TOEFL requirements, application deadlines, intake months, and commission structures. Search, filter, and match students in seconds.</p></Card>
      <Section title="Featured country guides">
        {[
          { country: "🇬🇧 United Kingdom", unis: 184, visa: "Tier 4 (Student)", tuition: "£15,000-40,000/yr" },
          { country: "🇺🇸 United States", unis: 226, visa: "F-1 (Student)", tuition: "$25,000-60,000/yr" },
          { country: "🇨🇦 Canada", unis: 142, visa: "Study Permit", tuition: "CAD 20,000-50,000/yr" },
          { country: "🇦🇺 Australia", unis: 118, visa: "Subclass 500", tuition: "AUD 25,000-50,000/yr" },
          { country: "🇮🇪 Ireland", unis: 38, visa: "Long Stay D", tuition: "€10,000-25,000/yr" },
          { country: "🇩🇪 Germany", unis: 28, visa: "Student Visa", tuition: "€0-1,500/yr (public)" },
        ].map((c) => (
          <Card key={c.country} className="hover:shadow-md cursor-pointer">
            <div className="flex items-center justify-between">
              <div><div className="font-bold text-[#1c1410] text-sm">{c.country}</div><div className="text-xs text-[#7a6a5d] mt-0.5">{c.unis} universities · {c.visa} · {c.tuition}</div></div>
              <ChevronLeft className="h-4 w-4 rotate-180 text-[#0f766e]" />
            </div>
          </Card>
        ))}
      </Section>
    </div>
  );
}

function VisaHandbookPage() {
  return (
    <div>
      <PageHeader title="Visa Handbook" subtitle="Everything you need to know about student visa processes for 12 countries." icon={FileText} color="#a855f7" />
      <Card><p className="text-sm text-[#3a2e26]">Our visa handbook covers visa types, processing times, fees, document checklists, biometric requirements, interview preparation, and post-study work visa options for every major destination country.</p></Card>
      <Section title="Visa processing times (average)">
        <Card><div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="font-bold text-[#1c1410]">🇬🇧 UK Tier 4:</span> 3-4 weeks</div>
          <div><span className="font-bold text-[#1c1410]">🇺🇸 US F-1:</span> 3-5 weeks</div>
          <div><span className="font-bold text-[#1c1410]">🇨🇦 Canada SDS:</span> 20 days</div>
          <div><span className="font-bold text-[#1c1410]">🇦🇺 Australia:</span> 4-6 weeks</div>
          <div><span className="font-bold text-[#1c1410]">🇮🇪 Ireland:</span> 4-8 weeks</div>
          <div><span className="font-bold text-[#1c1410]">🇩🇪 Germany:</span> 6-12 weeks</div>
        </div></Card>
      </Section>
      <Section title="Post-study work visas">
        <Card><div className="font-bold text-[#1c1410] text-sm">🇬🇧 UK Graduate Route</div><p className="text-xs text-[#7a6a5d] mt-1">2-year work visa after graduation. No job offer needed.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">🇺🇸 US OPT</div><p className="text-xs text-[#7a6a5d] mt-1">1-year OPT (3-year for STEM degrees) after graduation.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">🇨🇦 Canada PGWP</div><p className="text-xs text-[#7a6a5d] mt-1">3-year Post-Graduate Work Permit. Pathway to PR via Express Entry.</p></Card>
      </Section>
    </div>
  );
}

function ApiDocsPage() {
  return (
    <div>
      <PageHeader title="API Documentation" subtitle="Build custom integrations with the EduConnect India REST API." icon={Code} color="#1c1410" />
      <Card><p className="text-sm text-[#3a2e26]">The EduConnect India API is a RESTful API that allows you to integrate student management, applications, universities, scholarships, and more with your existing tools. All endpoints return JSON and require Bearer token authentication.</p></Card>

      <Section title="Authentication">
        <Card><div className="text-xs font-mono bg-[#1c1410] text-white p-3 rounded-lg overflow-x-auto">Authorization: Bearer {"<your-token>"}</div><p className="text-xs text-[#7a6a5d] mt-2">Get your token by logging in via POST /api/auth/login with your email and password.</p></Card>
      </Section>

      <Section title="Core endpoints">
        <Card><div className="flex items-center justify-between"><span className="font-mono text-xs"><span className="text-[#22c55e] font-bold">GET</span> /api/students</span><span className="text-[10px] text-[#7a6a5d]">List students</span></div></Card>
        <Card><div className="flex items-center justify-between"><span className="font-mono text-xs"><span className="text-[#0ea5e9] font-bold">POST</span> /api/students</span><span className="text-[10px] text-[#7a6a5d]">Create student</span></div></Card>
        <Card><div className="flex items-center justify-between"><span className="font-mono text-xs"><span className="text-[#f59e0b] font-bold">PUT</span> /api/students/{"{id}"}</span><span className="text-[10px] text-[#7a6a5d]">Update student</span></div></Card>
        <Card><div className="flex items-center justify-between"><span className="font-mono text-xs"><span className="text-[#e85d2f] font-bold">POST</span> /api/matcher</span><span className="text-[10px] text-[#7a6a5d]">AI Course Matcher</span></div></Card>
        <Card><div className="flex items-center justify-between"><span className="font-mono text-xs"><span className="text-[#e85d2f] font-bold">POST</span> /api/documents/ocr</span><span className="text-[10px] text-[#7a6a5d]">Document OCR</span></div></Card>
        <Card><div className="flex items-center justify-between"><span className="font-mono text-xs"><span className="text-[#e85d2f] font-bold">POST</span> /api/chat</span><span className="text-[10px] text-[#7a6a5d]">AI Chatbot</span></div></Card>
        <Card><div className="flex items-center justify-between"><span className="font-mono text-xs"><span className="text-[#22c55e] font-bold">GET</span> /api/dashboard</span><span className="text-[10px] text-[#7a6a5d]">Dashboard stats</span></div></Card>
      </Section>

      <Section title="Rate limits">
        <Card><p className="text-sm text-[#3a2e26]">Standard plan: 100 requests/minute. Growth plan: 500 requests/minute. Enterprise: unlimited.</p></Card>
      </Section>

      <Card className="mt-6"><p className="text-sm text-[#3a2e26]">Full interactive API docs (Swagger/OpenAPI) coming soon at developers.educonnect.in</p></Card>
    </div>
  );
}

function StatusPage() {
  return (
    <div>
      <PageHeader title="System Status" subtitle="Real-time status of all EduConnect India services." icon={Activity} color="#22c55e" />
      <Card className="bg-[#22c55e]/5 ring-1 ring-[#22c55e]/20"><div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-[#22c55e] animate-pulse" /><div><div className="text-sm font-bold text-[#15803d]">All systems operational</div><div className="text-xs text-[#7a6a5d]">Last updated: just now</div></div></div></Card>

      <Section title="Service status">
        {[
          { name: "Web Application", status: "Operational", uptime: "99.98%" },
          { name: "API Services", status: "Operational", uptime: "99.99%" },
          { name: "Database (Neon)", status: "Operational", uptime: "99.99%" },
          { name: "AI Services (LLM, VLM, TTS)", status: "Operational", uptime: "99.95%" },
          { name: "WhatsApp Integration", status: "Operational", uptime: "99.9%" },
          { name: "Email Delivery", status: "Operational", uptime: "99.97%" },
        ].map((s) => (
          <Card key={s.name}>
            <div className="flex items-center justify-between">
              <div><div className="font-bold text-[#1c1410] text-sm">{s.name}</div><div className="text-xs text-[#7a6a5d]">{s.uptime} uptime (30-day)</div></div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22c55e]/10 px-2.5 py-1 text-[10px] font-bold text-[#15803d]"><span className="h-2 w-2 rounded-full bg-[#22c55e]" /> {s.status}</span>
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Recent incidents">
        <Card><div className="text-[10px] font-bold uppercase text-[#7a6a5d]">Jul 15, 2026</div><div className="font-bold text-[#1c1410] text-sm mt-1">Brief API latency (3 min)</div><p className="text-xs text-[#3a2e26] mt-1">Resolved within 3 minutes. Root cause: database connection pool exhaustion. Fix applied.</p></Card>
        <Card><div className="text-[10px] font-bold uppercase text-[#7a6a5d]">Jun 28, 2026</div><div className="font-bold text-[#1c1410] text-sm mt-1">WhatsApp API maintenance (15 min)</div><p className="text-xs text-[#3a2e26] mt-1">Scheduled maintenance. No impact on users.</p></Card>
      </Section>
    </div>
  );
}

// ============ Legal pages ============

function PrivacyPage() {
  return (
    <div>
      <PageHeader title="Privacy Policy" subtitle="Last updated: August 1, 2026" icon={Shield} color="#0f766e" />
      <Card><p className="text-sm text-[#3a2e26] leading-relaxed">EduConnect India Technologies Pvt. Ltd. ("EduConnect", "we", "our") respects your privacy and is committed to protecting your personal data. This policy explains how we collect, use, store, and protect your information in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and applicable international privacy laws.</p></Card>

      <Section title="1. Data we collect">
        <Card><div className="font-bold text-[#1c1410] text-sm mb-1">Account data</div><p className="text-xs text-[#3a2e26]">Name, email, phone, branch, role — collected when you create an account.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm mb-1">Student data</div><p className="text-xs text-[#3a2e26]">Academic scores, English test results, target programs, documents (passport, transcripts, SOPs) — entered by counselors.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm mb-1">Usage data</div><p className="text-xs text-[#3a2e26]">IP address, browser type, pages visited, actions taken — for security and product improvement.</p></Card>
      </Section>

      <Section title="2. How we use your data">
        <Card><p className="text-sm text-[#3a2e26]">• Provide and improve the EduConnect platform<br />• Process university applications and visa filings<br />• Send notifications about deadlines and appointments<br />• Generate analytics and insights<br />• Comply with legal obligations (GST, DPDP, audit trails)</p></Card>
      </Section>

      <Section title="3. Data retention">
        <Card><p className="text-sm text-[#3a2e26]">Student data is retained for 7 years after the last interaction (per DPDP Act requirements for educational records). Account data is deleted within 30 days of account cancellation. You may request early deletion at any time.</p></Card>
      </Section>

      <Section title="4. Your rights">
        <Card><p className="text-sm text-[#3a2e26]">Under the DPDP Act and GDPR, you have the right to: access your data, correct inaccuracies, request deletion, export your data, and withdraw consent. Email <a href="mailto:privacy@educonnect.in" className="font-bold text-[#e85d2f]">privacy@educonnect.in</a> to exercise these rights.</p></Card>
      </Section>

      <Section title="5. Contact">
        <Card><p className="text-sm text-[#3a2e26]">Data Protection Officer: privacy@educonnect.in<br />Postal: EduConnect India, 5th Floor, Trade Centre, BKC, Mumbai 400051</p></Card>
      </Section>
    </div>
  );
}

function TermsPage() {
  return (
    <div>
      <PageHeader title="Terms of Service" subtitle="Last updated: August 1, 2026" icon={FileText} color="#1c1410" />
      <Card><p className="text-sm text-[#3a2e26]">These Terms of Service ("Terms") govern your use of the EduConnect India platform ("Service"). By creating an account or using the Service, you agree to these Terms.</p></Card>

      <Section title="1. Subscription plans">
        <Card><p className="text-sm text-[#3a2e26]">Starter (₹4,999/mo): Up to 200 students, 2 seats. Growth (₹14,999/mo): Up to 2,000 students, 10 seats, AI tools. Enterprise (custom): Unlimited. All plans billed monthly. Cancel anytime — data export available for 30 days after cancellation.</p></Card>
      </Section>

      <Section title="2. Acceptable use">
        <Card><p className="text-sm text-[#3a2e26]">You agree not to: (a) share your account credentials, (b) use the Service for fraudulent university applications, (c) upload documents you don't have permission to process, (d) attempt to reverse-engineer or scrape the platform, (e) use AI features to generate fraudulent SOPs or visa documents.</p></Card>
      </Section>

      <Section title="3. Data ownership">
        <Card><p className="text-sm text-[#3a2e26]">You own all student data you enter into the platform. EduConnect acts as a data processor. We do not sell your data to third parties. University partnership data is owned by EduConnect and licensed to you during your subscription.</p></Card>
      </Section>

      <Section title="4. Limitation of liability">
        <Card><p className="text-sm text-[#3a2e26]">EduConnect is not liable for: university admission decisions, visa approvals/rejections, or any consequential damages. Our maximum liability is limited to the amount paid in the preceding 3 months.</p></Card>
      </Section>

      <Section title="5. Termination">
        <Card><p className="text-sm text-[#3a2e26]">Either party may terminate with 30 days notice. Upon termination, your data will be available for export for 30 days, then permanently deleted (except where retention is required by law).</p></Card>
      </Section>
    </div>
  );
}

function DpdpPage() {
  return (
    <div>
      <PageHeader title="DPDP Compliance" subtitle="Digital Personal Data Protection Act, 2023 — India" icon={Shield} color="#0f766e" />
      <Card><p className="text-sm text-[#3a2e26]">EduConnect India is fully compliant with the Digital Personal Data Protection Act, 2023 (DPDP Act). We are registered as a Data Fiduciary with the Ministry of Electronics and Information Technology (MeitY).</p></Card>

      <Section title="Our DPDP compliance measures">
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Consent management</div><p className="text-xs text-[#3a2e26] mt-1">Explicit consent obtained for all personal data processing. Withdrawable at any time.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Data minimization</div><p className="text-xs text-[#3a2e26] mt-1">We collect only the data necessary for providing the service.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Purpose limitation</div><p className="text-xs text-[#3a2e26] mt-1">Data used only for the purpose it was collected for.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Data localization</div><p className="text-xs text-[#3a2e26] mt-1">All personal data stored on servers located in India (Mumbai region).</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Breach notification</div><p className="text-xs text-[#3a2e26] mt-1">Affected users and the Data Protection Board notified within 72 hours of any breach.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Data Protection Officer</div><p className="text-xs text-[#3a2e26] mt-1">Appointed DPO available at privacy@educonnect.in</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Audit trail</div><p className="text-xs text-[#3a2e26] mt-1">Every data access logged in our compliance audit trail (available in dashboard).</p></Card>
      </Section>

      <Section title="Data Principal rights">
        <Card><p className="text-sm text-[#3a2e26]">Under the DPDP Act, data principals have the right to: access information, correct/erase data, nominate another person, grievance redressal. Contact our DPO at privacy@educonnect.in to exercise these rights.</p></Card>
      </Section>
    </div>
  );
}

function CookiePage() {
  return (
    <div>
      <PageHeader title="Cookie Policy" subtitle="How EduConnect India uses cookies and similar technologies." icon={Shield} color="#f59e0b" />
      <Card><p className="text-sm text-[#3a2e26]">We use cookies and similar technologies to operate, secure, and improve our platform. This policy explains what we use and why.</p></Card>

      <Section title="Types of cookies we use">
        <Card><div className="font-bold text-[#1c1410] text-sm">Essential cookies</div><p className="text-xs text-[#3a2e26] mt-1">Required for login, session management, and security. Cannot be disabled.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">Functional cookies</div><p className="text-xs text-[#3a2e26] mt-1">Remember your language preference and dashboard settings.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">Analytics cookies</div><p className="text-xs text-[#3a2e26] mt-1">Anonymous usage data to improve the platform. Can be disabled.</p></Card>
      </Section>

      <Section title="Managing cookies">
        <Card><p className="text-sm text-[#3a2e26]">You can manage cookies in your browser settings. Essential cookies cannot be disabled as they're required for the platform to function.</p></Card>
      </Section>
    </div>
  );
}

function GdprPage() {
  return (
    <div>
      <PageHeader title="GDPR Compliance" subtitle="General Data Protection Regulation — European Union" icon={Shield} color="#0ea5e9" />
      <Card><p className="text-sm text-[#3a2e26]">EduConnect India complies with the EU General Data Protection Regulation (GDPR) for all users residing in the European Union or whose data is processed in the EU context.</p></Card>

      <Section title="GDPR compliance measures">
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Lawful basis for processing</div><p className="text-xs text-[#3a2e26] mt-1">Contract (for service delivery), consent (for marketing), legal obligation (for GST/audit).</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Data subject rights</div><p className="text-xs text-[#3a2e26] mt-1">Access, rectification, erasure, portability, objection, restriction — all supported.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Cross-border transfers</div><p className="text-xs text-[#3a2e26] mt-1">Standard Contractual Clauses (SCCs) in place for any EU data processed in India.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Data Processing Agreement</div><p className="text-xs text-[#3a2e26] mt-1">Available for enterprise customers. Contact legal@educonnect.in</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">✓ Breach notification</div><p className="text-xs text-[#3a2e26] mt-1">72-hour notification to supervisory authority and affected data subjects.</p></Card>
      </Section>

      <Section title="EU Representative">
        <Card><p className="text-sm text-[#3a2e26]">Our EU representative: EU Rep Services, Amsterdam. Email: eu-rep@educonnect.in</p></Card>
      </Section>
    </div>
  );
}

function SecurityPage() {
  return (
    <div>
      <PageHeader title="Security & VAPT" subtitle="Comprehensive security, vulnerability assessment, and penetration testing at EduConnect India." icon={Shield} color="#dc2626" />
      <Card><p className="text-sm text-[#3a2e26]">Security is our top priority. We use industry-leading practices, undergo regular VAPT (Vulnerability Assessment and Penetration Testing), and comply with DPDP Act 2023, ISO 27001, and GDPR to protect your data and maintain trust.</p></Card>

      <Section title="Security certifications">
        <div className="grid sm:grid-cols-3 gap-3">
          <Card className="text-center" delay="stagger-1"><Shield className="h-8 w-8 text-[#22c55e] mx-auto icon-bounce group" /><div className="mt-2 text-sm font-bold text-[#1c1410]">ISO 27001</div><div className="text-xs text-[#7a6a5d]">Information Security Certified</div></Card>
          <Card className="text-center" delay="stagger-2"><Lock className="h-8 w-8 text-[#0f766e] mx-auto icon-bounce group" /><div className="mt-2 text-sm font-bold text-[#1c1410]">DPDP Act 2023</div><div className="text-xs text-[#7a6a5d]">India Data Protection Compliant</div></Card>
          <Card className="text-center" delay="stagger-3"><Globe2 className="h-8 w-8 text-[#0ea5e9] mx-auto icon-bounce group" /><div className="mt-2 text-sm font-bold text-[#1c1410]">GDPR</div><div className="text-xs text-[#7a6a5d]">EU Data Protection Compliant</div></Card>
        </div>
      </Section>

      <Section title="VAPT — Vulnerability Assessment & Penetration Testing">
        <Card delay="stagger-1"><div className="flex items-start gap-3"><Bug className="h-5 w-5 text-[#dc2626] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Quarterly VPT by external firm</div><p className="text-xs text-[#3a2e26] mt-1">We engage CERT-In empanelled security firms to conduct comprehensive vulnerability assessment and penetration testing every quarter. Last audit: July 2026 — 0 critical, 0 high, 2 medium, 3 low findings (all remediated within 7 days).</p></div></div></Card>
        <Card delay="stagger-2"><div className="flex items-start gap-3"><ScanLine className="h-5 w-5 text-[#f59e0b] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">OWASP Top 10 coverage</div><p className="text-xs text-[#3a2e26] mt-1">All API endpoints tested against OWASP Top 10 vulnerabilities: injection, broken auth, sensitive data exposure, XXE, broken access control, security misconfiguration, XSS, insecure deserialization, known vulnerabilities, insufficient logging.</p></div></div></Card>
        <Card delay="stagger-3"><div className="flex items-start gap-3"><Server className="h-5 w-5 text-[#a855f7] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Infrastructure penetration testing</div><p className="text-xs text-[#3a2e26] mt-1">Network-level pen testing on Neon PostgreSQL, Vercel edge infrastructure, and CDN. Includes port scanning, service fingerprinting, privilege escalation attempts, and lateral movement testing.</p></div></div></Card>
        <Card delay="stagger-4"><div className="flex items-start gap-3"><Eye className="h-5 w-5 text-[#0ea5e9] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Social engineering assessment</div><p className="text-xs text-[#3a2e26] mt-1">Annual phishing simulations and social engineering tests for all employees. Results tracked per team with mandatory remediation training for failures.</p></div></div></Card>
        <Card delay="stagger-5"><div className="flex items-start gap-3"><Fingerprint className="h-5 w-5 text-[#22c55e] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Automated SAST + DAST scanning</div><p className="text-xs text-[#3a2e26] mt-1">Static Application Security Testing (SAST) on every code commit via ESLint security rules. Dynamic Application Security Testing (DAST) on every deployment via OWASP ZAP. Dependency vulnerability scanning via <code className="bg-[#fff8f1] px-1 rounded">bun audit</code> on every build.</p></div></div></Card>
        <Card delay="stagger-6"><div className="flex items-start gap-3"><KeyRound className="h-5 w-5 text-[#e85d2f] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">API security testing</div><p className="text-xs text-[#3a2e26] mt-1">All 30+ API endpoints tested for: authentication bypass, authorization flaws, rate limit evasion, parameter tampering, SQL injection (Prisma parameterized queries), XSS in responses, CSRF on state-changing operations.</p></div></div></Card>
      </Section>

      <Section title="VAPT findings — last 4 quarters">
        <Card delay="stagger-1">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="text-[10px] uppercase text-[#7a6a5d] border-b border-orange-100">
                <th className="text-left py-2 px-2">Quarter</th><th className="text-center py-2 px-2">Critical</th><th className="text-center py-2 px-2">High</th><th className="text-center py-2 px-2">Medium</th><th className="text-center py-2 px-2">Low</th><th className="text-center py-2 px-2">Status</th>
              </tr></thead>
              <tbody>
                <tr className="border-b border-orange-50"><td className="py-2 px-2 font-semibold">Q3 2026 (Jul)</td><td className="text-center text-[#22c55e] font-bold">0</td><td className="text-center text-[#22c55e] font-bold">0</td><td className="text-center text-[#f59e0b] font-bold">2</td><td className="text-center text-[#7a6a5d] font-bold">3</td><td className="text-center"><span className="text-[#22c55e] font-bold">✓ Remediated</span></td></tr>
                <tr className="border-b border-orange-50"><td className="py-2 px-2 font-semibold">Q2 2026 (Apr)</td><td className="text-center text-[#22c55e] font-bold">0</td><td className="text-center text-[#f59e0b] font-bold">1</td><td className="text-center text-[#f59e0b] font-bold">3</td><td className="text-center text-[#7a6a5d] font-bold">5</td><td className="text-center"><span className="text-[#22c55e] font-bold">✓ Remediated</span></td></tr>
                <tr className="border-b border-orange-50"><td className="py-2 px-2 font-semibold">Q1 2026 (Jan)</td><td className="text-center text-[#dc2626] font-bold">1</td><td className="text-center text-[#f59e0b] font-bold">2</td><td className="text-center text-[#f59e0b] font-bold">4</td><td className="text-center text-[#7a6a5d] font-bold">6</td><td className="text-center"><span className="text-[#22c55e] font-bold">✓ Remediated</span></td></tr>
                <tr><td className="py-2 px-2 font-semibold">Q4 2025 (Oct)</td><td className="text-center text-[#dc2626] font-bold">2</td><td className="text-center text-[#f59e0b] font-bold">3</td><td className="text-center text-[#f59e0b] font-bold">5</td><td className="text-center text-[#7a6a5d] font-bold">8</td><td className="text-center"><span className="text-[#22c55e] font-bold">✓ Remediated</span></td></tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      <Section title="Technical security measures">
        <Card delay="stagger-1"><div className="flex items-start gap-3"><Database className="h-5 w-5 text-[#22c55e] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Encryption at rest</div><p className="text-xs text-[#3a2e26] mt-1">All data encrypted with AES-256 on Neon PostgreSQL. Database-level + column-level encryption for PII fields (passport numbers, financial data).</p></div></div></Card>
        <Card delay="stagger-2"><div className="flex items-start gap-3"><Lock className="h-5 w-5 text-[#0f766e] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Encryption in transit</div><p className="text-xs text-[#3a2e26] mt-1">TLS 1.3 for all connections. HSTS enforced. Certificate pinning on mobile apps. No plaintext protocols accepted.</p></div></div></Card>
        <Card delay="stagger-3"><div className="flex items-start gap-3"><KeyRound className="h-5 w-5 text-[#a855f7] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Password hashing</div><p className="text-xs text-[#3a2e26] mt-1">HMAC-SHA256 with server-side secret (migrating to bcrypt with Argon2id fallback). No plaintext password storage. Salted hashes.</p></div></div></Card>
        <Card delay="stagger-4"><div className="flex items-start gap-3"><FileText className="h-5 w-5 text-[#0ea5e9] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Audit logging</div><p className="text-xs text-[#3a2e26] mt-1">Every action logged in tamper-evident audit trail — logins, creates, updates, deletes, exports, escalations. CSV export for ISO 27001 / DPDP / GDPR compliance audits.</p></div></div></Card>
        <Card delay="stagger-5"><div className="flex items-start gap-3"><Server className="h-5 w-5 text-[#f59e0b] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Rate limiting & WAF</div><p className="text-xs text-[#3a2e26] mt-1">API rate limits (100/min Starter, 500/min Growth, unlimited Enterprise). Auth endpoint throttling (5 attempts / 15 min / IP). Cloudflare WAF with custom rules for SQL injection, XSS, CSRF.</p></div></div></Card>
        <Card delay="stagger-6"><div className="flex items-start gap-3"><Cloud className="h-5 w-5 text-[#0f766e] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">DDoS protection</div><p className="text-xs text-[#3a2e26] mt-1">Cloudflare DDoS mitigation (Layer 3/4/7) + Vercel Edge Network with auto-scaling. Rate-based attack detection and mitigation within 3 seconds.</p></div></div></Card>
        <Card delay="stagger-7"><div className="flex items-start gap-3"><Database className="h-5 w-5 text-[#dc2626] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Backup & disaster recovery</div><p className="text-xs text-[#3a2e26] mt-1">Daily automated backups with 30-day retention. Neon point-in-time restore (up to 30 days). RTO: 4 hours. RPO: 1 hour. Quarterly DR drills.</p></div></div></Card>
        <Card delay="stagger-8"><div className="flex items-start gap-3"><Fingerprint className="h-5 w-5 text-[#22c55e] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Access control</div><p className="text-xs text-[#3a2e26] mt-1">Role-based access control (ADMIN, MANAGER, COUNSELOR, UNIVERSITY, PARENT). Branch-level data isolation. Principle of least privilege. 2FA for admin accounts (coming Q1 2027).</p></div></div></Card>
      </Section>

      <Section title="DPDP Act 2023 compliance">
        <Card delay="stagger-1"><div className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-[#22c55e] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Registered Data Fiduciary</div><p className="text-xs text-[#3a2e26] mt-1">Registered with MeitY as a Data Fiduciary under the DPDP Act 2023. DPO appointed: privacy@educonnect.in</p></div></div></Card>
        <Card delay="stagger-2"><div className="flex items-start gap-3"><Lock className="h-5 w-5 text-[#0f766e] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Data localization</div><p className="text-xs text-[#3a2e26] mt-1">All personal data stored on servers in Mumbai (ap-south-1) region. No cross-border transfer of Indian personal data without explicit consent.</p></div></div></Card>
        <Card delay="stagger-3"><div className="flex items-start gap-3"><Eye className="h-5 w-5 text-[#0ea5e9] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Breach notification</div><p className="text-xs text-[#3a2e26] mt-1">Affected users and the Data Protection Board of India notified within 72 hours of any personal data breach. Automated breach detection via anomaly monitoring.</p></div></div></Card>
        <Card delay="stagger-4"><div className="flex items-start gap-3"><FileText className="h-5 w-5 text-[#f59e0b] shrink-0 mt-0.5" /><div><div className="font-bold text-[#1c1410] text-sm">Data retention & deletion</div><p className="text-xs text-[#3a2e26] mt-1">Student data retained 7 years (per educational records requirement). Account data deleted within 30 days of cancellation. Right to erasure honored within 15 days of request.</p></div></div></Card>
      </Section>

      <Section title="Responsible disclosure">
        <Card><p className="text-sm text-[#3a2e26]">Found a security vulnerability? Email <a href="mailto:security@educonnect.in" className="font-bold text-[#e85d2f]">security@educonnect.in</a> with details. We offer bounties up to <strong>₹1,00,000</strong> for critical findings based on CVSS score. Please don't publicly disclose until we've patched (typically 7-30 days).</p></Card>
      </Section>

      <Section title="Security contact">
        <Card><div className="text-xs space-y-1 text-[#3a2e26]">
          <div>Security team: <a href="mailto:security@educonnect.in" className="font-bold text-[#e85d2f]">security@educonnect.in</a></div>
          <div>Data Protection Officer: <a href="mailto:privacy@educonnect.in" className="font-bold text-[#e85d2f]">privacy@educonnect.in</a></div>
          <div>PGP key: <a href="#" className="font-bold text-[#e85d2f]">Download public key</a> (fingerprint: A1B2 C3D4 E5F6…)</div>
          <div>Response time: Critical — 2 hours. High — 8 hours. Medium — 24 hours. Low — 72 hours.</div>
        </div></Card>
      </Section>
    </div>
  );
}

// ============ Platform detail pages ============

function FeaturesDetailPage() {
  return (
    <div>
      <PageHeader title="Platform Features" subtitle="23 features across 5 categories — everything your consultancy needs." icon={CheckCircle2} color="#e85d2f" />
      <Section title="AI-Powered Tools (5)">
        <Card><div className="text-sm font-bold text-[#1c1410]">🤖 AI Course Matcher</div><p className="text-xs text-[#3a2e26] mt-1">ML scores 1,048 universities against student profile. LLM-generated explanations for top picks.</p></Card>
        <Card><div className="text-sm font-bold text-[#1c1410]">🎤 AI Mock Visa Interviewer</div><p className="text-xs text-[#3a2e26] mt-1">Voice-based practice with TTS. 7 countries, 70+ real questions. LLM scores on clarity, conviction, language.</p></Card>
        <Card><div className="text-sm font-bold text-[#1c1410]">🎓 Scholarship Finder Pro</div><p className="text-xs text-[#3a2e26] mt-1">Auto-matches students to 39+ scholarships (Chevening, Fulbright, DAAD, Vanier) with eligibility scoring.</p></Card>
        <Card><div className="text-sm font-bold text-[#1c1410]">🔍 Document OCR Engine</div><p className="text-xs text-[#3a2e26] mt-1">Vision AI extracts fields from passport, IELTS, transcripts, SOP, LOR, bank statements, resume.</p></Card>
        <Card><div className="text-sm font-bold text-[#1c1410]">💬 Conversational AI Chatbot</div><p className="text-xs text-[#3a2e26] mt-1">Floating EduBot widget on every page. LLM-powered, trained on EduConnect context. Captures leads 24/7.</p></Card>
      </Section>
      <Section title="Operations (7)">
        <Card><div className="text-sm font-bold text-[#1c1410]">👥 Student CRM · 📋 Application Tracker · 🏫 University Database · ✈️ Visa Tracker · 📨 Communication Hub · 📅 Calendar & Booking · 🔔 Smart Deadlines</div></Card>
      </Section>
      <Section title="Growth (3)">
        <Card><div className="text-sm font-bold text-[#1c1410]">🎁 Referral Engine · ⚡ Lead Magnets · 🌍 Country Guides</div></Card>
      </Section>
      <Section title="Business (6)">
        <Card><div className="text-sm font-bold text-[#1c1410]">💰 Finance · 📊 Analytics · 🏢 Multi-branch · 🛡️ Audit Trail · 🔌 Integrations · 📱 Mobile App</div></Card>
      </Section>
    </div>
  );
}

function PricingDetailPage() {
  return (
    <div>
      <PageHeader title="Pricing" subtitle="Simple, transparent pricing that scales with your consultancy." icon={FileText} color="#f59e0b" />
      <div className="grid sm:grid-cols-3 gap-4">
        <Card><div className="text-sm font-bold text-[#1c1410]">Starter</div><div className="text-3xl font-extrabold text-[#e85d2f] mt-1">₹4,999<span className="text-sm text-[#7a6a5d]">/mo</span></div><div className="text-xs text-[#7a6a5d] mt-1">200 students, 2 seats</div><div className="mt-3 text-xs space-y-1 text-[#3a2e26]"><div>✓ Student CRM + Tracker</div><div>✓ 200 Indian universities</div><div>✓ WhatsApp (1,000/mo)</div><div>✓ GST invoicing</div></div></Card>
        <Card className="ring-2 ring-[#e85d2f]"><div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e85d2f] text-white px-3 py-0.5 text-[10px] font-bold uppercase">Most Popular</div><div className="text-sm font-bold text-[#1c1410]">Growth</div><div className="text-3xl font-extrabold text-[#e85d2f] mt-1">₹14,999<span className="text-sm text-[#7a6a5d]">/mo</span></div><div className="text-xs text-[#7a6a5d] mt-1">2,000 students, 10 seats</div><div className="mt-3 text-xs space-y-1 text-[#3a2e26]"><div>✓ Full 1,048 university DB</div><div>✓ AI Course Matcher</div><div>✓ Visa module</div><div>✓ Unlimited comms</div><div>✓ Analytics dashboard</div><div>✓ Dedicated onboarding</div></div></Card>
        <Card><div className="text-sm font-bold text-[#1c1410]">Enterprise</div><div className="text-3xl font-extrabold text-[#1c1410] mt-1">Custom</div><div className="text-xs text-[#7a6a5d] mt-1">Unlimited everything</div><div className="mt-3 text-xs space-y-1 text-[#3a2e26]"><div>✓ Multi-branch + white-label</div><div>✓ Custom AI training</div><div>✓ API + SSO + audit logs</div><div>✓ 99.9% SLA</div><div>✓ On-premise options</div></div></Card>
      </div>
      <Card className="mt-6 text-center"><p className="text-sm text-[#3a2e26]">All plans include free data migration, 14-day money-back guarantee, and no setup fees.</p></Card>
    </div>
  );
}

function PartnersDetailPage() {
  return (
    <div>
      <PageHeader title="Partner Universities" subtitle="1,048 partner institutions across 32 countries." icon={Globe2} color="#0f766e" />
      <Card><p className="text-sm text-[#3a2e26]">From the IITs and IIMs at home to Oxford, MIT, Toronto, and Monash abroad — EduConnect India has direct commission agreements and application integrations with the institutions your students actually want to attend.</p></Card>
      <Section title="By country">
        {[
          { c: "🇮🇳 India", n: 312 },
          { c: "🇬🇧 United Kingdom", n: 184 },
          { c: "🇺🇸 United States", n: 226 },
          { c: "🇨🇦 Canada", n: 142 },
          { c: "🇦🇺 Australia", n: 118 },
          { c: "🇮🇪 Ireland", n: 38 },
          { c: "🇩🇪 Germany", n: 28 },
          { c: "🇸🇬 Singapore", n: 2 },
        ].map((x) => <Card key={x.c}><div className="flex items-center justify-between"><span className="text-sm font-bold text-[#1c1410]">{x.c}</span><span className="text-sm text-[#7a6a5d]">{x.n} universities</span></div></Card>)}
      </Section>
    </div>
  );
}

function MatcherDetailPage() {
  return (
    <div>
      <PageHeader title="AI Course Matcher" subtitle="Find the perfect-fit universities in seconds with ML-powered matching." icon={CheckCircle2} color="#a855f7" />
      <Card><p className="text-sm text-[#3a2e26]">Our matching algorithm scores all 1,048 universities against the student's academic profile, English scores, budget, and destination preference using a 5-factor model: academic fit (30pts), English proficiency (25pts), budget alignment (20pts), country preference (15pts), and ranking bonus (10pts).</p></Card>
      <Section title="How it works">
        <Card><div className="font-bold text-[#1c1410] text-sm">1. Select a student</div><p className="text-xs text-[#3a2e26] mt-1">Pick any student from your CRM.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">2. Get ranked matches</div><p className="text-xs text-[#3a2e26] mt-1">12 best-fit universities with match score, REACH/TARGET/SAFETY tier, and fit breakdown.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">3. AI explanations</div><p className="text-xs text-[#3a2e26] mt-1">LLM generates personalized 60-word recommendation for top 3 universities.</p></Card>
        <Card><div className="font-bold text-[#1c1410] text-sm">4. Draft application</div><p className="text-xs text-[#3a2e26] mt-1">One click creates a draft application in your pipeline.</p></Card>
      </Section>
    </div>
  );
}

function VisaTrackerDetailPage() {
  return (
    <div>
      <PageHeader title="Visa Tracker" subtitle="End-to-end visa workflow for placed students." icon={FileText} color="#a855f7" />
      <Card><p className="text-sm text-[#3a2e26]">Country-wise visa tracker with SOP builder, interview prep modules, and real-time status sync. Track every visa from DRAFT to APPROVED with stage progress bars.</p></Card>
      <Section title="Visa stages">
        <Card><div className="text-sm font-bold text-[#1c1410]">DRAFT → DOCS_READY → SUBMITTED → BIO_METRIC → INTERVIEW → APPROVED</div></Card>
      </Section>
      <Section title="Supported countries">
        <Card><p className="text-sm text-[#3a2e26]">🇬🇧 UK Tier 4 · 🇺🇸 US F-1 · 🇨🇦 Canada Study Permit · 🇦🇺 Australia Subclass 500 · 🇮🇪 Ireland · 🇩🇪 Germany · 🇸🇬 Singapore</p></Card>
      </Section>
    </div>
  );
}

function IntegrationsDetailPage() {
  return (
    <div>
      <PageHeader title="Integrations" subtitle="Connect EduConnect India with your favorite tools." icon={Code} color="#0ea5e9" />
      <Card><p className="text-sm text-[#3a2e26]">12 native integrations + open REST API + Zapier/Make.com connector for unlimited workflows.</p></Card>
      <Section title="Native integrations">
        {[
          { n: "WhatsApp Business API", c: "Communication", s: "Connected" },
          { n: "Razorpay", c: "Payments", s: "Connected" },
          { n: "Gmail / Google Workspace", c: "Communication", s: "Connected" },
          { n: "VFS Global", c: "Visa", s: "Available" },
          { n: "Slack", c: "Collaboration", s: "Available" },
          { n: "Zoom", c: "Counseling", s: "Available" },
          { n: "GST Network (GSTN)", c: "Finance", s: "Available" },
          { n: "DocuSign", c: "Documents", s: "Available" },
          { n: "Zapier / Make.com", c: "Automation", s: "Available" },
          { n: "Google Ads", c: "Marketing", s: "Available" },
          { n: "RazorpayX (Payouts)", c: "Finance", s: "Available" },
          { n: "Twilio SMS", c: "Communication", s: "Available" },
        ].map((i) => (
          <Card key={i.n}><div className="flex items-center justify-between"><div><div className="font-bold text-[#1c1410] text-sm">{i.n}</div><div className="text-xs text-[#7a6a5d]">{i.c}</div></div><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${i.s === "Connected" ? "bg-[#22c55e]/10 text-[#15803d]" : "bg-[#94a3b8]/10 text-[#475569]"}`}>{i.s}</span></div></Card>
        ))}
      </Section>
    </div>
  );
}
