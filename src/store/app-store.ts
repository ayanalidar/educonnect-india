// Global app store — view switching (landing/dashboard/parent) + auth state

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/lib/i18n";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  branch: string | null;
  phone: string | null;
  avatarColor: string;
};

export type ParentUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatarColor: string;
};

type AppState = {
  // view
  view: "landing" | "dashboard" | "parent";
  setView: (v: "landing" | "dashboard" | "parent") => void;

  // auth (counselor)
  user: AuthUser | null;
  token: string | null;
  setUser: (u: AuthUser | null, t: string | null) => void;
  logout: () => void;

  // auth (parent)
  parent: ParentUser | null;
  parentToken: string | null;
  setParent: (p: ParentUser | null, t: string | null) => void;
  logoutParent: () => void;

  // language
  lang: Lang;
  setLang: (l: Lang) => void;

  // auth modal
  authModalOpen: boolean;
  authModalMode: "signin" | "signup" | "parent";
  openAuthModal: (mode?: "signin" | "signup" | "parent") => void;
  closeAuthModal: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: "landing",
      setView: (v) => set({ view: v }),

      user: null,
      token: null,
      setUser: (u, t) => set({ user: u, token: t, view: u ? "dashboard" : "landing" }),
      logout: () => set({ user: null, token: null, view: "landing" }),

      parent: null,
      parentToken: null,
      setParent: (p, t) => set({ parent: p, parentToken: t, view: p ? "parent" : "landing" }),
      logoutParent: () => set({ parent: null, parentToken: null, view: "landing" }),

      lang: "en",
      setLang: (l) => set({ lang: l }),

      authModalOpen: false,
      authModalMode: "signin",
      openAuthModal: (mode = "signin") => set({ authModalOpen: true, authModalMode: mode }),
      closeAuthModal: () => set({ authModalOpen: false }),
    }),
    {
      name: "educonnect-store",
      partialize: (s) => ({
        user: s.user, token: s.token,
        parent: s.parent, parentToken: s.parentToken,
        lang: s.lang, view: s.view,
      }),
    }
  )
);

// Helper for API requests with counselor auth token
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = useAppStore.getState().token;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Helper for parent API requests
export async function parentApiFetch(path: string, options: RequestInit = {}) {
  const token = useAppStore.getState().parentToken;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
