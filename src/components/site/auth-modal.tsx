// Auth modal — sign in / sign up / parent login portal

"use client";

import { useState, useEffect } from "react";
import {
  X, Mail, Lock, User, Building2, Phone, Shield, Loader2,
  GraduationCap, ArrowRight, Users,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/context/i18n";
import { useToast } from "@/hooks/use-toast";

type Mode = "signin" | "signup" | "parent";

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, setUser, setParent } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>(authModalMode);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    phone: "",
  });

  useEffect(() => setMode(authModalMode), [authModalMode]);

  useEffect(() => {
    if (authModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "parent") {
        // Parent login
        const data = await fetch("/api/auth/parent-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        }).then((r) => r.json());

        if (data.error) throw new Error(data.error);

        // Cache students in sessionStorage for the parent portal
        if (data.students) {
          sessionStorage.setItem("educonnect-parent-students", JSON.stringify(data.students));
        }
        setParent(data.parent, data.token);
        closeAuthModal();
        toast({
          title: `Welcome, ${data.parent.name.split(" ")[0]}!`,
          description: "You're now in the Parent Portal.",
        });
        return;
      }

      // Counselor sign in / sign up
      const path = mode === "signin" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "signin"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, branch: form.branch, phone: form.phone };

      const data = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json());

      if (data.error) throw new Error(data.error);

      setUser(data.user, data.token);
      closeAuthModal();
      toast({
        title: mode === "signin" ? `Welcome back, ${data.user.name.split(" ")[0]}!` : "Account created!",
        description: mode === "signin"
          ? "You're now signed in to EduConnect."
          : "Your EduConnect workspace is ready.",
      });
    } catch (err) {
      toast({
        title: "Authentication failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setMode("signin");
    setForm((f) => ({ ...f, email: "demo@educonnect.in", password: "demo1234" }));
  };

  const fillParentDemo = () => {
    setMode("parent");
    setForm((f) => ({ ...f, email: "parent@educonnect.in", password: "parent1234" }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1c1410]/70 backdrop-blur-sm" onClick={closeAuthModal} />

      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#e85d2f] via-[#f59e0b] to-[#0f766e]" />

        <div className="p-6 sm:p-7 pb-0 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d2f] to-[#f59e0b] text-white shadow-lg shadow-orange-300/40">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e85d2f]">
                EduConnect India
              </div>
              <div className="text-sm text-[#7a6a5d]">
                {mode === "signin" ? t("auth.signIn") : mode === "signup" ? t("auth.signUp") : "Parent Portal"}
              </div>
            </div>
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#1c1410]">
            {mode === "signin" && "Welcome back, counselor"}
            {mode === "signup" && "Start your 14-day trial"}
            {mode === "parent" && "Parent / Guardian login"}
          </h2>
          <p className="mt-1 text-sm text-[#7a6a5d]">
            {mode === "signin" && "Sign in to access your consultancy dashboard."}
            {mode === "signup" && "Set up your consultancy workspace in under 60 seconds."}
            {mode === "parent" && "Track your child's application progress, messages, and payments."}
          </p>
        </div>

        {/* Mode tabs */}
        <div className="px-6 sm:px-7 pt-4 flex gap-1 rounded-full">
          {(["signin", "signup", "parent"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 rounded-full px-3 h-9 text-xs font-semibold transition-colors ${
                mode === m
                  ? m === "parent"
                    ? "bg-[#0f766e] text-white"
                    : "bg-[#e85d2f] text-white"
                  : "bg-[#fff8f1] text-[#7a6a5d] hover:bg-orange-100"
              }`}
            >
              {m === "signin" && "Counselor Sign in"}
              {m === "signup" && "Sign up"}
              {m === "parent" && "Parent Portal"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="p-6 sm:p-7 pt-4 space-y-3.5">
          {mode === "signup" && (
            <Field icon={User} label={t("auth.name")} required>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Rajesh Mehta"
                className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-3 text-sm focus:border-[#e85d2f] focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20"
              />
            </Field>
          )}

          <Field icon={Mail} label={t("auth.email")} required>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={mode === "parent" ? "you@gmail.com" : "you@consultancy.in"}
              className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-3 text-sm focus:border-[#e85d2f] focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20"
            />
          </Field>

          <Field icon={Lock} label={t("auth.password")} required>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-3 text-sm focus:border-[#e85d2f] focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20"
            />
          </Field>

          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <Field icon={Building2} label="Branch">
                <input
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  placeholder="Mumbai"
                  className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-3 text-sm focus:border-[#e85d2f] focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20"
                />
              </Field>
              <Field icon={Phone} label="Phone">
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91…"
                  className="h-11 w-full rounded-xl border border-orange-200 bg-white pl-10 pr-3 text-sm focus:border-[#e85d2f] focus:outline-none focus:ring-2 focus:ring-[#e85d2f]/20"
                />
              </Field>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-12 rounded-full bg-gradient-to-r from-[#e85d2f] to-[#f59e0b] text-white font-semibold shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:translate-y-0 flex items-center justify-center gap-2"
            style={mode === "parent" ? { background: "linear-gradient(90deg, #0f766e, #14b8a6)" } : {}}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "signin" ? "Signing in…" : mode === "signup" ? "Creating account…" : "Signing in…"}
              </>
            ) : (
              <>
                {mode === "signin" && t("auth.cta")}
                {mode === "signup" && "Create my workspace"}
                {mode === "parent" && "Enter Parent Portal"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Demo login shortcuts */}
          {mode === "signin" && (
            <button
              type="button"
              onClick={fillDemo}
              className="w-full rounded-xl border border-dashed border-orange-300 bg-orange-50 px-4 py-2.5 text-xs font-semibold text-[#c8451a] hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="h-3.5 w-3.5" />
              Counselor demo: demo@educonnect.in / demo1234
            </button>
          )}
          {mode === "parent" && (
            <button
              type="button"
              onClick={fillParentDemo}
              className="w-full rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-[#0f766e] hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
            >
              <Users className="h-3.5 w-3.5" />
              Parent demo: parent@educonnect.in / parent1234
            </button>
          )}

          {mode !== "parent" && (
            <div className="pt-1 text-center text-xs text-[#7a6a5d]">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="font-semibold text-[#e85d2f] hover:underline"
              >
                {mode === "signin" ? t("auth.signUp") : t("auth.signIn")}
              </button>
            </div>
          )}

          <div className="pt-2 mt-3 border-t border-orange-100 text-center text-[10px] text-[#7a6a5d]">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <a href="/?page=dpdp" className="inline-flex items-center gap-1 rounded-full bg-[#0f766e]/10 px-2 py-0.5 text-[9px] font-bold text-[#0f766e] hover:bg-[#0f766e]/20 transition-colors">
                <Shield className="h-2.5 w-2.5" /> DPDP Compliant
              </a>
              <a href="/?page=security" className="inline-flex items-center gap-1 rounded-full bg-[#22c55e]/10 px-2 py-0.5 text-[9px] font-bold text-[#15803d] hover:bg-[#22c55e]/20 transition-colors">
                <Shield className="h-2.5 w-2.5" /> ISO 27001
              </a>
            </div>
            Made & maintained by <a href="https://github.com/ayanalidar/educonnect-india" target="_blank" rel="noopener noreferrer" className="font-bold text-[#1c1410] hover:text-[#e85d2f]">GuardianX</a>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  required,
  children,
}: {
  icon: React.ElementType;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#3a2e26] mb-1.5">
        {label}{required && <span className="text-[#e85d2f]"> *</span>}
      </span>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a6a5d]" />
        {children}
      </div>
    </label>
  );
}
