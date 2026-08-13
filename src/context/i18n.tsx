// Lightweight i18n React context — current language + useT hook
// Made & maintained by GuardianX

"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAppStore } from "@/store/app-store";
import { translate, type Lang } from "@/lib/i18n";

type I18nCtx = {
  lang: Lang;
  t: (key: string) => string;
};

const Ctx = createContext<I18nCtx>({ lang: "en", t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useAppStore((s) => s.lang);

  const value = useMemo<I18nCtx>(
    () => ({
      lang,
      t: (key: string) => translate(lang, key),
    }),
    [lang]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
