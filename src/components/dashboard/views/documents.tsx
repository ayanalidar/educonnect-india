// Document OCR dashboard view — upload docs, VLM extracts fields, history list
// Made & maintained by GuardianX

"use client";

import { useEffect, useState, useRef } from "react";
import {
  FileText, Upload, Loader2, CheckCircle2, AlertCircle, FileSearch,
  Sparkles, Download, Trash2, FileCheck2, FileWarning,
} from "lucide-react";
import { apiFetch } from "@/store/app-store";
import { Card, Empty, Spinner, StatusBadge } from "@/components/dashboard/_ui";
import { useToast } from "@/hooks/use-toast";

type DocRecord = {
  id: string;
  docType: string;
  fileName: string;
  extractedData: string;
  summary: string | null;
  confidence: number;
  status: string;
  createdAt: string;
  student: { id: string; firstName: string; lastName: string } | null;
};

const DOC_TYPES = [
  { id: "PASSPORT", label: "Passport", icon: "🛂", color: "#e85d2f" },
  { id: "TRANSCRIPT", label: "Academic Transcript", icon: "📜", color: "#0f766e" },
  { id: "IELTS_CERT", label: "IELTS Certificate", icon: "🌍", color: "#f59e0b" },
  { id: "TOEFL_CERT", label: "TOEFL Certificate", icon: "🌐", color: "#0ea5e9" },
  { id: "BANK_STATEMENT", label: "Bank Statement", icon: "🏦", color: "#22c55e" },
  { id: "SOP", label: "Statement of Purpose", icon: "📝", color: "#a855f7" },
  { id: "LOR", label: "Letter of Recommendation", icon: "✉️", color: "#ec4899" },
  { id: "RESUME", label: "Resume / CV", icon: "👤", color: "#1c1410" },
];

const DOC_LABELS = Object.fromEntries(DOC_TYPES.map((d) => [d.id, d.label]));

