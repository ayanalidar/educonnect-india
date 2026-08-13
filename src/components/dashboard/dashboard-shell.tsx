// Dashboard shell — composes sidebar + topbar + active view
// Made & maintained by GuardianX

"use client";

import { useState, useEffect } from "react";
import Sidebar, { type DashboardView } from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import OverviewView from "@/components/dashboard/views/overview";
import MatcherView from "@/components/dashboard/views/matcher";
import StudentsView from "@/components/dashboard/views/students";
import ApplicationsView from "@/components/dashboard/views/applications";
import UniversitiesView from "@/components/dashboard/views/universities";
import VisaView from "@/components/dashboard/views/visa";
import CommunicationView from "@/components/dashboard/views/communication";
import DocumentsView from "@/components/dashboard/views/documents";
import FinanceView from "@/components/dashboard/views/finance";
import AnalyticsView from "@/components/dashboard/views/analytics";
import IntegrationsView from "@/components/dashboard/views/integrations";
import ScholarshipsView from "@/components/dashboard/views/scholarships";
import DeadlinesView from "@/components/dashboard/views/deadlines";
import VisaInterviewerView from "@/components/dashboard/views/visa-interviewer";
import MobileAppView from "@/components/dashboard/views/mobile-app";
import InnovationLabView from "@/components/dashboard/views/innovation-lab";
import SettingsView from "@/components/dashboard/views/settings";
import { useAppStore } from "@/store/app-store";

export default function DashboardShell() {
  const [view, setView] = useState<DashboardView>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAppStore();

  useEffect(() => {
    if (!user) return;
  }, [user]);

  return (
    <div className="min-h-screen flex bg-[#fff8f1]">
      <Sidebar
        active={view}
        setActive={setView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar view={view} onOpenSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {view === "overview" && <OverviewView onNavigate={setView} />}
          {view === "matcher" && <MatcherView />}
          {view === "students" && <StudentsView />}
          {view === "applications" && <ApplicationsView />}
          {view === "universities" && <UniversitiesView />}
          {view === "visa" && <VisaView />}
          {view === "communication" && <CommunicationView />}
          {view === "documents" && <DocumentsView />}
          {view === "finance" && <FinanceView />}
          {view === "analytics" && <AnalyticsView />}
          {view === "integrations" && <IntegrationsView />}
          {view === "scholarships" && <ScholarshipsView />}
          {view === "deadlines" && <DeadlinesView />}
          {view === "visa-interview" && <VisaInterviewerView />}
          {view === "mobile" && <MobileAppView />}
          {view === "innovation" && <InnovationLabView />}
          {view === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
