"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { I18nProvider } from "@/context/i18n";
import { useAppStore } from "@/store/app-store";
import Navbar from "@/components/site/navbar";
import Hero from "@/components/site/hero";
import Company from "@/components/site/company";
import Features from "@/components/site/features";
import HowItWorks from "@/components/site/how-it-works";
import Partners from "@/components/site/partners";
import Testimonials from "@/components/site/testimonials";
import Pricing from "@/components/site/pricing";
import Contact from "@/components/site/contact";
import Footer from "@/components/site/footer";
import AuthModal from "@/components/site/auth-modal";
import ChatbotWidget from "@/components/site/chatbot-widget";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import ParentPortal from "@/components/site/parent-portal";
import ConsultantLandingPage from "@/components/site/consultant-landing";
import PublicPage from "@/components/site/public-pages";
import { useEffect, useState } from "react";

export default function Home() {
  useScrollReveal();

  return (
    <I18nProvider>
      <AppShell />
      <AuthModal />
      <ChatbotWidget />
    </I18nProvider>
  );
}

function AppShell() {
  const { view, user, parent } = useAppStore();
  const [consultantSlug, setConsultantSlug] = useState<string | null>(null);
  const [pageKey, setPageKey] = useState<string | null>(null);

  // Check URL for ?consultant=slug or ?page=key on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("consultant");
    const page = params.get("page");
    if (slug) {
      Promise.resolve().then(() => setConsultantSlug(slug));
    } else if (page) {
      Promise.resolve().then(() => setPageKey(page));
    }
  }, []);

  // Parent portal takes priority
  if (view === "parent" && parent) {
    return <ParentPortal />;
  }

  // Counselor dashboard
  if (view === "dashboard" && user) {
    return <DashboardShell />;
  }

  // Per-consultant landing page
  if (consultantSlug) {
    return <ConsultantLandingPage slug={consultantSlug} onBack={() => {
      setConsultantSlug(null);
      window.history.replaceState({}, "", window.location.pathname);
    }} />;
  }

  // Public info pages (footer links)
  if (pageKey) {
    return <PublicPage pageKey={pageKey as any} onBack={() => {
      setPageKey(null);
      window.history.replaceState({}, "", window.location.pathname);
    }} />;
  }

  // Default: landing page
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Company />
        <Features />
        <HowItWorks />
        <Partners />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