export default function DocumentsView() {
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [students, setStudents] = useState<Array<{ id: string; firstName: string; lastName: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("PASSPORT");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [docsData, studentsData] = await Promise.all([
        apiFetch("/api/documents"),
        apiFetch("/api/students"),
      ]);
      setDocs(docsData.documents);
      setStudents(studentsData.students);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4_000_000) {
      toast({ title: "File too large", description: "Max 4 MB per document.", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const upload = async () => {
    if (!selectedFile || !previewUrl) {
      toast({ title: "Pick a file first", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const data = await apiFetch("/api/documents/ocr", {
        method: "POST",
        body: JSON.stringify({
          imageBase64: previewUrl,
          docType: selectedDocType,
          studentId: selectedStudent || null,
          fileName: selectedFile.name,
        }),
      });
      toast({
        title: `✨ ${DOC_LABELS[selectedDocType]} processed`,
        description: data.document.summary,
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      load();
    } catch (err) {
      toast({ title: "OCR failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const stats = {
    total: docs.length,
    verified: docs.filter((d) => d.status === "EXTRACTED" || d.status === "VERIFIED").length,
    rejected: docs.filter((d) => d.status === "REJECTED").length,
    avgConfidence: docs.length ? Math.round(docs.reduce((s, d) => s + (d.confidence || 0), 0) / docs.length * 100) : 0,
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1c1410] via-[#2a1d15] to-[#1c1410] p-6 sm:p-7 text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#0ea5e9]/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#22c55e]/30 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0ea5e9] via-[#22c55e] to-[#a855f7] shadow-xl">
            <FileSearch className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">
              <Sparkles className="h-3 w-3" />
              Document OCR Engine · Vision AI
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Upload any document → auto-extract structured data</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-2xl">
              Drop in a passport scan, academic transcript, IELTS certificate, bank statement, or SOP — our
              Vision AI extracts the key fields, scores confidence, and stores a searchable record. No more
              manual data entry for your counseling team.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="Documents processed" value={stats.total} color="#0ea5e9" icon={FileText} />
        <StatBox label="Successfully extracted" value={stats.verified} color="#22c55e" icon={CheckCircle2} />
        <StatBox label="Rejected / failed" value={stats.rejected} color="#ef4444" icon={AlertCircle} />
        <StatBox label="Avg confidence" value={`${stats.avgConfidence}%`} color="#a855f7" icon={Sparkles} />
      </div>

      <div className="grid lg:grid-cols-12 gap-5">
        {/* Upload panel */}
        <div className="lg:col-span-5">
          <Card className="p-5 sticky top-24">
            <h3 className="text-base font-bold text-[#1c1410] mb-3 flex items-center gap-2">
              <Upload className="h-4 w-4 text-[#e85d2f]" />
              Upload new document
            </h3>

            {/* Doc type picker */}
            <div className="text-xs font-semibold text-[#3a2e26] mb-1.5">Document type</div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {DOC_TYPES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDocType(d.id)}
                  className={`rounded-xl p-2 text-center transition-all ${
                    selectedDocType === d.id
                      ? "ring-2 ring-[#e85d2f] bg-[#fff8f1]"
                      : "bg-white ring-1 ring-orange-100 hover:ring-orange-200"
                  }`}
                  style={selectedDocType === d.id ? { boxShadow: `0 0 0 2px ${d.color}33` } : {}}
                >
                  <div className="text-lg">{d.icon}</div>
                  <div className="text-[9px] font-bold text-[#1c1410] mt-0.5 leading-tight">{d.label}</div>
                </button>
              ))}
            </div>

            {/* Student picker */}
            <div className="text-xs font-semibold text-[#3a2e26] mb-1.5">Link to student (optional)</div>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="h-10 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm focus:border-[#e85d2f] focus:outline-none mb-3"
            >
              <option value="">— No linked student —</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>

            {/* File drop zone */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={onFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-orange-300 bg-[#fff8f1] hover:bg-orange-50 p-6 text-center transition-colors"
            >
              {previewUrl ? (
                <div className="space-y-2">
                  <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded-lg shadow" />
                  <div className="text-xs font-semibold text-[#1c1410] truncate">{selectedFile?.name}</div>
                  <div className="text-[10px] text-[#7a6a5d]">{selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : ""}</div>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 mx-auto text-[#e85d2f]" />
                  <div className="mt-2 text-sm font-semibold text-[#1c1410]">Click to upload</div>
                  <div className="text-[10px] text-[#7a6a5d] mt-0.5">PNG, JPG, WebP · Max 4 MB</div>
                </div>
              )}
            </button>

            <button
              onClick={upload}
              disabled={!selectedFile || uploading}
              className="mt-3 w-full h-11 rounded-full bg-gradient-to-r from-[#0ea5e9] via-[#22c55e] to-[#a855f7] text-white font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:-translate-y-0.5"
            >
              {uploading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing with Vision AI…</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Extract with AI</>
              )}
            </button>

            <div className="mt-3 text-[10px] text-[#7a6a5d] text-center">
              Processing takes 3–8 seconds. Documents are processed securely and never leave the platform.
            </div>
          </Card>
        </div>

        {/* History list */}
        <div className="lg:col-span-7">
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-orange-50">
              <h3 className="text-base font-bold text-[#1c1410] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0ea5e9]" />
                Processed documents
              </h3>
            </div>

            {loading ? (
              <div className="py-16 flex items-center justify-center gap-2 text-[#7a6a5d]"><Spinner /> Loading…</div>
            ) : docs.length === 0 ? (
              <Empty title="No documents yet" hint="Upload your first document on the left →" />
            ) : (
              <div className="divide-y divide-orange-50 max-h-[700px] overflow-y-auto">
                {docs.map((d) => {
                  const dt = DOC_TYPES.find((t) => t.id === d.docType);
                  let extracted: Record<string, string> = {};
                  try { extracted = JSON.parse(d.extractedData); } catch { extracted = { raw: d.extractedData }; }
                  const filledFields = Object.values(extracted).filter((v) => v && String(v).trim()).length;
                  const totalFields = Object.keys(extracted).length || 1;
                  const confPct = Math.round((d.confidence || 0) * 100);

                  return (
                    <div key={d.id} className="p-4 hover:bg-[#fff8f1]/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <span
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg shrink-0"
                          style={{ background: `${dt?.color || "#7a6a5d"}1a` }}
                        >
                          {dt?.icon || "📄"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-[#1c1410] truncate">{d.fileName}</div>
                              <div className="text-[11px] text-[#7a6a5d]">
                                {dt?.label || d.docType} · {new Date(d.createdAt).toLocaleString([], { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                              </div>
                              {d.student && (
                                <div className="text-[10px] text-[#0f766e] font-semibold mt-0.5">
                                  👤 {d.student.firstName} {d.student.lastName}
                                </div>
                              )}
                            </div>
                            <StatusBadge status={d.status} />
                          </div>

                          {/* Confidence bar */}
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-[#fff8f1] overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${confPct}%`,
                                  background: confPct > 70 ? "#22c55e" : confPct > 40 ? "#f59e0b" : "#ef4444",
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-[#1c1410]">{confPct}%</span>
                            <span className="text-[10px] text-[#7a6a5d]">{filledFields}/{totalFields} fields</span>
                          </div>

                          {/* Extracted fields */}
                          {Object.keys(extracted).length > 0 && (
                            <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
                              {Object.entries(extracted).slice(0, 4).map(([k, v]) => (
                                <div key={k} className="rounded bg-[#fff8f1] px-2 py-1">
                                  <span className="font-bold text-[#7a6a5d] uppercase">{k.replace(/([A-Z])/g, " $1").trim()}:</span>{" "}
                                  <span className="text-[#1c1410]">{String(v).slice(0, 30) || "—"}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {d.summary && (
                            <div className="mt-2 text-[11px] text-[#3a2e26] italic">{d.summary}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon: Icon }: { label: string; value: string | number; color: string; icon: React.ElementType }) {
  return (
    <Card className="p-4">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}1a`, color }}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="mt-3 text-2xl font-extrabold text-[#1c1410] leading-none">{value}</div>
      <div className="mt-1 text-[11px] text-[#7a6a5d]">{label}</div>
    </Card>
  );
}
