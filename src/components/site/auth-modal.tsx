// Auth modal — sign in / sign up portal
// Made & maintained by GuardianX

"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Building2, Phone, Shield, Loader2, GraduationCap, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useI18n } from "@/context/i18n";
import { useToast } from "@/hooks/use-toast";

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, setUser } = useAppStore();
  const { t } = useI18n();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">(authModalMode);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    phone: "",
  });

  useEffect(() => setMode(authModalMode), [authModalMode]);

  // Lock body scroll
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1c1410]/70 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-orange-100 overflow-hidden">
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-[#e85d2f] via-[#f59e0b] to-[#0f766e]" />

        {/* Header */}
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
                {mode === "signin" ? t("auth.signIn") : t("auth.signUp")}
              </div>
            </div>
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#1c1410]">
            {mode === "signin" ? "Welcome back, counselor" : "Start your 14-day trial"}
          </h2>
          <p className="mt-1 text-sm text-[#7a6a5d]">
            {mode === "signin"
              ? "Sign in to access your consultancy dashboard."
              : "Set up your consultancy workspace in under 60 seconds."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 sm:p-7 pt-5 space-y-3.5">
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
              placeholder="you@consultancy.in"
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
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "signin" ? "Signing in…" : "Creating account…"}
              </>
            ) : (
              <>
                {mode === "signin" ? t("auth.cta") : "Create my workspace"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Demo login shortcut */}
          {mode === "signin" && (
            <button
              type="button"
              onClick={fillDemo}
              className="w-full rounded-xl border border-dashed border-orange-300 bg-orange-50 px-4 py-2.5 text-xs font-semibold text-[#c8451a] hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="h-3.5 w-3.5" />
              {t("auth.demoHint")}
            </button>
          )}

          {/* Switch mode */}
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

          {/* GuardianX footer */}
          <div className="pt-2 mt-3 border-t border-orange-100 flex items-center justify-center gap-1.5 text-[10px] text-[#7a6a5d]">
            <Shield className="h-3 w-3" />
            {t("brand.madeBy")} <strong className="text-[#1c1410]">GuardianX</strong>
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
