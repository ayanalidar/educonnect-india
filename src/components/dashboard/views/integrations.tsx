// Integrations view — connect tools (WhatsApp, Razorpay, embassy, etc.)
// Made & maintained by GuardianX

"use client";

import { useState } from "react";
import { Check, Plug, Sparkles, ExternalLink } from "lucide-react";
import { Card } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

const INTEGRATIONS = [
  { id: "whatsapp", name: "WhatsApp Business API", category: "Communication", desc: "Send/receive WhatsApp messages, run campaigns, automate sequences.", color: "#22c55e", status: "connected" },
  { id: "razorpay", name: "Razorpay", category: "Payments", desc: "Collect fees, subscriptions, and invoice payments via UPI/cards.", color: "#0f766e", status: "connected" },
  { id: "gmail", name: "Gmail / Google Workspace", category: "Communication", desc: "Two-way email sync, calendar booking, contact sync.", color: "#e85d2f", status: "connected" },
  { id: "vfsglobal", name: "VFS Global", category: "Visa", desc: "Real-time visa appointment availability and status sync.", color: "#a855f7", status: "available" },
  { id: "slack", name: "Slack", category: "Collaboration", desc: "Get lead alerts, application status updates in your team channel.", color: "#1c1410", status: "available" },
  { id: "zoom", name: "Zoom", category: "Counseling", desc: "Schedule and host video counseling sessions inside EduConnect.", color: "#0ea5e9", status: "available" },
  { id: "gst", name: "GST Network (GSTN)", category: "Finance", desc: "Auto-file GST returns from invoice data with one click.", color: "#f59e0b", status: "available" },
  { id: "docusign", name: "DocuSign", category: "Documents", desc: "E-signature for offer acceptances, MOUs, and contracts.", color: "#dbe114", status: "available" },
  { id: "zapier", name: "Zapier / Make.com", category: "Automation", desc: "Connect EduConnect to 5,000+ apps via no-code workflows.", color: "#ff4a00", status: "available" },
  { id: "googleads", name: "Google Ads", category: "Marketing", desc: "Track which campaigns convert into student leads.", color: "#4285f4", status: "available" },
  { id: "razorpayx", name: "RazorpayX (Payouts)", category: "Finance", desc: "Auto-payout partner commissions and counselor incentives.", color: "#0f766e", status: "available" },
  { id: "twilio", name: "Twilio SMS", category: "Communication", desc: "Programmatic SMS for OTP, reminders, and updates.", color: "#f22f46", status: "available" },
];

const CATEGORIES = ["All", "Communication", "Payments", "Visa", "Collaboration", "Counseling", "Finance", "Documents", "Automation", "Marketing"];

export default function IntegrationsView() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [cat, setCat] = useState("All");
  const { toast } = useToast();

  const toggle = (id: string, name: string) => {
    setIntegrations((prev) =>
      prev.map((i) => i.id === id ? { ...i, status: i.status === "connected" ? "available" : "connected" } : i)
    );
    const isConn = integrations.find((i) => i.id === id)?.status === "connected";
    toast({
      title: isConn ? `${name} disconnected` : `${name} connected`,
      description: isConn ? "You can re-connect any time." : "Integration is now live. Configure in Settings.",
    });
  };

  const list = cat === "All" ? integrations : integrations.filter((i) => i.category === cat);
  const connectedCount = integrations.filter((i) => i.status === "connected").length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs text-[#7a6a5d]">Connected</div>
          <div className="mt-1 text-2xl font-extrabold text-[#22c55e]">{connectedCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-[#7a6a5d]">Available</div>
          <div className="mt-1 text-2xl font-extrabold text-[#1c1410]">{integrations.length - connectedCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-[#7a6a5d]">Categories</div>
          <div className="mt-1 text-2xl font-extrabold text-[#1c1410]">{CATEGORIES.length - 1}</div>
        </Card>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`rounded-full px-3 h-8 text-xs font-semibold transition-colors ${cat === c ? "bg-[#1c1410] text-white" : "bg-white ring-1 ring-orange-200 text-[#7a6a5d] hover:bg-orange-50"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((i) => (
          <Card key={i.id} className="p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md"
                style={{ background: i.color }}>
                <Plug className="h-5 w-5" />
              </span>
              {i.status === "connected" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#22c55e]/10 px-2 py-0.5 text-[10px] font-bold text-[#15803d]">
                  <Check className="h-3 w-3" /> CONNECTED
                </span>
              )}
            </div>
            <div className="mt-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#7a6a5d]">{i.category}</div>
              <h3 className="mt-0.5 text-sm font-bold text-[#1c1410]">{i.name}</h3>
              <p className="mt-1.5 text-xs text-[#7a6a5d] leading-relaxed">{i.desc}</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => toggle(i.id, i.name)}
                className={`flex-1 h-9 rounded-full text-xs font-semibold transition-all ${
                  i.status === "connected"
                    ? "bg-[#fff8f1] text-[#7a6a5d] hover:bg-red-50 hover:text-red-600"
                    : "bg-[#1c1410] text-white hover:bg-[#e85d2f]"
                }`}
              >
                {i.status === "connected" ? "Disconnect" : "Connect"}
              </button>
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100">
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Custom integrations banner */}
      <Card className="p-6 bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#e85d2f]/30 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] shadow-lg">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-base font-bold">Need a custom integration?</h3>
            <p className="text-xs text-white/70 mt-0.5">Our REST API + webhooks let you build any workflow. Full docs at developers.educonnect.in</p>
          </div>
          <button className="shrink-0 rounded-full bg-white text-[#1c1410] px-4 h-9 text-xs font-semibold hover:bg-orange-50">
            View API docs
          </button>
        </div>
      </Card>
    </div>
  );
}
