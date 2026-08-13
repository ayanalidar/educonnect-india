// Communication hub — WhatsApp / Email / SMS inbox + composer

"use client";

import { useEffect, useState } from "react";
import { Send, Loader2, MessageCircle, Mail, Smartphone, Check } from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type Comm = {
  id: string;
  channel: string;
  direction: string;
  subject: string | null;
  body: string;
  status: string;
  createdAt: string;
  student: { firstName: string; lastName: string } | null;
};

const CHANNELS = [
  { id: "WHATSAPP", label: "WhatsApp", icon: MessageCircle, color: "#22c55e" },
  { id: "EMAIL", label: "Email", icon: Mail, color: "#0ea5e9" },
  { id: "SMS", label: "SMS", icon: Smartphone, color: "#f59e0b" },
];

export default function CommunicationView() {
  const [comms, setComms] = useState<Comm[]>([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState("WHATSAPP");
  const [sending, setSending] = useState(false);
  const [body, setBody] = useState("");
  const [students, setStudents] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);
  const [studentId, setStudentId] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/communications?channel=${channel}`);
      setComms(data.communications);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    apiFetch("/api/students").then((d) => setStudents(d.students));
  }, []);

  useEffect(() => { load(); }, [channel]);

  const send = async () => {
    if (!body.trim()) return;
    setSending(true);
    try {
      await apiFetch("/api/communications", {
        method: "POST",
        body: JSON.stringify({ channel, studentId: studentId || null, body }),
      });
      setBody("");
      toast({ title: `Message sent via ${channel.toLowerCase()}`, description: "Status: DELIVERED" });
      load();
    } catch (err) {
      toast({ title: "Failed to send", description: (err as Error).message, variant: "destructive" });
    } finally { setSending(false); }
  };

  const activeChannel = CHANNELS.find((c) => c.id === channel) || CHANNELS[0];

  return (
    <div className="grid lg:grid-cols-12 gap-4 h-[calc(100vh-180px)]">
      {/* Left: inbox */}
      <div className="lg:col-span-7 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Channel tabs */}
          <div className="flex items-center gap-1 p-3 border-b border-orange-50">
            {CHANNELS.map((c) => (
              <button
                key={c.id}
                onClick={() => setChannel(c.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 h-9 text-xs font-semibold transition-colors ${
                  channel === c.id ? "text-white" : "bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100"
                }`}
                style={channel === c.id ? { background: c.color } : {}}
              >
                <c.icon className="h-3.5 w-3.5" />
                {c.label}
              </button>
            ))}
            <div className="ml-auto text-xs text-[#7a6a5d]">
              {comms.length} messages
            </div>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="py-16 flex items-center justify-center gap-2 text-[#7a6a5d]"><Spinner /> Loading…</div>
            ) : comms.length === 0 ? (
              <Empty title={`No ${channel.toLowerCase()} messages yet`} hint="Send your first message using the composer →" />
            ) : (
              comms.map((c) => (
                <div key={c.id} className="px-4 py-3 border-b border-orange-50 hover:bg-[#fff8f1]/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
                      style={{ background: `${activeChannel.color}1a`, color: activeChannel.color }}
                    >
                      <activeChannel.icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-[#1c1410] truncate">
                          {c.student ? `${c.student.firstName} ${c.student.lastName}` : "Broadcast"}
                        </div>
                        <div className="text-[10px] text-[#7a6a5d] shrink-0">
                          {new Date(c.createdAt).toLocaleString([], { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                        </div>
                      </div>
                      {c.subject && <div className="text-xs font-medium text-[#3a2e26] truncate">{c.subject}</div>}
                      <div className="text-xs text-[#7a6a5d] mt-0.5 line-clamp-2">{c.body}</div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span
                          className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                          style={{
                            background: c.status === "DELIVERED" ? "#22c55e20" : c.status === "READ" ? "#0ea5e920" : "#f59e0b20",
                            color: c.status === "DELIVERED" ? "#15803d" : c.status === "READ" ? "#0369a1" : "#b45309",
                          }}
                        >
                          {c.status === "DELIVERED" && <Check className="h-2.5 w-2.5" />}
                          {c.status}
                        </span>
                        <span className="text-[9px] text-[#7a6a5d] uppercase">{c.direction}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Right: composer */}
      <div className="lg:col-span-5">
        <Card className="p-5 h-full flex flex-col">
          <div className="flex items-center gap-2.5 mb-4">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${activeChannel.color}1a`, color: activeChannel.color }}
            >
              <activeChannel.icon className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-bold text-[#1c1410]">Send {activeChannel.label}</div>
              <div className="text-[11px] text-[#7a6a5d]">Templates · Bulk campaigns · Auto-sequences</div>
            </div>
          </div>

          <div className="space-y-3 flex-1 flex flex-col">
            <label className="block">
              <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">To (optional)</span>
              <select value={studentId} onChange={(e) => setStudentId(e.target.value)}
                className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none">
                <option value="">All active students (broadcast)</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
              </select>
            </label>

            <label className="block flex-1">
              <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">Message</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`Type your ${activeChannel.label.toLowerCase()} message…`}
                className="w-full h-full min-h-[180px] rounded-xl border border-orange-200 bg-white p-3 text-sm focus:border-[#e85d2f] focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20 resize-none"
              />
            </label>

            {/* Quick templates */}
            <div className="flex flex-wrap gap-1.5">
              {["Document reminder", "Appointment confirmation", "Offer received", "Visa approved", "Fee payment due"].map((t) => (
                <button
                  key={t}
                  onClick={() => setBody(`Hi {name}, this is a reminder regarding: ${t.toLowerCase()}. Please reach out if you have any questions.`)}
                  className="rounded-full bg-[#fff8f1] px-2.5 py-1 text-[10px] font-medium text-[#7a6a5d] ring-1 ring-orange-100 hover:bg-orange-100"
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={send}
              disabled={sending || !body.trim()}
              className="w-full h-11 rounded-full text-white font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:-translate-y-0.5"
              style={{ background: `linear-gradient(90deg, ${activeChannel.color}, ${activeChannel.color}dd)` }}
            >
              {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send {activeChannel.label}</>}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
