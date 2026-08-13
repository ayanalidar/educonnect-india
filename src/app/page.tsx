"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
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

export default function Home() {
  useScrollReveal();

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
