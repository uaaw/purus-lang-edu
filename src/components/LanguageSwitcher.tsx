"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

const localeLabels: Record<Locale, string> = {
  ja: "JA",
  en: "EN",
};

const alternateLocale: Record<Locale, Locale> = {
  ja: "en",
  en: "ja",
};

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  const other = alternateLocale[locale];
  const pathWithoutLocale = pathname.replace(/^\/(ja|en)/, "") || "/";
  const href = `/${other}${pathWithoutLocale}`;

  return (
    <Link
      href={href}
      className="px-2 py-1 text-xs rounded"
      style={{
        color: "var(--color-text-muted)",
        backgroundColor: "var(--color-bg-tertiary)",
      }}
    >
      {localeLabels[other]}
    </Link>
  );
}
