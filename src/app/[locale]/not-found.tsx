"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { t, type Locale } from "@/lib/i18n";

export default function NotFound() {
  const { locale } = useParams<{ locale: string }>();
  const l = locale as Locale;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--color-text)" }}
      >
        404
      </h1>
      <p
        className="mb-6"
        style={{ color: "var(--color-text-muted)" }}
      >
        {t(l, "lessonNotFound")}
      </p>
      <Link
        href={`/${locale}/`}
        className="btn-accent px-5 py-2 text-sm font-medium rounded-lg"
      >
        {t(l, "startLearning")}
      </Link>
    </div>
  );
}
