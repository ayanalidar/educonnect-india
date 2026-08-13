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
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function Home() {
  useScrollReveal();

  return (
    <I18nProvider>
      <AppShell />
      <AuthModal />
    </I18nProvider>
  );
}

function AppShell() {
  const { view, user } = useAppStore();

  // If user is authenticated, default to dashboard
  const showDashboard = view === "dashboard" && user;

  if (showDashboard) {
    return <DashboardShell />;
  }

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
